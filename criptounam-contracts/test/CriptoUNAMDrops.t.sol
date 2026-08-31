// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/CriptoUNAMDrops.sol";
import "../contracts/PUMAToken.sol";
import "../contracts/CriptoUNAMBadges.sol";

contract CriptoUNAMDropsTest is Test {
    PUMAToken internal puma;
    CriptoUNAMBadges internal badges;
    CriptoUNAMDrops internal drops;

    address internal admin = address(0xA11CE);
    address internal alice = address(0xBEEF);
    address internal bob = address(0xB0B);

    bytes32 internal constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");
    bytes32 internal constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string internal constant CODE = "sesion-26-mayo";
    string internal constant TITLE = "Sesion Embajadores 26 mayo";
    uint256 internal constant PUMA_REWARD = 50e18;
    string internal constant BADGE_REF = "ambassador-2026-05-26";
    string internal constant BADGE_URI = "ipfs://CID/sesion-26-mayo.json";

    function setUp() public {
        vm.startPrank(admin);
        puma = new PUMAToken(admin, 1_000 * 1e18); // 1000 PUMA inicial
        badges = new CriptoUNAMBadges(admin);
        drops = new CriptoUNAMDrops(admin, address(puma), address(badges));

        // Otorga roles necesarios al Drops
        puma.grantRole(REWARD_MANAGER_ROLE, address(drops));
        badges.grantRole(MINTER_ROLE, address(drops));
        vm.stopPrank();
    }

    function _futureDeadline() internal view returns (uint256) {
        return block.timestamp + 2 days;
    }

    /* ============================================================
       createDrop
       ============================================================ */

    function testCreateDropOk() public {
        vm.prank(admin);
        drops.createDrop(
            CODE,
            TITLE,
            PUMA_REWARD,
            uint8(CriptoUNAMBadges.BadgeKind.Ambassador),
            BADGE_REF,
            BADGE_URI,
            _futureDeadline()
        );

        CriptoUNAMDrops.Drop memory d = drops.getDropByCode(CODE);
        assertTrue(d.exists);
        assertTrue(d.active);
        assertEq(d.title, TITLE);
        assertEq(d.pumaReward, PUMA_REWARD);
        assertEq(d.badgeRef, BADGE_REF);
        assertEq(drops.dropHashesLength(), 1);
    }

    function testCreateDropEmptyCodeReverts() public {
        vm.prank(admin);
        vm.expectRevert(CriptoUNAMDrops.EmptyCode.selector);
        drops.createDrop("", TITLE, PUMA_REWARD, 2, BADGE_REF, BADGE_URI, _futureDeadline());
    }

    function testCreateDropPastDeadlineReverts() public {
        vm.warp(1_000_000);
        vm.prank(admin);
        vm.expectRevert(CriptoUNAMDrops.InvalidDeadline.selector);
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 2, BADGE_REF, BADGE_URI, block.timestamp);
    }

    function testCreateDropDuplicateReverts() public {
        vm.startPrank(admin);
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 2, BADGE_REF, BADGE_URI, _futureDeadline());
        vm.expectRevert(CriptoUNAMDrops.DropAlreadyExists.selector);
        drops.createDrop(CODE, "otro", 10e18, 2, "otro-ref", BADGE_URI, _futureDeadline());
        vm.stopPrank();
    }

    function testCreateDropNothingToClaimReverts() public {
        vm.prank(admin);
        vm.expectRevert(CriptoUNAMDrops.NothingToClaim.selector);
        // pumaReward = 0 y badgeRef vacío → nada que entregar
        drops.createDrop(CODE, TITLE, 0, 2, "", BADGE_URI, _futureDeadline());
    }

    function testCreateDropNonAdminReverts() public {
        vm.prank(alice);
        vm.expectRevert();
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 2, BADGE_REF, BADGE_URI, _futureDeadline());
    }

    /* ============================================================
       claimDrop — feliz
       ============================================================ */

    function testClaimDropFullOk() public {
        vm.prank(admin);
        drops.createDrop(
            CODE,
            TITLE,
            PUMA_REWARD,
            uint8(CriptoUNAMBadges.BadgeKind.Ambassador),
            BADGE_REF,
            BADGE_URI,
            _futureDeadline()
        );

        // Alice antes
        assertEq(puma.balanceOf(alice), 0);
        assertEq(badges.balanceOf(alice), 0);

        vm.prank(alice);
        uint256 tokenId = drops.claimDrop(CODE);

        assertEq(puma.balanceOf(alice), PUMA_REWARD);
        assertEq(badges.balanceOf(alice), 1);
        assertEq(badges.ownerOf(tokenId), alice);
        assertEq(badges.tokenRef(tokenId), BADGE_REF);
        assertTrue(drops.hasClaimed(CODE, alice));
    }

    function testClaimDropPumaOnly() public {
        vm.prank(admin);
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 0, "", "", _futureDeadline());

        vm.prank(alice);
        drops.claimDrop(CODE);
        assertEq(puma.balanceOf(alice), PUMA_REWARD);
        assertEq(badges.balanceOf(alice), 0);
    }

    function testClaimDropBadgeOnly() public {
        vm.prank(admin);
        drops.createDrop(CODE, TITLE, 0, 1, BADGE_REF, BADGE_URI, _futureDeadline());

        vm.prank(alice);
        drops.claimDrop(CODE);
        assertEq(puma.balanceOf(alice), 0);
        assertEq(badges.balanceOf(alice), 1);
    }

    function testClaimDropMultipleUsers() public {
        vm.prank(admin);
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 2, BADGE_REF, BADGE_URI, _futureDeadline());

        vm.prank(alice);
        drops.claimDrop(CODE);

        vm.prank(bob);
        drops.claimDrop(CODE);

        assertEq(puma.balanceOf(alice), PUMA_REWARD);
        assertEq(puma.balanceOf(bob), PUMA_REWARD);
        assertEq(badges.balanceOf(alice), 1);
        assertEq(badges.balanceOf(bob), 1);
    }

    /* ============================================================
       claimDrop — fallos
       ============================================================ */

    function testClaimDropTwiceReverts() public {
        vm.prank(admin);
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 2, BADGE_REF, BADGE_URI, _futureDeadline());

        vm.prank(alice);
        drops.claimDrop(CODE);

        vm.prank(alice);
        vm.expectRevert(CriptoUNAMDrops.AlreadyClaimedDrop.selector);
        drops.claimDrop(CODE);
    }

    function testClaimUnknownDropReverts() public {
        vm.prank(alice);
        vm.expectRevert(CriptoUNAMDrops.DropUnknown.selector);
        drops.claimDrop("no-existe");
    }

    function testClaimAfterDeadlineReverts() public {
        uint256 deadline = block.timestamp + 1 hours;
        vm.prank(admin);
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 2, BADGE_REF, BADGE_URI, deadline);

        vm.warp(deadline + 1);
        vm.prank(alice);
        vm.expectRevert(CriptoUNAMDrops.DropExpired.selector);
        drops.claimDrop(CODE);
    }

    function testClaimDeactivatedReverts() public {
        vm.startPrank(admin);
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 2, BADGE_REF, BADGE_URI, _futureDeadline());
        drops.deactivateDrop(CODE);
        vm.stopPrank();

        vm.prank(alice);
        vm.expectRevert(CriptoUNAMDrops.DropInactive.selector);
        drops.claimDrop(CODE);
    }

    function testDeactivateUnknownReverts() public {
        vm.prank(admin);
        vm.expectRevert(CriptoUNAMDrops.DropUnknown.selector);
        drops.deactivateDrop("no-existe");
    }

    function testDeactivateNonAdminReverts() public {
        vm.prank(admin);
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 2, BADGE_REF, BADGE_URI, _futureDeadline());

        vm.prank(alice);
        vm.expectRevert();
        drops.deactivateDrop(CODE);
    }

    /* ============================================================
       Sin roles cruzados → falla en Badges/PUMA
       ============================================================ */

    function testClaimWithoutBadgeRoleReverts() public {
        // Revoca el MINTER_ROLE al Drops
        vm.prank(admin);
        badges.revokeRole(MINTER_ROLE, address(drops));

        vm.prank(admin);
        drops.createDrop(CODE, TITLE, 0, 2, BADGE_REF, BADGE_URI, _futureDeadline());

        vm.prank(alice);
        vm.expectRevert(); // AccessControl revert desde Badges
        drops.claimDrop(CODE);
    }

    function testClaimWithoutPumaRoleReverts() public {
        vm.prank(admin);
        puma.revokeRole(REWARD_MANAGER_ROLE, address(drops));

        vm.prank(admin);
        drops.createDrop(CODE, TITLE, PUMA_REWARD, 0, "", "", _futureDeadline());

        vm.prank(alice);
        vm.expectRevert();
        drops.claimDrop(CODE);
    }
}
