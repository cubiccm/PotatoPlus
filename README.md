# PotatoPlus

南京大学教务系统改善工程！

[项目页面及更新日志](https://cubiccm.ddns.net/2019/09/potatojw-upgraded/)

<a href='https://chrome.google.com/webstore/detail/potatoplus/mokphlegfcilcbnjmhgfikjgnbnconba'><img src='https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/HRs9MPufa1J1h5glNhut.png' alt='Chrome Web Store Badge' style='width: 238px; height: 72px;'/></a>
<a href='https://microsoftedge.microsoft.com/addons/detail/potatoplus/miofoebmeohjbieochdmaolpaneapmib'><img src='https://getbadgecdn.azureedge.net/images/en-us light.svg' alt='Microsoft Store' style='width: 202.5px; height: 72px;'/></a>

## 安装

*可以在 [项目主页](https://cubiccm.ddns.net/2019/09/potatojw-upgraded/) 获取较详细的安装教程。*

### 通过浏览器插件安装

**Chrome:** [Chrome 网上应用店](https://chrome.google.com/webstore/detail/potatoplus/mokphlegfcilcbnjmhgfikjgnbnconba)

**Edge:** [Microsoft Store](https://microsoftedge.microsoft.com/addons/detail/potatoplus/miofoebmeohjbieochdmaolpaneapmib)

**Firefox:** [GitHub Releases](https://github.com/cubiccm/potatoplus/releases/latest/download/PotatoPlus.xpi)

**Safari:** 可通过 Xcode 对插件进行转换和签名后在 Safari 中使用，请参考 [官方文档](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari)。

### 通过 Userscript 安装

请确保浏览器中已经安装 [Tampermonkey](https://tampermonkey.net) 等支持 Userscript 的插件。

[获取 Userscript（GitHub Releases）](https://github.com/cubiccm/potatoplus/releases/latest/download/potatoplus.user.js)

[获取 Userscript（NJU GitLab）](https://git.nju.edu.cn/Limos/cdn/-/raw/master/potatoplus.user.js)

## 生成

包装为浏览器插件：
```shell
python3 package.py [OUTPUT_PATH] 
```

生成 Userscript：

```shell
python3 generate-userscript.py [VERSION] [OUTPUT_FILENAME] [UPDATE_URL]
```

## 🌟

[![Stargazers over time](https://starchart.cc/cubiccm/PotatoPlus.svg)](https://starchart.cc/cubiccm/PotatoPlus)


