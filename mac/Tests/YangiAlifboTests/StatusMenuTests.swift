import XCTest
@testable import YangiAlifbo

final class StatusMenuTests: XCTestCase {
    func testUpdateBadgeOpensMenuInsteadOfDisablingTyping() {
        XCTAssertTrue(StatusMenu.opensMenu(rightClick: false, hasPermission: true, available: "2.0.4"))
        XCTAssertFalse(StatusMenu.opensMenu(rightClick: false, hasPermission: true, available: nil))
        XCTAssertTrue(StatusMenu.opensMenu(rightClick: true, hasPermission: true, available: nil))
        XCTAssertTrue(StatusMenu.opensMenu(rightClick: false, hasPermission: false, available: nil))
    }

    func testPermissionCopyUsesTheNewAlphabet() {
        XCTAssertFalse(StatusMenu.accessibilityPrompt.contains("'"))
        XCTAssertTrue(StatusMenu.accessibilityPrompt.contains("Accessibilityʼda"))
    }
}
