// ==UserScript==
// @name         potatojw_upgraded
// @namespace    https://cubiccm.ddns.net
// @version      0.0.2
// @description  土豆改善工程！
// @author       You
// @match        *://*.nju.edu.cn/jiaowu/student/elective/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==
(function() {
  'use strict';
  $$ = jQuery.noConflict();
  console.log("potatojw_upgraded v0.0.2 by Limosity");
  // Your code here...
  var reg_gym = /gymClassList.do/i;
  var reg_read = /readCourseList.do/i;
  var reg_fr_dis = /freshman_discuss.do/i;
  var reg_open = /open.do/i;

  var mode = "";
  if (reg_gym.test(window.location.href)) mode = "gym";
  else if (reg_read.test(window.location.href)) mode = "read";
  else if (reg_fr_dis.test(window.location.href)) mode = "fr_dis";
  else if (reg_open.test(window.location.href)) mode = "open";
  else return;

  if (mode == "gym") {
    window.selectedClass = function(class_ID) {
      document.getElementById('courseList').disabled = true;

      $$.ajax({
        url: "/jiaowu/student/elective/selectCourse.do",
        data: "method=addGymSelect&classId=" + class_ID,
        type: "POST",
        success: function(res) {
          document.getElementById('courseList').disabled = false;
          $$("#courseOperation").css("display", "none");
          $$("#courseOperation").html(res);
          if ($$("#errMsg").length) {
            console.log("Error: " + $$("#errMsg").attr("title"));
            $$("#courseOperation").html("");
          }
          $$("#courseOperation").html("");
        }
      });
    }

    window.initClassList = function(func = function() {}){
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do",
        data: "method=gymCourseList",
        type: "POST",
        success: function(res) {
          $$("#courseList").html(res);
          updateFilterList();
          applyFilter();
          func();
        }
      });
    }

    window.refreshCourseList = function() {
      checkAvailableClass();
    }

    window.checkFilter = function (element) {
      if ($$("#filter_switch").prop("checked") == false)
        return true;
      if ($$("#filter_full_class").prop("checked"))
        if (parseInt($$(element).children("td:eq(3)").html()) >= parseInt($$(element).children("td:eq(4)").html()))
          return false;
      var current_time_val = $$(element).children("td:eq(1)").html();
      if (date_list.indexOf(current_time_val) >= 0 && $$("#filter_time_checkbox_" + date_list.indexOf(current_time_val)).prop("checked") == false)
        return false;
      return true;
    }

    window.checkAvailableClass = function() {
      initClassList(function() {
        var allclass = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        if (auto_select_switch)
          $$("tbody > tr").each(function() {
            if (!checkFilter(this)) return;
            if (parseInt($$(this).children("td:eq(3)").html()) < parseInt($$(this).children("td:eq(4)").html())) {
              $$(this).children("td:eq(5)").click();
              console.log("Class Selected: " + i);
            }
          });
      });
    }
    
    window.startAutoCheck = function() {
      var auto_check_times = 0, random_interval = 500 + Math.floor(Math.random() * 800);
      return window.setInterval(function() {
        window.setTimeout(function() {
          checkAvailableClass();
          console.log((++auto_check_times) + " times refreshed");
        }, Math.floor(Math.random() * 1000));
      }, random_interval);
    }
  } else if (mode == "read") {
    window.readSelect = function(event, class_ID, is_delete = false) {
      $$("#courseList")[0].disabled = true;

      $$.ajax({
        url: "/jiaowu/student/elective/selectCourse.do",
        data: 'method=readCourse' + (is_delete ? 'Delete' : 'Select') + '&classid=' + class_ID,
        type: "POST",
        success: function(res) {
          $$("#courseList")[0].disabled = false;
          $$("#courseDetail").html(res);
          $$('#courseOperation').html(res);
          if ($$("#errMsg").length == 0)
            console.log("Error: " + $$("#errMsg").attr("title"));
          else if ($$("#successMsg").length == 0)
            console.log("Error: " + $$("#successMsg").attr("title"));
          readTypeChange();
        }
      });
    }

    window.initClassList = function(type = 1, success_func = function() {}){ 
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do",
        data: 'method=readCourseList&type=' + type,
        type: "POST",
        success: function(res) {
          $$("#courseList").html(res);
          applyFilter();
          success_func();
        }
      });
    }

    var filter_type = 0;
    window.readTypeChange = function() {
      filter_type = $$('#readType')[0].options[$$('#readType')[0].selectedIndex].value;
      initClassList(filter_type, hideCourseDetail);
    }

    window.readDelete = function(event, class_ID) {
      readSelect(event, class_ID, true);
    }

  } else return;

  const filter_setting_html = `
<div id="potatojw_mask"></div>
<div id="potatojw_filter_setting_frame">
  <input type="checkbox" id="filter_full_class" checked="checked">
  <label for="filter_full_class">过滤满员课程</label>
  <br>
  <section id="filter_time">
    <h3>上课时间过滤器</h3>
  </section>
  <br>
  <button onclick="hideFilterSetting();">关闭</button>
</div>
  `;
  $$("body").append(filter_setting_html);

  const toolbar_html = `
<div id='potatojw_upgraded_toolbar'>
<input type="checkbox" id="filter_switch">
<label for="filter_switch">打开过滤器</label>
<input type="checkbox" id="auto_refresh">
<label for="auto_refresh">自动刷新</label>
<input type="checkbox" id="auto_select">
<label for="auto_select">自动选课</label>
<input type="checkbox" id="close_alert" disabled="disabled" checked="checked">
<label for="close_alert">关闭所有提示框</label>
<input type="checkbox" id="close_alert" disabled="disabled">
<label for="close_alert">更漂亮的界面</label>
<button id="show_filter_setting" onclick="showFilterSetting();">过滤器设置</button>
<br>
potatojw_upgraded Beta 当前仅限体育补选 注：自动选课是按过滤器选课~ 更多功能开发中~
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
}
  `;
  $$("body").append("<style>" + css + "</style>");

  window.applyFilter = function() {
    $$("tbody > tr").each(function() {
      $$(this).css("display", (checkFilter(this) ? "table-row" : "none"));
    });
  };

  window.date_list = new Array();
  window.updateFilterList = function() {
    var date_num = 0;
    $$("tbody > tr").each(function() {
      var current_time_val = $$(this).children("td:eq(1)").html();
      if (date_list.includes(current_time_val)) return;
      date_list.push(current_time_val);
      var filter_time_append_html = `
        <input type="checkbox" class="filter_time_checkbox" id="filter_time_checkbox_` + date_num + `" checked="checked">
        <label for="filter_time_checkbox_` + (date_num++) + `">` + current_time_val + `</label>
      `;
      $$("section#filter_time").append(filter_time_append_html);
    });
  }

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

  window.check_id;
  $$("#auto_refresh").change(function() {
    $$("#auto_refresh").prop("checked") ? (function() {
      window.check_id = startAutoCheck();
    } ()) : (function() {
      window.clearInterval(window.check_id);
    } ());
  });

  window.auto_select_switch = $$("#auto_select").prop("checked");
  $$("#auto_select").change(function() {
    if ($$("#auto_select").prop("checked") && !$$("#auto_refresh").prop("checked"))
      $$("#auto_refresh").click();
    window.auto_select_switch = $$("#auto_select").prop("checked");
  })

})();
