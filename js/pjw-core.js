window.potatojw_intl = function() {
  if (typeof(window.pjw_version) == "string") return;

  window.pjw_platform = "@platform@";
  if (window.pjw_platform[0] == "@")
    window.pjw_platform = "General Plugin";

  window.pjw_version = "@version@";
  if (window.pjw_version[0] == "@")
    window.pjw_version = "0.3.6";
  
  if (jQuery.fn.jquery == "3.5.1")
    window.$$ = jQuery.noConflict();
  else
    window.$$ = $;

  var head_metadata = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <link rel="shortcut icon" href="https://www.nju.edu.cn/_upload/tpl/01/36/310/template310/images/16.ico" type="image/x-icon">
  `;
  $$("head").prepend(head_metadata);

  // UI Improvement
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
    if (store.has("privilege")) $$("#pjw-user-type").html(store.get("privilege")); 
    $$("#pjw-user-type").on("click", (e) => { if (window.click_count) {window.click_count++;}
      else {window.click_count = 1; setTimeout(() => {delete click_count;}, 2000);} if (window.click_count >= 5) { window.click_count = 0; if (store.has("privilege")) { store.remove("privilege"); $$("#pjw-user-type").html("学生");} else store.set("privilege", "root"); if (store.has("privilege")) $$("#pjw-user-type").html(store.get("privilege"));}/*ifyouareheretryitout*/
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
    $$("div#TopLink").html(`<span class="pjw-mini-button" onclick="window.open('https://cubiccm.ddns.net/potatoplus')">v${pjw_version}</span>
      <span class="pjw-mini-button" id="pjw-logout-button" onclick="window.location.href='exit.do?type=student'">退出登录</span>`);
  }

  window.reset_storage_confirm = false;
  window.reset_storage_timeout = 0;
  window.resetStorage = function() {
    if (reset_storage_confirm) {
      store.clearAll();
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

  console.log(`PotatoPlus v${pjw_version} (${pjw_platform}) by Limos`);

  if (pjw_mode == "") return;

  console.log(pjw_mode + " mode activated");

  if (store.get("login_settings") != null && store.get("login_settings").share_stats == true) {
    $$("head").append($$(google_analytics_js));
  }

  var filter_mode_list = {"major_course": 6};
  var pjw_classlist_mode_list = {"dis_view": true, "art_view": true, "open_view": true, "all_course_list": true, "dis": true, "open": true, "common": true, "public": true, "read_view": true, "gym": true, "read": true, "grade_info": true, "public_view": true, "union": true, "course": true, "art": true};

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
    filter: `
      <div id="filter-control-bar">
        <section>
          <input type="checkbox" id="filter_switch">
          <label for="filter_switch">课程过滤器</label>
          <span class="pjw-mini-button" id="show_filter_setting" onclick="showFilterSettings();">配置</span>
        </section>
        <section>
          <input type="checkbox" id="auto_refresh">
          <label for="auto_refresh" style="font-weight: bold; margin-right: 8px;">刷新</label>
          <span style="color: #dedede; font-size: 11px;">标准</span>
          <input type="range" id="auto_refresh_frequency" style="width: 50px; height: 15px;" value="0" onchange="frequencyUpdate();">
          <span style="color: #dedede; font-size: 11px;">封号退学</span>
        </section>
        <section style="opacity: .6;">
          <input type="checkbox" id="auto_select" disabled="disabled">
          <label for="auto_select" style="font-weight: bold;">自动选择 *弃用</label>
        </section>
      </div>
    `,
    default: `<span>正在此页面上运行。</span>`
  };

  const about_this_project = `
  <span style="user-select: text;">PotatoPlus v` + pjw_version + `</span>
  `;

  if (pjw_mode in filter_mode_list) {
    const filter_setting_html = `
      <div id="potatojw_mask"></div>
      <div id="potatojw_filter_setting_frame">
        <section id="filter_full_class" class="filter_section">
          <input type="checkbox" id="is_filter_full_class" checked="checked">
          <label for="is_filter_full_class">仅显示空余课程</label>
        </section>

        <section id="filter_major" class="filter_section">
          <h3>专业过滤</h3>
          <h5>将会自动选择此专业。</h5>
          <input type="text" id="filter_major_text">
        </section>

        <section id="filter_grade" class="filter_section">
          <h3>年级过滤</h3>
          <h5>将会自动选择此年级。</h5>
          <input type="text" id="filter_grade_text">
        </section>

        <section id="filter_class_name" class="filter_section">
          <h3>课名过滤</h3>
          <h5>仅显示含有以下关键字的课程。</h5>
          <input type="text" id="filter_class_name_text">
        </section>
        <section id="filter_teacher_name" class="filter_section">
          <h3>教师过滤</h3>
          <h5>仅显示含有该教师的课程。</h5>
          <input type="text" id="filter_teacher_name_text">
        </section>
        <section id="filter_time" class="filter_section">
          <h3>上课时间过滤</h3>
        </section>
        <br>
        <span class="pjw-mini-button" onclick="hideFilterSettings();">完成设置</span>
        <br><br>
        <span>请留意，此处的课程过滤器是 PotatoPlus v0.1 的功能，近期未经过测试和更新，请不要依赖此功能。</span>
        <br>
        <span>上课时间过滤器暂不能储存，刷新页面后会消失。</span>
        <br>
        <span>打开开发者界面（F12 / Option + Command + I）的控制台（Console）可查看输出信息</span>
        <br>
        <div class="about-proj"></div>
      </div>
    `;
    $$("body").append(filter_setting_html);
  }

  if (pjw_mode != "" && !(pjw_mode in pjw_classlist_mode_list) && pjw_mode != "main_page" && pjw_mode != "course_info" && pjw_mode != "xk_system") {
    $$("body").append(`<div id='pjw-toolbar'><div id="pjw-toolbar-content">` +
        custom_toolbar_html[(pjw_mode in filter_mode_list ? "filter" : (pjw_mode in custom_toolbar_html ? pjw_mode : "default"))]
    + `<div class="about-proj"></div></div></div>`);
    const toolbar_button_html = `
    <div id="pjw-toolbar-collapse-bg"><canvas id="pjw-toolbar-collapse" width="30px" height="30px"></canvas></div>
    `;
    $$("#pjw-toolbar").prepend(toolbar_button_html);

    // Initiate toolbar
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
      if (store.get("is_toolbar_collapsed") == true) expandToolBar();
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
      store.set("is_toolbar_collapsed", true);
    }
    if (store.get("is_toolbar_collapsed") == null)
      store.set("is_toolbar_collapsed", false);
    else if (store.get("is_toolbar_collapsed") == true)
      collapseToolBar();
    $$("#pjw-toolbar-collapse-bg").on("click", switchToolBar);
    $$("#pjw-toolbar-collapse").on("mousedown", () => { if (store.get("is_toolbar_collapsed") == false) $$("#pjw-toolbar-collapse-bg").css("background-color", "rgba(255, 255, 255, 1.0)");} );
    $$("#pjw-toolbar-collapse-bg").on("mousedown", () => { if (store.get("is_toolbar_collapsed") == false) $$("#pjw-toolbar-collapse-bg").css("background-color", "rgba(255, 255, 255, 1.0)");} );

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
      store.set("is_toolbar_collapsed", false);
    }
  }

  if (pjw_mode in pjw_classlist_mode_list)
    ClassListPlugin();


  // Storage Upgrade  
  if (store.get("version") == null || store.get("version") != pjw_version) {
    store.set("is_toolbar_collapsed", false);
    store.remove("privilege");
    store.set("version", pjw_version);
    store.remove("bulletin_update_timestamp");
    store.remove("bulletin_content");
  }

  var enterMode = function(mode) {
    window.pjw_select_mode = pjw_mode;
    class_select_funcs[mode]();
  }

  if (pjw_mode == "main_page") {
    window.pconsole = new PJWConsole();
    if (typeof(window.alert_data) != "undefined") {
      pconsole.alert(window.alert_data);
    }

    $$("div#TopLink").prepend(`<span class="pjw-mini-button" style="color: gray; opacity: 0.7;" onclick="resetStorage();" id="reset_storage">重置存储</span>`);

    var update_html = "";
    if (pjw_platform == "Userscript") {
      update_html = `<a href="https://github.com/cubiccm/potatoplus/releases/latest/download/potatoplus.user.js">&gt; 获取更新 - Userscript</a><br><br>PotatoPlus 浏览器扩展已经在<a href="https://chrome.google.com/webstore/detail/potatoplus/mokphlegfcilcbnjmhgfikjgnbnconba" target="_blank">Chrome网上应用店</a>和<a href="https://microsoftedge.microsoft.com/addons/detail/potatoplus/miofoebmeohjbieochdmaolpaneapmib" target="_blank">Microsoft Edge Add-ons</a>上线，您也可以可以到<a href="https://github.com/cubiccm/potatoplus/releases/latest/download/PotatoPlus.xpi" target="_blank">GitHub Releases</a>获取适用于 Firefox 浏览器的插件。迁移到插件版本会在部分功能上获得更好的体验；安装插件前请先关闭当前 Userscript 的执行。`;
    } else if (pjw_platform == "General Plugin") {
      update_html = `您所安装的版本可能不支持自动更新，请访问<a href="https://github.com/cubiccm/potatoplus/releases/latest/" target="_blank">GitHub Releases</a>页面检查及获取更新。`;
    }

    var welcome_html = `
      <div id="pjw-welcome" class="pjw-card">
        <p style="display: flex; flex-direction: row; align-items: flex-start;"><span class="material-icons-round">done</span><span>&nbsp;&nbsp;</span><span>PotatoPlus 0.3.6 包含界面小更新与错误修复。</span></p>
        <p style="display: flex; flex-direction: row; align-items: flex-start;"><span class="material-icons-round">contactless</span><span>&nbsp;&nbsp;</span><span id="pjw-bulletin-content">${store.get("bulletin_content") || ""}</span></p>
        <br>
        <div class="pjw-welcome-get-update">${update_html}</div>
        <note>
          <a href="https://cubiccm.ddns.net/potatoplus" target="_blank" style="margin-left: 0;">PotatoPlus ${pjw_version}</a>
          <a href="https://github.com/cubiccm/potatoplus" target="_blank">GitHub</a>
          <a href="https://cubiccm.ddns.net/potato-mailing-list/" target="_blank">加入邮件列表</a>
          <a href="mailto:illimosity@gmail.com">发送反馈邮件</a>
          <a href="https://cubiccm.ddns.net/about" target="_blank">@Limos</a>
        </note>
      </div>
    `;

    const cn_days_name = ["日", "一", "二", "三", "四", "五", "六"];

    var calcCurrentWeek = () => {
      const fall_sem = new Date(new Date("2021-08-30").getTime() - 8 * 3600000);
      const fall_exam = new Date(new Date("2021-12-27").getTime() - 8 * 3600000);
      const winter_holiday = new Date(new Date("2022-01-10").getTime() - 8 * 3600000);
      const spring_sem = new Date(new Date("2022-02-14").getTime() - 8 * 3600000);
      const spring_exam = new Date(new Date("2022-06-13").getTime() - 8 * 3600000);
      const summer_school = new Date(new Date("2022-06-27").getTime() - 8 * 3600000);
      const summer_holiday = new Date(new Date("2022-07-25").getTime() - 8 * 3600000);
      const next_sem = new Date(new Date("2022-08-29").getTime() - 8 * 3600000); // Undetermined
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
        return "考试周";
      else if (today < next_sem)
        return "暑假";
      else
        return "查看教学周历";
    }

    const menu_html = `
      <div id="pjw-menu" class="pjw-card">
        <heading>Howdy, NJUer</heading><br>
        <subheading>${new Date().getMonth() + 1}月${new Date().getDate()}日 星期${cn_days_name[new Date().getDay()]} <a href="https://jw.nju.edu.cn/qxnjxxl/list.htm" target="_blank">${calcCurrentWeek()}</a></subheading>
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

    if (!store.has("bulletin_update_timestamp") || store.get("bulletin_update_timestamp") + 300000 <= new Date().getTime()) {
      var is_sharing_stats = ("share_stats" in store.get("login_settings")) && (store.get("login_settings")["share_stats"] == true);
      welcome_html += `<iframe src="https://cubiccm.ddns.net/apps/potatoplus-bulletin/?version=${pjw_version}&share_stats=${is_sharing_stats ? 1 : 0}" width="300" height="300" style="display: none;"></iframe>`;

      window.addEventListener("message", (e) => {
        if (e.origin !== "https://cubiccm.ddns.net") return;
        store.set("bulletin_update_timestamp", new Date().getTime());
        store.set("bulletin_content", e.data);
        $$("#pjw-bulletin-content").html(store.get("bulletin_content"));
      });
    }

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
    })
    window.mdc.autoInit();
  } else if (pjw_mode == "course_eval") {
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
  } else if (pjw_mode == "all_course_list") {
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
        }).fail((data) => {
          reject(data);
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
      var stu_info = store.get("stu_info");
      var stu_grade = stu_info.grade, stu_dept = stu_info.department, stu_major = stu_info.major;
      var sel = list.selectors;
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

    if (store.get("stu_info") != null && Date.now() - store.get("stu_info").last_update < 3 * 24 * 3600 * 1000) {
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
        store.set("stu_info", {grade: stu_grade, department: stu_dept, major: stu_major, last_update: Date.now()});
        autofillInfo();
      }).fail(() => {
        reloadMajor();
        fillCompleted();
      });
    }
  } else if (pjw_mode == "union") {
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
  } else if (pjw_mode == "gym") {
    enterMode("gym");
  } else if (pjw_mode == "read") {
    enterMode("read");
  } else if (pjw_mode == "read_view") {
    enterMode("read_view");
  } else if (pjw_mode == "common") {
    enterMode("common");
  } else if (pjw_mode == "dis" || pjw_mode == "public" || pjw_mode == "art") {
    enterMode("dis_public");
  } else if (pjw_mode == "dis_view" || pjw_mode == "public_view" || pjw_mode == "art_view") {
    enterMode("dis_public_view");
  } else if (pjw_mode == "open") {
    enterMode("open");
  } else if (pjw_mode == "open_view") {
    enterMode("open_view");
  } else if (pjw_mode == "major_course") {
    window.hideCourseDetail = function(response){
      $('courseDetail').style.visibility = "hidden";
      if (auto_select_switch) doAutoClassSelect();
    }
    window.initClassList = function(success_func = function() {}) {
      var filtered_major = filter_settings.filter_major_text;
      var filtered_grade = filter_settings.filter_grade_text;
      if ($$("#specialityList").length > 0 && (filtered_major && filtered_grade)) {
        $$("#specialityList").val($$("#specialityList").find('option:contains("' + filtered_major + '")').val());
        $$("#gradeList").val($$("#gradeList").find('option:contains("' + filtered_grade + '")').val());
      }
      if ($$("#specialityList").length > 0) {
        specialityChange();
        return;
      }
      var pars = 'method=specialityCourseList';
      var myAjax = new Ajax.Updater(
        'courseList',
        '/jiaowu/student/elective/courseList.do',
        {
          method : 'post',
          parameters : pars,
          evalScript : true
        }
      );
    };

    window.completeSelected = function(response) {
      $('courseOperation').innerHTML = response.responseText;
      if (document.getElementById('errMsg') != null) {
        alert(document.getElementById('errMsg').title);
        return;
      }
      if (document.getElementById("tdSelected" + g_selectingCourseNumber) != null) {
        document.getElementById("tdSelected" + g_selectingCourseNumber).innerHTML = "<font color='#000000'>已选</font>";
        stopAuto();
      }
    }

    window.class_list_auto_triggered = false;
    window.showCourseDetail = function(res){
      $('courseDetail').style.visibility = "visible";
      if (class_list_auto_triggered == true && auto_select_switch == true) {
        class_list_auto_triggered = false;
        $$("div#classList > table > tbody > tr").each(function() {
          var current_teacher_name = $$(this).find("td:eq(1) > table > tbody > tr:eq(2) > td:eq(1)").html();
          if (current_teacher_name.indexOf(filter_settings.filter_teacher_name_text) < 0)
            return true;
          console.log("Class Match. Selection requested.");
          $$(this).children("td:eq(2)").children("input")[0].click();
          selectClass();
        })
      }
    }

    window.checkCourse = function(element) {
      var current_class_name = $$(element).children("td:eq(1)").html();
      if (current_class_name.indexOf(filter_settings.filter_class_name_text) < 0)
        return true;
      if ($$(element).children("td:eq(7)").html() == "已选")
        return true;
      $$(element).children("td:eq(7)")[0].click();
      class_list_auto_triggered = true;
    };

    $$(document).ready(function() {
      showFilter("grade");
      showFilter("major");
      $$("#filter_switch").css("display", "none");
    });
  } else if (pjw_mode == "login_page") {
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
        store.set("login_info", login_info);
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
      if (store.get("login_settings") != null) {
        login_settings = store.get("login_settings");
      }
      $$(".login_settings").each(function() {
        var t = $$(this);
        if (t.attr("id") in login_settings) {
          if (write)
            login_settings[t.attr("id")] = t.prop("checked");
          else
            t.prop("checked", login_settings[t.attr("id")]);
        } else {
          login_settings[t.attr("id")] = t.prop("checked");
        }
      });
      store.set("login_settings", login_settings);
      if (login_settings["solve_captcha"] == false)
        closeLoginMask();
      if (!write) return login_settings;

      if (login_settings["store_login_info"] == false)
        store.remove("login_info");
      if (login_settings["solve_captcha"] == true && $$("#ValidateCode").val().length == 0)
        fillCAPTCHA();
      return login_settings;
    }

    login_settings = updateLoginSettings();
    $$(".login_settings").on("change", function() { updateLoginSettings(true); });

    // Username & password auto-fill
    if (login_settings["store_login_info"] == true && store.get("login_info") != null) {
      var login_info = store.get("login_info");
      if ($$("input[name=userName]").val().length == 0)
        $$("input[name=userName]").val(login_info.username);
      if ($$("input[name=password]").val().length == 0)
        $$("input[name=password]").val(login_info.password);
    }
    var checkLogin = function() {
      login_settings = store.get("login_settings");
      if (CheckForm()) {
        if (login_settings["store_login_info"] == true) {
          var login_info = {
            username: $$("input[name=userName]").val(),
            password: $$("input[name=password]").val()
          }
          store.set("login_info", login_info);
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

    min_certainty = 14;

    function fillCAPTCHA() {
      login_settings = store.get("login_settings");
      if (login_settings["solve_captcha"] == false) return;
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
  } else if (pjw_mode == "grade_info") {
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

      if (store.get("grade_info_settings") == null) {
        store.set("grade_info_settings", true);
      }
      if (!store.get("grade_info_settings")) {
        showGrade();
        $$("#hide-grade").prop("checked", false);
        $$("#show-all-grade").css("display", "none");
      }
      $$("#hide-grade").on("change", function() {
        store.set("grade_info_settings", $$("#hide-grade").prop("checked"));
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
    
  } else if (pjw_mode == "course_info") {
    $$("div:eq(1)").after(`<br>当前页面地址是：${window.location.href}`);
  } else if (pjw_mode == "course") {
    $$(".cv-btn.yxkc-window-btn").after(`<button class="cv-btn yxkc-window-btn" onclick="window.switch_pjw();">${store.has("enable_on_newsystem") ? "禁用" : "启用"} PotatoPlus</button>`);
    if (store.has("enable_on_newsystem")) {
      window.switch_pjw = () => {
        store.remove("enable_on_newsystem");
        window.location.reload();
      };
      enterMode("course");
    } else {
      window.switch_pjw = () => {
        window.confirm("新选课系统中的 PotatoPlus 仅供测试之用，还存在很多已知的问题与缺陷。要启用吗？") && (store.set("enable_on_newsystem", true) || window.location.reload());
      };
      return;
    }
  } else {
    return;
  }

  if (pjw_mode in filter_mode_list) {
    window.select_class_button_index = {
    };

    window.class_name_index = {
      "major_course": -1
    };

    window.teacher_name_index = {
      "major_course": -1
    };

    window.class_time_index = {
    };

    if (store.get("filter_settings_" + pjw_mode) == null || store.get("filter_settings_" + pjw_mode) == "")
      window.filter_settings = {};
    else
      window.filter_settings = store.get("filter_settings_" + pjw_mode);

    $$(document).ready(function() {
      if (typeof(class_name_index[pjw_mode]) != "undefined")
        showFilter("class_name");
      if (typeof(teacher_name_index[pjw_mode]) != "undefined")
        showFilter("teacher_name");
      if (typeof(class_time_index[pjw_mode]) != "undefined")
        showFilter("time");
      if (typeof(isClassFull) != "undefined")
        showFilter("full_class");
    });
    window.showFilter = function(filter_name) {
      $$("#filter_" + filter_name).css("display", "block");
    };

    window.showFilterSettings = function() {
      $$("#potatojw_mask").css("display", "block");
      $$("#potatojw_filter_setting_frame").css("display", "block");
      $$("#is_filter_full_class").prop("checked", filter_settings.is_filter_full_class);
      $$("#potatojw_filter_setting_frame input").each(function() {
        if ($$(this).attr("id") in filter_settings)
          $$(this).val(filter_settings[$$(this).attr("id")]);
      });
    };

    window.hideFilterSettings = function() {
      $$("#potatojw_filter_setting_frame input").each(function() {
        filter_settings[$$(this).attr("id")] = $$(this).val();
      });
      filter_settings["is_filter_full_class"] = $$('#is_filter_full_class').is(":checked");
      applyFilter();
      $$("#potatojw_mask").css("display", "none");
      $$("#potatojw_filter_setting_frame").css("display", "none");
      store.set("filter_settings_" + pjw_mode, window.filter_settings);
      $$("#filter_switch").prop("checked", true);
      $$("#filter_switch").trigger("change");
    };

    window.applyFilter = function() {
      getAllClassDOM().each(function() {
        $$(this).css("display", (filterClass(this) ? "table-row" : "none"));
      });
    };

    // Register control bar event
    window.auto_refresh_interval_id = -1;
    $$("#auto_refresh").change(function() {
      $$("#auto_refresh").prop("checked") ? (function() {
        startAutoRefresh();
      } ()) : (function() {
        stopAutoRefresh();
      } ());
    });

    $$("#filter_switch").change(function() {
      applyFilter();
      $$("#auto_select").prop("disabled", false);
      $$("#auto_select").trigger("change");
    });

    window.auto_select_switch = false;
    $$("#auto_select").change(function() {
      window.auto_select_switch = $$("#auto_select").prop("checked");
    });

    window.stopAuto = function(){
      $$("#auto_refresh").prop("checked", false);
      $$("#auto_refresh").trigger("change");
      $$("#auto_select").prop("checked", false);
      $$("#auto_select").trigger("change");
    };

    window.getAllClassDOM = function() {
      return (pjw_mode == "open" ? $$("div#tbCourseList > tbody > tr:gt(0)") : $$("table#tbCourseList:eq(0) > tbody > tr"));
    };

    window.getNumberInNormalDistribution = function(mean, std_dev, lower_limit, upper_limit) {
      var res = Math.floor(mean + randomNormalDistribution() * std_dev);
      if (res >= upper_limit) return upper_limit;
      if (res >= mean) return res;
      res = mean - (mean-res) * 0.8;
      if (res < lower_limit) return lower_limit;
      return res;
    };

    window.randomNormalDistribution = function() {
      var u=0.0, v=0.0, w=0.0, c=0.0;
      do {
        u = Math.random()*2 - 1.0;
        v = Math.random()*2 - 1.0;
        w = u*u + v*v;
      } while (w == 0.0 || w >= 1.0)
      c = Math.sqrt((-2 * Math.log(w)) / w);
      return u * c;
    };

    window.auto_refresh_frequency = 1.0,
    window.auto_refresh_loss_rate = 0.1;

    // Auto-update class list
    window.startAutoRefresh = function() {
      initClassList(function() {doAutoClassSelect();});
      window.auto_refresh_loss_rate = 0.1 + getNumberInNormalDistribution(10, 10, 0, 20) / 100;
      var auto_check_times = 1;
      console.log("First time refreshed.");
      var random_interval = auto_refresh_frequency * getNumberInNormalDistribution(Math.floor(Math.random() * 600) + 1400, 800, 800, 3000);
      window.auto_refresh_interval_id = window.setInterval(function() {
        if (Math.random() < window.auto_refresh_loss_rate) return;
        window.setTimeout(function() {
          initClassList(function() {doAutoClassSelect();});
          console.log((++auto_check_times) + " times refreshed.");
        }, getNumberInNormalDistribution(random_interval * 0.3, random_interval * 0.3, 60, random_interval * 0.8));
      }, random_interval);
    };

    window.stopAutoRefresh = function() {
      window.clearInterval(window.auto_refresh_interval_id);
      window.auto_refresh_interval_id = -1;
    };

    window.frequencyUpdate = function() {
      window.auto_refresh_frequency = 1.0 / (1.0 + parseInt($$("#auto_refresh_frequency").val()) / 25);
      if (window.auto_refresh_interval_id != -1) {
        stopAutoRefresh();
        startAutoRefresh();
      }
    };

    // Select class automatically based on filter
    window.doAutoClassSelect = function() {
      if (auto_select_switch == false) return;
      getAllClassDOM().each(function() {
        if (auto_select_switch == false) return;
        if (pjw_mode == "major_course") {
          checkCourse(this); return;
        }
        if (!filterClass(this)) return;
        if (typeof(isClassFull) == "function" && !isClassFull(this)) {
          $$(this).children("td:eq(" + select_class_button_index[pjw_mode] + ")").children("a")[0].click();
          console.log("Class Selected: " + $$(this).children("td:eq(" + class_name_index[pjw_mode] + ")").html());
          stopAuto();
        }
      });
    };

    // Get the time of a given class
    // 获取课程上课时间
    window.getClassTime = function(element) {
      return $$(element).children("td:eq(" + class_time_index[pjw_mode] + ")").html();
    };

    window.time_list = new Array();
    window.updateFilterList = function() {
      time_list = [];
      $$("section#filter_time > input").css("display", "none");
      $$("section#filter_time > label").css("display", "none");
      $$("section#filter_time > br").css("display", "none");
      var date_num = 0;
      getAllClassDOM().each(function() {
        if (typeof(class_time_index[pjw_mode]) != "undefined") {
          var current_time_val = getClassTime(this);
          var str_array = current_time_val.split("<br>");
          for (var i = 0; i < str_array.length; i++) {
            if (time_list.includes(str_array[i])) return;
            time_list.push(str_array[i]);
            var filter_time_append_html = `
              <input type="checkbox" class="filter_time_checkbox" id="filter_time_checkbox_` + date_num + `" checked="checked">
              <label for="filter_time_checkbox_` + (date_num++) + `">` + str_array[i] + `</label><br>
            `;
            $$("section#filter_time").append(filter_time_append_html);
          }
        }
      });
    };
    updateFilterList();

    // Check if the given class satisfy the filter
    // 检查课程是否符合过滤器
    window.filterClass = function(element) {
      if ($$("#filter_switch").prop("checked") == false || pjw_mode == "major_course")
        return true;
      if (filter_settings.is_filter_full_class == true)
        if (typeof(isClassFull) == "function" && isClassFull(element))
          return false;
      if (typeof(class_time_index[pjw_mode]) != "undefined") {
        var current_time_val = getClassTime(element);
        var str_array = current_time_val.split("<br>");
        for (var i = 0; i < str_array.length; i++)
          if (time_list.indexOf(str_array[i]) >= 0 && $$("#filter_time_checkbox_" + time_list.indexOf(str_array[i])).prop("checked") == false)
            return false;
      }
      if (typeof(class_name_index[pjw_mode]) != "undefined") {
        var current_class_name = $$(element).children("td:eq(" + class_name_index[pjw_mode] + ")").html();
        if (current_class_name.indexOf(filter_settings.filter_class_name_text) < 0)
          return false;
      }
      if (typeof(teacher_name_index[pjw_mode]) != "undefined") {
        var current_teacher_name = $$(element).children("td:eq(" + teacher_name_index[pjw_mode] + ")").html();
        if (current_teacher_name.indexOf(filter_settings.filter_teacher_name_text) < 0)
          return false;
      }
      return true;
    };

    // Rewrite refresh function
    // 改写刷新按钮：刷新课程列表
    window.refreshCourseList = function() {
      initClassList();
    };
  }
};

var google_analytics_js = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-173014211-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-173014211-1', {
    'custom_map': {'dimension1': 'version'}
  });
  gtag('event', 'version_dimension', {'version': pjw_version + " " + pjw_platform});
</script>
`;

(function() {
  if (document.readyState == "complete")
    potatojw_intl();
  else
    window.addEventListener("load", potatojw_intl);
})();