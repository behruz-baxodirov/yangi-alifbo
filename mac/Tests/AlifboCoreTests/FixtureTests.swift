import Foundation
import XCTest
@testable import AlifboCore

struct FixtureCase: Decodable {
    let `in`: String
    let out: String
    let note: String
}

func loadFixtures() throws -> [FixtureCase] {
    let root = URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent().deletingLastPathComponent()
        .deletingLastPathComponent().deletingLastPathComponent()
    let data = try Data(contentsOf: root.appendingPathComponent("core/fixtures/cases.json"))
    return try JSONDecoder().decode([FixtureCase].self, from: data)
}

final class FixtureTests: XCTestCase {
    func testFixtures() throws {
        let cases = try loadFixtures()
        XCTAssertGreaterThanOrEqual(cases.count, 60)
        for c in cases {
            XCTAssertEqual(Typing.simulate(c.in), c.out, c.note)
        }
    }
}
