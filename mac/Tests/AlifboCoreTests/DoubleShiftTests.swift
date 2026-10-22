import XCTest
@testable import AlifboCore

final class DoubleShiftTests: XCTestCase {
    private func tap(_ d: inout DoubleShiftDetector, at t: Double) -> Bool {
        _ = d.shift(down: true, at: t)
        return d.shift(down: false, at: t + 0.05)
    }

    func testTwoQuickTapsToggle() {
        var d = DoubleShiftDetector()
        XCTAssertFalse(tap(&d, at: 0))
        XCTAssertTrue(tap(&d, at: 0.15))
    }

    func testSlowTapsDoNotToggle() {
        var d = DoubleShiftDetector()
        XCTAssertFalse(tap(&d, at: 0))
        XCTAssertFalse(tap(&d, at: 0.9))
    }

    func testKeyBetweenTapsCancels() {
        var d = DoubleShiftDetector()
        XCTAssertFalse(tap(&d, at: 0))
        d.otherKey()
        XCTAssertFalse(tap(&d, at: 0.15))
    }

    func testShiftUsedForCapitalIsNotATap() {
        var d = DoubleShiftDetector()
        _ = d.shift(down: true, at: 0)
        d.otherKey()  // Shift bilan "O" yozildi
        XCTAssertFalse(d.shift(down: false, at: 0.05))
        XCTAssertFalse(tap(&d, at: 0.15))
    }

    func testLongHoldIsNotATap() {
        var d = DoubleShiftDetector()
        _ = d.shift(down: true, at: 0)
        XCTAssertFalse(d.shift(down: false, at: 0.6))
        XCTAssertFalse(tap(&d, at: 0.7))
    }

    func testThirdTapStartsOver() {
        var d = DoubleShiftDetector()
        XCTAssertFalse(tap(&d, at: 0))
        XCTAssertTrue(tap(&d, at: 0.15))
        XCTAssertFalse(tap(&d, at: 0.3))
        XCTAssertTrue(tap(&d, at: 0.45))
    }
}
