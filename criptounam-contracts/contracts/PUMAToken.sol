// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PUMAToken
 * @notice Token de recompensas educativas CriptoUNAM (PUMA): embajadores, sesiones y misiones on-chain.
 * @dev Requiere OpenZeppelin Contracts ^4.9.x (rutas `security/ReentrancyGuard`, hook `_beforeTokenTransfer`).
 *
 * Cambios respecto a la versión anterior:
 *  - Hereda `AccessControl` (antes se usaban roles sin heredarlo → el contrato no compilaba).
 *  - `completeMission`: cada alumno reclama una vez; la misión sigue activa para el resto (antes solo el primero cobraba).
 *  - `burnReward`: solo con `allowance(usuario, contrato)` para no quemar fondos sin consentimiento.
 *  - Pausa aplicada a mint, burn administrativo, misiones y transferReward.
 *  - Nivel por XP alineado con cantidades en wei (1000 tokens ≈ 1 nivel con xpPerTokenWei = 1).
 *  - Errores personalizados para ahorrar gas; eventos claros para indexadores / front.
 */
contract PUMAToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");
    bytes32 public constant MISSION_MANAGER_ROLE = keccak256("MISSION_MANAGER_ROLE");

    /// @notice Tope: 1_000_000_000 tokens (18 decimales).
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    uint256 public totalRewardsDistributed;
    uint256 public totalRewardsBurned;

    struct RewardRecord {
        uint256 amount;
        string reason;
        uint256 timestamp;
    }

    struct Mission {
        string title;
        uint256 reward;
        bool active;
        uint256 deadline;
        bool exists;
    }

    mapping(address => RewardRecord[]) private _userRewards;
    mapping(string => Mission) public missions;
    mapping(string => mapping(address => bool)) public missionCompletedBy;
    mapping(address => uint256) public userLevel;
    mapping(address => uint256) public userExperience;
    mapping(address => string[]) private _userBadges;

    string[] public missionIds;

    /// @notice XP = tokenWei * xpPerTokenWei (ajustable por el admin).
    uint256 public xpPerTokenWei;

    event RewardMinted(address indexed to, uint256 amount, string reason);
    event RewardBurned(address indexed from, uint256 amount, string reason);
    event RewardTransferred(address indexed from, address indexed to, uint256 amount);
    event MissionClaimed(address indexed user, string missionId, uint256 reward);
    event CoursePaid(address indexed user, string cursoId, uint256 amount);
    event MissionCreated(string missionId, string title, uint256 reward, uint256 deadline);
    event MissionDeactivated(string missionId);
    event BadgeGranted(address indexed user, string badge);
    event XpPerTokenWeiUpdated(uint256 newValue);

    error ZeroAddress();
    error ZeroAmount();
    error MaxSupplyExceeded();
    error InsufficientBalance();
    error MissionUnknown();
    error MissionInactive();
    error MissionExpired();
    error AlreadyClaimed();
    error InvalidDeadline();
    error MissionAlreadyExists();
    error AllowanceTooLow();
    error EmptyCursoId();

    constructor(address initialAdmin, uint256 initialMint) ERC20("PUMA Token", "PUMA") {
        address admin = initialAdmin == address(0) ? msg.sender : initialAdmin;
        if (initialMint == 0) revert ZeroAmount();
        if (initialMint > MAX_SUPPLY) revert MaxSupplyExceeded();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REWARD_MANAGER_ROLE, admin);
        _grantRole(MISSION_MANAGER_ROLE, admin);

        xpPerTokenWei = 1;

        _mint(admin, initialMint);
    }

    function setXpPerTokenWei(uint256 newXpPerWei) external onlyRole(DEFAULT_ADMIN_ROLE) {
        xpPerTokenWei = newXpPerWei;
        emit XpPerTokenWeiUpdated(newXpPerWei);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Distribución en sesiones / embajadores — solo rol de recompensas.
     */
    function mintReward(address to, uint256 amount, string calldata reason)
        external
        onlyRole(REWARD_MANAGER_ROLE)
        nonReentrant
        whenNotPaused
    {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (totalSupply() + amount > MAX_SUPPLY) revert MaxSupplyExceeded();

        _mint(to, amount);
        totalRewardsDistributed += amount;

        _userRewards[to].push(RewardRecord({amount: amount, reason: reason, timestamp: block.timestamp}));
        _addXp(to, amount);

        emit RewardMinted(to, amount, reason);
    }

    /**
     * @notice El alumno debe hacer `approve(address(this), cantidad)` antes; así evitamos quemas arbitrarias.
     */
    function burnReward(address from, uint256 amount, string calldata reason)
        external
        onlyRole(REWARD_MANAGER_ROLE)
        nonReentrant
        whenNotPaused
    {
        if (from == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (allowance(from, address(this)) < amount) revert AllowanceTooLow();

        _spendAllowance(from, address(this), amount);
        _burn(from, amount);
        totalRewardsBurned += amount;

        emit RewardBurned(from, amount, reason);
    }

    function transferReward(address to, uint256 amount) external nonReentrant whenNotPaused {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (balanceOf(msg.sender) < amount) revert InsufficientBalance();
        _transfer(msg.sender, to, amount);
        emit RewardTransferred(msg.sender, to, amount);
    }

    function createMission(
        string calldata missionId,
        string calldata title,
        uint256 reward,
        uint256 deadline
    ) external onlyRole(MISSION_MANAGER_ROLE) whenNotPaused {
        if (bytes(missionId).length == 0) revert MissionUnknown();
        if (missions[missionId].exists) revert MissionAlreadyExists();
        if (reward == 0) revert ZeroAmount();
        if (deadline <= block.timestamp) revert InvalidDeadline();

        missions[missionId] = Mission({
            title: title,
            reward: reward,
            active: true,
            deadline: deadline,
            exists: true
        });
        missionIds.push(missionId);

        emit MissionCreated(missionId, title, reward, deadline);
    }

    function deactivateMission(string calldata missionId) external onlyRole(MISSION_MANAGER_ROLE) {
        if (!missions[missionId].exists) revert MissionUnknown();
        missions[missionId].active = false;
        emit MissionDeactivated(missionId);
    }

    /**
     * @notice Cada wallet reclama una vez por `missionId`; el resto de alumnos puede reclamar la misma misión.
     */
    function completeMission(string calldata missionId) external nonReentrant whenNotPaused {
        Mission storage m = missions[missionId];
        if (!m.exists) revert MissionUnknown();
        if (!m.active) revert MissionInactive();
        if (block.timestamp > m.deadline) revert MissionExpired();
        if (missionCompletedBy[missionId][msg.sender]) revert AlreadyClaimed();
        if (totalSupply() + m.reward > MAX_SUPPLY) revert MaxSupplyExceeded();

        missionCompletedBy[missionId][msg.sender] = true;

        _mint(msg.sender, m.reward);
        totalRewardsDistributed += m.reward;

        _userRewards[msg.sender].push(
            RewardRecord({
                amount: m.reward,
                reason: string(abi.encodePacked("Mission:", missionId)),
                timestamp: block.timestamp
            })
        );
        _addXp(msg.sender, m.reward);

        emit MissionClaimed(msg.sender, missionId, m.reward);
    }

    function setUserLevel(address user, uint256 newLevel) external onlyRole(REWARD_MANAGER_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        if (newLevel == 0) revert ZeroAmount();
        userLevel[user] = newLevel;
    }

    function grantBadge(address user, string calldata badge) external onlyRole(REWARD_MANAGER_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        if (bytes(badge).length == 0) revert ZeroAmount();
        _userBadges[user].push(badge);
        emit BadgeGranted(user, badge);
    }

    function getUserRewards(address user) external view returns (RewardRecord[] memory) {
        return _userRewards[user];
    }

    function getUserBadges(address user) external view returns (string[] memory) {
        return _userBadges[user];
    }

    function getUserInfo(address user)
        external
        view
        returns (uint256 balance, uint256 level, uint256 experience, uint256 badgeCount)
    {
        return (balanceOf(user), userLevel[user], userExperience[user], _userBadges[user].length);
    }

    function getTokenStats()
        external
        view
        returns (uint256 supplyTotal, uint256 rewardsTotal, uint256 burnedTotal, uint256 missionsCount)
    {
        return (totalSupply(), totalRewardsDistributed, totalRewardsBurned, missionIds.length);
    }

    function missionIdsLength() external view returns (uint256) {
        return missionIds.length;
    }

    /**
     * @notice Pago de curso CriptoUNAM con $PUMA. Cualquier alumno con saldo suficiente
     *         puede llamarla — quema sus propios tokens y deja registro on-chain
     *         del curso que pagó. No requiere `approve` (es burn de uno mismo).
     * @param cursoId Identificador del curso (ej. "stellar-soroban-dev"). No vacío.
     * @param amount  Cantidad en wei a quemar como pago.
     */
    function payCourse(string calldata cursoId, uint256 amount)
        external
        nonReentrant
        whenNotPaused
    {
        if (bytes(cursoId).length == 0) revert EmptyCursoId();
        if (amount == 0) revert ZeroAmount();
        if (balanceOf(msg.sender) < amount) revert InsufficientBalance();

        _burn(msg.sender, amount);
        totalRewardsBurned += amount;

        emit CoursePaid(msg.sender, cursoId, amount);
    }

    function _addXp(address user, uint256 tokenWeiAmount) internal {
        uint256 xpGain = tokenWeiAmount * xpPerTokenWei;
        if (xpGain == 0 && tokenWeiAmount > 0) {
            xpGain = 1;
        }
        userExperience[user] += xpGain;
        uint256 xpBasedLevel = userExperience[user] / (1000 * 10**18);
        if (xpBasedLevel > userLevel[user]) {
            userLevel[user] = xpBasedLevel;
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
