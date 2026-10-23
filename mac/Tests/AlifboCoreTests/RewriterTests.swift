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

    // Manzil qatori "yozgic" ga "yozgich.uz" taklif qilib "h.uz" ni belgilaydi:
    // birinçi Backspace belgilangan taklifni öçiradi, "c" uçun yana bittasi kerak.
    func testSelectedSuggestionNeedsOneMoreBackspace() {
        XCTAssertEqual(RewriteAction.backspaceCount(deleteBefore: 1, selectionLength: 4), 2)
    }

    func testNoSelectionKeepsBackspaceCount() {
        XCTAssertEqual(RewriteAction.backspaceCount(deleteBefore: 1, selectionLength: 0), 1)
        XCTAssertEqual(RewriteAction.backspaceCount(deleteBefore: 1, selectionLength: nil), 1)
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

    // c, b (adaşib), ⌫, h → ç: Backspace faqat oxirgi harfni unutadi.
    func testBackspaceKeepsLetterBeforeDeletedOne() {
        var r = Rewriter()
        _ = r.handle(.char("c"))
        _ = r.handle(.char("b"))
        XCTAssertEqual(r.handle(.backspace), .pass)
        XCTAssertEqual(r.handle(.char("h")), .replace(deleteBefore: 1, insert: "ç"))
    }

    func testBackspaceAfterApostropheTypo() {
        var r = Rewriter()
        _ = r.handle(.char("o"))
        _ = r.handle(.char("x"))
        _ = r.handle(.backspace)
        XCTAssertEqual(r.handle(.char("'")), .replace(deleteBefore: 1, insert: "ö"))
    }

    // Belgilangan matn öçirilsa, qaysi harf qolgani noma'lum: hammasi unutiladi.
    func testDeletingSelectionForgetsContext() {
        var r = Rewriter()
        _ = r.handle(.char("c"))
        r.deletedSelection()
        XCTAssertEqual(r.handle(.char("h")), .pass)
    }

    func testDisabledBackspaceForgetsContext() {
        var r = Rewriter(options: .init(enabled: false))
        _ = r.handle(.char("c"))
        _ = r.handle(.char("b"))
        _ = r.handle(.backspace)
        r.options.enabled = true
        XCTAssertEqual(r.handle(.char("h")), .pass)
    }

    // cbh → kursor b dan keyin → ⌫: c va h birikadi.
    func testJoinedLetterAroundDeletedCharacter() {
        XCTAssertEqual(Alphabet.joinedLetter(before: "c", after: "h"), "ç")
        XCTAssertEqual(Alphabet.joinedLetter(before: "S", after: "H"), "Ş")
        XCTAssertEqual(Alphabet.joinedLetter(before: "s", after: "H"), "ş")
        XCTAssertEqual(Alphabet.joinedLetter(before: "o", after: "'"), "ö")
        XCTAssertEqual(Alphabet.joinedLetter(before: "G", after: "’"), "Ğ")
    }

    func testNothingJoinsWithoutPair() {
        XCTAssertNil(Alphabet.joinedLetter(before: "a", after: "h"))
        XCTAssertNil(Alphabet.joinedLetter(before: "c", after: "b"))
        XCTAssertNil(Alphabet.joinedLetter(before: "c", after: "'"))
        XCTAssertNil(Alphabet.joinedLetter(before: nil, after: "h"))
        XCTAssertNil(Alphabet.joinedLetter(before: "c", after: nil))
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
