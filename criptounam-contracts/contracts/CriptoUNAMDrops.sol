// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IPUMARewardMinter {
    function mintReward(address to, uint256 amount, string calldata reason) external;
}

interface IBadgeMinter {
    function mint(
        address to,
        uint8 kind,
        string calldata ref,
        string calldata uri
    ) external returns (uint256 tokenId);
}

/**
 * @title CriptoUNAMDrops
 * @notice Coordina la entrega de PUMA + POAP/NFT mediante un código compartido en sesión.
 *
 * Flujo:
 *  1. Admin crea drop con `createDrop(code, title, pumaReward, kind, ref, uri, deadline)`.
 *  2. En la sesión se dicta el `code` (no la wallet del alumno).
 *  3. Cada wallet que sepa el código puede llamar `claimDrop(code)` una sola vez antes del deadline.
 *  4. Recibe `pumaReward` PUMA y, si `bytes(badgeRef).length > 0`, un NFT (kind/ref/uri).
 *
 * Requisitos post-deploy (otorgar desde los contratos respectivos):
 *  - PUMAToken.grantRole(REWARD_MANAGER_ROLE, address(this))
 *  - CriptoUNAMBadges.grantRole(MINTER_ROLE, address(this))
 *
 * Diseño:
 *  - El código se almacena hasheado (`keccak256(bytes(code))`) para reducir storage cost y
 *    para que la lista pública en exploradores no muestre los códigos antes del deadline.
 *    No es secreto criptográfico (las llamadas a `claimDrop(code)` revelan el código en calldata),
 *    pero ayuda en exploradores antes del primer reclamo.
 *  - Permite drops solo PUMA o solo NFT siempre que al menos uno esté presente.
 */
contract CriptoUNAMDrops is AccessControl, ReentrancyGuard {
    bytes32 public constant DROP_MANAGER_ROLE = keccak256("DROP_MANAGER_ROLE");

    IPUMARewardMinter public immutable puma;
    IBadgeMinter public immutable badges;

    struct Drop {
        string title;
        uint256 pumaReward;
        uint8 badgeKind;      // 0..3 = CourseCompletion, EventAttendance, Ambassador, Certification
        string badgeRef;      // vacío => no se mintea NFT
        string badgeUri;
        uint256 deadline;     // unix timestamp; debe ser > block.timestamp al crear
        bool active;
        bool exists;
    }

    mapping(bytes32 => Drop) private _drops;
    mapping(bytes32 => mapping(address => bool)) public claimed;
    bytes32[] public dropHashes;

    event DropCreated(
        bytes32 indexed codeHash,
        string code,
        string title,
        uint256 pumaReward,
        uint8 badgeKind,
        string badgeRef,
        uint256 deadline
    );
    event DropDeactivated(bytes32 indexed codeHash);
    event DropClaimed(
        address indexed user,
        bytes32 indexed codeHash,
        uint256 pumaAmount,
        uint256 badgeTokenId
    );

    error ZeroAddress();
    error EmptyCode();
    error DropUnknown();
    error DropInactive();
    error DropExpired();
    error AlreadyClaimedDrop();
    error DropAlreadyExists();
    error InvalidDeadline();
    error NothingToClaim();

    constructor(address admin, address pumaToken, address badgesContract) {
        if (admin == address(0) || pumaToken == address(0) || badgesContract == address(0)) {
            revert ZeroAddress();
        }
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(DROP_MANAGER_ROLE, admin);
        puma = IPUMARewardMinter(pumaToken);
        badges = IBadgeMinter(badgesContract);
    }

    /**
     * @notice Crea un drop nuevo. Sólo `DROP_MANAGER_ROLE`.
     * @dev `badgeRef` puede ir vacío si el drop es solo PUMA.
     *      `pumaReward` puede ir en 0 si el drop es solo NFT.
     *      Pero al menos uno tiene que ser > 0.
     */
    function createDrop(
        string calldata code,
        string calldata title,
        uint256 pumaReward,
        uint8 badgeKind,
        string calldata badgeRef,
        string calldata badgeUri,
        uint256 deadline
    ) external onlyRole(DROP_MANAGER_ROLE) {
        if (bytes(code).length == 0) revert EmptyCode();
        if (deadline <= block.timestamp) revert InvalidDeadline();
        bool hasPuma = pumaReward > 0;
        bool hasBadge = bytes(badgeRef).length > 0;
        if (!hasPuma && !hasBadge) revert NothingToClaim();

        bytes32 h = keccak256(bytes(code));
        if (_drops[h].exists) revert DropAlreadyExists();

        _drops[h] = Drop({
            title: title,
            pumaReward: pumaReward,
            badgeKind: badgeKind,
            badgeRef: badgeRef,
            badgeUri: badgeUri,
            deadline: deadline,
            active: true,
            exists: true
        });
        dropHashes.push(h);

        emit DropCreated(h, code, title, pumaReward, badgeKind, badgeRef, deadline);
    }

    /**
     * @notice Desactiva un drop. Las wallets que ya reclamaron mantienen su recompensa.
     */
    function deactivateDrop(string calldata code) external onlyRole(DROP_MANAGER_ROLE) {
        bytes32 h = keccak256(bytes(code));
        if (!_drops[h].exists) revert DropUnknown();
        _drops[h].active = false;
        emit DropDeactivated(h);
    }

    /**
     * @notice Reclama el drop. Una vez por wallet. Mintea PUMA y/o NFT según la configuración.
     */
    function claimDrop(string calldata code) external nonReentrant returns (uint256 badgeTokenId) {
        bytes32 h = keccak256(bytes(code));
        Drop storage d = _drops[h];
        if (!d.exists) revert DropUnknown();
        if (!d.active) revert DropInactive();
        if (block.timestamp > d.deadline) revert DropExpired();
        if (claimed[h][msg.sender]) revert AlreadyClaimedDrop();

        claimed[h][msg.sender] = true;

        if (bytes(d.badgeRef).length > 0) {
            badgeTokenId = badges.mint(msg.sender, d.badgeKind, d.badgeRef, d.badgeUri);
        }

        if (d.pumaReward > 0) {
            puma.mintReward(msg.sender, d.pumaReward, d.title);
        }

        emit DropClaimed(msg.sender, h, d.pumaReward, badgeTokenId);
    }

    /* ============================================================
       Vistas
       ============================================================ */

    function getDropByCode(string calldata code) external view returns (Drop memory) {
        return _drops[keccak256(bytes(code))];
    }

    function getDropByHash(bytes32 codeHash) external view returns (Drop memory) {
        return _drops[codeHash];
    }

    function hasClaimed(string calldata code, address user) external view returns (bool) {
        return claimed[keccak256(bytes(code))][user];
    }

    function dropHashesLength() external view returns (uint256) {
        return dropHashes.length;
    }
}
