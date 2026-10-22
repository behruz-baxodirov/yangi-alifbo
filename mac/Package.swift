// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "YangiAlifbo",
    platforms: [.macOS(.v12)],
    targets: [
        .target(name: "AlifboCore"),
        .executableTarget(
            name: "YangiAlifbo",
            dependencies: ["AlifboCore"],
            linkerSettings: [.linkedFramework("InputMethodKit"), .linkedFramework("Carbon")]
        ),
        .testTarget(name: "AlifboCoreTests", dependencies: ["AlifboCore"]),
    ]
)
