import Cocoa
import AlifboCore

enum KeyMapper {
    private static let deleteKeyCode: UInt16 = 51

    static func input(for event: NSEvent) -> KeyInput {
        let flags = event.modifierFlags.intersection(.deviceIndependentFlagsMask)
        if !flags.intersection([.command, .control, .option]).isEmpty { return .other }
        if event.keyCode == deleteKeyCode { return .backspace }
        guard let chars = event.characters, chars.count == 1, let ch = chars.first,
              let scalar = ch.unicodeScalars.first else { return .other }
        // Boshqaruv belgilari (Enter, Tab, Esc) va funksional tugmalar (strelkalar, F1…).
        if scalar.value < 0x20 || scalar.value == 0x7F || (0xF700...0xF8FF).contains(scalar.value) {
            return .other
        }
        return .char(ch)
    }
}
