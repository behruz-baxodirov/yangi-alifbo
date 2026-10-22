#!/usr/bin/env bash
# Yangi alifbo — macOS klaviaturasini örnatiş.
#   curl -fsSL https://behruz-baxodirov.github.io/yangi-alifbo/install.sh | bash
set -euo pipefail

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
    local pid
    for pid in $(running_pids "$1"); do
        kill "$pid" 2>/dev/null || true
    done
}

main() {
    local zip_url="${YA_ZIP_URL:-https://github.com/behruz-baxodirov/yangi-alifbo/releases/latest/download/YangiAlifbo.zip}"
    local dest="$HOME/Library/Input Methods"
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

    echo "→ Örnatilmoqda: $app"
    stop_running "$app"
    mkdir -p "$dest"
    rm -rf "$app"
    mv "$tmp/YangiAlifbo.app" "$app"
    xattr -dr com.apple.quarantine "$app" 2>/dev/null || true

    if [ "${YA_SKIP_REGISTER:-0}" != "1" ]; then
        "$app/Contents/MacOS/YangiAlifbo" --install
    fi

    local version
    version="$("$app/Contents/MacOS/YangiAlifbo" --version 2>/dev/null || echo '?')"
    echo
    echo "✓ Yangi alifbo örnatildi (versiya: $version)."
    cat <<'MSG'

Klaviatura hozir yoqildi: menyu-barda "ö" belgisi turibdi.
Almaştiriş:  ⌃ Control + Space yoki 🌐 (Fn) — ABC va Yangi alifbo orasida.
Qaysi biri yoqilganini menyu-bardagi belgi körsatadi; kerak bölsa öşa yerdan tanlang.

Yozib köring:  o' → ö   g' → ğ   sh → ş   ch → ç   s'h → sʼh (Isʼhoq)

Agar röyxatda körinmasa: System Settings → Keyboard → Input Sources → Edit → "+" → Uzbek → Yangi alifbo.
Öçiriş:  curl -fsSL https://behruz-baxodirov.github.io/yangi-alifbo/uninstall.sh | bash
MSG
}

[ -n "${YA_TEST_SOURCE:-}" ] || main "$@"
