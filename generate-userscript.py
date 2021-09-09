# Usage: python generate-userscript.py VERSION
# The userscript will be automatically updated based on updateURL

import sys

version = "beta"
if len(sys.argv) >= 2:
  version = sys.argv[1]
else:
  print("[Warning] No version specified, using \"beta\" as version.")

prefix = '''// ==UserScript==
// @name         PotatoPlus
// @version      ''' + version + '''
// @description  土豆改善工程！
// @author       Limos
// @match        *://*.nju.edu.cn/jiaowu*
// @match        *://xk.nju.edu.cn/*
// @match        *://219.219.120.46/jiaowu*
// @run-at       document-start
// @grant        none
// @updateURL    https://github.com/cubiccm/potatoplus/releases/latest/download/potatoplus.user.js
// @downloadURL  https://github.com/cubiccm/potatoplus/releases/latest/download/potatoplus.user.js
// ==/UserScript==

'''

with open("js/inject.js", "r") as fin:
  with open("potatoplus.user.js", "w") as fout:
    fout.write(prefix);
    lines = fin.readlines()
    for line in lines:
      if line.find("injectScript(\"") == -1 and line.find("injectStyle(\"") == -1:
        fout.write(line)
      else:
        start = line.find('\"')
        end = line.find('\"', start + 1)
        filename = line[start + 1 : end]
        fout.write("\n/* " + filename + " */\n")
        if line.find("injectStyle(\"") != -1:
          fout.write("injectStyleFromString(`")
        with open(filename, "r") as lib:
          lines2 = lib.readlines()
          for line2 in lines2:
            if line2.find("@platform@") != -1:
              fout.write(line2.replace("@platform@", "Userscript"))
            elif line2.find("@version@") != -1:
              fout.write(line2.replace("@version@", version))
            else:
              fout.write(line2)
        if line.find("injectStyle(\"") != -1:
          fout.write("`);")
        fout.write("\n")

