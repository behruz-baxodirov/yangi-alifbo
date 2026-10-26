; CI sozlamalar testi: yoqilgan/öçiq holat va tutuq dastur qayta işga tuşganda saqlanadi,
; exe içida o'z ikonkalarimiz (yoqilgan — 159, öçiq — 160, har biri 8 ölçam) bor.
; Işlatiş: AutoHotkey64.exe settings.ahk <YangiAlifbo.exe yöli>
#Requires AutoHotkey v2.0
SendMode "Event"
SetKeyDelay 30, 10
SendLevel 1   ; ^!Space va InputHook bu tugmalarni körişi uçun

; CIʼda xato oynasi hech kim bosmaydigan dialog bölib qotib qoladi: xatoni yozib çiqamiz.
OnError (e, *) => (FileAppend("ERROR " e.Message " (" e.What ", " e.Line ")`n", "*", "UTF-8"), ExitApp(2))

exe := A_Args[1]
ini := A_AppData "\YangiAlifbo\sozlamalar.ini"
failed := 0

Expect(label, got, want) {
    global failed
    if (got != want)
        failed += 1
    FileAppend ((got == want) ? "ok   " : "FAIL ") label " -> " got " (kutilgan " want ")`n", "*", "UTF-8"
}

IconCount(id) {
    lib := DllCall("LoadLibraryEx", "str", exe, "ptr", 0, "uint", 2, "ptr")   ; LOAD_LIBRARY_AS_DATAFILE
    res := DllCall("FindResource", "ptr", lib, "ptr", id, "ptr", 14, "ptr")   ; RT_GROUP_ICON
    n := res ? NumGet(DllCall("LockResource", "ptr", DllCall("LoadResource", "ptr", lib, "ptr", res, "ptr"), "ptr"), 4, "ushort") : 0
    DllCall("FreeLibrary", "ptr", lib)
    return n
}

Restart() {
    if ProcessExist("YangiAlifbo.exe")
        ProcessClose "YangiAlifbo.exe"
    ProcessWaitClose "YangiAlifbo.exe", 5
    Run exe
    ProcessWait "YangiAlifbo.exe", 5
    Sleep 1500
}

Typed(text) {
    WinActivate "ahk_exe notepad.exe"
    WinWaitActive "ahk_exe notepad.exe", , 5
    Send "^a{Delete}"
    Sleep 200
    SendEvent "{Text}" text
    Sleep 500
    A_Clipboard := ""
    Send "^a^c"
    ClipWait 2
    return A_Clipboard
}

Expect("ikonka 159 (yoqilgan)", IconCount(159), 8)
Expect("ikonka 160 (öçiq)", IconCount(160), 8)

Run "notepad.exe"
WinWaitActive "ahk_exe notepad.exe", , 10
Sleep 1000

; Öçiriş faylga yoziladi va qayta işga tuşgandan keyin ham öçiq qoladi.
Send "^!{Space}"
Sleep 500
Expect("öçirilgandan keyin ini", IniRead(ini, "Sozlamalar", "Yoqilgan", "yöq"), "0")
Restart()
Expect("qayta işga tuşgandan keyin öçiq", Typed("shahar"), "shahar")

; Qayta yoqiş ham saqlanadi.
WinActivate "ahk_exe notepad.exe"
Send "^!{Space}"
Sleep 500
Expect("yoqilgandan keyin ini", IniRead(ini, "Sozlamalar", "Yoqilgan", "yöq"), "1")
Restart()
Expect("qayta işga tuşgandan keyin yoqilgan", Typed("shahar"), "şahar")

; Tutuq sozlamasi faylidan öqiladi.
IniWrite 0, ini, "Sozlamalar", "Tutuq"
Restart()
Expect("tutuq öçiq", Typed("ma'no"), "ma'no")
IniWrite 1, ini, "Sozlamalar", "Tutuq"
Restart()
Expect("tutuq yoqilgan", Typed("ma'no"), "maʼno")

WinClose "ahk_exe notepad.exe"
Sleep 300
if WinExist("ahk_exe notepad.exe")
    Send "!n"
ExitApp failed ? 1 : 0
