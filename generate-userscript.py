prefix = '''// ==UserScript==
// @name         potatojw_upgraded
// @version      0.2 beta
// @description  土豆改善工程！
// @author       Limos
// @match        *://*.nju.edu.cn/jiaowu*
// @match        *://219.219.120.46/jiaowu*
// @run-at       document-start
// @grant        none
// ==/UserScript==

'''

with open("js/inject.js", "r") as fin:
  with open("potatojw_upgraded.user.js", "w") as fout:
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
            fout.write(line2)
        if line.find("injectStyle(\"") != -1:
          fout.write("`);")
        fout.write("\n")

