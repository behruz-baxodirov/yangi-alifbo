#!/usr/bin/env bash
# Yangi alifbo — macOS uçun fondagi dasturni örnatiş.
#   curl -fsSL https://behruz-baxodirov.github.io/yangi-alifbo/install.sh | bash
set -euo pipefail

LABEL="uz.yangialifbo.YangiAlifbo"

# Faqat şu yerdagi nusxaning jarayonlari (nom böyiça emas: boşqa nusxalarga tegmaymiz).
running_pids() {
    local exe="$1/Contents/MacOS/YangiAlifbo"
    ps -axo pid=,command= | while read -r pid command; do
        case "$command" in
            "$exe" | "$exe "*) echo "$pid" ;;
        esac
    done
    return 0
}

stop_running() {
    local pid i
    for pid in $(running_pids "$1"); do
        kill "$pid" 2>/dev/null || true
        # Eski jarayon to'liq öçmaguncha kutamiz.
        for i in $(seq 1 30); do
            kill -0 "$pid" 2>/dev/null || break
            sleep 0.1
        done
    done
}

# 1.x versiyadagi klaviatura (input source) — yangi dastur bilan birga ikki marta ögirmasin.
remove_old_input_method() {
    local old="$HOME/Library/Input Methods/YangiAlifbo.app"
    [ -d "$old" ] || return 0
    echo "→ Eski klaviatura (1.x) olib taşlanmoqda"
    "$old/Contents/MacOS/YangiAlifbo" --uninstall 2>/dev/null || true
    stop_running "$old"
    rm -rf "$old"
}

write_launch_agent() {
    local app="$1" plist="$HOME/Library/LaunchAgents/$LABEL.plist"
    mkdir -p "$HOME/Library/LaunchAgents"
    cat > "$plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>$LABEL</string>
	<key>ProgramArguments</key>
	<array>
		<string>$app/Contents/MacOS/YangiAlifbo</string>
	</array>
	<key>RunAtLoad</key>
	<true/>
	<key>KeepAlive</key>
	<dict>
		<key>SuccessfulExit</key>
		<false/>
	</dict>
	<key>LimitLoadToSessionType</key>
	<string>Aqua</string>
</dict>
</plist>
PLIST
    launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
    launchctl bootstrap "gui/$(id -u)" "$plist"
}

main() {
    local zip_url="${YA_ZIP_URL:-https://github.com/behruz-baxodirov/yangi-alifbo/releases/latest/download/YangiAlifbo.zip}"
    local dest="$HOME/Applications"
    local app="$dest/YangiAlifbo.app"

    if [ "$(uname -s)" != "Darwin" ]; then
        echo "Bu skript faqat macOS uçun." >&2
        exit 1
    fi
    local major
    major="$(sw_vers -productVersion | cut -d. -f1)"
    if [ "$major" -lt 12 ]; then
        echo "macOS 12 yoki undan yangisi kerak (sizda $(sw_vers -productVersion))." >&2
        exit 1
    fi

    TMP_DIR="$(mktemp -d)"
    trap 'rm -rf "${TMP_DIR:-}"' EXIT
    local tmp="$TMP_DIR"

    echo "→ Yuklab olinmoqda…"
    curl -fsSL "$zip_url" -o "$tmp/YangiAlifbo.zip"
    ditto -x -k "$tmp/YangiAlifbo.zip" "$tmp"
    if [ ! -x "$tmp/YangiAlifbo.app/Contents/MacOS/YangiAlifbo" ]; then
        echo "Arxiv buzilgan: YangiAlifbo.app topilmadi." >&2
        exit 1
    fi

    if [ "${YA_SKIP_REGISTER:-0}" != "1" ]; then
        remove_old_input_method
        launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
    fi

    echo "→ Örnatilmoqda: $app"
    stop_running "$app"
    mkdir -p "$dest"
    rm -rf "$app"
    mv "$tmp/YangiAlifbo.app" "$app"
    xattr -dr com.apple.quarantine "$app" 2>/dev/null || true

    if [ "${YA_SKIP_REGISTER:-0}" != "1" ]; then
        write_launch_agent "$app"
    fi

    local version
    version="$("$app/Contents/MacOS/YangiAlifbo" --version 2>/dev/null || echo '?')"
    echo
    echo "✓ Yangi alifbo örnatildi (versiya: $version)."
    cat <<'MSG'

Bitta qadam qoldi — ruxsat beriş:
  macOS "Yangi alifbo would like to control this computer" deb söraydi →
  "Open System Settings" → Privacy & Security → Accessibility → "Yangi alifbo"ni yoqing.

Şundan keyin menyu-barda "ö" turadi va istalgan dasturda yozganingiz özi ögiriladi.
Yoqiş/öçiriş: menyu-bardagi "ö" ni bosing ("A" — öçiq). Til almaştiriş şart emas.

Yozib köring:  o' → ö   g' → ğ   sh → ş   ch → ç   s'h → sʼh (Isʼhoq)

Öçiriş:  curl -fsSL https://behruz-baxodirov.github.io/yangi-alifbo/uninstall.sh | bash
MSG
}

[ -n "${YA_TEST_SOURCE:-}" ] || main "$@"
