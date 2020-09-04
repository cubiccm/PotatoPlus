function injectScript(path, module = false, defer = false) {
  var script = document.createElement('script');
  if (defer) script.setAttribute('defer', '');
  if (module) script.setAttribute('type', 'module');
  else script.setAttribute('type', 'text/javascript');
  script.src = chrome.extension.getURL(path);
  document.documentElement.appendChild(script);
}

function injectScriptFromString(str) {
  var script = document.createElement('script');
  script.text = str;
  document.documentElement.appendChild(script);
}

function injectStyleFromString(str) {
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = str;
  document.documentElement.appendChild(style);
}

(function() {
  var modes_reg = {
    major_course: /student\/elective\/specialityCourseList.do/i, // 专业选课
    gym: /gymClassList.do/i, // 体育补选
    read: /readRenewCourseList.do/i, // 经典导读读书班补选
    dis: /discussRenewCourseList/i, // 导学、研讨、通识课补选
    open: /openRenewCourse/i, // 跨专业补选
    common: /commonCourseRenewList/i, // 通修课补选

    dis_view: /elective\/freshman_discuss.do/i, // 导学、研讨、通识课初选
    open_view: /elective\/open.do/i, // 跨专业初选

    freshmen_exam: /student\/exam\/index.do/i, // 新生测试
    course_eval: /evalcourse\/courseEval.do\?method=currentEvalCourse/i, // 课程评估

    all_course_list: /teachinginfo\/allCourseList.do\?method=getTermAcademy/i, // 全校课程
    grade_info: /student\/studentinfo\/achievementinfo.do\?method=searchTermList/i, // 成绩查看

    main_page: /(\/jiaowu\/student\/index.do|\/jiaowu\/login.do)/i, // 主页
    login_page: /(\/jiaowu\/exit.do|\/jiaowu$|\/jiaowu\/$|\/jiaowu\/index.jsp)/i // 登录页
  }
  window.pjw_mode = "";
  for (const mode_name in modes_reg) {
    if (modes_reg[mode_name].test(window.location.href) == true) {
      pjw_mode = mode_name;
      break;
    }
  }

  if (pjw_mode == "") return;

  injectScript("js/jquery.min.js");
  injectScript("js/store.min.js");
  injectScript("js/material-components-web.min.js");

  injectScriptFromString(`
    var pjw_mode = "${pjw_mode}";
  `);
  if (pjw_mode == "grade_info") {
    injectStyleFromString(`table.TABLE_BODY{ display: none; }`);
  } else if (pjw_mode == "main_page") {
    injectScriptFromString(`alert = function(x) {window.alert_data = x;};`);
  }

  injectScript("js/pjw-lib.js");
  injectScript("js/pjw-captcha.js");
  injectScript("js/pjw-classlist.js");
  injectScript("js/pjw-core.js");
})();