public enum Typing {
    /// Matnni harfma-harf yozilgandek Composer'dan o'tkazadi (testlar uchun).
    public static func simulate(_ text: String, options: ComposerOptions = .init()) -> String {
        var composer = Composer(options: options)
        var result = ""
        for ch in text {
            let out = composer.handle(.char(ch), before: { result.last })
            result += out.commit
            if !out.consumed { result.append(ch) }
        }
        return result + composer.flush()
    }
}
