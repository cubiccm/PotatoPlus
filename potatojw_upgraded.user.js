// ==UserScript==
// @name         potatojw_upgraded
// @namespace    https://cubiccm.ddns.net
// @version      0.0.1
// @description  土豆改善工程
// @author       You
// @match        *://*.nju.edu.cn/jiaowu/student/elective/gymClassList.do
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==
(function() {
  'use strict';
  $$ = jQuery.noConflict();
  console.log("potatojw_upgraded v0.0.1 by Limosity");
  // Your code here...

  window.selectedClass = function(classId) {
    document.getElementById('courseList').disabled = true;

    $$.ajax({
      url: "/jiaowu/student/elective/selectCourse.do",
      data: "method=addGymSelect&classId=" + classId,
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
  window.initClassList = function(method = "gymCourseList", func = function() {}){
    $$.ajax({
      url: "/jiaowu/student/elective/courseList.do",
      data: "method=" + method,
      type: "POST",
      success: function(res) {
        $$("#courseList").html(res);
        func();
      }
    });
  }

  window.refreshCourseList = function() {
    checkAvailableClass();
  }

  window.applyFilter = function(force_apply = false) {
    if (!force_apply && !$$("#auto_filter").prop("checked")) return;
    $$("tbody > tr").each(function() {
      if (parseInt($$(this).children("td:eq(3)").html()) == parseInt($$(this).children("td:eq(4)").html()))
        $$(this).css("display", "none");
    });
  }

  window.checkAvailableClass = function() {
    initClassList("gymCourseList", function() {
      var allclass = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
      applyFilter();
      if (auto_select_switch)
        $$("tbody > tr").each(function() {
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
      }, Math.floor(Math.random() * 1000))
    }, random_interval);
  }
  const toolbar_html = `
<input type="checkbox" id="auto_filter">
<label for="auto_filter">过滤满员课程</label>
<input type="checkbox" id="auto_refresh">
<label for="auto_refresh">自动刷新</label>
<input type="checkbox" id="auto_select">
<label for="auto_select">无脑自动选课</label>
<input type="checkbox" id="close_alert" disabled="disabled" checked="checked">
<label for="close_alert">关闭所有提示框</label>
<input type="checkbox" id="close_alert" disabled="disabled">
<label for="close_alert">更漂亮的界面</label>
<br>
potatojw_upgraded Beta 当前仅限体育补选 注：无脑选课功能是指，有空余的课就自动点选择，如果不是实在没课了不要点~ 更多功能开发中~
  `;

  $$("body").append("<div id='potatojw_upgraded_toolbar'>" + toolbar_html + "</div>");

  const css = `
#potatojw_upgraded_toolbar {
  position: fixed;
  left: 5%;
  bottom: 5px;
  width: 90%;
  height: 40px;
  background-color:#63065f;
  border-radius: 8px;
  color: white;
  padding-left: 8px;
}
  `;

  $$("body").append("<style>" + css + "</style>");

  $$("#auto_filter").change(function() {
    $$("#auto_filter").prop("checked") ? (function() {
      applyFilter();
    } ()) : (function() {
      $$("tbody > tr").each(function() {
          $$(this).css("display", "table-row");
      });
    } ());
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
