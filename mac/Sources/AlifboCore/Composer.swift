public struct ComposerOptions: Equatable {
    /// Harf + apostrof + harf → tutuq belgisi ʼ (U+02BC).
    public var tutuq: Bool
    public init(tutuq: Bool = true) { self.tutuq = tutuq }
}

public enum KeyInput: Equatable {
    case char(Character)
    case backspace
    /// Matn bo'lmagan tugma (Enter, strelka, ⌘-kombinatsiya, fokus o'zgarishi).
    case other
}

public struct ComposerOutput: Equatable {
    /// Ilovaga yozib yuboriladigan matn.
    public var commit: String
    /// true: tugmani dastur o'zi yutdi; false: tugma ilovaga odatdagidek o'tadi.
    public var consumed: Bool
    public init(commit: String, consumed: Bool) {
        self.commit = commit
        self.consumed = consumed
    }
}

public enum Alphabet {
    public static let apostrophes: Set<Character> = ["'", "`", "‘", "’", "ʻ", "ʼ", "´"]
    public static let tutuq: Character = "ʼ"

    /// o' → ö, g' → ğ
    static let withApostrophe: [Character: Character] = ["o": "ö", "O": "Ö", "g": "ğ", "G": "Ğ"]
    /// sh → ş, ch → ç
    static let withH: [Character: Character] = ["s": "ş", "S": "Ş", "c": "ç", "C": "Ç"]
}

/// Tugmalar ketma-ketligini yangi alifboga o'giradigan holat mashinasi.
/// Bir vaqtda faqat bitta belgi kutib turiladi (`marked`): o/g/s/c yoki harfdan keyingi apostrof.
public struct Composer {
    public var options: ComposerOptions
    public private(set) var marked: String = ""

    private var pending: Character?
    /// Oxirgi yozilgan belgi harfmi; nil — noma'lum (kursor ko'chgan bo'lishi mumkin).
    private var lastWasLetter: Bool? = nil

    public init(options: ComposerOptions = .init()) { self.options = options }

    public mutating func handle(_ input: KeyInput, before: () -> Character? = { nil }) -> ComposerOutput {
        switch input {
        case .backspace:
            guard pending != nil else {
                lastWasLetter = nil
                return ComposerOutput(commit: "", consumed: false)
            }
            setPending(nil)
            lastWasLetter = nil
            return ComposerOutput(commit: "", consumed: true)
        case .other:
            return ComposerOutput(commit: flush(), consumed: false)
        case .char(let ch):
            return handleChar(ch, before: before)
        }
    }

    public mutating func flush() -> String {
        let out = pending.map(String.init) ?? ""
        setPending(nil)
        lastWasLetter = nil
        return out
    }

    private mutating func handleChar(_ ch: Character, before: () -> Character?) -> ComposerOutput {
        if let p = pending {
            if Alphabet.apostrophes.contains(ch), let letter = Alphabet.withApostrophe[p] {
                return converted(letter)
            }
            if ch == "h" || ch == "H", let letter = Alphabet.withH[p] {
                return converted(letter)
            }
            let flushed: String
            let flushedLetter: Bool
            if Alphabet.apostrophes.contains(p) {
                // Harf + apostrof + harf → tutuq; aks holda apostrof o'zicha qoladi.
                flushed = ch.isLetter ? String(Alphabet.tutuq) : String(p)
                flushedLetter = false
            } else {
                flushed = String(p)
                flushedLetter = true
            }
            lastWasLetter = flushedLetter
            setPending(nil)
            var out = startFresh(ch, before: before, flushedLetter: flushedLetter)
            out.commit = flushed + out.commit
            return out
        }
        return startFresh(ch, before: before)
    }

    private mutating func startFresh(_ ch: Character, before: () -> Character?, flushedLetter: Bool? = nil) -> ComposerOutput {
        if Alphabet.withApostrophe[ch] != nil || Alphabet.withH[ch] != nil {
            setPending(ch)
            return ComposerOutput(commit: "", consumed: true)
        }
        if Alphabet.apostrophes.contains(ch), options.tutuq {
            // Hozirgina yozib yuborilgan belgini client hali körmaydi; aks holda client'ning matni
            // (sichqoncha bilan ko'chgan kursor) kuzatilgan holatdan ustun.
            let afterLetter = flushedLetter ?? before()?.isLetter ?? lastWasLetter ?? false
            if afterLetter {
                setPending(ch)
                return ComposerOutput(commit: "", consumed: true)
            }
        }
        lastWasLetter = ch.isLetter
        return ComposerOutput(commit: "", consumed: false)
    }

    private mutating func converted(_ letter: Character) -> ComposerOutput {
        setPending(nil)
        lastWasLetter = true
        return ComposerOutput(commit: String(letter), consumed: true)
    }

    private mutating func setPending(_ ch: Character?) {
        pending = ch
        marked = ch.map(String.init) ?? ""
    }
}
