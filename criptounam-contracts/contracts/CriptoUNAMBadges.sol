// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CriptoUNAMBadges
 * @notice NFTs educativos: certificados soulbound (curso/certificación) y badges transferibles (evento POAP, embajador).
 * @dev `ref` identifica de forma única el hito (p. ej. curso slug + cohorte, eventId). Evita doble emisión on-chain.
 */
contract CriptoUNAMBadges is ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextTokenId = 1;

    enum BadgeKind {
        CourseCompletion,
        EventAttendance,
        Ambassador,
        Certification
    }

    mapping(uint256 => BadgeKind) public tokenKind;
    mapping(uint256 => string) public tokenRef;
    mapping(bytes32 => bool) private _claimUsed;

    error Soulbound();
    error EmptyRef();
    error AlreadyClaimed();

    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        BadgeKind indexed kind,
        string ref
    );

    constructor(address admin) ERC721("CriptoUNAM Credentials", "CUNAM") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mint(
        address to,
        BadgeKind kind,
        string calldata ref,
        string calldata uri
    ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        if (bytes(ref).length == 0) revert EmptyRef();

        bytes32 claimKey = keccak256(abi.encode(to, kind, ref));
        if (_claimUsed[claimKey]) revert AlreadyClaimed();
        _claimUsed[claimKey] = true;

        tokenId = _nextTokenId++;
        tokenKind[tokenId] = kind;
        tokenRef[tokenId] = ref;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit BadgeMinted(to, tokenId, kind, ref);
    }

    function isSoulbound(uint256 tokenId) public view returns (bool) {
        BadgeKind k = tokenKind[tokenId];
        return k == BadgeKind.CourseCompletion || k == BadgeKind.Certification;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        if (from != address(0) && to != address(0) && isSoulbound(firstTokenId)) {
            revert Soulbound();
        }
    }
}
