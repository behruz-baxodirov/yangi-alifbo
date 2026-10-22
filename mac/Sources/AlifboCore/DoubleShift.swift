/// ⇧ Shift'ni tez-tez ikki marta bosişni aniqlaydi (boşqa tugmasiz).
/// Katta harf uçun bosilgan Shift (orada harf yozilgan) hisoblanmaydi.
public struct DoubleShiftDetector {
    private let window: Double
    private var downAt: Double?
    private var usedWithOtherKey = false
    private var lastTapUp: Double?

    public init(window: Double = 0.4) { self.window = window }

    /// Shift bosildi yoki qöyib yuborildi. true — ikkinçi tez bosiş tugadi.
    public mutating func shift(down: Bool, at time: Double) -> Bool {
        if down {
            downAt = time
            usedWithOtherKey = false
            return false
        }
        guard let start = downAt else { return false }
        downAt = nil
        guard !usedWithOtherKey, time - start <= window else {
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

    /// Shift'dan boşqa har qanday tugma ketma-ketlikni uzadi.
    public mutating func otherKey() {
        usedWithOtherKey = true
        lastTapUp = nil
    }
}
