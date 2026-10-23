// Saytlar uçun vidjet: konvertor va vidjet kodi bitta oddiy skriptga yiğiladi (begona saytda modul importi va CORS yöq).
export function bundleVidjet(converterSrc, vidjetSrc) {
  const converter = converterSrc.replace(/^export /gm, "");
  return `/* yozgich.uz vidjet — generator yasagan (web/converter.js + web/vidjet-src.js). Tarmoqqa çiqmaydi, kuki qöymaydi. */\n(() => {\n${converter}\n${vidjetSrc}\n})();\n`;
}
