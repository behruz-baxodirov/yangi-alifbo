public struct Modifiers: OptionSet, Hashable {
    public let rawValue: Int
    public init(rawValue: Int) { self.rawValue = rawValue }
    public static let shift = Modifiers(rawValue: 1)
    public static let option = Modifiers(rawValue: 2)
    public static let control = Modifiers(rawValue: 4)
    public static let command = Modifiers(rawValue: 8)
}

/// Foydalanuvçi menyudan tanlaydigan yoqiş/öçiriş tugmasi.
public enum ToggleShortcut: String, CaseIterable {
    case doubleShift, doubleOption, doubleControl, controlSpace, commandShiftSpace, none

    public var label: String {
        switch self {
        case .doubleShift: return "⇧ Shift — ikki marta"
        case .doubleOption: return "⌥ Option — ikki marta"
        case .doubleControl: return "⌃ Control — ikki marta"
        case .controlSpace: return "⌃ Control + Space (tilni almaştiriş örniga)"
        case .commandShiftSpace: return "⌘ Cmd + ⇧ Shift + Space"
        case .none: return "Faqat menyu-bardagi belgi"
        }
    }

    /// Ikki marta bosiladigan modifikator (bölsa).
    var doubleTapModifier: Modifiers? {
        switch self {
        case .doubleShift: return .shift
        case .doubleOption: return .option
        case .doubleControl: return .control
        default: return nil
        }
    }

    /// Space bilan birga bosiladigan modifikatorlar (bölsa).
    var spaceCombo: Modifiers? {
        switch self {
        case .controlSpace: return .control
        case .commandShiftSpace: return [.command, .shift]
        default: return nil
        }
    }
}

/// Tugma hodisalaridan tanlangan yoqiş/öçiriş tugmasini aniqlaydi.
public struct ShortcutMatcher {
    public static let spaceKeyCode: UInt16 = 49
    private let shortcut: ToggleShortcut
    private let window: Double
    private var downAt: Double?
    private var tainted = false
    private var lastTapUp: Double?

    public init(_ shortcut: ToggleShortcut, window: Double = 0.4) {
        self.shortcut = shortcut
        self.window = window
    }

    /// Modifikatorlar özgardi. true — ikki marta bosiş tugadi.
    public mutating func flagsChanged(_ modifiers: Modifiers, at time: Double) -> Bool {
        guard let target = shortcut.doubleTapModifier else { return false }
        if modifiers == target, downAt == nil {
            downAt = time
            tainted = false
            return false
        }
        if modifiers.isEmpty, let start = downAt {
            downAt = nil
            guard !tainted, time - start <= window else {
                lastTapUp = nil
                return false
            }
            if let last = lastTapUp, time - last <= window {
                lastTapUp = nil
                return true
            }
            lastTapUp = time
            return false
        }
        // Boşqa modifikator qöşildi: bu tap emas.
        tainted = true
        lastTapUp = nil
        return false
    }

    /// Oddiy tugma bosildi. true — bu tanlangan kombinatsiya (tugma yutiladi).
    public mutating func keyDown(code: UInt16, modifiers: Modifiers, at time: Double) -> Bool {
        tainted = true
        lastTapUp = nil
        guard let combo = shortcut.spaceCombo else { return false }
        return code == Self.spaceKeyCode && modifiers == combo
    }
}
