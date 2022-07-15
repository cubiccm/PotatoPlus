path = "."
root_dirs = ["css", "js", "img", "fonts"]

versions = [{
  "filename": "potatoplus - Firefox",
  "manifest": 2,
  "label": "Firefox Add-on"
}, {
  "filename": "potatoplus - Chrome",
  "manifest": 3,
  "label": "Chrome Extension"
}, {
  "filename": "potatoplus - Edge",
  "manifest": 2,
  "label": "Edge Extension"
}]

import os
import zipfile

os.chdir(path)
for version in versions:
  with zipfile.ZipFile(version["filename"] + ".zip", "w") as f:
    if version["manifest"] == 3:
      f.write("manifest.json")
    elif version["manifest"] == 2:
      f.write("manifest-v2.json", "manifest.json")
    for root_dir in root_dirs:
      for root, dirs, files in os.walk(root_dir):
        for file in files:
          if file == "pjw-core.js":
            data = ""
            with open(root + "/" + file, "r", encoding="utf-8") as corejs:
              lines = corejs.readlines()
              for line in lines:
                if line.find("@platform@") != -1:
                  data = data + line.replace("@platform@", version["label"])
                else:
                  data = data + line
            f.writestr(root + "/" + file, data)
            print("Appending file", root + "/" + file)
          elif file != "" and file[0] != ".":
            f.write(root + "/" + file)
            print("Appending file", root + "/" + file)
