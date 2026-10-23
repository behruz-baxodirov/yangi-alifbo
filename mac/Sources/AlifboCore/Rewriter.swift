/// Fondagi dastur uçun: tugma ilovaga ötib bölgandan keyin "öçir + yoz" qarorini beradi.
/// `.replace` — joriy tugma yutiladi, oldingi `deleteBefore` ta belgi öçiriladi va `insert` yoziladi.
public enum RewriteAction: Equatable {
    case pass
    case replace(deleteBefore: Int, insert: String)
}

extension RewriteAction {
    /// `.replace` uçun nečta Backspace yuboriladi.
    /// `selectionLength` — maydonda belgilangan matn uzunligi (bilinmasa nil).
    /// Belgilangan matn bölsa (masalan, manzil qatorining taklifi), birinçi Backspace
    /// faqat uni öçiradi, şuning uçun bitta qöşimça Backspace kerak.
    public static func backspaceCount(deleteBefore: Int, selectionLength: Int?) -> Int {
        deleteBefore + ((selectionLength ?? 0) > 0 ? 1 : 0)
    }
}

extension Alphabet {
    /// Örtadagi belgi öçirilganda qöşnilar birikadimi: c|b|h → ç, o|x|' → ö.
    public static func joinedLetter(before: Character?, after: Character?) -> Character? {
        guard let before, let after else { return nil }
        if after == "h" || after == "H" { return withH[before] }
        if apostrophes.contains(after) { return withApostrophe[before] }
        return nil
    }
}

public struct Rewriter {
    public var options: ComposerOptions
    /// Hujjatdagi oxirgi ikki belgi (biz bilgan qadar). Bo'sh — kontekst nomalum.
    private var recent: [Character] = []

    public init(options: ComposerOptions = .init()) { self.options = options }

    public mutating func handle(_ input: KeyInput) -> RewriteAction {
        if options.enabled, input == .backspace {
            // Faqat oxirgi belgi öçadi: "c b ⌫ h" → ç.
            if !recent.isEmpty { recent.removeLast() }
            return .pass
        }
        guard options.enabled, case .char(let ch) = input else {
            reset()
            return .pass
        }
        let last = recent.last
        if Alphabet.apostrophes.contains(ch), let prev = last, let letter = Alphabet.withApostrophe[prev] {
            return replaced(1, with: [letter])
        }
        if ch == "h" || ch == "H", let prev = last, let letter = Alphabet.withH[prev] {
            return replaced(1, with: [letter])
        }
        if options.tutuq, ch.isLetter, let prev = last, Alphabet.apostrophes.contains(prev),
           recent.count >= 2, recent[recent.count - 2].isLetter {
            return replaced(1, with: [Alphabet.tutuq, ch])
        }
        remember(ch)
        return .pass
    }

    public mutating func reset() { recent.removeAll() }

    /// Backspace belgilangan matnni öçirdi: kursor oldida nima qolgani noma'lum.
    public mutating func deletedSelection() { reset() }

    private mutating func replaced(_ count: Int, with chars: [Character]) -> RewriteAction {
        recent.removeLast(min(count, recent.count))
        // ö ğ ş ç qoidalar kalitlari emas, şuning uçun keyingi tugma bilan qayta birikmaydi (maşhur).
        chars.forEach { remember($0) }
        return .replace(deleteBefore: count, insert: String(chars))
    }

    private mutating func remember(_ ch: Character) {
        recent.append(ch)
        if recent.count > 2 { recent.removeFirst() }
    }
}

/// Matnni harfma-harf yozilgandek Rewriter'dan ötkazadi (testlar uçun).
public enum RewriteTyping {
    public static func simulate(_ text: String, options: ComposerOptions = .init()) -> String {
        var rewriter = Rewriter(options: options)
        var result: [Character] = []
        for ch in text {
            switch rewriter.handle(.char(ch)) {
            case .pass:
                result.append(ch)
            case .replace(let count, let insert):
                result.removeLast(min(count, result.count))
                result.append(contentsOf: insert)
            }
        }
        return String(result)
    }
}
