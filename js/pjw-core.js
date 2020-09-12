window.potatojw_intl = function() {
  if (typeof(window.pjw_version) == "string") return;

  window.pjw_version = "0.2 beta";
  window.$$ = jQuery.noConflict();

  var head_metadata = `
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
  `;
  $$("head").prepend(head_metadata);

  // UI Improvement
  if ($$("#UserInfo").length) {
    $$("#UserInfo").html(`
      <div id="pjw-user-info" onclick="window.location.href='/jiaowu/student/teachinginfo/courseList.do?method=currentTermCourse'">${$$("#UserInfo").html().slice(4).match(/.*?\&/)[0].slice(0, -1)}
        <div id="pjw-user-type">${$$("#UserInfo").html().slice(4).match(/：.*/)[0].slice(1)}</div>
      </div>
    `);
    $$("#TopLink").children("img").remove();
  }

  var reset_storage_confirm = false;
  window.resetStorage = function() {
    if (reset_storage_confirm) {
      store.clearAll();
      reset_storage_confirm = false;
      $$("#reset_storage").html("重置存储");
    } else {
      $$("#reset_storage").html("确定重置？");
      reset_storage_confirm = true;
    }
  }
  if ($$("div#TopLink").length > 0)
    $$("div#TopLink").html(`<span class="pjw-mini-button" style="color: gray;" onclick="resetStorage();" id="reset_storage">重置存储</span>
      <span class="pjw-mini-button" onclick="window.open('https://github.com/cubiccm/potatojw_upgraded')">GitHub</span>
      <span class="pjw-mini-button" onclick="window.open('https://cubiccm.ddns.net/2019/09/potatojw-upgraded')">v${pjw_version}</span>
      <span class="pjw-mini-button" style="color: darkred;" onclick="window.location.href='exit.do?type=student'">退出登录</span>`);

  console.log("potatoplus v" + pjw_version + " by Limosity");

  if (pjw_mode == "") return;

  console.log(pjw_mode + " mode activated");

  if (store.get("login_settings") != null && store.get("login_settings").share_stats == true) {
    $$("head").append($$(google_analytics_js));
  }

  var subclass_mode_list = {};
  var pjw_classlist_mode_list = {"dis_view": true, "open_view": true, "all_course_list": true, "dis": true, "open": true, "common": true, "public": true};
  var filter_mode_list = subclass_mode_list;

  const custom_toolbar_html = {
    main_page: `
      <h5>v` + pjw_version + ` 更新说明</h5>
      <ul>
        <li>^> 全新课程列表</li>
      </ul>
    `,
    freshmen_exam: `
      <span class="pjw-mini-button" onclick="autoSolve();">开始自动答题</span>
      <span>若答题意外停止，请再次点击自动答题按钮。</span>
    `,
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
    grade_info: `
      <input type="checkbox" id="hide_grade" class="grade_info_settings" checked="checked">
      <label for="hide_grade">默认隐藏成绩</label>
      <span id="show_all_grade" class="pjw-mini-button">显示全部成绩</span>
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
        <section>
          <input type="checkbox" id="auto_select" disabled="disabled">
          <label for="auto_select" style="font-weight: bold;">自动选课</label>
        </section>
      </div>
    `,
    default: `<span>正在此页面上运行。</span>`
  };

  const about_this_project = `
  <span style="user-select: text;">potatoplus v` + pjw_version + `</span> &nbsp; <a style="color: #dedede;" href="https://github.com/cubiccm/potatojw_upgraded" target="_blank">[GitHub]</a> &nbsp;
  <a style="color: #dedede;" href="https://cubiccm.ddns.net/2019/09/potatojw-upgraded/" target="_blank">[About]</a>
  `;

  if (pjw_mode != "" && !(pjw_mode in pjw_classlist_mode_list))
    $$("body").append(`<div id='pjw-toolbar'><div id="pjw-toolbar-content">` +
        custom_toolbar_html[(pjw_mode in filter_mode_list ? "filter" : (pjw_mode in custom_toolbar_html ? pjw_mode : "default"))]
    + `<div class="about-proj"></div></div></div>`);

  const toolbar_button_html = `
  <div id="pjw-toolbar-collapse-bg"><canvas id="pjw-toolbar-collapse" width="30px" height="30px"></canvas></div>
  `;
  $$("#pjw-toolbar").prepend(toolbar_button_html);

  if (pjw_mode in pjw_classlist_mode_list)
    ClassListPlugin();
  else {
    (function() {
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
    })();
  }

  // Storage upgrade
  function checkStorageVersion() {
    if (store.get("version") == null || store.get("version") != pjw_version)
      return false;
    return true;
  }
  
  if (!checkStorageVersion()) {
    store.set("is_toolbar_collapsed", false);
    store.set("version", pjw_version);
  }


  if (pjw_mode == "main_page") {
    if (typeof(window.alert_data) != "undefined") {
      $$("#pjw-toolbar-content").prepend("<h5>教务网通知</h5><span>" + window.alert_data + "</span><br>");
    }
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

    // if ($$("option[value=20202]").length == 0)
      // $$("#termList > option:eq(0)").after('<option value="20201">2020-2021学年第二学期(*pjw+)</option>');

    window.list = new PJWClassList($$("body"));

    window.searchCourseList = function() {
      list.refresh(true);
    };

    list.parse = function(data) {
      return new Promise((resolve, reject) => {
        try {
          $$("body").append("<div id='ghost-div' style='display:none;'>" + data + "</div>");
          var table = $$("#ghost-div").find("table.TABLE_BODY > tbody");
          table.find("tr:gt(0)").each((index, val) => {
            var res = parseClassTime($$(val).children("td:eq(8)").html());
            data = {
              title: $$(val).children("td:eq(1)").html(),
              teachers: parseTeacherNames($$(val).children("td:eq(7)").html()),
              info: [{
                key: "课程编号",
                val: $$(val).children('td:eq(0)').html()
              }, {
                key: "课程性质",
                val: $$(val).children('td:eq(2)').html(),
                hidden: true
              }, {
                key: "开课院系",
                val: $$(val).children('td:eq(3)').html(),
                hidden: true
              }, {
                key: "校区",
                val: $$(val).children('td:eq(6)').html(),
                hidden: true
              }],
              num_info: [{
                num: parseInt($$(val).children("td:eq(4)").html()),
                label: "学分"
              }, {
                num: parseInt($$(val).children("td:eq(5)").html()),
                label: "学时"
              }],
              lesson_time: res.lesson_time,
              class_weeknum: res.class_weeknum,
              select_button: {
                status: false
              },
              comment_button: {
                status: true,
                text: (Math.random() * 10).toFixed(1)
              }
            };
            list.add(data);
          });
          list.update();
          window.mdc.autoInit();
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
        $$.ajax({
          type: "GET",
          url: "/jiaowu/student/teachinginfo/allCourseList.do",
          data: {
            method: "getCourseList",
            curTerm: sel.term.val(),
            curGrade: sel.grade.val(),
            curSpeciality: major_code
          }
        }).done((data) => {
          this.parse(data);
          resolve();
        }).fail((data) => {
          reject("Failed to request data: " + data);
        });
      });
    }

    $$("#academySelect > option:eq(0)").html("全部院系");
    $$("#academySelect > option:eq(0)").val("00");

    list.selectors = {
      term: new PJWSelect("termList", "学期", list.heading.children(".pjw-classlist-selectors")),
      grade: new PJWSelect("gradeList", "年级", list.heading.children(".pjw-classlist-selectors")),
      institution: new PJWSelect("academySelect", "院系", list.heading.children(".pjw-classlist-selectors"), 0),
      major: new PJWSelect("specialitySelect", "专业", list.heading.children(".pjw-classlist-selectors"))
    };

    $$("table").remove();

    window.reloadMajor = function(e) {
      list.selectors.major.clear();  
      for (var item of academySelectgroup[parseInt(list.selectors.institution.obj.selectedIndex)]) {
        if (item.value != "")
          list.selectors.major.addItem(item);
      }
    };

    // 自动获取年级及专业
    function autofillInfo() {
      var stu_info = store.get("stu_info");
      var stu_grade = stu_info.grade, stu_dept = stu_info.department, stu_major = stu_info.major;
      var sel = list.selectors;
      sel.grade.setByText(stu_grade);
      sel.institution.setByText(stu_dept);
      reloadMajor();
      sel.major.setByText(stu_major);
      list.refresh();
      fillCompleted();
    }

    function fillCompleted() {
      list.selectors.term.onchange( (e) => { list.refresh(); } );
      list.selectors.grade.onchange( (e) => { list.refresh(); } );
      list.selectors.major.onchange( (e) => { 
        if (e.detail.index == -1) return;
        list.refresh();
      } );
      list.selectors.institution.onchange( (e) => {
        if (list.selectors.institution.obj.selectedIndex == 0) {
          list.selectors.major.dom.hide();
          list.clear();
          list.refresh();
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

  } else if (pjw_mode == "freshmen_exam") {
    window.findSelection = function(pos) {
      var sel_A = lib.lastIndexOf('A', pos);
      var sel_B = lib.lastIndexOf('B', pos);
      var sel_C = lib.lastIndexOf('C', pos);
      var sel_D = lib.lastIndexOf('D', pos);
      return Math.max(sel_A, sel_B, sel_C, sel_D);
    };

    window.problemNum = function(pos) {
      return lib.substr(0, pos - 1).split('\n').length;
    };

    window.prob_times = new Array();

    window.solve = function() {
      for (var i = 0; i < 4; i++) {
        var cont = $$("fieldset > div:eq(" + i + ")").html();
        var start_pos = 0;
        if (cont.length > 80) start_pos = 15;
        while (lib.indexOf(cont.substr(start_pos, 12)) == -1) {
          start_pos += 10;
          if (start_pos > cont.length) {
            console.log("PROBLEM NOT FOUND");
            return false;
          }
        }
        var sel_pos = findSelection(lib.indexOf(cont.substr(start_pos, 12)));
        var sel_cont = lib.slice(sel_pos + 2, lib.indexOf(';', sel_pos + 2));
        var found_sel = false;
        for (var j = 0; j < 4; j++) {
          real_sel_cont = $$("li:eq(" + (i*4 + j) +  ")").html();
          if (real_sel_cont.substr(real_sel_cont.indexOf(')') + 1).replace(/\s+/g,"") == sel_cont.replace(/\s+/g,"")) {
            found_sel = true;
            $$("input[type='radio']:eq(" + (i*4 + j) + ")").click();
            console.log("#" + problemNum(sel_pos) + ": " + String.fromCharCode('A'.charCodeAt() + j));
            if (typeof(prob_times[problemNum(sel_pos)]) == "undefined") {
              prob_times[problemNum(sel_pos)] = 1;
            } else {
              prob_times[problemNum(sel_pos)]++;
              console.log("WARNING: PROBLEM REPEATED: #" + problemNum(sel_pos));
              return false;
            }
            break;
          }
        }
        if (found_sel == false) {
          console.log("SELECTION NOT FOUND: " + $$.trim(sel_cont));
          return false;
        }
      }
      return true;
    };

    window.autoSolve = function() {
      if (solve()) {
        getnextpage();
        if (parseInt($$("#currentpage").val()) == 20) {
          console.log(prob_times);
          console.log("Done.");
          return true;
        }
        window.setTimeout(autoSolve, 1000);
      } else {
        return false;
      }
    };
  } else if (pjw_mode == "gym") {
    window.list = new PJWClassList($$("body"));

    list.select = function(classID) {
      return new Promise((resolve, reject) => {
        var campus = this.selectors.campus.val();
        var target = this;
        $$.ajax({
          url: "/jiaowu/student/elective/selectCourse.do",
          data: "method=addGymSelect&classId=" + classID,
          type: "POST"
        }).done(function(res) {
          console.log(res);
          // if ($$("#errMsg").length == 0)
          //   resolve();
          // else
          //   reject();
        }).fail((res) => {
          reject(res);
        });
      });
    }


    list.parse = function(data) {
      return new Promise((resolve, reject) => {
        try {
          var table = $$(data).find("table#tbCourseList");
          table.find("tbody").each((index, val) => {
            if ($$(val).css("display") == "none") return;
            $$(val).find("tr").each((index, val) => {
              var res = parseClassTime($$(val).children("td:eq(4)").html());
              if ($$(val).children("td:eq(9)").html() != "") select_status = "Available";
              else select_status = "Full";
              var classID = $$(val).children("td:eq(9)").children("input").val();
              data = {
                title: $$(val).children("td:eq(2)").html(),
                teachers: parseTeacherNames($$(val).children("td:eq(5)").html()),
                info: [{
                  key: "课程编号",
                  val: $$(val).children('td:eq(0)').html(),
                  hidden: false
                }, {
                  key: "备注",
                  val: $$(val).children('td:eq(8)').html(),
                  hidden: true
                }],
                num_info: [{
                  num: parseInt($$(val).children("td:eq(3)").html()),
                  label: "学分"
                }],
                lesson_time: res.lesson_time,
                class_weeknum: res.class_weeknum,
                select_button: {
                  status: select_status,
                  text: [`${$$(val).children("td:eq(7)").html()}/${$$(val).children("td:eq(6)").html()}`],
                  action: (e) => { e.data.target.list.select(classID); }
                },
                comment_button: {
                  status: true,
                  text: (Math.random() * 10).toFixed(1)
                }
              };
              this.add(data);
            });
          });
          this.update();
          window.mdc.autoInit();
          resolve();
        } catch(e) {
          reject(e);
        }
      });
    }

    list.load = function() {
      return new Promise((resolve, reject) => {
        $$.ajax({
          url: "/jiaowu/student/elective/courseList.do",
          data: "method=gymCourseList",
          type: "POST"
        }).done((data) => {
          this.parse(data);
          resolve();
        }).fail((data) => {
          reject("Failed to request data: " + data);
        });
      });
    }
  } else if (pjw_mode == "read") {
    // Submit reading class selection request
    // 提交阅读选课
    window.readSelect = function(event, class_ID, is_delete = false) {
      $$.ajax({
        url: "/jiaowu/student/elective/selectCourse.do",
        data: 'method=readCourse' + (is_delete ? 'Delete' : 'Select') + '&classid=' + class_ID,
        type: "POST",
        success: function(res) {
          $$("#courseDetail").html(res);
          $$('#courseOperation').html(res);
          if ($$("#errMsg").length == 0)
            console.log("Message: " + $$("#errMsg").attr("title"));
          else if ($$("#successMsg").length == 0)
            console.log("Error: " + $$("#successMsg").attr("title"));
          readTypeChange();
        }
      });
    };

    // Load reading class list
    // 加载阅读课列表
    window.initClassList = function(success_func = function() {}){
      var type;
      if ($$('#readRenewType').length == 0) type = 7;
      else type = $$('#readRenewType')[0].options[$$('#readRenewType')[0].selectedIndex].value;
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do",
        data: 'method=readRenewCourseList&type=' + type,
        type: "POST",
        success: function(res) {
          $$("#courseList").html(res);
          applyFilter();
          success_func();
        }
      });
    };

    // Detect reading type filter change
    // 检测阅读类型过滤器更新
    window.readTypeChange = function() {
      initClassList(function() {
        hideCourseDetail();
        doAutoClassSelect();
      });
    };

    window.isClassFull = function(element) {
      return parseInt($$(element).children("td:eq(5)").html()) >= parseInt($$(element).children("td:eq(4)").html());
    };

    // Drop a reading class
    // 退选阅读课
    window.readDelete = function(event, class_ID) {
      readSelect(event, class_ID, true);
    };

    $$(document).ready(function() {
      $$("#comment").html("[potatoplus Notice]<br>悦读经典功能可能暂时无法使用<br>如影响到手动选课，可在插件菜单中暂时关闭potatoplus<br><br>" + $$("#comment").html());
    });
  } else if (pjw_mode == "common") {
    window.list = new PJWClassList($$("body"));

    window.selectedClass = function(classID, class_kind) {
      return [classID, class_kind];
    };

    list.select = function(classID, class_kind) {
      return new Promise((resolve, reject) => {
        var target = this;
        $$.ajax({
          url: "/jiaowu/student/elective/courseList.do?method=submitCommonRenew&classId=" + classID + "&courseKind=" + class_kind,
          type: "GET"
        }).done(function(res) {
          res = res.slice(res.search("function initSelectedList()"));
          var start = res.search(/\"*\"/);
          var end = res.search(/\"\)/);
          res = res.slice(start + 1, end);
          console.log(res);
          if (res.search("成功！") != -1)
            target.refresh();
          resolve();
        }).fail((res) => {
          reject(res);
        });
      });
    }

    list.parse = function(data) {
      return new Promise((resolve, reject) => {
        try {
          var table = $$(data).find("table > tbody");
          table.find("tr:gt(0)").each((index, val) => {
            var res = parseClassTime($$(val).children("td:eq(4)").html());
            var classID = "0", class_kind = "13";
            if ($$(val).children("td:eq(9)").html() != "") {
              select_status = "Available";
              var parse_class_res = Function($$(val).children("td:eq(9)").children("a").attr("href").replace("javascript:", "return "))();
              classID = parse_class_res[0], class_kind = parse_class_res[1];
            } else {
              select_status = "Full";
            }
            
            data = {
              title: $$(val).children("td:eq(2)").html(),
              teachers: parseTeacherNames($$(val).children("td:eq(5)").html()),
              info: [{
                key: "课程编号",
                val: $$(val).children('td:eq(0)').html()
              }, {
                key: "备注",
                val: $$(val).children('td:eq(8)').html(),
                hidden: true
              }],
              num_info: [{
                num: parseInt($$(val).children("td:eq(3)").html()),
                label: "学分"
              }],
              lesson_time: res.lesson_time,
              class_weeknum: res.class_weeknum,
              select_button: {
                status: select_status,
                text: [`${$$(val).children("td:eq(7)").html()}/${$$(val).children("td:eq(6)").html()}`],
                action: ((e) => { e.data.target.list.select(classID, class_kind); })
              },
              comment_button: {
                status: true,
                text: (Math.random() * 10).toFixed(1)
              }
            };
            list.add(data);
          });
          list.update();
          window.mdc.autoInit();
          resolve();
        } catch(e) {
          reject(e);
        }
      });
    }

    list.load = function() {
      return new Promise((resolve, reject) => {
        $$.ajax({
          type: "GET",
          url: "/jiaowu/student/elective/courseList.do",
          data: {
            method: "commonCourseRenewList",
            courseKind: this.selectors.class_kind.val()
          }
        }).done((data) => {
          this.parse(data);
          resolve();
        }).fail((data) => {
          reject("Failed to request data: " + data);
        });
      });
    }

    list.selectors = {
      class_kind: new PJWSelect("courseKindList", "课程类型", list.heading.children(".pjw-classlist-selectors"))
    };
    list.selectors.class_kind.onchange( (e) => {
      list.refresh(true);
    } );
    list.refresh();

    $$("table#tbCourseList").remove();
    $$("#courseKindList").parent().remove();
  } else if (pjw_mode == "dis" || pjw_mode == "public") {
    window.list = new PJWClassList($$("body"));

    // Optimize class list
    (function() {
      $$("input[type='radio']").css("display", "none");
      $$("input[type='button']").css("display", "none");
      $$("input[type='radio']").each(function() {
        $$(this).after("<a onclick='selectClass(" + $$(this).attr("value") + ");'>选择</a>")
      });
    })();

    list.select = function(classID) {
      return new Promise((resolve, reject) => {
        var campus = this.selectors.campus.val();
        var target = this;
        $$.ajax({
          url: "/jiaowu/student/elective/courseList.do?method=submit" + (pjw_mode == "dis" ? "Discuss" : "Public") + "Renew&classId=" + classID + "&campus=" + campus,
          type: "GET"
        }).done(function(res) {
          res = res.slice(res.search("function initSelectedList()"));
          var start = res.search(/\"*\"/);
          var end = res.search(/\"\)/);
          res = res.slice(start + 1, end);
          console.log(res);
          if (res.search("成功！") != -1)
            target.refresh();
          resolve();
        }).fail((res) => {
          reject(res);
        });
      });
    }

    list.parse = function(data) {
      return new Promise((resolve, reject) => {
        try {
          var table = $$(data).find("table#tbCourseList");
          table.find("tbody").each((index, val) => {
            if ($$(val).css("display") == "none") return;
            $$(val).find("tr").each((index, val) => {
              var res = parseClassTime($$(val).children("td:eq(4)").html());
              if ($$(val).children("td:eq(9)").html() != "") select_status = "Available";
              else select_status = "Full";
              var classID = $$(val).children("td:eq(9)").children("input").val();
              data = {
                title: $$(val).children("td:eq(2)").html(),
                teachers: parseTeacherNames($$(val).children("td:eq(5)").html()),
                info: [{
                  key: "课程编号",
                  val: $$(val).children('td:eq(0)').html(),
                  hidden: false
                }, {
                  key: "备注",
                  val: $$(val).children('td:eq(8)').html(),
                  hidden: true
                }],
                num_info: [{
                  num: parseInt($$(val).children("td:eq(3)").html()),
                  label: "学分"
                }],
                lesson_time: res.lesson_time,
                class_weeknum: res.class_weeknum,
                select_button: {
                  status: select_status,
                  text: [`${$$(val).children("td:eq(7)").html()}/${$$(val).children("td:eq(6)").html()}`],
                  action: (e) => { e.data.target.list.select(classID); }
                },
                comment_button: {
                  status: true,
                  text: (Math.random() * 10).toFixed(1)
                }
              };
              this.add(data);
            });
          });
          this.update();
          window.mdc.autoInit();
          resolve();
        } catch(e) {
          reject(e);
        }
      });
    }

    list.load = function() {
      return new Promise((resolve, reject) => {
        $$.ajax({
          type: "GET",
          url: window.location.pathname,
          data: {
            method: (pjw_mode == "dis" ? "discuss" : "public") + "RenewCourseList",
            campus: this.selectors.campus.val()
          }
        }).done((data) => {
          this.parse(data);
          resolve();
        }).fail((data) => {
          reject("Failed to request data: " + data);
        });
      });
    }

    list.selectors = {
      campus: new PJWSelect("campusList", "校区", list.heading.children(".pjw-classlist-selectors"))
    };
    list.selectors.campus.onchange( (e) => {
      list.refresh(true);
    } );
    list.refresh();

    $$("#campusList").parent().remove();
    $$("table#tbCourseList").remove();
    $$("body > div[align=center]").children("p").remove();
  } else if (pjw_mode == "dis_view") {
    window.parse = function(data) {
      $$("body").append("<div id='ghost-div' style='display:none;'>" + data + "</div>");
      campusChange();
      var table = $$("#ghost-div").find("#tbCourseList");
      table.find("tbody").each((index, val) => {
        if ($$(val).css("display") == "none") return;
        $$(val).find("tr").each((index, val) => {
          var res = parseClassTime($$(val).children("td:eq(4)").html());
          data = {
            title: $$(val).children("td:eq(2)").html(),
            teachers: parseTeacherNames($$(val).children("td:eq(5)").html()),
            info: [{
              key: "课程编号",
              val: $$(val).children('td:eq(0)').html(),
              hidden: true
            }, {
              key: "类别",
              val: $$(val).children('td:eq(6)').html(),
              hidden: true
            }],
            num_info: [{
              num: parseInt($$(val).children("td:eq(3)").html()),
              label: "学分"
            }],
            lesson_time: res.lesson_time,
            class_weeknum: res.class_weeknum,
            select_button: {
              status: "Available",
              text: [`${$$(val).children("td:eq(8)").html()}/${$$(val).children("td:eq(7)").html()}`],
              action: (() => {})
            },
            comment_button: {
              status: true,
              text: (Math.random() * 10).toFixed(1)
            }
          };
          list.add(data);
        });
      });
      window.mdc.autoInit();
      $$("#ghost-div").remove();
    }

    window.initList = function(campus = $$("#campusList").val()) {
      if (typeof(list) != "undefined") {
        list.clear();
      } else {
        window.list = new PJWDisClassList($$("#courseList"));
      }

      $$.ajax({
        type: "POST",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: "discussGeneralCourse",
          campus: campus
        }
      }).done(function(data) {
        parse(data);
      }).fail(function(data) {
        console.log("Failed to request data: " + data);
      });
    };

    class PJWDisClassList extends PJWClassList {
      refresh() {
        initList();
      }
    }
    initList();
  } else if (pjw_mode == "open") {
    window.list = new PJWClassList($$("body"));

    window.showCourseDetailInfo = function(classID, courseNumber){
      window.open("/jiaowu/student/elective/courseList.do?method=getCourseInfoM&courseNumber="+courseNumber+"&classid="+classID);
    };

    window.selectedClass = function(classID, name) {
      return classID;
    };

    list.select = function(classID) {
      return new Promise((resolve, reject) => {
        var academy_ID = this.selectors.academy.val();
        var target = this;
        $$.ajax({
          url: "/jiaowu/student/elective/courseList.do?method=submitOpenRenew&classId=" + classID + "&academy=" + academy_ID,
          type: "GET"
        }).done(function(res) {
          res = res.slice(res.search("function initSelectedList()"));
          var start = res.search(/\"*\"/);
          var end = res.search(/\"\)/);
          res = res.slice(start + 1, end);
          console.log(res);
          if (res.search("成功！") != -1)
            target.refresh();
          resolve();
        }).fail((res) => {
          reject(res);
        });
      });
    }

    list.parse = function(data) {
      return new Promise((resolve, reject) => {
        try {
          var rows = $$(data).find("table > tbody").find("tr:gt(0)");
          rows.each((index, val) => {
            // Prepare lesson time
            var res = parseClassTime($$(val).children("td:eq(5)").html());

            // Prepare select button
            var classID = "0";
            if ($$(val).children("td:eq(9)").html() != "" && $$(val).children("td:eq(9)").html() != "&nbsp;") {
              select_status = "Available";
              classID = Function($$(val).children("td:eq(9)").children("a").attr("href").replace("javascript:", "return "))();
            } else {
              select_status = "Full";
            }

            // Construct class data
            data = {
              classID: classID,
              title: $$(val).children("td:eq(2)").html(),
              teachers: parseTeacherNames($$(val).children("td:eq(6)").html()),
              info: [{
                key: "开课年级",
                val: $$(val).children("td:eq(4)").html()
              }, {
                key: "课程编号",
                val: $$(val).children('td:eq(0)').html(),
                hidden: true
              }, {
                key: "开课院系",
                val: this.selectors.academy.text(),
                hidden: true
              }],
              num_info: [{
                num: parseInt($$(val).children("td:eq(3)").html()),
                label: "学分"
              }],
              lesson_time: res.lesson_time,
              class_weeknum: res.class_weeknum,
              select_button: {
                status: select_status,
                text: [`${$$(val).children("td:eq(8)").html()}/${$$(val).children("td:eq(7)").html()}`],
                action: ((e) => { e.data.target.list.select(classID); })
              },
              comment_button: {
                status: true,
                text: (Math.random() * 10).toFixed(1)
              }
            };

            this.add(data);
          });

          // Render DOM
          this.update();
          window.mdc.autoInit();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }

    list.load = function() {
      return new Promise((resolve, reject) => {
        $$.ajax({
          type: "GET",
          url: window.location.pathname,
          data: {
            method: "openRenewCourse",
            campus: "全部校区",
            academy: this.selectors.academy.val()
          }
        }).done((data) => {
          this.parse(data);
          resolve();
        }).fail((data) => {
          reject("Failed to request data: " + data);
        });
      });
    }

    list.selectors = {
      academy: new PJWSelect("academyList", "院系", list.heading.children(".pjw-classlist-selectors"))
    };
    list.selectors.academy.onchange( (e) => {
      list.refresh(true);
    } );
    list.refresh();

    $$("#iframeTable").remove();
    $$("#myForm").remove();
    $$("#operationInfo").remove();
  } else if (pjw_mode == "open_view") {
    window.parse = function(data) {
      $$("body").append("<div id='ghost-div' style='display:none;'>" + data + "</div>");
      var table = $$("#ghost-div").find("#tbCourseList > tbody");
      table.find("tr:gt(0)").each((index, val) => {
        var res = parseClassTime($$(val).children("td:eq(5)").html());
        data = {
          title: $$(val).children("td:eq(2)").html(),
          teachers: parseTeacherNames($$(val).children("td:eq(6)").html()),
          info: [{
            key: "开课年级",
            val: $$(val).children("td:eq(4)").html()
          }, {
            key: "课程编号",
            val: $$(val).children('td:eq(0)').html(),
            hidden: true
          }, {
            key: "开课院系",
            val: $$("#academyList option:selected"),
            hiddden: true
          }],
          num_info: [{
            num: parseInt($$(val).children("td:eq(3)").html()),
            label: "学分"
          }],
          lesson_time: res.lesson_time,
          class_weeknum: res.class_weeknum,
          select_button: {
            status: "Available",
            text: [`${$$(val).children("td:eq(8)").html()}/${$$(val).children("td:eq(7)").html()}`, `专业意向：${$$(val).children("td:eq(9)").html()}`],
            action: (() => {})
          },
          comment_button: {
            status: true,
            text: (Math.random() * 10).toFixed(1)
          }
        };
        list.add(data);
      });
      window.mdc.autoInit();
      $$("#ghost-div").remove();
    }

    window.loadClassList = function(academy = $$("#academyList").val()) {
      if (typeof(list) != "undefined") {
        list.clear();
      } else {
        $$("div#course").css("display", "none");
        window.list = new PJWOpenClassList($$("#courseList"));
      }
      
      $$.ajax({
        type: "POST",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: "opencourse",
          campus: "全部校区",
          academy: academy
        }
      }).done(function(data) {
        parse(data);
      }).fail(function(data) {
        console.log("Failed to request data: " + data);
      });
    };

    class PJWOpenClassList extends PJWClassList {
      refresh() {
        loadClassList();
      }
    }

    window.campusChange = loadClassList;
  } else if (pjw_mode == "major_course") {
    /*
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
    });*/
  } else if (pjw_mode == "login_page") {
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
      if ($$("#userName").val().length == 0)
        $$("#userName").val(login_info.username);
      if ($$("#password").val().length == 0)
        $$("#password").val(login_info.password);
    }
    $$("form[action=\"login.do\"]").attr("onsubmit", "");
    $$("form[action=\"login.do\"]").on("submit", function() {
      login_settings = store.get("login_settings");
      if (CheckForm()) {
        if (login_settings["store_login_info"] == true) {
          var login_info = {
            username: $$("#userName").val(),
            password: $$("#password").val()
          }
          store.set("login_info", login_info);
        }
        return true;
      } else {
        return false;
      }
    });

    // CAPTCHA auto-fill
    CAPTCHAPlugin();

    function fillCAPTCHA() {
      login_settings = store.get("login_settings");
      if (login_settings["solve_captcha"] == false) return;
      var res = solveCAPTCHA($$("#ValidateImg")[0]);
      if (res === false) {
        $$("#ValidateCode").val("Please wait...");
        RefreshValidateImg('ValidateImg');
      } else {
        $$("#ValidateCode").val(res);
      }
    }
    if ($$("#ValidateImg")[0].complete) {
      fillCAPTCHA();
    }
    $$("#ValidateImg").on("load", function() {
      fillCAPTCHA();
    });
  } else if (pjw_mode == "grade_info") {
    function hideGrade() {
      var targ = $$("table.TABLE_BODY:eq(0) > tbody > tr:gt(0)").find("td:eq(6)");
      targ.each(function() {
        var t = $$(this);
        if (t.children("ul").length == 0) {
          var orig = t.html();
          t.html("");
          t.append("<ul></ul>");
          t.children("ul").html(orig);
        }
        t = t.children("ul");
        t.attr("data-grade", t.html());
        t.attr("data-grade-color", t.css("color"));
        t.attr("class", "grade-label");
        t.html("***");
        t.css("color", "black");
        t.css("cursor", "pointer");
        t.css("user-select", "none");
        t.on("click", function() {
          t.html(t.attr("data-grade"));
          t.css("color", t.attr("data-grade-color"));
          t.css("cursor", "auto");
          t.css("font-weight", "bold");
          t.css("user-select", "auto");
        });
      });
      $$("table.TABLE_BODY:eq(0) > tbody > tr:eq(0) > th:eq(6)").css("cursor", "pointer");
      $$("table.TABLE_BODY:eq(0) > tbody > tr:eq(0) > th:eq(6)").on("click", function() {
        $$(".grade-label").trigger("click");
        $$("table.TABLE_BODY:eq(0) > tbody > tr:eq(0) > th:eq(6)").css("cursor", "auto");
      });

      $$("table:eq(0) > tbody > tr:eq(1) > td:eq(3) > div:eq(0)").append(`<p style="margin: 0;">成绩已被隐藏</p><p style="margin: 0; color: gray;">单击以显示，或单击表格头部“总评”显示全部。</p>`);
    }
    function showGrade() {
      $$("table.TABLE_BODY:eq(0) > tbody > tr:eq(0) > th:eq(6)").trigger("click");
    }
    if (store.get("grade_info_settings") == null) {
      store.set("grade_info_settings", true);
    }
    if (store.get("grade_info_settings") == true) {
      hideGrade();
    } else {
      $$("#hide_grade").prop("checked", false);
      $$("#show_all_grade").css("display", "none");
    }
    $$("#hide_grade").on("change", function() {
      store.set("grade_info_settings", $$("#hide_grade").prop("checked"));
    });
    $$("#show_all_grade").on("click", function() {
      showGrade();
    });
    $$("table.TABLE_BODY").css("display", "table");

    if (window.location.href.search("termCode") == -1) {
      window.location.href = $$("table:eq(0) > tbody > tr:eq(1) > td:eq(1) > div > table > tbody > tr:eq(2) > td > a").attr("href");
    }
  } else return;

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
  gtag('event', 'version_dimension', {'version': pjw_version});
</script>
`;

(function() {
  if (document.readyState == "complete")
    potatojw_intl();
  else
    window.addEventListener("load", potatojw_intl);
})();