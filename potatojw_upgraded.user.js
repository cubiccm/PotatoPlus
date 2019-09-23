// ==UserScript==
// @name         potatojw_upgraded
// @namespace    https://cubiccm.ddns.net
// @version      0.0.3
// @description  土豆改善工程！
// @author       Limosity
// @match        *://*.nju.edu.cn/jiaowu/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==
(function() {
  'use strict';
  $$ = jQuery.noConflict();
  console.log("potatojw_upgraded v0.0.3 by Limosity");
  // Your code here...
  $$("head").append('<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">');
  var reg_gym = /gymClassList.do/i;
  var reg_read = /readRenewCourseList.do/i;
  var reg_dis = /discussRenewCourseList/i;
  var reg_open = /openRenewCourseList/i;
  var reg_common = /commonCourseRenewList/i;

  var mode = "";
  if (reg_gym.test(window.location.href)) mode = "gym"; //体育补选
  else if (reg_read.test(window.location.href)) mode = "read"; // 经典导读读书班补选
  else if (reg_dis.test(window.location.href)) mode = "dis"; // 导学、研讨、通识课补选
  else if (reg_open.test(window.location.href)) mode = "open"; // 跨专业补选
  else if (reg_common.test(window.location.href)) mode = "common"; //通修课补选
  else return;

  if (mode == "gym") {
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
          }
          $$("#courseOperation").html("");
        }
      });
    };

    // Load gym class list
    // 加载体育课列表
    window.initClassList = function(func = function() {}){
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do",
        data: "method=gymCourseList",
        type: "POST",
        success: function(res) {
          $$("#courseList").html(res);
          updateFilterList();
          applyFilter();
          if (auto_select_switch) doAutoClassSelect();
          func();
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
            console.log("Error: " + $$("#errMsg").attr("title"));
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
      initClassList(hideCourseDetail);
    };

    window.isClassFull = function(element) {
      return parseInt($$(element).children("td:eq(5)").html()) >= parseInt($$(element).children("td:eq(4)").html());
    };

    // Drop a reading class
    // 退选阅读课
    window.readDelete = function(event, class_ID) {
      readSelect(event, class_ID, true);
    };
  } else if (mode == "common") {
    window.initClassList = function() {
      $$.ajax({
        url: window.location.href,
        type: "GET",
        success: function(res) {
          $$("#tbCourseList").html($$(res).find("table").html());
          updateFilterList();
          applyFilter();
        }
      });
    };

    window.isClassFull = function(element) {
      return parseInt($$(element).children("td:eq(7)").html()) >= parseInt($$(element).children("td:eq(6)").html());
    };
  } else if (mode == "dis") {
    window.selectClass = function(class_ID) {
      console.log(class_ID);
      var g_campus = $$('#campusList')[0].options[$$('#campusList')[0].selectedIndex].value;
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do?method=submitDiscussRenew&classId=" + classId + "&campus=" + g_campus,
        type: "GET",
        success: function(res) {
          console.log("Success!");
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

    window.initClassList = function() {
      $$.ajax({
        url: window.location.href,
        type: "GET",
        success: function(res) {
          $$("#tbCourseList").html($$(res).find("table").html());
          optimizeClassList();
          applyFilter();
        }
      });
    };

    window.isClassFull = function(element) {
      return parseInt($$(element).children("td:eq(7)").html()) >= parseInt($$(element).children("td:eq(6)").html());
    };
  } else return;

  const filter_setting_html = `
<div id="potatojw_mask"></div>
<div id="potatojw_filter_setting_frame">
  <input type="checkbox" id="filter_full_class" checked="checked">
  <label for="filter_full_class">仅显示空余课程</label>
  <br>
  <section id="filter_class_name">
    <h3>课名过滤Beta</h3>
    <h5>仅显示含有以下全部字符的课程（如：游泳 微积分）</h5>
    <h5>说明：当且仅当下面输入框中的文字是课程名的连续一段文字时才会显示该课程~</h5>
    <input type="text" id="filter_class_name_text">
  </section>
  <br>
  <section id="filter_time">
    <h3>仅显示这些上课时间：</h3>
  </section>
  <br>
  <button onclick="hideFilterSetting();">应用设置并关闭</button>
  <br>
  <span>potatojw_upgraded Beta v0.0.3 暂时不支持跨专业选课 注：自动选课是按过滤器选课~ 更多功能开发中~</span>
  <br>
  <span>字体美化已启用</span>
</div>
  `;
  $$("body").append(filter_setting_html);

  const toolbar_html = `
<div id='potatojw_upgraded_toolbar'>
<input type="checkbox" id="filter_switch">
<label for="filter_switch">打开过滤器</label>
<button id="show_filter_setting" onclick="showFilterSetting();">过滤器设置</button>
<input type="checkbox" id="auto_refresh">
<label for="auto_refresh">自动刷新</label>
<input type="checkbox" id="auto_select">
<label for="auto_select">自动选课</label>
<input type="checkbox" id="close_alert" disabled="disabled" checked="checked">
<label for="close_alert">关闭选课提示框</label>
<input type="checkbox" id="close_alert" disabled="disabled">
<label for="close_alert">整体界面美化</label>
<br>
<span>potatojw_upgraded Beta</span>
</div>
  `;
  $$("body").append(toolbar_html);

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
  position: fixed;
  left: 5%;
  bottom: 5px;
  width: 90%;
  height: 40px;
  background-color: #63065f;
  border-radius: 8px;
  color: white;
  padding-left: 8px;
  opacity: 0.8;
}
#filter_time {
  display: none;
}
body {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
  `;
  $$("body").append("<br><br><br><style>" + css + "</style>");

  window.applyFilter = function() {
    $$("tbody > tr").each(function() {
      $$(this).css("display", (filterClass(this) ? "table-row" : "none"));
    });
  };

  window.showFilterSetting = function() {
    $$("#potatojw_mask").css("display", "block");
    $$("#potatojw_filter_setting_frame").css("display", "block");
  };

  window.hideFilterSetting = function() {
    applyFilter();
    $$("#potatojw_mask").css("display", "none");
    $$("#potatojw_filter_setting_frame").css("display", "none");
  };

  $$("#filter_switch").change(function() {
    applyFilter();
  });

  window.auto_refresh_interval_id;
  $$("#auto_refresh").change(function() {
    $$("#auto_refresh").prop("checked") ? (function() {
      window.auto_refresh_interval_id = startAutoRefresh();
    } ()) : (function() {
      window.clearInterval(window.auto_refresh_interval_id);
    } ());
  });

  window.auto_select_switch = $$("#auto_select").prop("checked");
  $$("#auto_select").change(function() {
    if ($$("#auto_select").prop("checked") && !$$("#auto_refresh").prop("checked"))
      $$("#auto_refresh").click();
    window.auto_select_switch = $$("#auto_select").prop("checked");
  });

  const select_class_button_index = {
    "gym": 5,
    "read": 6,
    "common": 9,
    "dis": 10
  };

  const class_name_index = {
    "gym": 0,
    "read": 1,
    "common": 2,
    "dis": 2
  };

  const class_time_index = {
    "gym": 1,
    "common": 4,
    "dis": 4
  };

  // Update class list automatically
  // 自动更新
  window.startAutoRefresh = function() {
    var auto_check_times = 0, random_interval = 500 + Math.floor(Math.random() * 800);
    return window.setInterval(function() {
      window.setTimeout(function() {
        initClassList();
        console.log((++auto_check_times) + " times refreshed");
      }, Math.floor(Math.random() * 1000));
    }, random_interval);
  };

  // Select qualified class automatically
  // 自动选择符合过滤器的课程
  window.doAutoClassSelect = function() {
    $$("tbody > tr").each(function() {
      if (!filterClass(this)) return;
      if (!isClassFull(this)) {
        $$(this).children("td:eq(" + select_class_button_index[mode] + ")").children("a").click();
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
    var date_num = 0;
    $$("tbody > tr").each(function() {
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

  if (typeof(class_time_index[mode]) != "undefined")
    $$("section#filter_time").css("display", "block");

  // Check if the given class satisfy the filter
  // 检查课程是否符合过滤器
  window.filterClass = function(element) {
    if ($$("#filter_switch").prop("checked") == false)
      return true;
    if ($$("#filter_full_class").prop("checked"))
      if (isClassFull(element))
        return false;
    if (typeof(class_time_index[mode]) != "undefined") {
      var current_time_val = getClassTime(element);
      var str_array = current_time_val.split("<br>");
      for (var i = 0; i < str_array.length; i++)
        if (time_list.indexOf(str_array[i]) >= 0 && $$("#filter_time_checkbox_" + time_list.indexOf(str_array[i])).prop("checked") == false)
          return false;
    }
    var current_class_name = $$(element).children("td:eq(" + class_name_index[mode] + ")").html();
    if (current_class_name.indexOf($$("#filter_class_name_text").val()) < 0)
      return false;
    return true;
  };

  // Rewrite refresh function
  // 改写刷新按钮：刷新课程列表
  window.refreshCourseList = function() {
    initClassList();
  };

})();
