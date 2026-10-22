import Cocoa

/// Ekran pastida qisqa körinadigan "yoqildi / öçirildi" xabari (macOS ovoz HUD'iga öxşaş).
final class ToggleHUD {
    private var panel: NSPanel?
    private var hideWork: DispatchWorkItem?

    func show(symbol: String, title: String, subtitle: String? = nil, seconds: Double = 1.4) {
        hideWork?.cancel()
        panel?.orderOut(nil)

        let width: CGFloat = subtitle == nil ? 300 : 420
        let height: CGFloat = subtitle == nil ? 84 : 104
        let panel = NSPanel(contentRect: NSRect(x: 0, y: 0, width: width, height: height),
                            styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
        panel.level = .statusBar
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.ignoresMouseEvents = true
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary]

        let blur = NSVisualEffectView(frame: panel.contentView!.bounds)
        blur.material = .hudWindow
        blur.state = .active
        blur.wantsLayer = true
        blur.layer?.cornerRadius = 18
        blur.layer?.masksToBounds = true
        panel.contentView = blur

        let symbolLabel = NSTextField(labelWithString: symbol)
        symbolLabel.font = .systemFont(ofSize: 40, weight: .heavy)
        let titleLabel = NSTextField(labelWithString: title)
        titleLabel.font = .systemFont(ofSize: 17, weight: .semibold)
        let text = NSStackView(views: [titleLabel])
        text.orientation = .vertical
        text.alignment = .leading
        text.spacing = 2
        if let subtitle {
            let sub = NSTextField(labelWithString: subtitle)
            sub.font = .systemFont(ofSize: 13)
            sub.textColor = .secondaryLabelColor
            text.addArrangedSubview(sub)
        }
        let row = NSStackView(views: [symbolLabel, text])
        row.orientation = .horizontal
        row.spacing = 16
        row.alignment = .centerY
        row.translatesAutoresizingMaskIntoConstraints = false
        blur.addSubview(row)
        NSLayoutConstraint.activate([
            row.leadingAnchor.constraint(equalTo: blur.leadingAnchor, constant: 22),
            row.trailingAnchor.constraint(lessThanOrEqualTo: blur.trailingAnchor, constant: -22),
            row.centerYAnchor.constraint(equalTo: blur.centerYAnchor),
        ])

        if let screen = NSScreen.main {
            let frame = screen.visibleFrame
            panel.setFrameOrigin(NSPoint(x: frame.midX - width / 2, y: frame.minY + 120))
        }
        panel.alphaValue = 0
        panel.orderFrontRegardless()
        NSAnimationContext.runAnimationGroup { $0.duration = 0.15; panel.animator().alphaValue = 1 }
        self.panel = panel

        let work = DispatchWorkItem { [weak panel] in
            NSAnimationContext.runAnimationGroup({ $0.duration = 0.3; panel?.animator().alphaValue = 0 },
                                                 completionHandler: { panel?.orderOut(nil) })
        }
        hideWork = work
        DispatchQueue.main.asyncAfter(deadline: .now() + seconds, execute: work)
    }
}
