import XCTest
import Cocoa
import AlifboCore
@testable import YangiAlifbo

final class KeyMapperTests: XCTestCase {
    private func key(_ text: String, code: UInt16 = 0, flags: NSEvent.ModifierFlags = []) -> NSEvent {
        NSEvent.keyEvent(with: .keyDown, location: .zero, modifierFlags: flags, timestamp: 0,
                        windowNumber: 0, context: nil, characters: text,
                        charactersIgnoringModifiers: text, isARepeat: false, keyCode: code)!
    }

    func testTextBackspaceAndNavigation() {
        XCTAssertEqual(KeyMapper.input(for: key("s")), .char("s"))
        XCTAssertEqual(KeyMapper.input(for: key("S", flags: .shift)), .char("S"))
        XCTAssertEqual(KeyMapper.input(for: key("\u{7f}", code: 51)), .backspace)
        for text in ["\r", "\t", "\u{1b}", "\u{f702}", ""] {
            XCTAssertEqual(KeyMapper.input(for: key(text)), .other)
        }
    }

    func testShortcutsArePassedThrough() {
        for flags: NSEvent.ModifierFlags in [.command, .control, .option] {
            XCTAssertEqual(KeyMapper.input(for: key("s", flags: flags)), .other)
            XCTAssertEqual(KeyMapper.input(for: key("\u{7f}", code: 51, flags: flags)), .other)
        }
    }

    func testOptionTypographyCanReachTheAlphabetWithoutConsumingShortcuts() {
        XCTAssertEqual(KeyMapper.input(for: key("‘", flags: .option)), .char("‘"))
        XCTAssertEqual(KeyMapper.input(for: key("’", flags: [.option, .shift])), .char("’"))
        XCTAssertEqual(KeyMapper.input(for: key("’", flags: [.option, .command])), .other)
    }
}
