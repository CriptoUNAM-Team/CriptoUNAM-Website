// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/CriptoUNAMBadges.sol";

contract CriptoUNAMBadgesTest is Test {
    CriptoUNAMBadges internal badges;
    address internal admin = address(0xA11CE);
    address internal minter = address(0xB0B);
    address internal alice = address(0xA11CE2);

    function setUp() public {
        vm.startPrank(admin);
        badges = new CriptoUNAMBadges(admin);
        badges.grantRole(badges.MINTER_ROLE(), minter);
        vm.stopPrank();
    }

    function testMintCourseSoulbound() public {
        vm.prank(minter);
        uint256 id = badges.mint(alice, CriptoUNAMBadges.BadgeKind.CourseCompletion, "solidity-101-2026", "ipfs://a");

        assertEq(badges.ownerOf(id), alice);
        assertTrue(badges.isSoulbound(id));

        vm.prank(alice);
        vm.expectRevert(CriptoUNAMBadges.Soulbound.selector);
        badges.transferFrom(alice, admin, id);
    }

    function testMintEventTransferable() public {
        vm.prank(minter);
        uint256 id = badges.mint(alice, CriptoUNAMBadges.BadgeKind.EventAttendance, "eth-mexico-2026", "ipfs://b");

        assertFalse(badges.isSoulbound(id));

        vm.prank(alice);
        badges.transferFrom(alice, admin, id);
        assertEq(badges.ownerOf(id), admin);
    }

    function testDoubleMintSameRefReverts() public {
        vm.prank(minter);
        badges.mint(alice, CriptoUNAMBadges.BadgeKind.Ambassador, "season-1", "ipfs://c");

        vm.prank(minter);
        vm.expectRevert(CriptoUNAMBadges.AlreadyClaimed.selector);
        badges.mint(alice, CriptoUNAMBadges.BadgeKind.Ambassador, "season-1", "ipfs://d");
    }

    function testMintEmptyRefReverts() public {
        vm.prank(minter);
        vm.expectRevert(CriptoUNAMBadges.EmptyRef.selector);
        badges.mint(alice, CriptoUNAMBadges.BadgeKind.EventAttendance, "", "ipfs://x");
    }

    function testCertificationSoulbound() public {
        vm.prank(minter);
        uint256 id = badges.mint(alice, CriptoUNAMBadges.BadgeKind.Certification, "cert-web3-2026", "ipfs://cert");

        assertTrue(badges.isSoulbound(id));
        vm.prank(alice);
        vm.expectRevert(CriptoUNAMBadges.Soulbound.selector);
        badges.transferFrom(alice, admin, id);
    }

    function testNonMinterCannotMint() public {
        vm.prank(alice);
        vm.expectRevert();
        badges.mint(alice, CriptoUNAMBadges.BadgeKind.EventAttendance, "evt-1", "ipfs://e");
    }

    /// @dev Clave de anti-duplicado incluye `kind`: mismo ref, distinto tipo → permitido.
    function testDifferentKindSameRefAllowed() public {
        vm.startPrank(minter);
        uint256 a = badges.mint(alice, CriptoUNAMBadges.BadgeKind.EventAttendance, "same-ref", "ipfs://1");
        uint256 b = badges.mint(alice, CriptoUNAMBadges.BadgeKind.CourseCompletion, "same-ref", "ipfs://2");
        vm.stopPrank();
        assertTrue(a != b);
        assertEq(badges.ownerOf(a), alice);
        assertEq(badges.ownerOf(b), alice);
    }
}
