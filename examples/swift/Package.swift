// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MomotoExample",
    platforms: [
        .iOS(.v16),
        .macOS(.v13),
    ],
    targets: [
        .executableTarget(
            name: "MomotoExample",
            path: "Sources/MomotoExample"
        ),
    ]
)
