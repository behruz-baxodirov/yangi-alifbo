import XCTest
@testable import AlifboCore

final class ShortcutTests: XCTestCase {
    /// Modifikatorni bir marta bosib qöyib yuborişni yuboradi; ikkinçi (qöyib yuboriş) natijasini qaytaradi.
    private func tap(_ m: inout ShortcutMatcher, _ mod: Modifiers, at t: Double) -> Bool {
        _ = m.flagsChanged(mod, at: t)
        return m.flagsChanged([], at: t + 0.05)
    }

    func testDoubleShiftToggles() {
        var m = ShortcutMatcher(.doubleShift)
        XCTAssertFalse(tap(&m, .shift, at: 0))
        XCTAssertTrue(tap(&m, .shift, at: 0.15))
    }

    func testDoubleOptionToggles() {
        var m = ShortcutMatcher(.doubleOption)
        XCTAssertFalse(tap(&m, .option, at: 0))
        XCTAssertTrue(tap(&m, .option, at: 0.15))
    }

    func testDoubleShiftIgnoresOption() {
        var m = ShortcutMatcher(.doubleShift)
        XCTAssertFalse(tap(&m, .option, at: 0))
        XCTAssertFalse(tap(&m, .option, at: 0.15))
    }

    func testSlowTapsDoNotToggle() {
        var m = ShortcutMatcher(.doubleShift)
        XCTAssertFalse(tap(&m, .shift, at: 0))
        XCTAssertFalse(tap(&m, .shift, at: 0.9))
    }

    func testKeyBetweenTapsCancels() {
        var m = ShortcutMatcher(.doubleShift)
        XCTAssertFalse(tap(&m, .shift, at: 0))
        XCTAssertFalse(m.keyDown(code: 0, modifiers: [], at: 0.1))
        XCTAssertFalse(tap(&m, .shift, at: 0.15))
    }

    func testShiftForCapitalIsNotATap() {
        var m = ShortcutMatcher(.doubleShift)
        _ = m.flagsChanged(.shift, at: 0)
        XCTAssertFalse(m.keyDown(code: 31, modifiers: .shift, at: 0.02))  // "O"
        XCTAssertFalse(m.flagsChanged([], at: 0.05))
        XCTAssertFalse(tap(&m, .shift, at: 0.15))
    }

    func testShiftPlusOtherModifierIsNotATap() {
        var m = ShortcutMatcher(.doubleShift)
        _ = m.flagsChanged(.shift, at: 0)
        _ = m.flagsChanged([.shift, .command], at: 0.02)
        _ = m.flagsChanged(.shift, at: 0.03)
        XCTAssertFalse(m.flagsChanged([], at: 0.05))
        XCTAssertFalse(tap(&m, .shift, at: 0.15))
    }

    func testLongHoldIsNotATap() {
        var m = ShortcutMatcher(.doubleShift)
        _ = m.flagsChanged(.shift, at: 0)
        XCTAssertFalse(m.flagsChanged([], at: 0.6))
        XCTAssertFalse(tap(&m, .shift, at: 0.7))
    }

    func testThirdTapStartsOver() {
        var m = ShortcutMatcher(.doubleShift)
        XCTAssertFalse(tap(&m, .shift, at: 0))
        XCTAssertTrue(tap(&m, .shift, at: 0.15))
        XCTAssertFalse(tap(&m, .shift, at: 0.3))
        XCTAssertTrue(tap(&m, .shift, at: 0.45))
    }

    func testControlSpace() {
        var m = ShortcutMatcher(.controlSpace)
        XCTAssertTrue(m.keyDown(code: 49, modifiers: .control, at: 0))
        XCTAssertFalse(m.keyDown(code: 49, modifiers: [.control, .option], at: 0.1))
        XCTAssertFalse(m.keyDown(code: 49, modifiers: [], at: 0.2))
    }

    func testCommandShiftSpace() {
        var m = ShortcutMatcher(.commandShiftSpace)
        XCTAssertTrue(m.keyDown(code: 49, modifiers: [.command, .shift], at: 0))
        XCTAssertFalse(m.keyDown(code: 49, modifiers: .command, at: 0.1))
    }

    func testNoneNeverToggles() {
        var m = ShortcutMatcher(.none)
        XCTAssertFalse(tap(&m, .shift, at: 0))
        XCTAssertFalse(tap(&m, .shift, at: 0.15))
        XCTAssertFalse(m.keyDown(code: 49, modifiers: .control, at: 0.3))
    }

    func testEveryShortcutHasALabel() {
        for s in ToggleShortcut.allCases { XCTAssertFalse(s.label.isEmpty, s.rawValue) }
    }
}
