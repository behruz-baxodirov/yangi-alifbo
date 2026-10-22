import XCTest
@testable import AlifboCore

final class RewriterTests: XCTestCase {
    func testFixturesThroughDeleteAndInsertModel() throws {
        let cases = try loadFixtures()
        for c in cases {
            XCTAssertEqual(RewriteTyping.simulate(c.in), c.out, c.note)
        }
    }

    func testApostropheAfterOReplacesIt() {
        var r = Rewriter()
        XCTAssertEqual(r.handle(.char("o")), .pass)
        XCTAssertEqual(r.handle(.char("'")), .replace(deleteBefore: 1, insert: "ö"))
    }

    func testShAndCapitals() {
        var r = Rewriter()
        XCTAssertEqual(r.handle(.char("S")), .pass)
        XCTAssertEqual(r.handle(.char("H")), .replace(deleteBefore: 1, insert: "Ş"))
    }

    func testTutuqReplacesApostropheBeforeNextLetter() {
        var r = Rewriter()
        _ = r.handle(.char("a"))
        XCTAssertEqual(r.handle(.char("'")), .pass)
        XCTAssertEqual(r.handle(.char("n")), .replace(deleteBefore: 1, insert: "ʼn"))
    }

    func testDisabledPassesEverything() {
        XCTAssertEqual(RewriteTyping.simulate("o'zbek shahar", options: .init(enabled: false)), "o'zbek shahar")
    }

    func testBackspaceForgetsContext() {
        var r = Rewriter()
        _ = r.handle(.char("o"))
        _ = r.handle(.backspace)
        XCTAssertEqual(r.handle(.char("'")), .pass)
    }

    func testOtherKeyForgetsContext() {
        var r = Rewriter()
        _ = r.handle(.char("s"))
        _ = r.handle(.other)
        XCTAssertEqual(r.handle(.char("h")), .pass)
    }

    func testConvertedLetterDoesNotChain() {
        // maşhur: ş dan keyin h yana ögirilmaydi
        var r = Rewriter()
        _ = r.handle(.char("s"))
        _ = r.handle(.char("h"))
        XCTAssertEqual(r.handle(.char("h")), .pass)
    }
}
