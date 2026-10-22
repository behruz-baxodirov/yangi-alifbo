import XCTest
@testable import AlifboCore

final class ComposerTests: XCTestCase {
    func testTriggerLetterIsHeldAsMarked() {
        var c = Composer()
        XCTAssertEqual(c.handle(.char("o")), ComposerOutput(commit: "", consumed: true))
        XCTAssertEqual(c.marked, "o")
    }

    func testBackspaceDropsPending() {
        var c = Composer()
        _ = c.handle(.char("o"))
        XCTAssertEqual(c.handle(.backspace), ComposerOutput(commit: "", consumed: true))
        XCTAssertEqual(c.marked, "")
    }

    func testBackspaceWithoutPendingPassesThrough() {
        var c = Composer()
        XCTAssertEqual(c.handle(.backspace), ComposerOutput(commit: "", consumed: false))
    }

    func testOtherFlushesPending() {
        var c = Composer()
        _ = c.handle(.char("s"))
        XCTAssertEqual(c.handle(.other), ComposerOutput(commit: "s", consumed: false))
        XCTAssertEqual(c.marked, "")
    }

    func testNonTriggerAfterPendingCommitsPendingAndPassesKey() {
        var c = Composer()
        _ = c.handle(.char("s"))
        XCTAssertEqual(c.handle(.char("a")), ComposerOutput(commit: "s", consumed: false))
    }

    func testFlushReturnsPending() {
        var c = Composer()
        _ = c.handle(.char("g"))
        XCTAssertEqual(c.flush(), "g")
        XCTAssertEqual(c.marked, "")
        XCTAssertEqual(c.flush(), "")
    }

    func testConversionIsConsumed() {
        var c = Composer()
        _ = c.handle(.char("o"))
        XCTAssertEqual(c.handle(.char("'")), ComposerOutput(commit: "ö", consumed: true))
    }

    func testTutuqOff() {
        XCTAssertEqual(Typing.simulate("ma'no", options: .init(tutuq: false)), "ma'no")
        XCTAssertEqual(Typing.simulate("o'zbek", options: .init(tutuq: false)), "özbek")
    }

    func testApostropheUsesClientContextWhenUnknown() {
        var c = Composer()
        _ = c.handle(.other)
        XCTAssertEqual(c.handle(.char("'"), before: { "a" }), ComposerOutput(commit: "", consumed: true))
        XCTAssertEqual(c.marked, "'")
        XCTAssertEqual(c.handle(.char("n")), ComposerOutput(commit: "ʼ", consumed: false))

        var d = Composer()
        _ = d.handle(.other)
        XCTAssertEqual(d.handle(.char("'"), before: { " " }), ComposerOutput(commit: "", consumed: false))
    }

    func testPendingApostropheFlushedAsAscii() {
        var c = Composer()
        _ = c.handle(.char("a"))
        _ = c.handle(.char("'"))
        XCTAssertEqual(c.flush(), "'")
    }
}
