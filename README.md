# PotatoPlus

potato **overgrow**
NJU土豆改善工程

## 介绍 Introduction

为教务网化上妆容，面貌焕然一新！

精心设计的课程列表让重要信息一览无余，并提供了丰富的搜索与过滤功能；更有自动刷新等多个增强模块融合交织，将体验提升到前所未有的高度。

差点忘了，它还只是一个插件。

## 安装 Installation

**[较详细的安装教程](https://cubiccm.ddns.net/2019/09/potatojw-upgraded/)**

### 通过插件安装

#### Chrome

[Chrome网上应用店](https://chrome.google.com/webstore/detail/potatoplus/mokphlegfcilcbnjmhgfikjgnbnconba)

#### Edge

[Microsoft Store](https://microsoftedge.microsoft.com/addons/detail/potatoplus/miofoebmeohjbieochdmaolpaneapmib) 或 [Chrome网上应用店](https://chrome.google.com/webstore/detail/potatoplus/mokphlegfcilcbnjmhgfikjgnbnconba)

#### Firefox

[GitHub Releases](https://github.com/cubiccm/potatoplus/releases/latest/download/PotatoPlus.xpi)

#### Safari (macOS)

安装较为复杂，如有需要请联系 illimosity@gmail.com

### 通过Userscript安装

请确保浏览器中已经安装 [Tampermonkey](https://tampermonkey.net) 等支持Userscript的插件。

[获取 Userscript](https://github.com/cubiccm/potatoplus/releases/latest/download/potatoplus.user.js)

要及时获得最新的功能和错误修复，您可以调快插件的自动更新频率，及加入[邮件列表](https://cubiccm.ddns.net/potato-mailing-list/)接收最新动态。

## 功能 Features

- 整体用户界面改进
  - 部分采用渐变化和圆角风格
  - 部分采用 Google Material Design 设计
  - 改进反馈动画效果
  - 导航栏
    - 更新标志及背景设计
    - 重新整理的登录信息和功能按钮
    - 各标签栏的界面优化和点击反馈
  - 字体
- 课程列表
  - 课程过滤器
    - 基于事件的可扩展模块式设计
    - 空余课程模块（avail）
    - 课程时间模块（hours）
      - “空闲时间”可以帮助自动勾掉已有课程的时间
    - 更多规则模块（advanced）
    - 土豆模块（potatoes）
      - 测试模块
      - 可配置的成功 / 失败后行为
    - Frozen Quotes模块（frozen）
  - 增强搜索
    - 使用多个关键字搜索课程信息
    - 用"-"过滤掉希望排除的课程，用"*"匹配所有课程
    - 使用拼音首字母快速搜索
  - 刷新
    - 可调节速度的自动刷新功能
    - 自动“软刷新”模式，提高性能及减少渲染量
  - 课程周历
    - 以可视化形式呈现上课时间
  - 改进的选择框
    - 减少点击操作，自动刷新列表
  - 改进的课程编号与课程指纹
  - 已应用在以下页面
    - 全校课程
    - 课程补选 / 导学、研讨、通识课补选
    - 课程补选 / 跨专业补选
    - 课程补选 / 通修课补选
    - 课程补选 / 公选课补选
    - 课程补选 / 经典导读读书班补选
    - 课程初选 / 跨院系选课
    - 课程初选 / 经典导读读书班
    - 课程初选 / 导学、研讨、通识课初选
    - 课程初选 / 公选课初选
    - 体育选课
- 浮动通知栏
  - 在页面下方自由浮动，轻点即可查看历史
  - 重要信息会停留直至光标划过
  - 消除提示框的烦扰
- 登录体验优化
  - 重新设计的登录窗口
  - 登录信息存储功能
  - 自动验证码识别
- 页面辅助功能
  - 首页
    - 将提示框转为浮动通知栏的通知
  - 全校课程
    - 自动获取及选择专业
    - 增加缺失的“人工智能学院”
    - 列出“全部院系”
  - 成绩查看
    - GPA计算器
    - 可选择默认隐藏成绩
    - 可以查看全部学期的成绩
  -  课程评估
    - 自动评估模式
- 其余细节更新
  - 为网站添加icon
  - 修复一些教务网的错误
  - 还有更多...
- 可折叠工具栏 (Legacy)
  - 已应用在以下页面
    - 专业选课
    - 其它含有 PotatoPlus 功能，但不含 PotatoPlus Class List 的页面
    
## Stargazers over time 

## [![Stargazers over time](https://starchart.cc/cubiccm/potatoplus.svg)](https://starchart.cc/cubiccm/potatoplus)



## 生成 Userscript

在目录下执行

```shell
python generate-userscript.py [VERSION]
```

即可生成对应版本的 Userscript。


## 更多信息 More Info

[项目页面及更新日志](https://cubiccm.ddns.net/2019/09/potatojw-upgraded/)
