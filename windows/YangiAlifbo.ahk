; Yangi alifbo — Windows uçun (beta).
; o' → ö, g' → ğ, sh → ş, ch → ç, s'h → sʼh, harf'harf → harfʼharf
; Yoqiş/öçiriş: Ctrl + Alt + Space yoki tray ikonkasi.
#Requires AutoHotkey v2.0
#SingleInstance Force

global Enabled := true
global Tutuq := true
global Last := ""            ; oxirgi yozilgan belgi ("" — nomalum)
global LastWasLetter := false
global ApoAfterLetter := false

APOS := "'``‘’ʻʼ´"
WITH_APOS := Map("o", "ö", "O", "Ö", "g", "ğ", "G", "Ğ")
WITH_H := Map("s", "ş", "S", "Ş", "c", "ç", "C", "Ç")

ih := InputHook("V")
ih.MinSendLevel := 1          ; özimiz yuborgan matnni qayta ushlamaymiz
ih.KeyOpt("{All}", "N")
ih.OnChar := OnChar
ih.OnKeyDown := OnKeyDown
ih.Start()

SetupTray()

^!Space:: ToggleEnabled()
~LButton:: ResetState()
~RButton:: ResetState()

OnChar(hook, ch) {
    global
    if !Enabled
        return
    if InStr(APOS, ch, true) && WITH_APOS.Has(Last) {
        Replace(2, WITH_APOS[Last])
        return
    }
    if (ch == "h" || ch == "H") && WITH_H.Has(Last) {
        Replace(2, WITH_H[Last])
        return
    }
    if ApoAfterLetter && Tutuq && IsLetter(ch) {
        Send "{BS 2}"
        SendText "ʼ" ch
        ApoAfterLetter := false
        Last := ch
        LastWasLetter := true
        return
    }
    ApoAfterLetter := InStr(APOS, ch, true) && LastWasLetter
    LastWasLetter := IsLetter(ch)
    Last := ch
}

Replace(count, letter) {
    global
    Send "{BS " count "}"
    SendText letter
    Last := letter
    LastWasLetter := true
    ApoAfterLetter := false
}

OnKeyDown(hook, vk, sc) {
    ; Matn bölmagan tugmalar (strelka, Enter, Backspace, Tab, Esc…) kontekstni uzadi.
    key := GetKeyName(Format("vk{:x}sc{:x}", vk, sc))
    if key ~= "^(L|R)?Shift$|^CapsLock$|^Space$"
        return
    if StrLen(key) > 1 || GetKeyState("Ctrl") || GetKeyState("Alt") || GetKeyState("LWin") || GetKeyState("RWin")
        ResetState()
}

ResetState() {
    global
    Last := ""
    LastWasLetter := false
    ApoAfterLetter := false
}

IsLetter(ch) => RegExMatch(ch, "^\p{L}$")

ToggleEnabled(*) {
    global
    Enabled := !Enabled
    ResetState()
    UpdateTray()
    TrayTip Enabled ? "Yangi alifbo yoqildi" : "Yangi alifbo öçirildi", "Yangi alifbo", "Mute"
}

ToggleTutuq(*) {
    global
    Tutuq := !Tutuq
    UpdateTray()
}

SetupTray() {
    A_TrayMenu.Delete()
    A_TrayMenu.Add("Yoqilgan (Ctrl+Alt+Space)", ToggleEnabled)
    A_TrayMenu.Add("Tutuq belgisi ʼ", ToggleTutuq)
    A_TrayMenu.Add()
    A_TrayMenu.Add("Çiqiş", (*) => ExitApp())
    A_TrayMenu.Default := "Yoqilgan (Ctrl+Alt+Space)"
    UpdateTray()
}

UpdateTray() {
    global
    if Enabled
        A_TrayMenu.Check("Yoqilgan (Ctrl+Alt+Space)")
    else
        A_TrayMenu.Uncheck("Yoqilgan (Ctrl+Alt+Space)")
    if Tutuq
        A_TrayMenu.Check("Tutuq belgisi ʼ")
    else
        A_TrayMenu.Uncheck("Tutuq belgisi ʼ")
    A_IconTip := "Yangi alifbo — " (Enabled ? "yoqilgan" : "öçirilgan")
}
