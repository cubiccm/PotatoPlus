/* Backup the builtin JS prototype so that the FAAAAACING prototype.js won't FAACING RUIN MY CODE AND MY LIFE IN THIS PROJECT */
window.proto_backup = {
  reduce: Array.prototype.reduce
};

function injectStyleFromString(str) {
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = str;
  document.documentElement.appendChild(style);
}

var modes_reg = {
  course: /grablessons.do/i, // 选课系统列表
  xk_system: /\/\/xk.nju.edu.cn/i, // 选课系统 xk.nju.edu.cn 界面

  major_course: /student\/elective\/specialityCourseList.do/i, // 专业选课
  union: /student\/elective\/index.do/i, // 选课
  gym: /gymClassList.do/i, // 体育补选
  read: /readRenewCourseList.do/i, // 经典导读读书班补选
  dis: /discussRenewCourseList/i, // 导学、研讨、通识课补选
  public: /publicRenewCourseList/i, // 公选课补选
  open: /openRenewCourse/i, // 跨专业补选
  art: /artRenewCourseList/i, // 美育补选
  common: /commonCourseRenewList|commonRenew.do/i, // 通修课补选

  read_view: /elective\/readCourseList.do/i, // 经典导读读书班初选
  dis_view: /elective\/freshman_discuss.do/i, // 导学、研讨、通识课初选
  art_view: /elective\/artList.do/i, // 美育初选
  public_view: /elective\/publicCourseList.do/i, // 公选课初选
  open_view: /elective\/open.do/i, // 跨专业初选

  course_eval: /evalcourse\/courseEval.do\?method=currentEvalCourse/i, // 课程评估

  all_course_list: /teachinginfo\/allCourseList.do\?method=getTermAcademy/i, // 全校课程
  grade_info: /student\/studentinfo\/achievementinfo.do\?method=searchTermList/i, // 成绩查看
  course_info: /courseList.do\?method=getCourseInfoM/i, // 课程详细信息

  main_page: /(\/jiaowu\/student\/index.do|\/jiaowu\/login.do)/i, // 主页
  login_page: /(\/jiaowu\/exit.do|\/jiaowu$|\/jiaowu\/$|\/jiaowu\/index.jsp)/i // 登录页
}

var pjw_mode = "";
for (const mode_name in modes_reg) {
  if (modes_reg[mode_name].test(window.location.href) == true) {
    window.pjw_mode = mode_name;
    break;
  }
}

window.pjw_mode = pjw_mode;

if (pjw_mode == "grade_info") {
  injectStyleFromString(`table.TABLE_BODY{ display: none; }`);
}

if (pjw_mode == "main_page") {
  alert = function(x) {window.alert_data = x;};
}
