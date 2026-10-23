import XCTest
@testable import AlifboCore

final class UpdateTests: XCTestCase {
    func testParsesAndCompares() {
        XCTAssertEqual(AppVersion("v2.0.3")?.description, "2.0.3")
        XCTAssertTrue(AppVersion("2.0.10")! > AppVersion("2.0.9")!)
        XCTAssertEqual(AppVersion("2.0"), AppVersion("2.0.0"))
        XCTAssertNil(AppVersion("dev"))
        XCTAssertNil(AppVersion("v2.1.0-rc1"))
        XCTAssertNil(AppVersion(""))
    }

    func testNewer() {
        XCTAssertEqual(UpdateCheck.newer(latest: "v2.0.3", than: "2.0.2")?.description, "2.0.3")
        XCTAssertNil(UpdateCheck.newer(latest: "v2.0.2", than: "2.0.2"))
        XCTAssertNil(UpdateCheck.newer(latest: "v2.0.1", than: "2.0.2"))
        // swift run'dagi "dev" nusxa yangilaşni taklif qilmaydi.
        XCTAssertNil(UpdateCheck.newer(latest: "v9.0.0", than: "dev"))
    }

    func testVersionFromLocation() {
        XCTAssertEqual(UpdateCheck.version(fromLocation: "https://github.com/behruz-baxodirov/yangi-alifbo/releases/tag/v2.0.2")?.description, "2.0.2")
        XCTAssertNil(UpdateCheck.version(fromLocation: "https://github.com/behruz-baxodirov/yangi-alifbo/releases"))
    }

    // Teg öqilmagan javob (429, 5xx) topilgan yangilanişni öçirmaydi.
    func testUnreadableAnswerKeepsSavedUpdate() {
        XCTAssertEqual(UpdateCheck.available(latest: nil, current: "2.0.3", saved: "2.0.4"), "2.0.4")
        XCTAssertNil(UpdateCheck.available(latest: nil, current: "2.0.3", saved: nil))
    }

    func testReadableAnswerReplacesSavedUpdate() {
        XCTAssertEqual(UpdateCheck.available(latest: AppVersion("v2.0.5"), current: "2.0.3", saved: "2.0.4"), "2.0.5")
        // Reliz qaytarib olingan: oxirgisi joriy bilan teng.
        XCTAssertNil(UpdateCheck.available(latest: AppVersion("v2.0.3"), current: "2.0.3", saved: "2.0.4"))
    }

    func testIsDue() {
        let now = Date(timeIntervalSince1970: 1_000_000)
        XCTAssertTrue(UpdateCheck.isDue(last: nil, now: now))
        XCTAssertFalse(UpdateCheck.isDue(last: now.addingTimeInterval(-23 * 3600), now: now))
        XCTAssertTrue(UpdateCheck.isDue(last: now.addingTimeInterval(-24 * 3600), now: now))
        // Soat orqaga surilgan: tekşiruv to'xtab qolmaydi.
        XCTAssertTrue(UpdateCheck.isDue(last: now.addingTimeInterval(3600), now: now))
    }
}
