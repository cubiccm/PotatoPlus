# Usage: python generate-userscript.py VERSION OUTPUT_FILENAME UPDATE_URL
import sys

if len(sys.argv) >= 2:
  version = sys.argv[1]
else:
  version = "beta"

if len(sys.argv) >= 3:
  output_filename = sys.argv[2]
else:
  output_filename = "potatoplus.user.js"

if len(sys.argv) >= 4:
  url = sys.argv[3]
else:
  url = "https://github.com/cubiccm/potatoplus/releases/latest/download/potatoplus.user.js"

print("Version: {}\nOutput filename: {}\nUpdate URL: {}\n".format(version, output_filename, url))

prefix = '''// ==UserScript==
// @name         PotatoPlus
// @version      {}
// @description  土豆改善工程！
// @author       Limos
// @match        *://*.nju.edu.cn/jiaowu*
// @match        *://xk.nju.edu.cn/*
// @match        *://219.219.120.46/jiaowu*
// @run-at       document-start
// @grant        none
// @updateURL    {}
// @downloadURL  {}
// ==/UserScript==

'''.format(version, url, url)

entry = "js/inject.js"
with open(entry, "r", encoding="utf-8") as fin:
  print("Reading", entry)
  with open(output_filename, "w", encoding="utf-8") as fout:
    fout.write(prefix);
    lines = fin.readlines()
    for line in lines:
      if line.find("browser?.runtime?.getManifest()?.version") != -1:
        fout.write(line.replace("\"\"", "\"{}\"".format(version)))
      elif line.find("injectScript(\"") == -1 and line.find("injectStyle(\"") == -1:
        fout.write(line)
      else:
        start = line.find('\"')
        end = line.find('\"', start + 1)
        include_filename = line[start + 1 : end]
        fout.write("\n/* " + include_filename + " */\n")
        if line.find("injectStyle(\"") != -1:
          fout.write("injectStyleFromString(`")
        with open(include_filename, "r", encoding="utf-8") as lib:
          print("Reading", include_filename)
          include_lines = lib.readlines()
          for include_line in include_lines:
            if include_line.find("platform: \"General Plugin\"") != -1:
              fout.write(include_line.replace("General Plugin", "Userscript"))
            else:
              fout.write(include_line)
        if line.find("injectStyle(\"") != -1:
          fout.write("`);")
        fout.write("\n")

print("Userscript written to", output_filename)