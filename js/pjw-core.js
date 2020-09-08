var potatojw_intl = function() {
  window.pjw_version = "0.2 beta";
  window.$$ = jQuery.noConflict();

  console.log("potatoplus v" + pjw_version + " by Limosity");
  console.log(pjw_mode + " mode activated");

  var head_metadata = `
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
  `;
  $$("head").prepend(head_metadata);

  if (store.get("login_settings") != null && store.get("login_settings").share_stats == true) {
    $$("head").append($$(google_analytics_js));
  }

  var subclass_mode_list = {"gym": 1, "read": 2, "common": 3, "dis": 4, "open": 5, "major_course": 6};
  subclass_mode_list = {};
  var pjw_classlist_mode_list = {"dis_view": true, "open_view": true, "all_course_list": true, "dis": true, "open": true};
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
        <span>自动选课打开后，potatojw将按照此处设置的过滤器选课。</span>
        <br>
        <span>上课时间过滤器暂不能储存，刷新页面后会消失。</span>
        <br>
        <span>打开开发者界面（F12 / Command + Shift + I）的控制台（Console）可查看输出信息</span>
        <br>
        <div class="about-proj"></div>
      </div>
    `;
    $$("body").append(filter_setting_html);
  }
  if (pjw_mode != "")
    $$("body").append(`<div id='pjw-toolbar'><div id="pjw-toolbar-content">` +
        custom_toolbar_html[(pjw_mode in filter_mode_list ? "filter" : (pjw_mode in custom_toolbar_html ? pjw_mode : "default"))]
    + `<div class="about-proj"></div></div></div>`);

  const toolbar_button_html = `
  <div id="pjw-toolbar-collapse-bg"><canvas id="pjw-toolbar-collapse" width="30px" height="30px"></canvas></div>
  `;
  $$("#pjw-toolbar").prepend(toolbar_button_html);

  if (pjw_mode in pjw_classlist_mode_list)
    ClassListPlugin();


  // Local storage
  var reset_storage_confirm = false;
  window.resetStorage = function() {
    if (reset_storage_confirm) {
      store.clearAll();
      reset_storage_confirm = false;
      $$("#reset_storage").html("重置pjw+存储");
    } else {
      $$("#reset_storage").html("确定重置？");
      reset_storage_confirm = true;
    }
  }
  if ($$("div#TopLink").length > 0)
    $$("div#TopLink").prepend(`<span style="color: rgba(74, 140, 53, .6); cursor: pointer;" onclick="resetStorage();" id="reset_storage">重置pjw+存储</span>&nbsp;&nbsp;&nbsp;&nbsp;`);

  function checkStorageVersion() {
    if (store.get("version") == null || store.get("version") != pjw_version)
      return false;
    return true;
  }

  // Storage upgrade
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
    $$("#termList > option:eq(0)").remove();
    $$("#academySelect > option:eq(0)").after('<option value="00">全部课程(*pjw+)</option>');
    $$("#academySelect > option:eq(0)").remove();

    window.searchCourseList = function(bInit) {
      if (!bInit) {
        if (document.myForm.termList.value.length == 0) {
          document.myForm.termList.focus();
          return;
        }
        if (document.myForm.gradeList.value.length == 0) {
          document.myForm.gradeList.focus();
          return;
        }
        if (document.myForm.specialitySelect.value.length == 0 && document.myForm.academySelect.value != "00") {
          document.myForm.specialitySelect.focus();
          return;
        }
      }
      loadClassList();
    };

    
    window.parse = function(data) {
      $$("body").append("<div id='ghost-div' style='display:none;'>" + data + "</div>");
      var table = $$("#ghost-div").find("table.TABLE_BODY > tbody");
      table.find("tr:gt(0)").each((index, val) => {
        var res = parseClassTime($$(val).children("td:eq(8)").html());
        data = {
          title: $$(val).children("td:eq(1)").html().split('<br>')[0],
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
      window.mdc.autoInit();
      $$("#ghost-div").remove();
    }

    window.loadClassList = function() {
      if (typeof(list) != "undefined") {
        list.clear();
      } else {
        window.list = new PJWAllClass($$("#iframeTable").parent());
      }

      $$("#iframeTable").css("display", "none");
      var url = "/jiaowu/student/teachinginfo/allCourseList.do?method=getCourseList&curTerm=" + $$("#termList").val() + "&curGrade=" + $$("#gradeList").val();
      if ($$("#academySelect").val() != "00")
        url += "&curSpeciality=" + $$('#specialitySelect').val();

      $$.ajax({
        type: "GET",
        url: url
      }).done(function(data) {
        parse(data);
        list.search(list.search_input.val());
      }).fail(function(data) {
        console.log("Failed to request data: " + data);
      });
    };

    class PJWAllClass extends PJWClassList {
      refresh() {
        loadClassList();
      }
    }


    $$("#specialitySelect").css("display", "none");
    window.academySelectredirect = function(x) {
      if (x == 0) {
        $$("#specialitySelect").css("display", "none");
      } else {
        $$("#specialitySelect").css("display", "inline-block");
      }
      for (m = academySelecttemp.options.length - 1; m > 0; m--)
          academySelecttemp.options[m] = null;
      for (i = 0; i < academySelectgroup[x].length; i++) {
          academySelecttemp.options[i] = new Option(academySelectgroup[x][i].text,academySelectgroup[x][i].value);
          if (academySelectgroup[x][i].value == '')
              academySelecttemp.options[i].selected = true;
      }
      academySelectredirect1(0);
    }

    // 自动获取年级及专业
    function autofillInfo() {
      var stu_info = store.get("stu_info");
      var stu_grade = stu_info.grade, stu_dept = stu_info.department, stu_major = stu_info.major;
      if ($$("#gradeList").find("option[value=" + stu_grade + "]").length == 1)
        $$("#gradeList").val(stu_grade);
      if ($$("#academySelect").find("option:contains(" + stu_dept + ")").length == 1) {
        $$("#academySelect").val($$("#academySelect").find("option:contains(" + stu_dept + "):eq(0)").val());
        academySelectredirect($$("#academySelect")[0].options.selectedIndex);
        if ($$("#specialitySelect").find("option:contains(" + stu_major + ")").length == 1)
          $$("#specialitySelect").val($$("#specialitySelect").find("option:contains(" + stu_major + "):eq(0)").val());
      }
      searchCourseList();
    }

    if (store.get("stu_info") != null && Date.now() - store.get("stu_info").last_update < 3 * 24 * 3600 * 1000) {
      autofillInfo();
    } else {
      $$.ajax({
        url: "/jiaowu/student/studentinfo/studentinfo.do?method=searchAllList",
        type: "POST",
        success: function(res) {
          window.aux_data = $$(res);
          var stu_grade = aux_data.find("div#d11 > form > table > tbody > tr:eq(4) > td:eq(3)").html();
          var stu_dept = aux_data.find("div#d11 > form > table > tbody > tr:eq(3) > td:eq(1)").html();
          var stu_major = aux_data.find("div#d11 > form > table > tbody > tr:eq(3) > td:eq(3)").html();
          store.set("stu_info", {grade: stu_grade, department: stu_dept, major: stu_major, last_update: Date.now()});
          autofillInfo();
        }
      });
    }

    window.iframeResize = function() {
      var frameCourse = document.getElementById('frameCourseView');
      frameCourse.height = frameCourse.contentWindow.document.body.scrollHeight;
      frameCourse.height = frameCourse.contentWindow.document.body.scrollHeight;
    }
    $$("#frameCourseView").on("load", function() {
      document.getElementById('btSearch').disabled = "";
      document.getElementById('operationInfo').style.visibility = "hidden";
      iframeResize();
    });
    $$(window).on("resize", function() {
      iframeResize();
    });
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
    // Submit gym class selection request
    // 提交体育选课
    window.selectedClass = function(class_ID) {
      $$.ajax({
        url: "/jiaowu/student/elective/selectCourse.do",
        data: "method=addGymSelect&classId=" + class_ID,
        type: "POST",
        success: function(res) {
          $$("#courseOperation").css("display", "none");
          $$("#courseOperation").html(res);
          if ($$("#errMsg").length) {
            console.log("Error: " + $$("#errMsg").attr("title"));
            $$("#courseOperation").html("");
          } else {
            stopAuto();
          }
          $$("#courseOperation").html("");
        }
      });
    };

    // Load gym class list
    // 加载体育课列表
    window.initClassList = function(success_func = function() {}){
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do",
        data: "method=gymCourseList",
        type: "POST",
        success: function(res) {
          $$("#courseList").html(res);
          updateFilterList();
          applyFilter();
          success_func();
        }
      });
    };

    // Check whether the class is full
    // 检查课程是否满员
    window.isClassFull = function(element) {
      return parseInt($$(element).children("td:eq(3)").html()) >= parseInt($$(element).children("td:eq(4)").html());
    };
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
    window.initClassList = function(success_func = function() {}) {
      $$.ajax({
        url: window.location.href,
        type: "GET",
        success: function(res) {
          $$("#tbCourseList").html($$(res).find("table").html());
          updateFilterList();
          applyFilter();
          success_func();
        }
      });
    };

    window.isClassFull = function(element) {
      return parseInt($$(element).children("td:eq(7)").html()) >= parseInt($$(element).children("td:eq(6)").html());
    };
  } else if (pjw_mode == "dis") {
    window.selectClass = function(class_ID) {
      console.log("Select: " + class_ID);
      var g_campus = $$('#campusList')[0].options[$$('#campusList')[0].selectedIndex].value;
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do?method=submitDiscussRenew&classId=" + class_ID + "&campus=" + g_campus,
        type: "GET",
        success: function(res) {
          console.log("Success!");
          list.refresh();
        }
      });
    }

    window.optimizeClassList = function() {
      $$("input[type='radio']").css("display", "none");
      $$("input[type='button']").css("display", "none");
      $$("input[type='radio']").each(function() {
        $$(this).after("<a onclick='selectClass(" + $$(this).attr("value") + ");'>选择</a>")
      });
    }
    
    optimizeClassList();

    window.parse = function(data) {
      var table = $$(data).find("table#tbCourseList");
      table.find("tbody").each((index, val) => {
        if ($$(val).css("display") == "none") return;
        $$(val).find("tr").each((index, val) => {
          var res = parseClassTime($$(val).children("td:eq(4)").html());
          if ($$(val).children("td:eq(9)").html() != "") select_status = "Available";
          else select_status = "Full";
          var class_ID = $$(val).children("td:eq(9)").children("input").val();
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
              action: () => { selectClass(class_ID); }
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
    }

    window.initList = function(campus = $$("#campusList").val()) {
      if (typeof(list) != "undefined") {
        list.clear();
      } else {
        window.list = new PJWDisClass($$("body > div[align=center]"));
      }

      $$.ajax({
        url: window.location.pathname,
        data: {
          method: "discussRenewCourseList",
          campus: campus
        },
        type: "GET"
      }).done(function(data) {
        parse(data);
        list.search(list.search_input.val());
      }).fail(function(data) {
        console.log("Failed to request data: " + data);
      });
    };

    class PJWDisClass extends PJWClassList {
      refresh() {
        initList();
      }
    }

    $$("table#tbCourseList").remove();
    initList();
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
            title: $$(val).children("td:eq(2)").html().split('<br>')[0],
            teachers: parseTeacherNames($$(val).children("td:eq(5)").html()),
            info: $$(val).children("td:eq(2)").html().split('<br>').slice(1).concat([ {
              key: "课程编号",
              val: $$(val).children('td:eq(0)').html(),
              hidden: true
            }, {
              key: "类别",
              val: $$(val).children('td:eq(6)').html(),
              hidden: true
            } ]),
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
        window.list = new PJWDisClass($$("#courseList"));
      }

      $$.ajax({
        type: "POST",
        url: "http://elite.nju.edu.cn/jiaowu/student/elective/courseList.do",
        data: {
          method: "discussGeneralCourse",
          campus: campus
        }
      }).done(function(data) {
        parse(data);
        list.search(list.search_input.val());
      }).fail(function(data) {
        console.log("Failed to request data: " + data);
      });
    };

    class PJWDisClass extends PJWClassList {
      refresh() {
        initList();
      }
    }
    initList();
  } else if (pjw_mode == "open") {
    window.showCourseDetailInfo = function(classId, courseNumber){
      window.open("/jiaowu/student/elective/courseList.do?method=getCourseInfoM&courseNumber="+courseNumber+"&classid="+classId);
    };

    window.selectedClass = function(class_ID, name) {
      return class_ID;
    };

    window.selectClass = function(class_ID) {
      var academy_ID = $$('#academyList').val();
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do?method=submitOpenRenew&classId=" + class_ID + "&academy=" + academy_ID,
        type: "GET",
        success: function(res) {
          console.log("Result: " + (res.search("课程选择成功！") == -1 ? "failed" : "success"));
          list.refresh();
        }
      });
    }

    window.parse = function(data) {
      var table = $$(data).find("table > tbody");
      table.find("tr:gt(0)").each((index, val) => {
        var res = parseClassTime($$(val).children("td:eq(5)").html());
        var class_ID = "0";
        if ($$(val).children("td:eq(9)").html() != "") {
          select_status = "Available";
          class_ID = Function($$(val).children("td:eq(9)").children("a").attr("href").replace("javascript:", "return "))();
        } else {
          select_status = "Full";
        }
        
        data = {
          title: $$(val).children("td:eq(2)").html().split('<br>')[0],
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
            val: $$(`#academyList option[value=${$$("#academyList").val()}]`).html(),
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
            action: ((e) => { selectClass(class_ID); })
          },
          comment_button: {
            status: true,
            text: (Math.random() * 10).toFixed(1)
          }
        };
        list.add(data);
      });
      window.mdc.autoInit();
    }

    window.loadClassList = function(academy = $$("#academyList").val()) {
      if (typeof(list) != "undefined") {
        list.clear();
      } else {
        window.list = new PJWOpenClass($$("#iframeTable").parent());
        $$("#iframeTable").html("");
      }
      
      $$.ajax({
        type: "GET",
        url: "http://elite.nju.edu.cn/jiaowu/student/elective/courseList.do",
        data: {
          method: "openRenewCourse",
          campus: "全部校区",
          academy: academy
        }
      }).done(function(data) {
        parse(data);
        list.search(list.search_input.val());
      }).fail(function(data) {
        console.log("Failed to request data: " + data);
      });
    };
    
    window.campusChange = window.searchCourseList = loadClassList;

    class PJWOpenClass extends PJWClassList {
      refresh() {
        loadClassList();
      }
    }
  } else if (pjw_mode == "open_view") {
    window.parse = function(data) {
      $$("body").append("<div id='ghost-div' style='display:none;'>" + data + "</div>");
      var table = $$("#ghost-div").find("#tbCourseList > tbody");
      table.find("tr:gt(0)").each((index, val) => {
        var res = parseClassTime($$(val).children("td:eq(5)").html());
        data = {
          title: $$(val).children("td:eq(2)").html().split('<br>')[0],
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
        window.list = new PJWOpenClass($$("#courseList"));
      }
      
      $$.ajax({
        type: "POST",
        url: "http://elite.nju.edu.cn/jiaowu/student/elective/courseList.do",
        data: {
          method: "opencourse",
          campus: "全部校区",
          academy: academy
        }
      }).done(function(data) {
        parse(data);
        list.search(list.search_input.val());
      }).fail(function(data) {
        console.log("Failed to request data: " + data);
      });
    };

    class PJWOpenClass extends PJWClassList {
      refresh() {
        loadClassList();
      }
    }

    window.campusChange = loadClassList;
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

  if (pjw_mode in filter_mode_list) {
    window.select_class_button_index = {
      "gym": 5,
      "read": 6,
      "common": 9,
      "dis": 10,
      "open": 9
    };

    window.class_name_index = {
      "gym": 0,
      "read": 1,
      "common": 2,
      "dis": 2,
      "open": 2,
      "major_course": -1
    };

    window.teacher_name_index = {
      "dis": 5,
      "open": 6,
      "common": 5,
      "major_course": -1
    };

    window.class_time_index = {
      "gym": 1,
      "common": 4,
      "dis": 4,
      "open": 5
    };

    if (store.get("filter_settings_" + pjw_mode) == null 
        || store.get("filter_settings_" + pjw_mode) == "")
      window.filter_settings = {};
    else
      window.filter_settings = store.get("filter_settings_" + pjw_mode);

    window.showFilter = function(filter_name) {
      $$("#filter_" + filter_name).css("display", "block");
    }

    if (typeof(class_name_index[pjw_mode]) != "undefined")
      showFilter("class_name");
    if (typeof(teacher_name_index[pjw_mode]) != "undefined")
      showFilter("teacher_name");
    if (typeof(class_time_index[pjw_mode]) != "undefined")
      showFilter("time");
    if (typeof(isClassFull) != "undefined")
      showFilter("full_class");

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
  }

  if (pjw_mode in subclass_mode_list) {
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
    }

    window.getAllClassDOM = function() {
      return (pjw_mode == "open" ? $$("div#tbCourseList > tbody > tr:gt(0)") : $$("table#tbCourseList:eq(0) > tbody > tr"));
    }

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
    }

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
    }

    window.frequencyUpdate = function() {
      window.auto_refresh_frequency = 1.0 / (1.0 + parseInt($$("#auto_refresh_frequency").val()) / 25);
      if (window.auto_refresh_interval_id != -1) {
        stopAutoRefresh();
        startAutoRefresh();
      }
    }

    // Select class automatically based on filter
    window.doAutoClassSelect = function() {
      if (auto_select_switch == false) return;
      getAllClassDOM().each(function() {
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

  // Initiate toolbar
  $$(".about-proj").html(about_this_project);

  // Draw collapse button
  (function() {
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
  })();

  // Collapse / Expand toolbar
  (function() {
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
};


function loadScript(url, callback = () => {}, failed = () => {}) {
  var script = document.createElement('script');
  script.type = "text/javaScript";
  script.onload = function() {
    callback();
  };
  script.onerror = function() {
    failed();
  };
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

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
  window.addEventListener("load", potatojw_intl);
})();


