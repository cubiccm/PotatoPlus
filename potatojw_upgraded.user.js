// ==UserScript==
// @name         potatojw_upgraded
// @namespace    https://cubiccm.ddns.net
// @version      0.1.1.1
// @description  土豆改善工程！
// @author       Limosity
// @match        *://*.nju.edu.cn/jiaowu/*
// @match        *://219.219.120.46/jiaowu/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==

window.potatojw_intl = function() {
  var $$ = jQuery.noConflict();
  console.log("potatojw_upgraded v0.1.1.1 by Limosity");
  console.log("jQuery version " + $$.fn.jquery);
  $$("head").append('<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">');
  var reg_gym = /gymClassList.do/i;
  var reg_read = /readRenewCourseList.do/i;
  var reg_dis = /discussRenewCourseList/i;
  var reg_open = /openRenewCourse/i;
  var reg_common = /commonCourseRenewList/i;
  var reg_freshmen_exam = /student\/exam\/index.do/i;
  var reg_all_course_list = /teachinginfo\/allCourseList.do\?method=getTermAcademy/i;
  var reg_eval_course = /evalcourse\/courseEval.do\?method=currentEvalCourse/i;
  var reg_major_course = /student\/elective\/specialityCourseList.do/i;
  var reg_main_page = /(\/jiaowu\/student\/index.do|\/jiaowu\/login.do)/i;

  var mode = "";
  if (reg_main_page.test(window.location.href)) mode = "main_page"; // 主页
  else if (reg_gym.test(window.location.href)) mode = "gym"; // 体育补选
  else if (reg_read.test(window.location.href)) mode = "read"; // 经典导读读书班补选
  else if (reg_dis.test(window.location.href)) mode = "dis"; // 导学、研讨、通识课补选
  else if (reg_open.test(window.location.href)) mode = "open"; // 跨专业补选
  else if (reg_common.test(window.location.href)) mode = "common"; // 通修课补选
  else if (reg_freshmen_exam.test(window.location.href)) mode = "freshmen_exam"; // 新生测试
  else if (reg_all_course_list.test(window.location.href)) mode = "all_course_list"; // 全校课程
  else if (reg_eval_course.test(window.location.href)) mode = "eval_course"; // 课程评估
  else if (reg_major_course.test(window.location.href)) mode = "major_course"; // 专业选课
  else return;

  if (mode == "main_page") {
  } else if (mode == "eval_course") {
    window.quick_eval_mode_enabled = false;
    window.updateEval = function(){
      document.getElementById("td" + g_evlId).innerHTML = quick_eval_mode_enabled ? "已自动五星好评" : "已评";
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

    window.showEvalItem = function(id){
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
        $$("#toggle_auto_eval_button").html("启用自动评价模式");
      } else {
        quick_eval_mode_enabled = true;
        $$("#toggle_auto_eval_button").html("停用自动评价模式");
      }
    };
  } else if (mode == "all_course_list") {
    if ($$("option[value=20192]").length == 0)
      $$("#termList > option:eq(0)").after('<option value="20192">*2019-2020学年第二学期</option>');
    $$("#termList > option:eq(0)").remove();
    $$("#academySelect > option:eq(0)").after('<option value="00">*全部课程</option>');
    $$("#academySelect > option:eq(0)").remove();
    window.searchCourseList = function(bInit) {
      if (!bInit) {
        if (document.myForm.termList.value.length == 0) {
          alert("请选择学期！");
          document.myForm.termList.focus();
          return;
        }
        if (document.myForm.gradeList.value.length == 0) {
          alert("请先选择您的年级~");
          document.myForm.gradeList.focus();
          return;
        }
        if (document.myForm.specialitySelect.value.length == 0 && document.myForm.academySelect.value != "00") {
          alert("请选择上课专业！");
          document.myForm.specialitySelect.focus();
          return;
        }
      }
      document.getElementById('frameCourseView').height="25";
      document.getElementById('iframeTable').style.height="25";
      document.getElementById('btSearch').disabled = "disabled";
      document.getElementById('operationInfo').style.visibility = "visible";

      if ($$("#academySelect").val() == "00")
        frames['frameCourseView'].location.href="http://elite.nju.edu.cn:80/jiaowu/"
        +"student/teachinginfo/allCourseList.do?method=getCourseList&curTerm="+document.getElementById('termList').value
        +"&curGrade="+document.getElementById('gradeList').value;
      else
        frames['frameCourseView'].location.href="http://elite.nju.edu.cn:80/jiaowu/"
        +"student/teachinginfo/allCourseList.do?method=getCourseList&curTerm="+document.getElementById('termList').value
        +"&curSpeciality="+document.getElementById('specialitySelect').value
        +"&curGrade="+document.getElementById('gradeList').value;
    };
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
              academySelecttemp.options[i].selected = true
      }
      academySelectredirect1(0)
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
    })
    $$(window).on("resize", function() {
      iframeResize();
    });
  } else if (mode == "freshmen_exam") {
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
  } else if (mode == "gym") {
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
  } else if (mode == "read") {
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
      $$("#comment").html("[potatojw_upgraded Notice]<br>悦读经典功能可能暂时无法使用<br>如影响到手动选课，可在插件菜单中暂时关闭potatojw_upgraded<br><br>" + $$("#comment").html());
    });
  } else if (mode == "common") {
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
  } else if (mode == "dis") {
    window.selectClass = function(class_ID) {
      console.log("Select: " + class_ID);
      var g_campus = $$('#campusList')[0].options[$$('#campusList')[0].selectedIndex].value;
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do?method=submitDiscussRenew&classId=" + classId + "&campus=" + g_campus,
        type: "GET",
        success: function(res) {
          console.log("Success!");
          stopAuto();
          initClassList();
        }
      });
    }

    window.optimizeClassList = function() {
      $$("input[type='radio']").css("display", "none");
      $$("input[type='button']").css("display", "none");
      $$("input[type='radio']").each(function() {
        $$(this).after("<a onclick='selectClass(" + $$(this).attr("value") + ");'>选择</a>")
      });
      updateFilterList();
    }

    $$(document).ready(function() {
      optimizeClassList();
    });

    window.initClassList = function(success_func = function() {}) {
      $$.ajax({
        url: window.location.href,
        type: "GET",
        success: function(res) {
          $$("#tbCourseList").html($$(res).find("table").html());
          optimizeClassList();
          applyFilter();
          success_func();
        }
      });
    };

    window.isClassFull = function(element) {
      return parseInt($$(element).children("td:eq(7)").html()) >= parseInt($$(element).children("td:eq(6)").html());
    };
  } else if (mode == "open") {
    window.showCourseDetailInfo = function(classId, courseNumber){
      window.open("/jiaowu/student/elective/courseList.do?method=getCourseInfoM&courseNumber="+courseNumber+"&classid="+classId);
    };

    window.campusChange = function() {
      initClassList(doAutoClassSelect);
    };

    window.selectedClass = function(class_ID, course_name) {
      console.log("Select: " + course_name);
      var academy_ID = $$('#academyList').val();
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do?method=submitOpenRenew&classId=" + class_ID + "&academy=" + academy_ID,
        type: "GET",
        success: function(res) {
          console.log("Success!");
          stopAuto();
          initClassList();
        }
      });
    };

    window.optimizeClassList = function() {
      $$("#btSearch").attr("value", "刷 新");
      $$("#iframeTable").after(`<div id="tbCourseList"></div>`);
      $$("#iframeTable").remove();
    };

    $$(document).ready(function() {
      optimizeClassList();
    });

    window.initClassList = function(success_func = function() {}) {
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do?method=openRenewCourse&campus="+document.getElementById('campusList').value+"&academy="+document.getElementById('academyList').value,
        type: "GET",
        success: function(res) {
          $$("#tbCourseList").html($$(res).find("table.TABLE_BODY").html());
          updateFilterList();
          applyFilter();
          success_func();
        }
      });
    };

    window.searchCourseList = function(truenmn) {
      initClassList(doAutoClassSelect);
    };

    window.isClassFull = function(element) {
      return parseInt($$(element).children("td:eq(8)").html()) >= parseInt($$(element).children("td:eq(7)").html());
    };
  } else if (mode == "major_course") {
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
      $$("#potatojw_upgraded_toolbar > label:eq(0)").css("display", "none");
    });
  } else return;

  subclass_mode_list = {"gym": 1, "read": 2, "common": 3, "dis": 4, "open": 5, "major_course": 6};
  filter_mode_list = subclass_mode_list; // Object.assign(subclass_mode_list, {"major_course": 6});

  const freshmen_exam_toolbar_html = `
<div id='potatojw_upgraded_toolbar'>
<span class="potatojw_mini_button" onclick="autoSolve();">执行自动答题模块</span>
<br>
<span><span class="about_proj"></span>若答题停止请再次点击执行按钮 浏览器F12 - Console可查看输出信息</span>
</div>
  `;

  const eval_course_toolbar_html = `
<div id='potatojw_upgraded_toolbar'>
<span class="potatojw_mini_button" onclick="toggleAutoEval();" id="toggle_auto_eval_button">启用自动评价模式</span>
<span>启用后，点一下对应课程即自动五星好评，手动修改请先停用 浏览器F12 - Console可查看输出信息</span>
<br>
<span class="about_proj"></span>
</div>
  `;

  const basic_toolbar_html = `
<div id='potatojw_upgraded_toolbar'>
<span>Activated on this page.</span>
<br>
<span class="about_proj"></span>
</div>
  `;
  const about_this_project = `
  <span style="user-select: text;">potatojw_upgraded v0.1.1.1</span> &nbsp; <a style="color: white;" href="https://github.com/cubiccm/potatojw_upgraded" target="_blank">[GitHub]</a> &nbsp;
  <a style="color: white;" href="https://cubiccm.ddns.net/2019/09/potatojw-upgraded/" target="_blank">[About]</a>
  `;
  const main_page_toolbar_html = `
    <div id='potatojw_upgraded_toolbar' style="height: auto;">
    <h5>Tips</h5>
    <ul><li>这个工具栏挡到什么东西了？试着双击来隐藏它。</li></ul>
    <br>
    <h5>v0.1.1.1 更新日志</h5>
    <ul>
      <li>^> 过滤器“空余课程”功能错误修复</li>
    </ul><br>
    <h5>近期更新</h5>
    <ul>
    <li>+> 增加自动刷新频率调整</li>
    <li>+> 增加专业选课功能</li>
    <li>+> 现在可以按照教师名过滤课程</li>
    <li>+> 增加校内网jQuery源备用</li>
    <li>+> 增加了在“全校课程”中查看一学期全部课程的功能</li>
    <li>^> 工具栏界面更新，现在双击可以收起工具栏</li>
    <li>^> 现在选到课后会自动停止自动刷新和自动选课</li>
    <li>^> 视觉及操作细节更新</li>
    </ul><br>
    <span class="about_proj"></span>
    </div>
  `
  if (mode in filter_mode_list) {
    const filter_toolbar_html = `
<div id='potatojw_upgraded_toolbar'>

<input type="checkbox" id="filter_switch">
<label for="filter_switch">打开过滤器</label>
<span class="potatojw_mini_button" id="show_filter_setting" onclick="showFilterSetting();">配置课程过滤器</span>

<input type="checkbox" id="auto_refresh">
<label for="auto_refresh" style="font-weight: bold;">自动刷新</label>

<span style="color: #c1c1c1; font-size: 11px;">标准</span>
<input type="range" id="auto_refresh_frequency" style="width: 50px; height: 15px;" value="0" onchange="frequencyUpdate();">
<span style="color: #c1c1c1; font-size: 11px;">封号退学</span>

<input type="checkbox" id="auto_select">
<label for="auto_select" style="font-weight: bold;">自动选课</label>
<br>
<span class="about_proj"></span>
</div>
    `;
    $$("body").append(filter_toolbar_html);

    const filter_setting_html = `
<div id="potatojw_mask"></div>
<div id="potatojw_filter_setting_frame">
  <section id="filter_full_class" class="filter_section">
    <input type="checkbox" id="is_filter_full_class" checked="checked">
    <label for="is_filter_full_class">仅显示空余课程</label>
  </section>
  <section id="filter_optional" class="filter_section">
    <input type="checkbox" id="filter_optional_class">
    <label for="filter_optional_class">仅显示可选课程</label>
  </section>

  <section id="filter_major" class="filter_section">
    <h3>专业过滤</h3>
    <h5>输入专业名称，将会自动选择对应专业。</h5>
    <input type="text" id="filter_major_text">
  </section>

  <section id="filter_grade" class="filter_section">
    <h3>年级过滤</h3>
    <h5>输入年级，将会自动选择对应年级。</h5>
    <input type="text" id="filter_grade_text">
  </section>

  <section id="filter_class_name" class="filter_section">
    <h3>课名过滤</h3>
    <h5>仅显示含有以下全部字符的课程</h5>
    <h5>说明：当且仅当下面输入框中的文字是课程名的连续一段文字时才会显示该课程~</h5>
    <input type="text" id="filter_class_name_text">
  </section>
  <section id="filter_teacher_name" class="filter_section">
    <h3>教师过滤</h3>
    <h5>输入教师姓名，所有不含该教师的课程都会被过滤掉。</h5>
    <input type="text" id="filter_teacher_name_text">
  </section>
  <section id="filter_time" class="filter_section">
    <h3>上课时间过滤</h3>
  </section>
  <br>
  <span class="potatojw_mini_button" onclick="hideFilterSetting();">应用设置并关闭</span>
  <br><br>
  <span>注：自动选课打开后，potatojw将按照此处设置的过滤器选课</span>
  <br>
  <span>选课提示框已关闭 字体美化已启用 浏览器F12 - Console可查看输出信息</span>
  <br>
  <span class="about_proj"></span>
</div>
    `;
    $$("body").append(filter_setting_html);
  } else if (mode == "freshmen_exam")
    $$("body").append(freshmen_exam_toolbar_html);
  else if (mode == "eval_course")
    $$("body").append(eval_course_toolbar_html);
  else if (mode == "main_page")
    $$("body").append(main_page_toolbar_html);
  else if (mode != "")
    $$("body").append(basic_toolbar_html);

  if (mode in filter_mode_list) {
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

    window.filter_settings = {};

    $$(document).ready(function() {
      if (typeof(class_name_index[mode]) != "undefined")
        showFilter("class_name");
      if (typeof(teacher_name_index[mode]) != "undefined")
        showFilter("teacher_name");
      if (typeof(class_time_index[mode]) != "undefined")
        showFilter("time");
      if (typeof(isClassFull) != "undefined")
        showFilter("full_class");
    });
    window.showFilter = function(filter_name) {
      $$("#filter_" + filter_name).css("display", "block");
    }

    window.showFilterSetting = function() {
      $$("#potatojw_mask").css("display", "block");
      $$("#potatojw_filter_setting_frame").css("display", "block");
    };

    window.hideFilterSetting = function() {
      $$("#potatojw_filter_setting_frame input").each(function() {
        filter_settings[$$(this).attr("id")] = $$(this).val();
      });
      filter_settings["is_filter_full_class"] = $$('#is_filter_full_class').is(":checked");
      applyFilter();
      $$("#potatojw_mask").css("display", "none");
      $$("#potatojw_filter_setting_frame").css("display", "none");
    };
  }

  if (mode in subclass_mode_list) {
    window.applyFilter = function() {
      getAllClassDOM().each(function() {
        $$(this).css("display", (filterClass(this) ? "table-row" : "none"));
      });
    };

    $$("#filter_switch").change(function() {
      applyFilter();
    });

    window.auto_refresh_interval_id = -1;
    $$("#auto_refresh").change(function() {
      $$("#auto_refresh").prop("checked") ? (function() {
        startAutoRefresh();
      } ()) : (function() {
        stopAutoRefresh();
      } ());
    });

    window.auto_select_switch = false;
    $$("#auto_select").change(function() {
      if (JSON.stringify(filter_settings) == "{}") {
        showFilterSetting();
        $$("#auto_select").click();
      }
      else window.auto_select_switch = $$("#auto_select").prop("checked");
    });

    window.stopAuto = function(){
      if ($$("#auto_refresh").prop("checked")) $$("#auto_refresh").click();
      if ($$("#auto_select").prop("checked"))  $$("#auto_select").click();
    }

    window.getAllClassDOM = function() {
      return (mode == "open" ? $$("div#tbCourseList > tbody > tr:gt(0)") : $$("table#tbCourseList:eq(0) > tbody > tr"));
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

    // Update class list automatically
    // 自动更新
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

    // Select qualified class automatically
    // 自动选择符合过滤器的课程
    window.doAutoClassSelect = function() {
      if (auto_select_switch == false) return;
      getAllClassDOM().each(function() {
        if (mode == "major_course") {
          checkCourse(this); return;
        }
        if (!filterClass(this)) return;
        if (typeof(isClassFull) == "function" && !isClassFull(this)) {
          $$(this).children("td:eq(" + select_class_button_index[mode] + ")").children("a")[0].click();
          console.log("Class Selected: " + $$(this).children("td:eq(" + class_name_index[mode] + ")".html()));
        }
      });
    };

    // Get the time of a given class
    // 获取课程上课时间
    window.getClassTime = function(element) {
      return $$(element).children("td:eq(" + class_time_index[mode] + ")").html();
    };

    window.time_list = new Array();
    window.updateFilterList = function() {
      time_list = [];
      $$("section#filter_time > input").css("display", "none");
      $$("section#filter_time > label").css("display", "none");
      $$("section#filter_time > br").css("display", "none");
      var date_num = 0;
      getAllClassDOM().each(function() {
        if (typeof(class_time_index[mode]) != "undefined") {
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
      if ($$("#filter_switch").prop("checked") == false)
        return true;
      if (filter_settings.is_filter_full_class == true)
        if (isClassFull(element))
          return false;
      if (typeof(class_time_index[mode]) != "undefined") {
        var current_time_val = getClassTime(element);
        var str_array = current_time_val.split("<br>");
        for (var i = 0; i < str_array.length; i++)
          if (time_list.indexOf(str_array[i]) >= 0 && $$("#filter_time_checkbox_" + time_list.indexOf(str_array[i])).prop("checked") == false)
            return false;
      }
      if (typeof(class_name_index[mode]) != "undefined") {
        var current_class_name = $$(element).children("td:eq(" + class_name_index[mode] + ")").html();
        if (current_class_name.indexOf(filter_settings.filter_class_name_text) < 0)
          return false;
      }
      if (typeof(teacher_name_index[mode]) != "undefined") {
        var current_teacher_name = $$(element).children("td:eq(" + teacher_name_index[mode] + ")").html();
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

  $$(document).ready(function() {
    window.toolbar_hidden = false;
    $$(".about_proj").html(about_this_project);
    $$("#potatojw_upgraded_toolbar").on("click", function() {
      if (window.toolbar_hidden == true) {
        $$("#potatojw_upgraded_toolbar").css("bottom", "20px");
        window.toolbar_hidden = false;
      }
    });
    $$("#potatojw_upgraded_toolbar").on("dblclick", function() {
      if (window.toolbar_hidden == false) {
        var bottom_px = 4 - $$("#potatojw_upgraded_toolbar").height();
        $$("#potatojw_upgraded_toolbar").css("bottom", bottom_px + "px");
        window.toolbar_hidden = true;
      } else {
        $$("#potatojw_upgraded_toolbar").css("bottom", "20px");
        window.toolbar_hidden = false;
      }
    });
  });

  const css = `
#potatojw_mask {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  opacity: 0.5;
  z-index: 9000;
}
#potatojw_filter_setting_frame {
  display: none;
  position: fixed;
  left: 15%;
  top: 15%;
  bottom: 5px;
  width: 70%;
  height: auto;
  z-index: 9001;
  background-color: #63065f;
  border-radius: 8px;
  padding: 15px;
  color: white;
  overflow: auto;
}
#potatojw_upgraded_toolbar {
  font-size: 13px;
  position: fixed;
  left: 5%;
  bottom: 20px;
  width: 90%;
  height: 45px;
  background-color: #63065f;
  border-radius: 18px;
  color: white;
  padding: 5px 5px 5px 10px;
  opacity: 0.8;
  transition: bottom .2s ease-out;
  user-select: none;
}
.filter_section {
  display: none;
}
body {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.potatojw_mini_button {
  font-size: 15px;
  border-radius: 4px; font-weight: bold; background-color: white; color: #63065f;
  user-select: none; cursor: pointer;
  padding: 2px 5px; margin: 5px;
  transition: color 0.1s ease-in;
}
.potatojw_mini_button:hover {
  color: #FF9B19;
}
  `;
  $$("body").append("<br><br><br><br><style>" + css + "</style>");


  var lib = `
C.③;  下列情况中，不属于考试作弊而属于一般考试违纪的是:①在允许用的工具书上写有考试有关的内容或书中夹带有关的材料者(不论是否抄用) ;②在桌面、手上等处写有与考试课程有关内容者;③不配合监考教师履行检查学生证件等职责者;④抢夺、窃取他人试卷、答卷、草稿纸或者强拿他人答卷或草稿纸为自己抄袭提供方便者(不论是否抄用)。
B.①②③;  以下行为与违规认定、处分对应关系正确的是:①经监考老师提醒后，仍未在试卷、答卷、草稿纸上填写姓名、学号、考号等信息者。一严重违反考试纪律，严重警告处分。②在发放试卷时领取超过一.份试卷、答卷且未将多余试卷返还监考教师者;一一般违反考试纪律， 警告处分。③故意销毁试卷、答卷或者考试材料者。一考 试作弊，记过处分。④涂改他人试卷姓名占为已有者。一严 重违反考试纪律，严重警告处分。
D.①②③④; 下列做法中正确的是:①书包、书籍、讲义、笔记、草稿纸等物品必须存放在监考教师指定的位置;②具有通讯或存储功能的手机、智能手表、电子词典等电子设备须关机后放入书包内;③只有任课教师允许且考试必需使用时才可携带计算器、耳机等物品;④学生应隔位就座;⑤学校的期末考试不需要携带有效身份证件。
A.开学第一周的规定时间; 需要补考的学生，须在开学____在“教服平台”进行补考申请。
B.①②③④; 下列关于学生申诉的说法正确的是:①学生对同一处理或者处分决定的申诉，以一次为限。②在申诉期间，不停止原处理或者处分决定的执行。③学生在接到符合申诉处理办法的处理或者处分决定书之日起十日内，可向学校学生申诉处理委员会提出书面申诉。④申诉复查决定作出之前，申诉人可以书面撤回中请，申诉复查程序终止。
C.作弊 记过;  携带处于开机状态的手机或其它具有通讯或存储功能的电子设备(不论使用与否且不论是否为本人所有)，属于__行为，给予__处分。
D.③④; 下列说法中正确的是:①学生休学时间不计入修业年限;②学生保留学籍时间不计入修业年限;③学生体学时间计入修业年限;④学生保留学籍时间计入修业年限。
D.①②③④; 以下哪些情况，不得申请成绩更正。①未选课注册或未办重修手续;②缺课或缺交作业超过三分之一;③未按时参加考试或提交作业;④违反考试纪律。
A.零分 开除学籍;  考试作弊的学生，该次考试成绩以____计，视情节给予相应处分，对于第二次作弊的学生，给予____处分。
A.作弊 记过;  开考后，桌面、桌内、座位旁、文具盒或试卷下、衣物等学生可触及范围内，有与考试内容有关的书、笔记本、复习提纲、讲义，或其他提前写有考试相关内容的纸张等(不论看与否且不论是否是本人所有)，属于____行为，给予____处分。
C.第二学期 第二、三、四学期;  各学科大类完成学科分流时间原则上在_____结束时，?原则上专业准入完成时间分别在_____结束时。
B.作弊 记过;  在读书报告、文献综述、课程论文、学年论文、毕业论文(设计)等方式的考核中抄袭或剽窃书籍、网络资料、他人作品，被任课教师认定为情节极其严重者，属于_??行为，给予_??处分。
C.30 40;  "学生修完第二专业规定的全部课程(学科平台、专业核心课程)，成绩合格，可申请南京大学第二专业证书。未能修完第二专业规定的全部课程，但已取得该专业学科平台、专业核心课程  个学分及以上，并且与主修专业(含多个第二专业中的其它专业)课程差异达50%以上,成绩合格者，可申请南京大学辅修专业结业证书;学生跨学科取得某个专业的学科平台、专业核心课程____个学分及以上， 并且与主修专业(含多个第二专业中的其它专业)课程差异达50%以上，成绩合格者，可申请南京大学双学位证书。"
A.视为自动退学 不享受; 保留学籍学生须在保留学籍期满后及时到校办理复学手续。逾期不办理复学手续者。 保留学籍的学生__在校学生和体学学生待遇。
C.①②③④; 下列属于原则上不予补考的情况是:①无故未参加课程考核;②考核中有违纪行为者;③因缺课，课程成绩以零分记载的;④因缺交作业严重，课程成绩以零分记载的。
C.平时成绩（含期中）和补考卷面成绩综合 不得;  学生首次修读的课程成绩不及格，可以申请一次补考，课程补考成绩按_评定。重修者__参加补考
A.1;  学生通过单独组班学习获得的第二专业课程成绩及学分，可以记载入____ : 1. 第二专业课程成绩单; 2.主修专业成绩单。
D.①③; 以下说法正确的是___ : ①获得副修结业证书者，允许在毕业后学校规定的最长学习年限內，按结业后重修的选课、缴费方式，继续修读所缺课程，合格者可换发双学位证书、第二专业证书。②第二专业准出申请时间在第入学期(五年制在第十学期)开学后两周。③学生主修专业(第-专业)课程与第专业课程相同(同课程名、同学分、同内容)，  经教务处审核后，可将该课程成绩及学分记载入第二专业课程成绩单
C.在教务系统里自行 提交书面申请;  "在设置专业意向的情况下,如果跨专业(大类)课程和自己的必修课有冲突，可_____?申?请缓修。如果是其他原因(课业偏重、实习等)需要缓修某门必修课的，可_??申请缓修，经所在院系审核同意后备案并删除课程。"
B.两 ①②③④; 学生每学期申请“免修不免考’的课程原则上不超过____。不得申请“免修不免考 ’的课程有___。 ①思政类课程;②军事课程;③体育课程;④实践类课程
A.①②③④⑤;  下列行为中属于一般违反考试纪律，应给予警告处分的有:①考试中以上厕所为由，到其他场所逗留者;②未经监考教师允许借用他人的考试相关用品者;③书包、书籍、讲义、笔记本、草稿纸等物晶未放在指定的位置且不听监考教师劝告者;④考试期间携带手机等具有通讯或信息存储功能的电子设备但处于关机状态者;⑤未经监考教师允许，擅自使用自备草稿纸者。
B.不能; 未获得主修专业(第一专业)毕业证书的学生，___获得第二专业证书、副修证书或双学位证书。
A.①②③;  "以下关于缓考的相关说法正确的是:①《缓考申请表》  (附相关证明材料)在期未考试开始前一周的第1-2个工作日提交教务处复审;②办理级考手续需提供客观真实的相关证明材料，如有弄虚作假，-经查实，相关课程按零分记载并按相关管理规定给予纪律处分;③缓考时间为每学期开学初,和补考同时进行，使用B卷;④《级考申请表》无须任课教室、开课单位教学院长书面同意，院系审批同意即可。"
B.3个月;  对于____以上的长期交换培养项目，原则上每位学生在校期间只能参加一次。
D.①②③④; 关于退学、试读的说法正确的有:①未经批准连续两周未参加学校规定的教学活动者应了退学;②学期内I课累计达50学时者应予退学;③学生本人申请退学的，需递交书面退学申请，经学生所在院系、教务处审核同意后，报分管校长审批;④学生享有对退学处理的陈述和申辩的权利。
D.①②③④⑤;  《南京大学学生申诉处理办法》适用于学校给予具有南京大学学籍学生的下列处理或者处分:①已经入学报到予以学籍注册的学生，被取消入学资格;②警告、严重警告、记过、留校察看、开除学籍等纪律处分;③3退学处理;④已经取得学历证书、学位证书的学生，给予撤销学历证书、学位证书处理;⑤需要申诉的其他处理。
A.②③④;  以下说法正确的有:①只有参加学位英语考试，成绩在及格以上才能申请授予学上学位;②因违反学术诚信受到记过(含记过)以上处分者，处分后如在学业等方面有突出成就，处分解除后，在毕业当年至最长修业年限内的6月1日至15日，可提交授予学上学位的书面申请;③学位补授的时间在每年三月、九月;④结业后重修课程期间或毕业后回校参加学位英语考试期间，有考试作弊行为者，取消其学位授予资格。
D.①②③④⑤;  《南京大学全日制本科生考试管理办法》的适用范围包括____:①闭卷笔试、?开卷(半开卷)笔试;②读书报告、文献综述;③操作考试、口试、口笔试兼用;④网络考试;⑤课程论文、学年论文、毕业论文(设计)
A.三分之一 三分之一 零分; 缺课时间达到某门课程一学期上课时间的_，或缺交作业达到某门课程一学期作业量的___，?不得参加本课程考，课程成绩以_??记载。(1.25分)
A.①②③;  关于交流学习的课程认定和学分转换范围，以下说法正确的是____?:?①交换课程认定完成后，不得再次中请课程认定。②校内已修的课程，不得用校外交流的课程替代。③学生参加校际交换的学期，须于开学两周内登陆本科生教服平台完成交流项目备案，没有在本科生教服平台进行交流项目备案的学生，其交流成绩认定不予受理。
B.425;  申请学位需通过学校组织的学位英语考试，成绩在及格以上。学生参加本校组织的全国大学英语六级考试成绩达_分及以上，可免学位英语考试。
A.保留南京大学学籍不变 3; 境外交换生在境外学校学习期间，其学籍_____，在满足对方学校最低要求的基础?上返校后至少应申请认定____个学分。(1.25分)
C.①②③;  以下应作结业处理的是:①学生在标准学制期满时，修完教学计划规定的内容，但仍有课程未通过，未通过学分之和低于(含)?12个;②受处分的学生，毕业时未解除其处分者;③最长修业年限期满，仍达不到毕业条件且满足结业条件者。
B.①②③④; 下列行为中属于考试作弊，应给予记过处分的有:①在考场内以借计算器、工具书、文具等物品的方式传递、接收有关答题内容者;②在考试中利用.上厕所机会在考场外偷看有关教学内容和考试资料或与他人交谈有关考试内容或使用手机者;③因保管不善等原因造成试卷、答卷及草稿纸等物品，在考试过程中或交卷时被他人利用，视为双方作弊;④评卷过程中发现同一科目同一考场有两份及以上答卷答案雷同，视为共同作弊。
A.一次 重修成绩;  学生如对已获得学分的某门课程成绩不满意，最多可以申请该课程重修__次并缴纳学分学费。课程重修后，以___计入学分绩。(1.25分)
B.①②③④; "关于成绩更正的流程，以下说法正确的是:①成绩更正申请受理时间为每学期开学两周内，逾期申请不予受理。②成绩更正申请表由任课老师填写，并附证明材料,由开课单位教务人员审核，经开课单位教学院长批准后，交送教务处。③每学期第三周，教务处对成绩更正申请组织审查，审查通过且公示期内无异议的，将在教务管理系统予以成绩更正。④对审查结果有异议的，可在公示期内提交相关证明材料,申请复查。(1.25分)"
B.①②③④; 下列行为中属于考试作弊，应给了记过处分的有:①为他人提供偷看机会者或偷看他人的试卷、答卷、草稿纸等考试材料者;②经允许上厕所后回考场时，发现带有与考试有关的材料;③已传给、已接看了他人的考卷、答卷或写有答题内容的草稿纸、纸条的传递者和接收者;因有交头接耳行为经警告仍不改正者; (1.25分)
D.开学两周 前两周; 休学、复学、保留学籍申请的集中审核批复时间为每学期___时间内。?应届毕业生办理了体学、保留学籍的，须在标准学制结束_??内提交复学申请。(1.25分)
B.一 两;  每学期允许缓修的课程数量原则上不超过准入课程时间冲突的情况下，允许缓修__门，专业意向为“跨院系专业准入”的，并且本专业必修课与对方专业门。(1.25分)
C.①②③;  可以申请缓考的情况包括:①公务性事假，如参加学校组织的重要的出访、竞赛、学术会议等;②家庭有重大变故，如遭遇严重自然灾害、有直系亲属亡故(病危)窨;③学生本人突发严重疾病，需住院治疗(观察)。(1.25分)
C.开放选修课程; 学生通过开放选修获得的第二专业课程成绩及学分，可作为_____学分记入主修专业 成绩单。
B.一年 必须办理退学手续;  "因总学分或必修课程学分达不到每学年最低要求须退学者，可申请在校试读_____。?试读期满达到在校修读年限累计学分数要求者，可继续就读;试读不合格者,???。(1.25分)"
B.旷考 零分;  "学生未申请缓考或申请未获准，未按时参加课程期末考试者，视为_____，课程成绩以_____记录。(1.25分)"
C.①②皆是; "下列属于有效的学业成绩单的是: 0由院系教务员打印,加盖教务员签名章及院系公章的成绩单;②由教务处打印(或自助打印) ,加盖教务处成绩审核章的成绩单。(1.25分)"
B.开学一周; 如果学生对课程成绩有疑问，可以在学期_____之内向开课院系（单位）教务员提出书面查分申请。(1.25分)
C.二周 三到八周 八周后;  学生应及时在教务系统内核对本学期课程，如学生选课不当，可在规定时间内退选课程。在课程开课_??退选的，该课程不记载在成绩单;在课程开课_??内退选的，该课程记载在成绩单，无成绩，注明“退选”字样，课程开课_??不得退选。(1.25分)
A.20 40 60 80 100;  第一学年最低完成必修课程（通修、平台、核心）学分数为_____，第二学年累计为_____，第三学年累计为_____，第四学年累计为_____，第五学年累计为_____。(1.25分)
A.一学期 一学年 批准; 学生因故休学时间不得少于____，一般以____为期。休学开始时间从休学申请____之日开始计算。(1.25分)
B.50% 50%;  学生选择的第二专业，其课程设置与主修专业的课程设置差异应达_____以上。学生同时修读多个第二专业，各第二专业之间的课程设置差异应达 _____以上。(1.25分
D.①②③;  "下列关于成绩记载的说法正确的是:①课程原成绩和补考成绩分别记载在成绩单上,补考成绩注明“补考”字样，课程原成绩注明“无效”字样。②课程缓考成绩按平时成绩(含期中)和缓考卷面成绩综合评定后记入学业成绩单,注明“缓考”字样。③重修课程以实得成绩记入成绩单，注明“重修”字样,原成绩注明“无效’字样。(1.25分)"
A.①②③④; 申请成绩更正，需提交的材料对应正确的是:①[登分错误]一成绩更正申请表、 成绩登记表复印件、试卷或论文复印件;②[成绩漏登]一成绩更正申请表、 成绩登记表复印件、试卷或论文复印件、含考场记录的考试小结或考场记录表、考试签到表以及其他可证明学生按时参加考试、提交作业的材料;③1平时分错误1一能证明参与 课程学习的材料，如点名册复印件、平时作业等;④[评分错误]成绩更正申请表、成绩登记表复印件、试卷或论文复印件、评分依据。(1.25分)
C.14 ①②③; 学生修读通识教育类课程不得少于___个学分。?属于通识教育类课程的有:①通识教育课;②新生研讨课;③新生导学课(1.25分)
C.③;  以下说法错误的是____?:?①学校允许学生创业或参军入伍;②学生体学创业、参军入伍时间一~般不超过2年;③学生休学创业、参军人伍的时间计入修业年限;④凡参加交流项目学生的学生，未经学校批准延期在外不归者，作退学处理。
B.开学两周 院系教务员; 因课程缓修或休学、交换等原因，没能按时修读某些课程，可申请补修。补修办理在_??_内进行，其中，通修课程的补修可在教务系统自行选课，专业课程的补修露提交书面申请，由_??_审核入班。(1.25分)
C.①②; "以下关于“免修不免考“的说法正确的是:①开课两周内申请;②由本人提出书面申请经任课教师及所在学院审核同意,报教务处备案;③无须注册课程;④申请通过后可不随堂听课，也可不交作业，须参加期未考核。(1.25分)"
B.第一周 第三周;  学生应在需重修课程开课的学期_批通过后，须在重修申请学期开学____内在“教服平台”提交相应课程重修申请，由院系教务员审核。学生重修申请审规定的时间内缴纳重修课程学分学费，逾期未缴费的，视为放弃重修。(1.25分)
B.学科分流意向 第一学期期中考试后; 为保障学生从一年级大类培养阶段到学科、专业培养阶段的顺利过渡，学生在第一学期需设置自己学科、专业意愿，即“_____”设置时间一般为_  _之后。(1.25分
C.开放选修课程; 学生修读的课程分为通识通修课程、学科专业课程和___三大模块。
D.以上均不可;  下列情况中，可以申请跨院系专业准入的有:①定向生、国防生、外语类保送生、运动员班、艺术类专业学生。②招生时有特殊要求的提前批次录取本科学生。③未经全国统一高考招收的特殊录取类型学生。④休学(保留学籍)期间的学生。⑤低学历层次转高学历层次。(1.25分)
D.退学 4; 凡经注册的课程必须按时上课。学生不请假或请假未批准而缺席，视为旷课。累计旷课达50学时者给予____处理。 各类实习军训、社会调查期间，未经同意擅自离队，每天按_  学时计算。(1.25分)
A.退学 20 40 60 80 100; "学生每学年应完成修读课程最低学分要求,否则作_处理。第一学年最低完成总学分数为____,第二学年累计为_，第三学年累计为_  第四学年累计为_第五学年累计为_  (1.25分)"
C.一学年 两次; 学生在标准学制期满时，未能修完教学计划规定的内容，无法达到毕业条件，可申请延长学习年限，每次可申请延长____最多申请_  _。 须在新学年开学两周内办理手续。(1.25分)
D.自动退学; 未经请假、请假未获批准或获准后逾期两周不注册的按__处理。
C.六年 七年;  全日制本科各专业的标准学制为四年或五年。学生可申请提前毕业或延长学习年限，但四年制学生最长修业年限不得超过_??;五年制学生最长修业年限不得超过_??(1.25分)
A.跨专业选课专业意向 第一周;  学生如果在学习主修专业课程的同时，对其他某个专业课程感兴趣，则需设置该专业为“_____”?，专业意向用于计算跨专业选课的优先级，设置时间-?~般为入学后_??(1.25分)
A.八 二;  专业准出申请时间在第_____学期开学后_周。
A.已准入的专业; 所有普通全日制本科生，都应申请一个专业作为主修专业准出，准出专业必须是我校经教育部批准的本科专业。学生原则上应将_??作为主修专业，申请专业准出。(1.25分)
D.①②③④; 下列哪些情况，不能获得学士学位授予资格：①因违反学术诚信受到记过（含记过）以上处分者；②退学试读者；③未通过学校组织的学位英语考试者；④处于处分期者。(1.25分)
C.①③④;  以下说法正确的是____：①休学、保留学籍时间累积最长不得超过两年；②休学学生可继续享受在校学习学生待遇，参与教学活动；③因病休学的学生，须离校治疗、休养；④学生休学期间，如有违纪行为，按《南京大学学生违纪处分规定》处理。(1.25分)
B.①②⑥;  学生请假须提出书面申请，并附相关事假、病假证明，在向任课教师请假时需出示具有下述审批手续的请假单:一天以上一周以内由  _批准;一周以上六周以内由_  _批准;超过六周_  ①辅导员;②主管教学院长(主任) ;③教务处;④学工处;⑤报教务处、学工处备案;⑥须办理体学手续。(1.25分)
B.15分钟 15分钟;  学生应在开考前_??_进入考场，不得中途擅自离场。开考后，迟到者需得到监考教师的允许方可进入考场、参加考试;迟到_??_以上者，不得参加考试，视作旷考。(1.25分)
D.①②③;  学生在学业、学术、品性等方面的失信行为须记录在学籍档案中。对有赃重失信行为的，给予相应的处分，对违背学术诚信的，对其获得学位等作出限制。下列行为属于学术不诚信行为的是:①考试作弊;②论文抄袭;③帮助他人实施学术不诚信行为。(1.25分)
D.②③⑤;  关于学科分流、专业准人的说法正确的是:①不允许学科大类在学科分流时直接进行专业准入。②学生在第二学期结束时准入某专业学习后，如有重新选择专业学习的意慰，可在第四学期规定的时间内再次申请专业准入。③学生在学科大类内申请学科、专业准入时，可填报多个志感。④学生申请跨大类学科、专业准入时，可不必填写录取学科大类的学科、专业准，入志愿。⑤跨大类申请学科、专业准入的学生，一旦被录取，其在录取学科大类填报的学科、专业准入志愿作废。
B.2;  学生修读通识教育类课程应包含____个学?分的悦读经典课程。
B.一年; 学校原则上不允许交换培养项目延期，如确因学业.上的特殊情况需延期交流的，必须办理延期手续，且境外交流学习时间累计不得超过??__。?(1.25分)
B.①③④⑤; 下列情况中，属于严重违反考试纪律，应给予严重警告处分的有:①使用规定以外的笔、纸答题或者在试卷规定范围以外的地方书写姓名、考号或者以其它方式在答卷.上标记信息者;②在考场内外大声喧哗经制止无效者;③考试过程中未经监考教师允许擅自离开考场者;④擅自将试卷、答卷、草稿纸等考试用纸带出考场外者;⑤考试中，在厕所停留时间超过15分钟者。(1.25分)
C.按实得成绩计入 60分;  课程有效成绩、学分计入学分绩，不及格的课程在补考或重修通过之前____学分绩， 补考通过的课程按_计入学分绩，原不及格成绩不再计入学分绩。(1.25分)
B.20; 学分绩计算方法为：学分绩=[(课程考分/______*学分数)求和]/总学分数。(1.25分)
C.两 网络课程; 交换期间，一般不得办理本校选课注册手续，经任课教师、开课院系和所在院系同意后，交换期间每学期最多可申请___门免修不免考课程;除_  外，擅自听课、考试者，其考试成绩不予承认。(1.25分)
C.第一周 旷课; 每学期开学_____，学生必须办理报到注册手续;因故不能如期到校注册者，必须办理请假手续并提供必要的证明材料，否则以_论处。(1.25分)
`;
};

(function() {
  if (typeof(jQuery) == "function")
    potatojw_intl();
  else {
    function loadScript(url, callback) {
      var script = document.createElement('script');
      script.type = "text/javaScript";
      if (script.readyState)
        script.onreadystatechange = function() {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            callback();
          }
        };
      else
        script.onload = function() {
          callback();
        };
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
    loadScript("https://wx.nju.edu.cn/thirdparty/nifty/js/jquery.min.js", potatojw_intl);
  }
})();
