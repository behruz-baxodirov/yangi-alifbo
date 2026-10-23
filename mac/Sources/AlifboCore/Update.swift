import Foundation

/// Reliz versiyasi: "v2.0.3" yoki "2.0.3". Raqamdan boşqa qismi bor teg (beta, rc) yangilaniş emas.
public struct AppVersion: Comparable, CustomStringConvertible {
    let parts: [Int]

    public init?(_ text: String) {
        let digits = text.hasPrefix("v") ? String(text.dropFirst()) : text
        let pieces = digits.split(separator: ".", omittingEmptySubsequences: false)
        guard !pieces.isEmpty, pieces.allSatisfy({ !$0.isEmpty && $0.allSatisfy(\.isASCII) && $0.allSatisfy(\.isNumber) }) else {
            return nil
        }
        var parts = pieces.compactMap { Int($0) }
        guard parts.count == pieces.count else { return nil }
        // 2.0 == 2.0.0: oxiridagi nollar taqqoslaşga ta'sir qilmaydi.
        while parts.count > 1, parts.last == 0 { parts.removeLast() }
        self.parts = parts
        self.description = digits
    }

    public let description: String

    public static func == (a: AppVersion, b: AppVersion) -> Bool { a.parts == b.parts }

    public static func < (a: AppVersion, b: AppVersion) -> Bool {
        for i in 0..<max(a.parts.count, b.parts.count) {
            let x = i < a.parts.count ? a.parts[i] : 0
            let y = i < b.parts.count ? b.parts[i] : 0
            if x != y { return x < y }
        }
        return false
    }
}

/// Kuniga bir marta GitHub'dagi oxirgi reliz versiyasini tekşiriş qoidalari.
public enum UpdateCheck {
    public static let interval: TimeInterval = 24 * 3600

    /// Oxirgi javobdan 24 soat ötgan bölsa (yoki soat orqaga surilgan bölsa) — tekşiriş vaqti.
    public static func isDue(last: Date?, now: Date) -> Bool {
        guard let last else { return true }
        return last > now || now.timeIntervalSince(last) >= interval
    }

    /// `…/releases/tag/v2.0.2` → 2.0.2
    public static func version(fromLocation location: String) -> AppVersion? {
        let path = location.split(separator: "?").first.map(String.init) ?? location
        let parts = path.split(separator: "/")
        guard parts.count >= 2, parts[parts.count - 2] == "tag" else { return nil }
        return AppVersion(String(parts[parts.count - 1]))
    }

    /// Javobdan keyin saqlanadigan yangi versiya. Teg öqilmagan javob (429, 5xx, boşqa sahifa)
    /// avval topilganini öçirmaydi.
    public static func available(latest: AppVersion?, current: String, saved: String?) -> String? {
        guard let latest else { return saved }
        return newer(latest: latest.description, than: current)?.description
    }

    /// Oxirgi reliz joriydan yangi bölsa, uning versiyasi.
    public static func newer(latest: String, than current: String) -> AppVersion? {
        guard let latest = AppVersion(latest), let current = AppVersion(current), latest > current else { return nil }
        return latest
    }
}
