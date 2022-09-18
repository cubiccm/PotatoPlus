const pjw = {
  version: "",
  platform: "General Plugin",
  site: "",
  mode: "",
  initialized: false,
  version_description: "PotatoPlus 0.3.9 包含界面更新与错误修复。",
  data: new Proxy(JSON.parse(localStorage.getItem("potatoplus_data")) || {}, {
    get(target, property, receiver) {
      if (property === "clear") {
        return function () {
          target = {};
          localStorage.removeItem("potatoplus_data");
        };
      }
      const data = target;
      if (property in data)
        return data[property];
      else
        return null;
    },
    set(target, property, value, receiver) {
      try {
        target[property] = value;
        localStorage.setItem("potatoplus_data", JSON.stringify(target));
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }

    },
    deleteProperty(target, property) {
      let delete_res = delete target[property];
      localStorage.setItem("potatoplus_data", JSON.stringify(target));
      return delete_res;
    }
  }),
  preferences: {},
  switch: function() {
    if (pjw.preferences.enabled) {
      pjw.preferences.enabled = false;
      $(".pjw-xk-welcome-card")?.hide();
      return false;
    } else {
      pjw.preferences.enabled = true;
      if (pjw.preferences.share_usage_data === null)
        pjw.preferences.share_usage_data = true;
      $(".pjw-xk-welcome-card")?.show();
      return true;
    }
  },
};

(() => {
  window.pjw = pjw;
  pjw.preferences = pjw.data;
  const info = document.querySelector("meta[name=\"pjw\"]");
  pjw.version = info.getAttribute("version");
  pjw.mode = info.getAttribute("mode");
  pjw.site = (window.location.host == "xk.nju.edu.cn" ? "xk" : "jw");
})();

window.potatojw_intl = function() {
  if (pjw.initialized == true) return;
  pjw.initialized = true;
  
  if (jQuery.fn.jquery == "3.5.1")
    window.$$ = jQuery.noConflict();
  else
    window.$$ = $;

  const head_metadata = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <link rel="shortcut icon" href="https://www.nju.edu.cn/_upload/tpl/01/36/310/template310/images/16.ico" type="image/x-icon">
  `;
  $$("head").prepend(head_metadata);

  const google_analytics_js = `
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-173014211-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-173014211-1', {
      'custom_map': {'dimension1': 'version'}
    });
    gtag('event', 'version_dimension', {'version': pjw.version + " " + pjw.platform});
    </script>
  `;

  if (pjw.site == "jw") {
    if (pjw.data.login_settings?.share_stats == true) {
      $$("head").append($$(google_analytics_js));
    }

    if ($$("#Function").length) {
      $$("#Function").addClass("light");
      $$("#Function").find("li").on("click", (e) => {
        window.location.href = $$(e.delegateTarget).find("a").attr("href");
      });
    }

    if ($$("#UserInfo").length) {
      $$("#UserInfo").html(`
        <div id="pjw-user-info" onclick="window.location.href = '/jiaowu/student/teachinginfo/courseList.do?method=currentTermCourse';">${$$("#UserInfo").html().slice(4).match(/.*?\&/)[0].slice(0, -1)}
          <div id="pjw-user-type">${$$("#UserInfo").html().slice(4).match(/：.*/)[0].slice(1)}</div>
        </div>
      `);
      pjw.preferences.privilege && $$("#pjw-user-type").html(pjw.preferences.privilege); 
      $$("#pjw-user-type").on("click", (e) => { if (window.click_count) {window.click_count++;}
        else {window.click_count = 1; setTimeout(() => {delete click_count;}, 2000);} if (window.click_count >= 5) { window.click_count = 0; (pjw.preferences.privilege && delete pjw.preferences.privilege && $$("#pjw-user-type").html("学生")) || ((pjw.preferences.privilege = "root") && $$("#pjw-user-type").html(pjw.preferences.privilege))};
        e.stopPropagation();
      });
      $$("#TopLink").children("img").remove();
      if ($$(".Line").length) {
        $$("table").find("tr").each((index, obj) => {
          if ($$(obj).html().trim() == "")
            $$(obj).remove();
        });
        $$("table").find("td[align=right] > b").css({
          "font-size": "14px",
          "color": "rgba(0, 0, 0, .75)",
          "font-weight": "bold"
        });
        $$("table").find("td[align=left] > b").css({
          "font-size": "14px",
          "color": "rgba(0, 0, 0, .65)",
          "font-weight": "normal"
        });
        $$("table").find("td[align=left] > b > a").css({
          "font-size": "14px",
          "color": "rgba(0, 0, 0, .65)",
          "font-weight": "normal"
        });
      }
    }
    
    if ($$("div#TopLink").length > 0) {
      $$("div#TopLink").html(`<span class="pjw-mini-button" onclick="window.open('https://cubiccm.ddns.net/potatoplus')">v${pjw.version}</span>
        <span class="pjw-mini-button" id="pjw-logout-button" onclick="window.location.href='exit.do?type=student'">退出登录</span>`);
    }
    
    window.reset_storage_confirm = false;
    window.reset_storage_timeout = 0;
    window.resetStorage = function() {
      if (reset_storage_confirm) {
        pjw.data.clear();
        reset_storage_confirm = false;
        $$("#reset_storage").html("重置存储");
        clearInterval(reset_storage_timeout);
      } else {
        $$("#reset_storage").html("确定重置 PotatoPlus 的全部存储？");
        reset_storage_confirm = true;
        reset_storage_timeout = setTimeout(() => {
          $$("#reset_storage").html("重置存储");
          reset_storage_confirm = false;
        }, 2000);
      }
    }
  } else if (pjw.site == "xk") {
    pjw.preferences.enabled && pjw.preferences.share_usage_data && $("head").append($(google_analytics_js));
  }

  console.log(`PotatoPlus v${pjw.version} (${pjw.platform}) by Limos`);
  if (pjw.mode == "") return;
  console.log(pjw.mode + " mode activated");

  const custom_toolbar_html = {
    course_eval: `
      <span class="pjw-mini-button" onclick="toggleAutoEval();" id="toggle_auto_eval_button">开启自动评价</span>
      <span>开启后，点一下对应课程即自动五星好评。</span>
    `,
    login_page: `
      <input type="checkbox" id="store_login_info" class="login_settings" checked="checked">
      <label for="store_login_info">记住登录信息</label>
      <input type="checkbox" id="solve_captcha" class="login_settings" checked="checked">
      <label for="solve_captcha">验证码识别</label>
      <input type="checkbox" id="share_stats" class="login_settings" checked="checked">
      <label for="share_stats">发送匿名统计数据</label>
    `,
  };

  // PJW Toolbar for specific pages
  if (pjw.mode in custom_toolbar_html) {
    $$("body").append(`<div id='pjw-toolbar'><div id="pjw-toolbar-content">` +
      custom_toolbar_html[pjw.mode]
    + `<div class="about-proj"></div></div></div>`);

    const toolbar_button_html = `
      <div id="pjw-toolbar-collapse-bg"><canvas id="pjw-toolbar-collapse" width="30px" height="30px"></canvas></div>
    `;
    $$("#pjw-toolbar").prepend(toolbar_button_html);

    const about_this_project = `
      <span style="user-select: text;">PotatoPlus v` + pjw.version + `</span>
    `;
    $$(".about-proj").html(about_this_project);

    // Draw collapse button
    var canvas = document.getElementById("pjw-toolbar-collapse");
    window.ctx = canvas.getContext('2d');
    ctx.fillStyle = "#63065f";

    ctx.beginPath();
    ctx.moveTo(6, 7);
    ctx.lineTo(6, 23);
    ctx.lineTo(7, 24);
    ctx.lineTo(8, 23);
    ctx.lineTo(8, 7);
    ctx.lineTo(7, 6);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(22, 6);
    ctx.lineTo(9, 15);
    ctx.lineTo(22, 24);
    ctx.lineTo(23, 25);
    ctx.lineTo(24, 24);
    ctx.lineTo(12, 15);
    ctx.lineTo(24, 6);
    ctx.lineTo(23, 5);
    ctx.fill();
    ctx.closePath();

    // Collapse / Expand toolbar
    function switchToolBar() {
      if (pjw.preferences.is_toolbar_collapsed) expandToolBar();
      else collapseToolBar();
    }
    function collapseToolBar() {
      $$("#pjw-toolbar").css("left", "-100%");
      $$("#pjw-toolbar-collapse-bg").css("background-color", "");
      $$("#pjw-toolbar-collapse").css({
        "position": "fixed",
        "left": "30px",
        "bottom": "30px",
        "top": "calc(100% - 60px)",
        "transform": "rotate(180deg)"
      });
      pjw.preferences.is_toolbar_collapsed = true;
    }
    if (pjw.preferences.is_toolbar_collapsed === true)
      collapseToolBar();
    $$("#pjw-toolbar-collapse-bg").on("click", switchToolBar);
    $$("#pjw-toolbar-collapse").on("mousedown", () => { if (pjw.preferences.is_toolbar_collapsed === false) $$("#pjw-toolbar-collapse-bg").css("background-color", "rgba(255, 255, 255, 1.0)");} );
    $$("#pjw-toolbar-collapse-bg").on("mousedown", () => { if (pjw.preferences.is_toolbar_collapsed === false) $$("#pjw-toolbar-collapse-bg").css("background-color", "rgba(255, 255, 255, 1.0)");} );

    // Show toolbar
    function expandToolBar() {
      $$("#pjw-toolbar").css("left", "");
      $$("#pjw-toolbar").css("opacity", "");
      $$("#pjw-toolbar-collapse").css({
        "position": "",
        "left": "",
        "bottom": "",
        "top": "",
        "transform": ""
      });
      pjw.preferences.is_toolbar_collapsed = false;
    }
  }

  // Initialize ClassList
  const pjw_classlist_mode_list = ["dis_view", "art_view", "open_view", "all_course_list", "dis", "open", "common", "public", "read_view", "gym", "read", "grade_info", "public_view", "union", "course", "art"];
  if (pjw_classlist_mode_list.includes(pjw.mode)) {
    ClassListPlugin();
  }

  // Storage upgrade upon version upgrade
  if ((pjw.data.version || 0) !== pjw.version) {
    if (localStorage.getItem("version")) {
      localStorage.clear();
    }
    delete pjw.data.bulletin_update_timestamp;
    delete pjw.data.bulletin_content;
    pjw.data.version = pjw.version;
  }

  var enterMode = function(mode) {
    window.pjw_select_mode = pjw.mode;
    class_select_funcs[mode]();
  }

  var getBulletin = function() {
    if ((pjw.data.bulletin_update_timestamp || 0) + 300000 <= new Date().getTime()) {
      const html = `<iframe src="https://cubiccm.ddns.net/apps/potatoplus-bulletin/?version=${pjw.version}&share_stats=${
        (pjw.preferences.share_usage_data || pjw.preferences.login_settings?.share_stats) ? 1 : 0
      }&site=${pjw.site}" width="300" height="300" style="display: none;"></iframe>`;
    
      $$(window).on("message", (e) => {
        if (e.originalEvent.origin !== "https://cubiccm.ddns.net") return;
        if (e?.originalEvent?.data) {
          let data = {};
          try {
            data = JSON.parse(e.originalEvent.data);
          } catch (e) {
            console.warn(e);
          } finally {
            if (data["type"] == "bulletin") {
              pjw.data.bulletin_content = data["content"];
              pjw.data.bulletin_update_timestamp = new Date().getTime();
              $$("#pjw-bulletin-content").html(data["content"]);
            }
          }
        }
      });

      $$("body").append(html);
    }
  }

  if (pjw.mode == "main_page") {
    window.pconsole = new PJWConsole();
    if (typeof(window.alert_data) != "undefined") {
      pconsole.alert(window.alert_data);
    }
    
    $$("div#TopLink").prepend(`<span class="pjw-mini-button" style="color: gray; opacity: 0.7;" onclick="resetStorage();" id="reset_storage">重置存储</span>`);

    var update_html = "";
    if (pjw.platform == "Userscript") {
      update_html = `<a href="https://github.com/cubiccm/potatoplus/releases/latest/download/potatoplus.user.js">&gt; 获取更新 - Userscript</a><br><br>PotatoPlus 浏览器扩展已经在<a href="https://chrome.google.com/webstore/detail/potatoplus/mokphlegfcilcbnjmhgfikjgnbnconba" target="_blank">Chrome网上应用店</a>和<a href="https://microsoftedge.microsoft.com/addons/detail/potatoplus/miofoebmeohjbieochdmaolpaneapmib" target="_blank">Microsoft Edge Add-ons</a>上线，您也可以可以到<a href="https://github.com/cubiccm/potatoplus/releases/latest/download/PotatoPlus.xpi" target="_blank">GitHub Releases</a>获取适用于 Firefox 浏览器的插件。迁移到插件版本会在部分功能上获得更好的体验；安装插件前请先关闭当前 Userscript 的执行。`;
    } else if (pjw.platform == "General Plugin") {
      update_html = `您所安装的版本可能不支持自动更新，请访问<a href="https://github.com/cubiccm/potatoplus/releases/latest/" target="_blank">GitHub Releases</a>页面检查及获取更新。`;
    }

    var welcome_html = `
      <div id="pjw-welcome" class="pjw-card">
        <p style="display: flex; flex-direction: row; align-items: flex-start;"><span class="material-icons-round">done</span><span>&nbsp;&nbsp;</span><span>${pjw.version_description}</span></p>
        <p style="display: flex; flex-direction: row; align-items: flex-start;"><span class="material-icons-round">contactless</span><span>&nbsp;&nbsp;</span><span id="pjw-bulletin-content">${pjw.data.bulletin_content || ""}</span></p>
        <br>
        <div class="pjw-welcome-get-update">${update_html}</div>
        <note>
          <a href="https://cubiccm.ddns.net/potatoplus" target="_blank" style="margin-left: 0;">PotatoPlus ${pjw.version}</a>
          <a href="https://github.com/cubiccm/potatoplus" target="_blank">GitHub</a>
          <a href="https://cubiccm.ddns.net/potato-mailing-list/" target="_blank">加入邮件列表</a>
          <a href="mailto:illimosity@gmail.com">发送反馈邮件</a>
          <a href="https://cubiccm.ddns.net/about" target="_blank">@Limos</a>
        </note>
      </div>
    `;

    const cn_days_name = ["日", "一", "二", "三", "四", "五", "六"];

    var calcCurrentWeek = () => {
      const fall_sem = new Date(new Date("2022-09-05").getTime() - 8 * 3600000);
      const fall_exam = new Date(new Date("2022-12-26").getTime() - 8 * 3600000);
      const winter_holiday = new Date(new Date("2022-01-09").getTime() - 8 * 3600000);
      const spring_sem = new Date(new Date("2022-02-13").getTime() - 8 * 3600000);
      const spring_exam = new Date(new Date("2022-06-12").getTime() - 8 * 3600000);
      const summer_school = new Date(new Date("2022-06-26").getTime() - 8 * 3600000);
      const summer_holiday = new Date(new Date("2022-07-24").getTime() - 8 * 3600000);
      const next_sem = new Date(new Date("2022-08-28").getTime() - 8 * 3600000); // Undetermined
      const today = new Date();
      if (today < fall_sem)
        return `秋季学期将开始于 ${fall_sem.toDateString()}`;
      else if (today < fall_exam)
        return `秋季学期第<num>${Math.ceil((today - fall_sem + 1) / (7 * 24 * 60 * 60 * 1000))}</num>周`;
      else if (today < winter_holiday)
        return "考试周";
      else if (today < spring_sem - 7 * 24 * 3600000)
        return "寒假";
      if (today < spring_sem)
        return `春季学期将开始于 ${spring_sem.toDateString()}`;
      else if (today < spring_exam)
        return `春季学期第<num>${Math.ceil((today - spring_sem + 1) / (7 * 24 * 60 * 60 * 1000))}</num>周`;
      else if (today < summer_school)
        return "考试周";
      else if (today < summer_holiday)
        return "暑期学校";
      else if (today < next_sem)
        return "暑假";
      else
        return "查看教学周历";
    }

    const date_html = `
      <heading>${new Date().getMonth() + 1}月${new Date().getDate()}日 星期${cn_days_name[new Date().getDay()]}</heading><br>
      <subheading><a href="https://jw.nju.edu.cn/qxnjxxl/list.htm" target="_blank" style="margin-left: 0;">${calcCurrentWeek()}</a></subheading>`
    ;

    const menu_html = `
      <div id="pjw-menu" class="pjw-card">
        ${date_html}
        <br>
        <br>
        <div data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised pjw-menu-button" style="background-color: rgb(30, 50, 180);" data-link="/jiaowu/student/teachinginfo/courseList.do?method=currentTermCourse">
          <div class="mdc-button__ripple"></div>
          <i class="material-icons-round">today</i>
          <div class="mdc-button__label">我的课程</div>
          <div data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised pjw-menu-button pjw-menu-button--inserted" style="background-color: white; color: rgb(30, 50, 180);" data-link="/jiaowu/student/elective/index.do">
            <div class="mdc-button__ripple"></div>
            <i class="material-icons-round">add</i>
            <div class="mdc-button__label">选课</div>
          </div>
        </div>
        <div data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised pjw-menu-button" style="background-color: rgba(255, 255, 255, .3);" data-link="/jiaowu/student/teachinginfo/allCourseList.do?method=getTermAcademy">
          <div class="mdc-button__ripple"></div>
          <i class="material-icons-round">search</i>
          <div class="mdc-button__label">查询全部课程</div>
        </div>

        <div data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised pjw-menu-button" style="background-color: rgba(255, 255, 255, .3);" data-link="/jiaowu/student/studentinfo/achievementinfo.do?method=searchTermList">
          <div class="mdc-button__ripple"></div>
          <i class="material-icons-round">calculate</i>
          <div class="mdc-button__label">成绩查看</div>
        </div>
        <br>
        <br>
      </div>
    `;

    getBulletin();
    
    $$("#Function").before(menu_html);
    $$("#pjw-menu").append($$("#Function"));
    $$("#Function:eq(1)").remove();
    $$("#Function").addClass("main-page-function");
    
    $$(".Line").before(welcome_html);
    $$(".Line").remove();
    
    $$(".pjw-menu-button").on("click", (e) => {
      e.stopPropagation();
      var target = $$(e.delegateTarget);
      if (target.attr("data-link"))
        window.location.href = target.attr("data-link");
    });
    window.mdc.autoInit();
  } else if (pjw.mode == "welcome") {
    const pjw_options_html = `
    <div class="pjw-xk-welcome-wrapper">
      <div class="pjw-xk-welcome-option">
        <button id="pjw-enable-switch" class="mdc-switch mdc-switch--unselected" type="button" role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
          <div class="mdc-switch__track"></div>
          <div class="mdc-switch__handle-track">
            <div class="mdc-switch__handle">
              <div class="mdc-switch__shadow">
                <div class="mdc-elevation-overlay"></div>
              </div>
              <div class="mdc-switch__ripple"></div>
            </div>
          </div>
          <span class="mdc-switch__focus-ring-wrapper">
            <div class="mdc-switch__focus-ring"></div>
          </span>
        </button>
        <label for="pjw-enable-switch">启用 PotatoPlus (Beta)</label>
      </div>

      <div class="pjw-xk-welcome-subsection">
        <div class="pjw-xk-welcome-option">
          <button id="pjw-share-usage-data-switch" class="mdc-switch mdc-switch--unselected" type="button" role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__handle-track">
              <div class="mdc-switch__handle">
                <div class="mdc-switch__shadow">
                  <div class="mdc-elevation-overlay"></div>
                </div>
                <div class="mdc-switch__ripple"></div>
              </div>
            </div>
            <span class="mdc-switch__focus-ring-wrapper">
              <div class="mdc-switch__focus-ring"></div>
            </span>
          </button>
          <label for="pjw-share-usage-data-switch">发送匿名统计数据</label>
        </div>

        <div class="pjw-xk-welcome-option">
          <button id="pjw-solve-captcha-switch" class="mdc-switch mdc-switch--unselected" type="button" role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__handle-track">
              <div class="mdc-switch__handle">
                <div class="mdc-switch__shadow">
                  <div class="mdc-elevation-overlay"></div>
                </div>
                <div class="mdc-switch__ripple"></div>
              </div>
            </div>
            <span class="mdc-switch__focus-ring-wrapper">
              <div class="mdc-switch__focus-ring"></div>
            </span>
          </button>
          <label for="pjw-solve-captcha-switch">验证码识别服务</label>
          <label id="pjw-captcha-config">配置</label>
        </div>
      </div>
    </div>

    <div id="pjw-captcha-config-dialog" class="mdc-dialog">
      <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="pjw-captcha-config-dialog-title"
          aria-describedby="pjw-captcha-config-dialog-content">
          <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
          <h2 class="mdc-dialog__title" id="pjw-captcha-config-dialog-title">
            验证码识别服务配置
          </h2>
          <div class="mdc-dialog__content" id="pjw-captcha-config-dialog-content">
            <p>启用验证码识别后，当前页面用于生成及校验验证码的 vtoken 将会被自动发送到远程服务器进行处理。您可以在此配置远程服务器的 URL，或留空以使用默认服务器。</p>
            <label id="pjw-captcha-config-dialog-url" class="mdc-text-field mdc-text-field--filled" style="width: 100%;" data-mdc-auto-init="MDCRipple">
              <span class="mdc-text-field__ripple"></span>
              <span class="mdc-floating-label" id="pjw-captcha-config-dialog-urllabel">URL</span>
              <input class="mdc-text-field__input" type="text" aria-labelledby="pjw-captcha-config-dialog-urllabel" placeholder="https://example.com/captcha-solver/?data={%data}">
              <span class="mdc-line-ripple"></span>
            </label>
            <section style="font-size: 12px;">
              <span>URL 中的 {%data} 将会在使用时被替换为 vtoken 的值。</span> <br>
              <span>声明：默认服务器为实验性质，不保证准确度和稳定性。您的个人数据不会被服务器存储。</span>
            </section>
          </div>
          <div class="mdc-dialog__actions">
            <button type="button" class="mdc-button mdc-dialog__button" style="color: gray;" data-mdc-dialog-action="close">
              <div class="mdc-button__ripple"></div>
              <span class="mdc-button__label">撤销更改</span>
            </button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">
              <div class="mdc-button__ripple"></div>
              <span class="mdc-button__label">保存</span>
            </button>
          </div>
        </div>
      </div>
      <div class="mdc-dialog__scrim"></div>
    </div>
    `;
    $("div.language").before(pjw_options_html);

    const enable_switch = new window.mdc.switchControl.MDCSwitch(document.getElementById("pjw-enable-switch"));
    enable_switch.selected = pjw.preferences.enabled === true;
    $("#pjw-enable-switch").on("click", () => {
      const target = $(".pjw-xk-welcome-subsection");
      if (pjw.switch()) target.show();
      else target.hide();
    });

    const share_usage_data_switch = new window.mdc.switchControl.MDCSwitch(document.getElementById("pjw-share-usage-data-switch"));
    share_usage_data_switch.selected = pjw.preferences.share_usage_data === null || pjw.preferences.share_usage_data === true;
    if (!pjw.preferences.enabled)
      $(".pjw-xk-welcome-subsection").hide();
    $("#pjw-share-usage-data-switch").on("click", () => { pjw.preferences.share_usage_data = !pjw.preferences.share_usage_data; });

    const solve_captcha_switch = new window.mdc.switchControl.MDCSwitch(document.getElementById("pjw-solve-captcha-switch"));
    solve_captcha_switch.selected = (pjw.preferences.solve_captcha === true);

    const captcha_config_dialog = new window.mdc.dialog.MDCDialog(document.getElementById("pjw-captcha-config-dialog"));
    $("#pjw-solve-captcha-switch").on("click", null, {
      dialog: captcha_config_dialog,
      switch: solve_captcha_switch
    }, (e) => {
      if (pjw.data.captcha_solver_link === null) {
        e.data.switch.selected = false;
        pjw.preferences.solve_captcha = false;
        e.data.dialog.open();
      } else {
        pjw.preferences.solve_captcha = !pjw.preferences.solve_captcha;
        initCAPTCHASolver();
      }
    });
    $("#pjw-captcha-config").on("click", null, {
      dialog: captcha_config_dialog
    }, (e) => {
      e.data.dialog.open();
    });

    const captcha_config_dialog_urlfield = new mdc.textField.MDCTextField(
        document.getElementById("pjw-captcha-config-dialog-url"));
    captcha_config_dialog_urlfield.value = pjw.data.captcha_solver_link || "";
    captcha_config_dialog.buttons[1].addEventListener("click", function () {
      pjw.data.captcha_solver_link = captcha_config_dialog_urlfield.value;
    });

    function initCAPTCHASolver() {
      if (pjw.captcha_initialized === true) {
        if (document.getElementById("vcodeImg").complete) {
          solveXKCAPTCHA();
        }
        return;
      }
      
      $(window).on("message", (e) => {
        if (!e.originalEvent.isTrusted) return;
        if (e?.originalEvent?.data) {
          let data = {};
          try {
            data = JSON.parse(e.originalEvent.data);
          } catch (e) {
            console.warn(e);
          } finally {
            if (data["type"] == "captcha" && data["content"].length == 4)
              $("input#verifyCode").val(data["content"]);
          }
        }
      });

      $("#vcodeImg").css("cursor", "pointer");
      $("#vcodeImg").on("click", () => {
        $("input#verifyCode").val("");
      })
    
      function solveXKCAPTCHA() {
        if (pjw.preferences.solve_captcha && $("#loginDiv").css("display") != "none") {
          let link = pjw.data.captcha_solver_link || "https://cubiccm.ddns.net/captcha-solver/?mode=xk&data={%data}";
          link = link.replace("{%data}", sessionStorage.getItem("vtoken"));
          if ($("iframe[data-type=captcha]").length) {
            $("iframe[data-type=captcha]").attr("src", link);
          } else {
            $("body").append(`<iframe src="${link}" width="300" height="300" data-type="captcha" style="display: none;"></iframe>`);
          }
        }
      }
    
      if (document.getElementById("vcodeImg").complete) {
        solveXKCAPTCHA();
      }

      $("#vcodeImg").on("load", () => {
        solveXKCAPTCHA();
      });

      pjw.captcha_initialized = true;
    }

    pjw.preferences.enabled && pjw.preferences.solve_captcha && initCAPTCHASolver();

    const welcome_html = `
      <div class="pjw-xk-welcome-card">
        <p id="pjw-bulletin-content" style="font-size: 14px;">${pjw.data.bulletin_content || ""}</p>
        <div class="pjw-xk-welcome-link-container">
          <a href="https://cubiccm.ddns.net/potatoplus" target="_blank" style="font-weight: bold;">PotatoPlus ${pjw.version}</a>
          <a href="https://github.com/cubiccm/potatoplus" target="_blank">GitHub</a>
        </div>
        <div class="pjw-xk-welcome-link-container">
          <a href="https://cubiccm.ddns.net/potato-mailing-list/" target="_blank">加入邮件列表</a>
          <a href="mailto:illimosity@gmail.com">发送反馈邮件</a>
          <a href="https://cubiccm.ddns.net/about" target="_blank">@Limos</a>
        </div>
      </div>
    `;

    $("div.language").before(welcome_html);
    if (!pjw.preferences.enabled)
      $(".pjw-xk-welcome-card").hide();

    getBulletin();
  } else if (pjw.mode == "course_eval") {
    window.quick_eval_mode_enabled = false;
    window.updateEval = function() {
      document.getElementById("td" + g_evlId).innerHTML = quick_eval_mode_enabled ? "已自动评价" : "已评";
      $('evalDetail').innerHTML = "谢谢您的评估！";
    }
    window.quickSubmitEval = function() {
      $$.ajax({
        url: "/jiaowu/student/evalcourse/courseEval.do?method=submitEval",
        data: "question1=5&question2=5&question3=5&question4=5&question5=5&question6=5&question7=5&question8=5&question9=5&question10=5&question=+10&mulItem1=0&mulItem=+1&ta1=",
        type: "POST",
        success: function(res) {
          updateEval();
        },
        error: function(res) {
          console.log("ERROR: " + res);
        }
      });
    };

    window.showEvalItem = function(id) {
      g_evlId = id;
      $$.ajax({
        url: "/jiaowu/student/evalcourse/courseEval.do",
        data: 'method=currentEvalItem&id=' + id,
        type: "POST",
        success: function(res) {
          if (quick_eval_mode_enabled == true)
            quickSubmitEval();
          else {
            $$("#evalDetail").html(res);
            $$("#sub").after("<br><br><br>");
          }
        },
        error: function(res) {
          console.log("ERROR: " + res);
        }
      });
    };

    window.toggleAutoEval = function() {
      if (quick_eval_mode_enabled == true) {
        quick_eval_mode_enabled = false;
        $$("#toggle_auto_eval_button").html("开启自动评价");
      } else {
        quick_eval_mode_enabled = true;
        $$("#toggle_auto_eval_button").html("停用自动评价");
      }
    };
  } else if (pjw.mode == "all_course_list") {
    // if ($$("#termList > option:eq(1)").val() != "20222")
    //   $$("#termList > option:eq(1)").before('<option value="20222">*2022-2023学年第二学期</option>');
    $$("#termList > option:eq(1)").before('<option value="pjw_custom_term">*自定学期...</option>');

    window.list = new PJWClassList($$("body"), ["acl_major_switch", "hours", "advanced", "frozen"]);
    total_weeks_history = {
      "20222": 17,
      "20221": 16,
      "20212": 17,
      "20211": 17,
      "20202": 16,
      "20201": 17,
      "20192": 17,
      "20191": 17,
      "20182": 16,
      "20181": 17,
      "20172": 16,
      "20171": 18
    };

    list.parse = function(data) {
      return new Promise((resolve, reject) => {
        try {
          $$("body").append("<div id='ghost-div' style='display:none;'>" + data + "</div>");
          var table = $$("#ghost-div").find("table.TABLE_BODY > tbody");
          table.find("tr:gt(0)").each((index, val) => {
            var td = (i) => ($$(val).children(`td:eq(${i})`));
            var res = this.parseClassTime(td(8).html());
            data = {
              title: td(1).html(),
              teachers: this.parseTeacherNames(td(7).html()),
              course_number: this.parseClassNumber(td(0)),
              info: [{
                key: "课程编号",
                val: this.parseClassNumber(td(0))
              }, {
                key: "开课院系",
                val: td(3).html()
              }, {
                key: "课程性质",
                val: td(2).html()
              }, {
                key: "校区",
                val: td(6).html(),
                hidden: true
              }],
              num_info: [{
                num: parseInt(td(4).html()),
                label: "学分"
              }, {
                num: parseInt(td(5).html()),
                label: "学时"
              }],
              lesson_time: res.lesson_time,
              time_detail: td(8).html(),
              places: res.places,
              class_weeknum: res.class_weeknum,
              select_button: {
                status: false
              }
            };
            list.add(data);
          });
          list.update();
          $$("#ghost-div").remove();
          resolve();
        } catch(e) {
          reject(e);
        }
      });
    }

    list.load = function() {
      return new Promise((resolve, reject) => {
        var sel = this.selectors;
        var major_code;
        if (sel.institution.obj.selectedIndex == 0)
          major_code = "";
        else
          major_code = sel.major.val();
        this.ajax_request = $$.ajax({
          type: "GET",
          url: "/jiaowu/student/teachinginfo/allCourseList.do",
          data: {
            method: "getCourseList",
            curTerm: sel.term.val(),
            curGrade: sel.grade.val(),
            curSpeciality: major_code
          }
        }).done((data) => {
          this.ajax_request = null;
          this.setTotalWeeks(total_weeks_history[sel.term.val()] || 18);
          this.parse(data);
          resolve();
        }).fail((jqXHR, textStatus) => {
          reject(`${textStatus} (${jqXHR.status})`);
        });
      });
    }

    $$("#academySelect > option:eq(0)").html("全部院系");
    $$("#academySelect > option:eq(0)").val("00");
    $$("#academySelect > option:eq(29)").after(`<option value="30">人工智能学院</option>`);
    academySelectgroup.splice(30, 0, [$$(`<option value="301">计算机科学与技术（人工智能方向）</option>`)[0], $$(`<option value="302">人工智能</option>`)[0]]);

    list.selectors = {
      term: new PJWSelect(list, "termList", "学期", list.heading.children(".pjw-classlist-selectors"), 1, 1),
      grade: new PJWSelect(list, "gradeList", "年级", list.heading.children(".pjw-classlist-selectors")),
      institution: new PJWSelect(list, "academySelect", "院系", list.heading.children(".pjw-classlist-selectors"), 0),
      major: new PJWSelect(list, "specialitySelect", "专业", list.heading.children(".pjw-classlist-selectors"))
    };

    $$("table").remove();

    window.reloadMajor = function() {
      list.selectors.major.clear();  
      for (var item of academySelectgroup[parseInt(list.selectors.institution.obj.selectedIndex)]) {
        if (item.value != "")
          list.selectors.major.addItem(item);
      }
      list.selectors.major.obj.layoutOptions();
    };

    // 自动获取年级及专业
    function autofillInfo() {
      const stu_info = pjw.data.stu_info;
      if (!stu_info) return;
      const stu_grade = stu_info.grade, stu_dept = stu_info.department, stu_major = stu_info.major;
      const sel = list.selectors;
      sel.grade.setByText(stu_grade);
      sel.institution.setByText("全部课程");
      list.selectors.major.dom.hide();
      // sel.institution.setByText(stu_dept);
      reloadMajor();
      // sel.major.setByText(stu_major);
      list.refresh();
      fillCompleted();
      $$("#acl-major-switch-label").html(`${stu_dept} > ${stu_major}`);
      $$(".acl-major-switch-button").on("click", null, {
        dept: stu_dept,
        major: stu_major
      }, (e) => {
        sel.institution.setByText(e.data.dept);
        sel.major.setByText(e.data.major);
        list.refresh(true);
      }).css("display", "inline-block");
    }

    function fillCompleted() {
      list.selectors.term.onchange( (e) => { list.refresh(true); } );
      list.selectors.grade.onchange( (e) => { list.refresh(true); } );
      list.selectors.major.onchange( (e) => { 
        if (e.detail.index == -1) return;
        list.refresh(true);
      } );
      list.selectors.institution.onchange( (e) => {
        if (list.selectors.institution.obj.selectedIndex == 0) {
          list.selectors.major.dom.hide();
          list.clear();
          list.refresh(true);
          return;
        } else {
          list.selectors.major.dom.show();
          reloadMajor();
          list.selectors.major.obj.selectedIndex = 0;
        }
      });
    }

    if (Date.now() - (pjw.data.stu_info?.last_update || 0) < 3 * 24 * 3600 * 1000) {
      autofillInfo();
    } else {
      $$.ajax({
        url: "/jiaowu/student/studentinfo/studentinfo.do?method=searchAllList",
        type: "POST"
      }).done(function(res) {
        window.aux_data = $$(res);
        var stu_grade = aux_data.find("div#d11 > form > table > tbody > tr:eq(4) > td:eq(3)").html();
        var stu_dept = aux_data.find("div#d11 > form > table > tbody > tr:eq(3) > td:eq(1)").html();
        var stu_major = aux_data.find("div#d11 > form > table > tbody > tr:eq(3) > td:eq(3)").html();
        pjw.data.stu_info = {grade: stu_grade, department: stu_dept, major: stu_major, last_update: Date.now()};
        autofillInfo();
      }).fail(() => {
        reloadMajor();
        fillCompleted();
      });
    }
  } else if (pjw.mode == "union") {
    var modes_map = [
      {"name": "通识课补选", "mode": "dis", "func": "dis_public"},
      {"name": "公选课补选", "mode": "public", "func": "dis_public"},
      {"name": "跨院系补选", "mode": "open"},
      // {"name": "悦读经典初选", "mode": "read_view"},
      {"name": "悦读经典补选", "mode": "read"},
      {"name": "通修课补选", "mode": "common"},
      // {"name": "通识课初选", "mode": "dis_view", "func": "dis_public_view"},
      // {"name": "公选课初选", "mode": "public_view", "func": "dis_public_view"},
      // {"name": "跨院系初选", "mode": "open_view"},
      {"name": "美育补选", "mode": "art", "func": "dis_public"},
      {"name": "体育选课", "mode": "gym"},
    ];
    var options_html = "";
    for (var item of modes_map) {
      options_html += `<div data-mode="${item.mode}" data-func="${item.func || ""}" class="pjw-mini-button pjw-mode-switcher-button">${item.name}</div>`;
    }
    var union_panel_html = `
      <div class="pjw-card" id="pjw-union-panel">
        <subheading>聚合选课 Beta</subheading>
        <div>${options_html}</div>
      </div>
      <div id="pjw-union-listcontainer"></div>
    `;
    $$("#Function").after(union_panel_html);
    last_selected_mode = null;
    $$(".pjw-mode-switcher-button").on("click", function() {
      if (!window.list) {
        $$("#Function").hide();
        window.list = new PJWClassList($$("#pjw-union-listcontainer"));
      } else {
        $$(".pjw-classlist-selectors").html("");
      }
      if (last_selected_mode) {
        last_selected_mode.css("color", "");
        last_selected_mode.removeClass("keep-hover");
      }
      $$(this).css("color", "#0058ff");
      $$(this).addClass("keep-hover");
      last_selected_mode = $$(this);
      var mode = $$(this).attr("data-mode");
      window.pjw_select_mode = mode;
      var func = $$(this).attr("data-func") || mode;
      class_select_funcs[func]();
    });
  } else if (pjw.mode == "gym") {
    enterMode("gym");
  } else if (pjw.mode == "read") {
    enterMode("read");
  } else if (pjw.mode == "read_view") {
    enterMode("read_view");
  } else if (pjw.mode == "common") {
    enterMode("common");
  } else if (pjw.mode == "dis" || pjw.mode == "public" || pjw.mode == "art") {
    enterMode("dis_public");
  } else if (pjw.mode == "dis_view" || pjw.mode == "public_view" || pjw.mode == "art_view") {
    enterMode("dis_public_view");
  } else if (pjw.mode == "open") {
    enterMode("open");
  } else if (pjw.mode == "open_view") {
    enterMode("open_view");
  } else if (pjw.mode == "login_page") {
    $$("body").prepend(`
      <div id="pjw-login-mask" style="position: fixed; top: 0; left: 0; height: 100%; width: 100%; background-color: rgba(0, 0, 0, .2); display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div style="display: flex; flex-direction: column; align-items: center; border-radius: 30px; background-color: white; padding: 30px 20px;">
        <form action="login.do" method="POST" style="display: flex; flex-direction: column; align-items: flex-start;" id="pjw-login-form">
        <h1 style="margin-left: 10px;">欢迎回来</h1>

        <div class="mdc-text-field mdc-text-field--filled pjw-login-field" data-mdc-auto-init="MDCTextField">
          <span class="mdc-text-field__ripple"></span>
          <span class="mdc-floating-label" id="pjw-login-username-label">用户名</span>
          <input class="mdc-text-field__input" name="userName" type="text" aria-labelledby="pjw-login-username-label" placeholder=" " required="required">
          <span class="mdc-line-ripple"></span>
        </div>

        <div class="mdc-text-field mdc-text-field--filled pjw-login-field" data-mdc-auto-init="MDCTextField">
          <span class="mdc-text-field__ripple"></span>
          <span class="mdc-floating-label" id="pjw-login-password-label">密码</span>
          <input class="mdc-text-field__input" name="password" type="password" aria-labelledby="pjw-login-password-label" placeholder=" " required="required">
          <span class="mdc-line-ripple"></span>
        </div>

        <div style="margin: 30px 0;">
          <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised pjw-login-button" id="pjw-login-submit-button" onclick="submitLoginForm();" type="button" disabled="disabled">
            <div class="mdc-button__ripple"></div>
            <span class="material-icons-round">login</span>
            <div class="mdc-button__label" style="margin-left: 8px;">登录</div>
          </button>

          <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised pjw-login-button" style="background-color: #63065f;" type="button" onclick="casLogin();">
            <div class="mdc-button__ripple"></div>
            <span class="material-icons-round">open_in_new</span>
            <div class="mdc-button__label" style="margin-left: 16px;">统一认证</div>
          </button>
        </div>

        <input type="hidden" name="returnUrl" value="/jiaowu/student/index.do">
        <input type="hidden" name="ValidateCode">

        </form>
        <div style="display: flex; align-items: center; justify-content: space-between; flex-direction: row; margin-bottom: 10px;">
          <canvas id="pjw-login-mask-canvas" width="80", height="20">Canvas is not supported in your browser.</canvas>
          <button data-mdc-auto-init="MDCRipple" id="pjw-login-mask-refresh-captcha" class="mdc-button" style="color: rgba(0, 0, 0, .5); margin-left: 20px;" onclick="RefreshValidateImg('ValidateImg');" disabled="disabled">
            <div class="mdc-button__ripple"></div>
            <div class="mdc-button__label" id="pjw-captcha-result">刷新验证码</div>
          </button>
        </div>
        <button data-mdc-auto-init="MDCRipple" class="mdc-button" style="color: rgba(0, 0, 0, .5);" onclick="closeLoginMask();">
          <div class="mdc-button__ripple"></div>
          <div class="mdc-button__label">关闭</div>
        </button>
      </div>
      </div>
    `);
    $$("body").on("keypress", (e) => {
      if (!window.login_mask_closed)
        if (e.which == 13 || e.keyCode == 13)
          submitLoginForm();
    });
    $$("#pjw-login-mask").append($$("#pjw-toolbar"));

    window.submitLoginForm = function() {
      var username = $$("#pjw-login-form").find("input[name=userName]").val();
      var password = $$("#pjw-login-form").find("input[name=password]").val();
      if (!username && !password) {
        casLogin();
        return;
      }
      if (!username || !password) return;
      if (login_settings["store_login_info"]) {
        var login_info = {
          username: username,
          password: password
        }
        pjw.data.login_info = login_info;
      }
      $$("#pjw-login-form").submit();
    }

    window.closeLoginMask = function() {
      $$("body").append($$("#pjw-toolbar"));
      $$("#pjw-login-mask").remove();
      window.login_mask_closed = true;
    }

    // Load login settings
    window.login_settings = {};
    function updateLoginSettings(write = false) {
      login_settings = pjw.preferences.login_settings || {};
      $$(".login_settings").each(function() {
        const t = $$(this);
        if (t.attr("id") in login_settings) {
          if (write)
            login_settings[t.attr("id")] = t.prop("checked");
          else
            t.prop("checked", login_settings[t.attr("id")]);
        } else {
          login_settings[t.attr("id")] = t.prop("checked");
        }
      });
      pjw.preferences.login_settings = login_settings;
      if (login_settings["solve_captcha"] == false)
        closeLoginMask();
      if (!write) return login_settings;

      if (login_settings["store_login_info"] == false)
        delete pjw.data.login_info
      if (login_settings["solve_captcha"] == true && $$("#ValidateCode").val().length == 0)
        fillCAPTCHA();
      return login_settings;
    }

    login_settings = updateLoginSettings();
    $$(".login_settings").on("change", function() { updateLoginSettings(true); });

    // Username & password auto-fill
    if (login_settings["store_login_info"] == true && pjw.data.login_info !== null) {
      if ($$("input[name=userName]").val().length == 0)
        $$("input[name=userName]").val(pjw.data.login_info.username);
      if ($$("input[name=password]").val().length == 0)
        $$("input[name=password]").val(pjw.data.login_info.password);
    }
    const checkLogin = function() {
      login_settings = pjw.preferences.login_settings;
      if (CheckForm()) {
        if (login_settings["store_login_info"] == true) {
          const login_info = {
            username: $$("input[name=userName]").val(),
            password: $$("input[name=password]").val()
          }
          pjw.data.login_info = login_info;
        }
        return true;
      } else {
        return false;
      }
    }
    $$("#Wrapper").find("form[action=\"login.do\"]").attr("onsubmit", "");
    $$("#Wrapper").find("form[action=\"login.do\"]").on("submit", checkLogin);

    $$("input[name=returnUrl]").val("/jiaowu/student/index.do");
    $$("input[type=submit]").after("<br><span id=\"pjw-login-helper-label\"></span>");

    // CAPTCHA auto-fill
    CAPTCHAPlugin();

    let min_certainty = 14;

    function fillCAPTCHA() {
      if (!pjw.data.login_settings?.["solve_captcha"]) return;
      $$("#pjw-captcha-result").html("正在识别验证码...");
      $$("#pjw-login-mask-refresh-captcha").prop("disabled", true);
      var res = solveCAPTCHA($$("#ValidateImg")[0]);
      if (res === false) {
        $$("#ValidateCode").val("Please wait...");
        RefreshValidateImg('ValidateImg');
      } else {
        $$("input[name=ValidateCode]").val(res["code"]);
        if (res["certainty"] < min_certainty) {
          $$("#pjw-captcha-result").html(res["code"] + " ...");
          $$("#pjw-login-helper-label").html("可能的低置信度识别，正在重试");
          min_certainty *= 0.9;
          RefreshValidateImg('ValidateImg');
        } else {
          min_certainty = 14;
          $$("#pjw-captcha-result").html(res["code"]);
          $$("#pjw-login-mask-refresh-captcha").prop("disabled", false);
          $$("#pjw-login-helper-label").html("");
          $$("#pjw-login-submit-button").prop("disabled", false);
        }
      }
    }
    if ($$("#ValidateImg")[0].complete) {
      fillCAPTCHA();
    }
    $$("#ValidateImg").on("load", function() {
      fillCAPTCHA();
    });
    window.mdc.autoInit();
  } else if (pjw.mode == "grade_info") {
    window.pconsole = new PJWConsole();

    window.list = new PJWMiniList();
    list.dom.prependTo($$("td[valign=top][align=left]"));
    list.dom.after(`<div class="pjw-mini-button" id="show-grade-table" onclick="$$('table.TABLE_BODY').css('display', 'table'); $$('#show-grade-table').hide();">显示成绩表格</div>`)

    initGradeList = () => {
      $$(".click-to-show").on("click", (e) => {
        e.stopPropagation();
        var target = $$(e.delegateTarget);
        target.parent().html(target.attr("data-value"));
      });

      function showGrade() {
        $$(".click-to-show").click();
      }

      $$(".pjw-minilist-heading").html(`
        <div>
          <input type="checkbox" id="hide-grade" class="grade_info_settings" checked="checked">
          <label for="hide-grade">默认隐藏成绩</label>
          <span id="show-all-grade" class="pjw-mini-button">显示全部成绩</span>
        </div>
        <div class="pjw-float--fixed" style="flex-direction: column;">
          <div>
            <span id="average-score" style="font-size: 14px; height: 24px; line-height: 24px">PotatoPlus GPA计算器</span>
          </div>
          <div>
            <span id="calc-all-grade" class="pjw-mini-button">计算全部</span>
            <span id="remove-all-grade" class="pjw-mini-button">移除全部</span>
          </div>
        </div>
      `);

      pjw.preferences.grade_info_settings || (pjw.preferences.grade_info_settings = true);
      if (!pjw.preferences.grade_info_settings) {
        showGrade();
        $$("#hide-grade").prop("checked", false);
        $$("#show-all-grade").css("display", "none");
      }
      $$("#hide-grade").on("change", function() {
        pjw.preferences.grade_info_settings = $$("#hide-grade").prop("checked");
      });
      $$("#show-all-grade").on("click", function() {
        showGrade();
      });
      $$("#calc-all-grade").on("click", function() {
        $$(".pjw-miniclass-add-to-calc").each((index, val) => {
          if ($$(val).attr("data-status") == "add")
            switchCalcStatus($$(val));
        });
        calcGPA();
      });
      $$("#remove-all-grade").on("click", function() {
        $$(".pjw-miniclass-add-to-calc").each((index, val) => {
          if ($$(val).attr("data-status") == "remove")
            switchCalcStatus($$(val));
        });
        calcGPA();
      });

      window.grade_list = [];
      $$(".pjw-miniclass").on("click", (e) => {
        if (window.getSelection().toString() != "") return;
        var target = $$(e.delegateTarget).find(".pjw-miniclass-add-to-calc");
        switchCalcStatus(target);
        calcGPA();
      });

      window.mdc.autoInit();
    };

    function switchCalcStatus(target) {
      if (target.attr("data-status") == "remove") {
        grade_list = grade_list.filter((item) => (item != target.attr("data-index")));
        target.css("background-color", "rgb(164, 199, 21)");
        target.find(".pjw-miniclass-button__label").html("添加");
        target.attr("data-status", "add");
      } else {
        grade_list.push(parseInt(target.attr("data-index")));
        target.css("background-color", "darkred");
        target.find(".pjw-miniclass-button__label").html("移除");
        target.attr("data-status", "remove");
      }
    }
    
    function calcGPA() {
      var total = 0, total_credit = 0;
      for (var item of grade_list) {
        var credit = parseInt(list.class_data[item - 1].data.num_info[0].num);
        if (!credit) credit = 0;
        total_credit += credit;
        total += parseFloat(list.class_data[item - 1].data.num_info[1].num) / 20 * credit;
      }
      if (total_credit == 0) {
        $$("#average-score").html("PotatoPlus GPA计算器");
      } else {
        $$("#average-score").html(`${grade_list.length} 门课程的平均学分绩：<span style="font-weight: bold; font-size: 18px;">${(total / total_credit).toFixed(4)}</span>`);
        pconsole.debug(`${grade_list.length} 门课程的平均学分绩：${total / total_credit}`, "calc_grade");
      }
    }

    function parseGrade(obj) {
      obj.find("table.TABLE_BODY:eq(0) > tbody > tr:gt(0)").each((index, val) => {
        var td = (i) => ($$(val).children(`td:eq(${i})`));
        
        list.add({
          title: td(2).html(),
          note: `${td(3).html()} / <span class="pjw-miniclass-course-number" onclick="window.open('${td(1).children("a").attr("href")}');">${td(1).find("u").html()}</span> / ${td(4).html()}${td(7).html().trim() ? ` / 交换成绩对应课程：${td(7).html()}` : ""}`,
          num_info: [{
            num: td(5).html(),
            label: "学分"
          }, {
            num: (td(6).children("ul").html() || td(6).html()),
            label: "总评",
            hidden: true
          }]
        });
      });
    }

    function loadGrade(id, limit = -1) {
      if (limit == 0 || id >= $$(`table:eq(0) > tbody > tr:eq(1) > td:eq(1) > div > table > tbody > tr`).length || !$$(`table:eq(0) > tbody > tr:eq(1) > td:eq(1) > div > table > tbody > tr:eq(${id}) > td > a`).length) {
        initGradeList();
        return;
      }
      $$(`table:eq(0) > tbody > tr:eq(1) > td:eq(1) > div > table > tbody > tr:eq(${id}) > td > a`).each((index, val) => {
        $$.ajax({
          url: $$(val).attr("href"),
          method: "GET"
        }).done((res) => {
          parseGrade($$(res));
          loadGrade(id + 1, limit - 1);
        });
      });
    };

    var search_params = new URLSearchParams(window.location.search);
    if (search_params.has("termCode")) {
      if (search_params.get("termCode") == "all") {
        loadGrade(2);
      } else {
        parseGrade($$("body"));
        initGradeList();
        $$("table:eq(0) > tbody > tr:eq(1) > td:eq(1) > div > table > tbody").prepend(`<div class="pjw-mini-button" onclick="window.location.href = '/jiaowu/student/studentinfo/achievementinfo.do?method=searchTermList&termCode=all';">加载所有学期成绩</div>`);
      }
    } else {
      loadGrade(2, 1);
      $$("table:eq(0) > tbody > tr:eq(1) > td:eq(1) > div > table > tbody").prepend(`<div class="pjw-mini-button" onclick="window.location.href = '/jiaowu/student/studentinfo/achievementinfo.do?method=searchTermList&termCode=all';">加载所有学期成绩</div>`);
    }
    
  } else if (pjw.mode == "course_info") {
    $$("div:eq(1)").after(`<br>当前页面地址是：${window.location.href}`);
  } else if (pjw.mode == "course") {
    $(".user-dropdown").prepend(`<div style="cursor: pointer; color: #4D87F2; line-height: 17px; margin-bottom: 20px;" onclick="window.pjw.switch();window.location.reload();">${pjw.preferences.enabled ? "禁用 PotatoPlus" : "启用 PotatoPlus (Beta)"}</div>`);
    pjw.preferences.enabled && enterMode("course");
  } else {
    return;
  }
};

window.proto_backup = {
  reduce: function (callback, initialVal) {
    // Source: https://stackoverflow.com/questions/55699861/implementing-reduce-from-scratch-not-sure-how-js-knows-what-array-is
    var accumulator = (initialVal === undefined) ? this[0] : initialVal;
    var start = (initialVal === undefined) ? 1 : 0;
    for (var i = start; i < this.length; i++) {
      accumulator = callback(accumulator, this[i])
    }
    return accumulator;
  }
};

if (/(\/jiaowu\/student\/index.do|\/jiaowu\/login.do)/i.test(window.location.href)) {
  alert = function(x) {window.alert_data = x;};
}

(function() {
  if (document.readyState == "complete")
    potatojw_intl();
  else
    window.addEventListener("load", potatojw_intl);
})();