; Yangi alifbo — Windows uçun (beta).
; o' → ö, g' → ğ, sh → ş, ch → ç, s'h → sʼh, harf'harf → harfʼharf
; Yoqiş/öçiriş: Ctrl + Alt + Space yoki tray ikonkasi.
#Requires AutoHotkey v2.0
#SingleInstance Force
;@Ahk2Exe-SetMainIcon icons\yoqilgan.ico
;@Ahk2Exe-AddResource icons\ochiq.ico, 300

; Yoqilgan/öçiq holat va tutuq dastur qayta işga tuşganda ham saqlanadi.
SETTINGS := A_AppData "\YangiAlifbo\sozlamalar.ini"
global Enabled := IniRead(SETTINGS, "Sozlamalar", "Yoqilgan", "1") == "1"
global Tutuq := IniRead(SETTINGS, "Sozlamalar", "Tutuq", "1") == "1"
global Recent := ""          ; hujjatdagi oxirgi ikki belgi, biz bilgan qadar ("" — nomalum)

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
    last := SubStr(Recent, -1)
    if InStr(APOS, ch, true) && WITH_APOS.Has(last) {
        Replace(2, WITH_APOS[last])
        return
    }
    if (ch == "h" || ch == "H") && WITH_H.Has(last) {
        Replace(2, WITH_H[last])
        return
    }
    if Tutuq && IsLetter(ch) && StrLen(Recent) == 2 && InStr(APOS, last, true) && IsLetter(SubStr(Recent, 1, 1)) {
        Send "{BS 2}"
        SendText "ʼ" ch
        Recent := "ʼ" ch
        return
    }
    Remember(ch)
}

Replace(count, letter) {
    global
    Send "{BS " count "}"
    SendText letter
    ; ö ğ ş ç qoidalar kalitlari emas, şuning uçun keyingi tugma bilan qayta birikmaydi (maşhur).
    Forget()
    Remember(letter)
}

Remember(ch) {
    global
    Recent .= ch
    if StrLen(Recent) > 2
        Recent := SubStr(Recent, 2)
}

Forget() {
    global
    if Recent != ""
        Recent := SubStr(Recent, 1, StrLen(Recent) - 1)
}

OnKeyDown(hook, vk, sc) {
    ; Matn bölmagan tugmalar (strelka, Enter, Tab, Esc, Ctrl+…) kontekstni uzadi.
    key := GetKeyName(Format("vk{:x}sc{:x}", vk, sc))
    if key ~= "^(L|R)?Shift$|^CapsLock$|^Space$"
        return
    if key == "Backspace" && !(GetKeyState("Ctrl") || GetKeyState("Alt") || GetKeyState("LWin") || GetKeyState("RWin")) {
        ; Faqat oxirgi belgi öçadi: "c b ⌫ h" → ç.
        ; Belgilangan matn öçirilsa buni bilmaymiz; siçqonça, Shift+strelka va Ctrl+A
        ; kontekstni allaqaçon uzgan, faqat dasturning özi belgilagan matn (manzil qatori taklifi) qoladi.
        Forget()
        return
    }
    if StrLen(key) > 1 || GetKeyState("Ctrl") || GetKeyState("Alt") || GetKeyState("LWin") || GetKeyState("RWin")
        ResetState()
}

ResetState() {
    global
    Recent := ""
}

IsLetter(ch) => RegExMatch(ch, "^\p{L}$")

ToggleEnabled(*) {
    global
    Enabled := !Enabled
    ResetState()
    SaveSettings()
    UpdateTray()
    TrayTip Enabled ? "Yangi alifbo yoqildi" : "Yangi alifbo öçirildi", "Yangi alifbo", "Mute"
}

ToggleTutuq(*) {
    global
    Tutuq := !Tutuq
    SaveSettings()
    UpdateTray()
}

SaveSettings() {
    global
    try {
        DirCreate A_AppData "\YangiAlifbo"
        IniWrite Enabled ? 1 : 0, SETTINGS, "Sozlamalar", "Yoqilgan"
        IniWrite Tutuq ? 1 : 0, SETTINGS, "Sozlamalar", "Tutuq"
    }
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
    ; Exe içida: 159 — asosiy ikonka (yoqilgan), 300 — öçiq.
    if A_IsCompiled
        TraySetIcon A_ScriptFullPath, Enabled ? -159 : -300
    else
        TraySetIcon A_ScriptDir "\icons\" (Enabled ? "yoqilgan" : "ochiq") ".ico"
}
