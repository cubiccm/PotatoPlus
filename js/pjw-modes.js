var collapseSidebarIntoFilter = function() {
  $$("#comment").detach().prependTo(".pjw-filter-panel");
  $$("#courseDetail").detach().prependTo(".pjw-filter-panel");
  $$("#courseDetail").css({
    width: "100%",
    left: 0
  });
  $$("#comment").css({
    width: "100%",
    left: 0,
    top: "5px",
    color: "rgba(0, 0, 0, .4)"
  });
};

var class_select_funcs = {

"course":
function() {
  window.getListParam = function(page) {
    function getOrderString() {
      var order = '';
      var $orderDomArr = $('.result-container .course-order[data-order="order"]');
      if ($orderDomArr.length == 0) {
        $orderDomArr = $('.result-container .course-order[data-order="desc"]');
      }
      if ($orderDomArr.length > 0) {
        var orderField = $orderDomArr.eq(0).attr('data-type');
        switch (orderField) {
          case 'KCH':
            order += 'courseNumber';
            break;
          case 'KCMC':
            order += 'courseName';
            break;
          case 'XF':
            order += 'credit';
            break;
          case 'JSMC':
            order += 'teacherName';
            break;
          case 'SJDD':
            order += 'teachingPlace';
            break;
          case 'YXRS':
            order += 'classCapacity';
            break;
          case 'XQ':
            order += 'campusName';
            break;
          case 'XKFS':
            order += 'typeName';
            break;
          case 'BJS':
            order += 'number';
            break;
          case 'BZ':
            order += 'extInfo';
            break;
          case 'KCXZ':
            order += 'courseNatureName';
            break;
          case 'KCLB':
            order += 'courseSection';
            break;
          case 'KKDW':
            order += 'departmentName';
            break;
          case 'TXSJ':
            order += 'deleteOperateTime';
            break;
          case 'NJ':
            order += 'recommendGrade';
            break;
          default:
            break;
        }
        if ($orderDomArr.eq(0).attr('data-order') == 'desc') {
          order += ' -';
        } else {
          order += ' +';
        }
      }
      return order;
    }
    var content = $('.search-input').val();
    content = content == null ? '' : content;
    if (content) {
      content = content.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"');
    }
    var studentInfo = JSON.parse(sessionStorage.getItem('studentInfo')); //学生信息
    var studentCode = studentInfo.code; // 学号
    // 选课批次
    var electiveBatch = studentInfo.electiveBatch;
    var electiveBatchCode = electiveBatch.code;
    // 当前校区
    var currentCampus = JSON.parse(sessionStorage.getItem('currentCampus'));
    var campus = currentCampus.code; // 校区
    var teachingClassType = sessionStorage.getItem("teachingClassTypeSecond"); // 教学班类型
    if (!teachingClassType) {
      teachingClassType = sessionStorage.getItem("teachingClassType"); // 教学班类型
    }
    var queryData = '{"studentCode":"' + studentCode + '","electiveBatchCode":"' + electiveBatchCode + '","teachingClassType":"' + teachingClassType + '"';
    if (campus) {
      queryData += ',"campus":"' + campus + '"';
    }
    var type = null;
    var value = null;
    $.each($('.search-container .search-item .search-value'), function(index, dom) {
      //平铺按钮类型
      type = $(dom).attr('data-search');
      if ($(dom).hasClass('cv-active')) {
        value = '0';
      } else {
        value = '2';
      }
      switch (type) {
        case 'SFCT':
          queryData += ',"checkConflict":"' + value + '"';
          break;
        case 'SFYM':
          queryData += ',"checkCapacity":"' + value + '"';
          break;
        default:
          break;
      }
    });
    $.each($('.search-container .search-item .cv-search-dropdown'), function(index, dom) {
      //下拉按钮类型
      type = $(dom).attr('data-search');
      value = $(dom).attr('data-code');
      if (value) {
        switch (type) {
          case 'KCXZ':
            content = 'KCXZ:' + value + ',' + content;
            break;
          case 'KCLB':
            content = 'YDKCLB:' + value + ',' + content;
            break;
          case 'NJ':
            content = 'FXNJ:' + value + ',' + content;
            break;
          case 'YX':
            content = 'FXYX:' + value + ',' + content;
            break;
          case 'ZY':
            content = 'FXZY:' + value + ',' + content;
            break;
          case 'SKNJ':
            content = 'ZXNJ:' + value + ',' + content;
            break;
          case 'SKYX':
            content = 'ZXYX:' + value + ',' + content;
            break;
          case 'SKZY':
            content = 'ZXZY:' + value + ',' + content;
            break;
          case 'XGXKLB':
            content = 'XGXKLBDM:' + value + ',' + content;
            break;
          case 'XKLX':
            content = 'CXCKLX:' + value + ',' + content;
            break;
          case 'KKDW':
            content = 'KKDWDM:' + value + ',' + content;
            break;
          case 'SKXQ':
            content = 'SKXQ:' + value + ',' + content;
            break;
          case 'KSJC':
            content = 'KSJC:' + value + ',' + content;
            break;
          case 'JSJC':
            content = 'JSJC:' + value + ',' + content;
            break;
          default:
            break;
        }
      }
    });
    queryData += ',"queryContent":"' + content + '"';
    queryData += '}';
    if (CVParams.pageNumber == null || CVParams.pageNumber < 0) {
      CVParams.pageNumber = 0;
    }
    var order = getOrderString();
    if (teachingClassType != 'QB') {
      if (order) {
        order = 'isChoose -,' + order;
      } else {
        order = 'isChoose -';
      }
    }
    var queryStr = '{"data":' + queryData + ',"pageSize":"' + CVParams.pageSize * 1000 + '","pageNumber":"' + (page || CVParams.pageNumber) + '","order":"' + order + '"}';
    var queryParam = {
      'querySetting': queryStr
    };
    return queryParam;
  }
  
  window.queryPublicCourse = window.queryCourseData = window.queryfavoriteResults = window.queryProgramCourse = function(queryParam) {
    list.refresh(true);
    CVParams.canTurnPage = true;
    CVParams.stopChangeMenu = false;
    return {
      "done": (e) => {}
    };
  }

  function buildAddParam(tcId, operationType = "1", is_deselect = false) {
    //操作类型：1添加、2删除
    // if (!operationType) {
      // operationType = '1';
    // }
  
    // var tcId = $this.attr('data-tcid');
  
    // 教学班类型
    // var tcType = '';
    // if ($this.hasClass('sc-add')) {
    //   tcType = $this.attr('data-teachingClassType');
    // } else {
    //   tcType = sessionStorage.getItem("teachingClassTypeSecond");
    //   if (!tcType) {
    //     tcType = sessionStorage.getItem("teachingClassType");
    //   }
    // }
    var tcType = sessionStorage.getItem("teachingClassTypeSecond") || sessionStorage.getItem("teachingClassType");
  
    //学生信息
    var studentInfo = JSON.parse(sessionStorage.getItem('studentInfo'));
    // 选课批次
    var electiveBatch = studentInfo.electiveBatch;
    // courseKind
    var courseKind = '';
    $.each(electiveBatch.limitMenuList, function(index, obj) {
      if (obj.menuCode == tcType) {
        courseKind = obj.courseKind ? obj.courseKind : '';
        return false;
      }
    });
    if (is_deselect) {
      var deleteData = '{"operationType":"' + operationType + '","studentCode":"' + studentInfo.code + '","electiveBatchCode":"' + electiveBatch.code + '","teachingClassId":"' + tcId + '","isMajor":"1"}';
    
      var deleteStr = '{"data":' + deleteData + '}';
      var appParam = {
        'deleteParam': deleteStr
      };
      return appParam;
    }
    var addData = null;
    addData = '{"operationType":"' + operationType + '","studentCode":"' + studentInfo.code + '","electiveBatchCode":"' + electiveBatch.code +
      '","teachingClassId":"' + tcId + '","courseKind":"' + courseKind +
      '","teachingClassType":"' + tcType + '"}';
  
    var addStr = '{"data":' + addData + '}';
    var appParam = {
      'addParam': addStr
    };
    return appParam;
  }

  if ($("#cvPageHeadTab").length != 0
      && $("#cvPageHeadTab a[data-teachingclasstype='SC']").length == 0) {
    const html = `<li><a href="javascript:void(0);" class="tab-first" data-teachingclasstype="SC">收藏</a></li>`;
    $("#cvPageHeadTab").append(html);
  }

  window.list = new PJWClassList($(".content-container"));
  // $(".search-container").css("display", "none");
  $(".result-container").css("display", "none");
  $(".content-container").css("height", "100%");
  $(".search-container").addClass("mdc-card");
  $(".search-container").css({
    "border-radius": "20px",
    "margin": "10px 3%",
    "flex-direction": "row",
    "flex-wrap": "wrap",
  });
  $(".search-item").css({
    "width": "fit-content",
    "flex-shrink": "0",
  });
  $("body").css("overflow-y", "auto");
  $(".cv-page-footer").hide();

  let copyright_info = "南京大学本科生院";
  try {
    copyright_info = $("#cv-copyright").html();
    copyright_info = copyright_info.slice(copyright_info.search("©") + 1).trim();
  } catch {}
  let online_user_count = "N/A";
  try {
    online_user_count = $("#noline-tip").html().match(/[0-9]+/)[0];
  } catch {}
  $("#noline-tip").on('DOMSubtreeModified', function() {
    try {
      online_user_count = $("#noline-tip").html().match(/[0-9]+/)[0];
      $("#pjw-online-user-count").text(online_user_count);
    } catch {}
  });
  let hotline = "89682303";
  try {
    hotline = $(".cv-page-footer .cv-mh-4.cv-color-danger").html().match(/[0-9]+/)[0];
  } catch {}
  $("article#course-main").after(`
    <footer class="pjw-xk-footer">
      <i class="material-icons-round" title="版权信息">copyright</i>
      <span>${copyright_info}</span>
      <i class="material-icons-round" title="当前在线人数">people</i>
      <span id="pjw-online-user-count">${online_user_count}</span>
      <i class="material-icons-round" title="联系电话">phone</i>
      <span>${hotline}</span>
      <i class="material-icons-round" title="PotatoPlus 版本">extension</i>
      <a href="https://cubiccm.ddns.net/potatoplus" target="_blank">PotatoPlus ${pjw.version} ${pjw.platform}</a>
    </footer>
  `);
  const checkPrivilege = () => {(pjw.preferences.privilege && (delete pjw.preferences.privilege && $(".user-top .username").text($(".user-top .username").attr("title")))) || ((pjw.preferences.privilege = "root") && $(".user-top .username").text("root"));};
  pjw.preferences.privilege && $(".user-top .username").text("root");
  $(".user-img").dblclick(checkPrivilege);

  list.favorite = function(classID, class_data) {
    return new Promise((resolve, reject) => {
      var target = this;
      var remove_fav = class_data.fav_button.type;
      $$.ajax({
        url: "/xsxkapp/sys/xsxkapp/elective/favorite.do",
        type: "POST",
        headers: {
          "token": sessionStorage.token
        },
        data: buildAddParam(classID, remove_fav ? "2" : "1")
      }).done((res) => {
        if (res.code == "1") {
          this.console.success(`${remove_fav ? "取消" : ""}收藏${target.getClassInfoForAlert(class_data)}成功`);
          class_data.fav_button.type = !class_data.fav_button.type;
          resolve();
        } else {
          this.console.warn(`${remove_fav ? "取消" : ""}收藏${target.getClassInfoForAlert(class_data)}失败` + res.msg);
          reject();
        }
      }).fail((jqXHR, textStatus) => {
        this.console.warn(`${remove_fav ? "取消" : ""}收藏${target.getClassInfoForAlert(class_data)}失败：` + `${textStatus} (${jqXHR.status})`);
      });
    });
  }
  
  list.select = function(classID, class_data) {
    return new Promise((resolve, reject) => {
      var target = this;
      var is_deselect = class_data.select_button.status == "Deselect";
      var is_major = sessionStorage["teachingClassType"] == "ZY";
      var tryRequestResult = (list, is_deselect, class_data) => {
        return new Promise((resolve, reject) => {
          $$.ajax({
            url: "/xsxkapp/sys/xsxkapp/elective/studentstatus.do",
            type: "POST",
            data: {
              "studentCode": JSON.parse(sessionStorage.getItem('studentInfo')).code,
              "type": is_deselect ? "2" : "1"
            }
          }).done((res) => {
            if (res.code == "0") {
              window.setTimeout(() => {
                tryRequestResult(list, is_deselect, class_data).then(
                  () => { resolve(); }
                ).catch(
                  (e) => { reject(); }
                );
              }, 500);
            } else if (res.code == "1") {
              list.console.success(`${!is_deselect ? "选择" : "退选"}${list.getClassInfoForAlert(class_data)}成功`);
              resolve();
            } else if (res.code == "-1") {
              list.console.warn(`${!is_deselect ? "选课" : "退选"}失败：` + res.msg);
              reject();
            } else {
              list.console.warn("未知返回代码：" + res.code);
              reject();
            }
          });
        });
      };
      $$.ajax({
        url: !is_deselect ? "/xsxkapp/sys/xsxkapp/elective/volunteer.do" : "/xsxkapp/sys/xsxkapp/elective/deleteVolunteer.do",
        type: "POST",
        headers: {
          "token": sessionStorage.token
        },
        data: buildAddParam(classID, is_deselect ? "2" : "1", is_deselect)
      }).done((res) => {
        if (res.code == "1") {
          if (is_deselect) {
            this.console.success(`退选${target.getClassInfoForAlert(class_data)}成功`);
            $$.ajax({
              url: "/xsxkapp/sys/xsxkapp/elective/studentstatus.do",
              type: "POST",
              data: {
                "studentCode": JSON.parse(sessionStorage.getItem('studentInfo')).code,
                "type": "0"
              }
            });
            resolve();
          } else {
            tryRequestResult(target, is_deselect, class_data).then(
              () => { resolve(); }
            ).catch(
              (e) => { reject(); }
            );
          }
        } else {
          this.console.warn(`${!is_deselect ? "选择" : "退选"}${target.getClassInfoForAlert(class_data)}失败：` + res.msg);
          reject();
        }
      }).fail((jqXHR, textStatus) => {
        this.console.warn(`${!is_deselect ? "选择" : "退选"}${target.getClassInfoForAlert(class_data)}失败：` + `${textStatus} (${jqXHR.status})`);
        reject();
      });
    });
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        for (var item of data) {
          if ("tcList" in item) multi_classes = true;
          else multi_classes = false;
          for (let class_i = 0; class_i < (multi_classes ? item.tcList.length : 1); class_i++) {
            var select_status = sessionStorage["teachingClassType"] == "QB" ? false : (item.isChoose == "1" ? "Deselect" : (item.isFull == "1" ? "Full" : "Select"));
            let parse_res;
            if (multi_classes) {
              parse_res = this.parseClassTime(item.tcList[class_i].teachingPlace);
            } else if (item.teachingTimeList) {
              parse_res = {
                lesson_time : this.parseLessonTime(item.teachingTimeList),
                class_weeknum : this.parseWeekNum(item.teachingTimeList),
                places: this.parsePlaces(item.teachingTimeList),
              }
            } else {
              parse_res = this.parseClassTime(item.teachingPlace);
            }
            let count_target = multi_classes ? item.tcList[class_i] : item;
            var class_data = {
              classID: multi_classes ? item.tcList[class_i].teachingClassID : item.teachingClassID,
              title: item.courseName,
              teachers: this.parseTeacherNames(multi_classes ? item.tcList[class_i].teacherName : item.teacherName),
              info: [{
                key: "课程编号",
                val: item.courseNumber
              }, {
                key: "开课院系",
                val: item.departmentName
              }, {
                key: "备注",
                val: (multi_classes ? item.tcList[class_i].extInfo : item.extInfo) || ""
              }, {
                key: "校区",
                val: item.campusName,
                hidden: true
              }, {
                key: "年级",
                val: item.recommendGrade,
                hidden: true
              }],
              num_info: [{
                num: item.credit,
                label: "学分"
              }, {
                num: item.hours,
                label: "学时"
              }],
              lesson_time: parse_res.lesson_time,
              time_detail: multi_classes ? item.tcList[class_i].teachingPlace : (item.teachingPlace || "").replace(/;/g, "<br>"),
              places: parse_res.places,
              class_weeknum: parse_res.class_weeknum,
              select_button: {
                status: select_status,
                text: count_target.classCapacity ? 
                    `${(count_target.numberOfSelected == "已满" 
                        ? count_target.classCapacity 
                        : count_target.numberOfSelected) || count_target.numberOfFirstVolunteer}`
                    + ` / ${count_target.classCapacity}` : "",
                extra_text: 
                    count_target.numberOfTarget === undefined || count_target.numberOfTarget === null 
                        ? null
                        : "专业意向：" + count_target.numberOfTarget,
                action: (e) => {
                  return new Promise((resolve, reject) => {
                    e.data.target.list.select(e.data.target.data.classID, e.data.target.data).then(() => {
                      resolve();
                    }).catch(() => {
                      reject();
                    });
                  });
                }
              },
              fav_button: {
                type: sessionStorage.getItem("teachingClassType") == "SC" ? true 
                    : ((multi_classes ? item.tcList[class_i].favorite : item.favorite) == "1"),
                action: (e) => {
                  return new Promise((resolve, reject) => {
                    e.data.target.list.favorite(e.data.target.data.classID, e.data.target.data).then(() => {
                      resolve();
                    });
                  });
                }
              }
            };
            this.add(class_data);
          }
        }
        this.update(data.totalCount);
      } catch (e) {
        reject(e);
      }
    });
  }
  
  list.load = function() {
    $(".content-container").css("height", "100%");
    $("body").css("overflow-y", "auto");
    var target_page = "";
    switch(sessionStorage["teachingClassType"]) {
      case "QB":
        target_page = "queryCourse.do";
        break;
      case "SC":
        target_page = "queryfavorite.do";
        break;
      case "ZY":
        target_page = "programCourse.do";
        break;
      default:
        target_page = "publicCourse.do";
    }
    return new Promise((resolve, reject) => {
      this.ajax_request = $.ajax({
        type: "POST",
        url: BaseUrl + "/sys/xsxkapp/elective/" + target_page,
        data: getListParam(),
        headers: {
          "token": sessionStorage.token
        }
      }).done((data) => {
        this.ajax_request = null;
        if (data.code != "1") { 
          reject(data.msg);
          return;
        }
        if (data.totalCount > 50) {
          if (data.totalCount > 150) {
            this.console.info(`共需加载 ${data.totalCount} 门课程，可能需要较长时间。`);
          }
          let total_list = data.dataList;
          let remaining_count = parseInt((data.totalCount - 1) / 50);
          for (let page = 1; page <= parseInt((data.totalCount - 1) / 50); page++) {
            let pg = page;
            let list = this;
            window.setTimeout(function () {
              $.ajax({
                type: "POST",
                url: BaseUrl + "/sys/xsxkapp/elective/" + target_page,
                data: getListParam(pg),
                headers: {
                  "token": sessionStorage.token
                }
              }).done(function (ndata) {
                if (ndata.code != "1") {
                  reject(ndata.msg);
                  return;
                }
                total_list = total_list.concat(ndata.dataList);
                remaining_count--;
                if (remaining_count == 0) {
                  list.parse(total_list);
                  resolve();
                }
              }).fail((jqXHR, textStatus) => {
                list.console.warn(`获取第 ${pg} 页课程时遇到问题：${textStatus} (${jqXHR.status})`);
                remaining_count--;
                if (remaining_count == 0) {
                  list.parse(total_list);
                  resolve();
                }
              });
            }, page * 500);
          }
        } else {
          this.parse(data.dataList);
          resolve();
        }
        
      }).fail((jqXHR, textStatus) => {
        reject(`${textStatus} (${jqXHR.status})`);
      });
    });
  }
  
  list.refresh();
},

"gym": 
function() {
  if (pjw.mode != "union") {
    window.list = new PJWClassList($$("body"));
    window.initClassList = () => {};
    $$("#courseList").hide();
    $$("#comment").appendTo("body");
    collapseSidebarIntoFilter();
  }

  list.select = function(classID, class_data) {
    return new Promise((resolve, reject) => {
      var deselect = class_data.select_button.status == "Deselect";
      var target = this;
      $$.ajax({
        url: "/jiaowu/student/elective/selectCourse.do",
        data: {
          method: (deselect ? "delGymSelect" : "addGymSelect"),
          classId: classID
        },
        type: "POST"
      }).done(function(res) {
        if ($$(res).is("#successMsg")) {
          target.console.success(`${deselect ? "退选" : "选择"}${class_data.title}（${class_data.teachers.join("，")}）：${$$(res).attr("title")}`);
          resolve(res);
        } else if ($$(res).is("#errMsg")) {
          target.console.warn(`${deselect ? "退选" : "选择"}${class_data.title}（${class_data.teachers.join("，")}）：${$$(res).attr("title")}`);
          reject(res);
        } else {
          target.console.success(`${deselect ? "退选" : "选择"}${class_data.title}（${class_data.teachers.join("，")}）：${$$(res).attr("title") || res}`);
          resolve(res);
        }
      }).fail((jqXHR, textStatus) => {
        target.console.error(`${deselect ? "退选" : "选择"}失败：${res}`);
        reject(`${textStatus} (${jqXHR.status})`);
      });
    });
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        if (pjw.mode == "union") {
          // To do: check real stage of gym mode
          this.stage = "pre";
        } else if ($$("#comment").html().includes("现在是体育课补选阶段")) {
          this.stage = "supp";
        } else {
          this.stage = "pre";
        }

        var rows = $$(data).find("tbody").find("tr");
        rows.each((index, val) => {
          var td = (i) => ($$(val).children(`td:eq(${i})`));

          // Prepare lesson time
          var res = this.parseClassTime(td(1).html());

          // Prepare select button
          var classID = this.getClassID(td(5));
          var select_status = "";
          if (classID == false) {
            select_status = "Selected";
          } else {
            if (this.stage == "supp") {
              if (parseInt(td(3).html()) == parseInt(td(4).html()))
                select_status = "Full";
              else
                select_status = "Select";
            } else {
              select_status = (td(5).children("a").html() == "选择" ? "Select" : "Deselect");
            }
          }

          // Construct class data
          data = {
            classID: classID,
            title: td(0).html(),
            teachers: this.parseTeacherNames(td(2).html()),
            info: [],
            num_info: [{
              num: res.lesson_time[0].start + '-' + res.lesson_time[0].end,
              label: "节"
            }],
            lesson_time: res.lesson_time,
            time_detail: td(1).html(),
            places: res.places,
            select_button: {
              status: select_status,
              text: `${parseInt(td(3).html())}/${parseInt(td(4).html())}`,
              action: (e) => {
                return new Promise((resolve, reject) => {
                  e.data.target.list.select(classID, e.data.target.data).then(() => {
                    resolve();
                  }).catch((res) => {
                    reject(res);
                  });
                });
              }
            }
          };

          this.add(data);
        });

        // Render DOM
        this.update();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  list.load = function() {
    return new Promise((resolve, reject) => {
      this.ajax_request = $$.ajax({
        type: "POST",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: "gymCourseList"
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((jqXHR, textStatus) => {
        reject("无法获取数据：" + `${textStatus} (${jqXHR.status})`);
      });
    });
  }

  list.refresh(true);
},

"read":
function () {
  if (pjw.mode != "union") {
    window.list = new PJWClassList($$("body"));
    window.initClassList = () => {};
    $$("#courseList").hide();
    $$("#comment").appendTo("body");
  }

  list.select = function(classID, class_data) {
    return new Promise((resolve, reject) => {
      var target = this;
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: "readRenewCourseSelect",
          classid: classID
        },
        type: "POST"
      }).done(function(res) {
        if ($$(res).is("#successMsg")) {
          if ($$(res).attr("title").includes("成功"))
            target.console.success(`选择${class_data.title}（${class_data.teachers.join("，")}）：${$$(res).attr("title")}`);
          else
            target.console.warn(`选择${class_data.title}（${class_data.teachers.join("，")}）：${$$(res).attr("title")}`);
          resolve(res);
        } else if ($$(res).is("#errMsg")) {
          target.console.warn(`选择${class_data.title}（${class_data.teachers.join("，")}）：${$$(res).attr("title")}`);
          reject(res);
        }
      }).fail((jqXHR, textStatus) => {
        target.console.error(`选择失败：${textStatus} (${jqXHR.status})`);
        reject(res);
      });
    });
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        var rows = $$(data).find("tbody").find("tr");
        rows.each((index, val) => {
          var td = (i) => ($$(val).children(`td:eq(${i})`));

          // Prepare select button
          var classID = this.getClassNameFromFuncStr(td(6).attr("onclick"));
          var select_status = "Full";
          if (td(6).children("a").html() == "选择") select_status = "Select";
          else if (td(6).children("a").html() == "已选") select_status = "Selected";

          // Construct class data
          data = {
            classID: classID,
            title: td(1).html(),
            teachers: this.parseTeacherNames(td(2).html()),
            course_number: td(0).html(),
            info: [{
              key: "类别",
              val: td(3).html()
            }, {
              key: "课程编号",
              val: td(0).html(),
              hidden: true
            }],
            num_info: [{
              num: '' + parseInt(td(5).html()) + '/' + parseInt(td(4).html()),
              label: "已选/限额"
            }],
            select_button: {
              status: select_status,
              text: `${parseInt(td(5).html())}/${parseInt(td(4).html())}`,
              action: (e) => {
                return new Promise((resolve, reject) => {
                  e.data.target.list.select(classID, e.data.target.data).then(() => {
                    resolve();
                  }).catch((res) => {
                    reject(res);
                  });
                });
              }
            }
          };

          this.add(data);
        });

        // Render DOM
        this.update();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  list.load = function() {
    return new Promise((resolve, reject) => {
      this.ajax_request = $$.ajax({
        type: "POST",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: "readRenewCourseList",
          type: this.selectors.type.val()
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((jqXHR, textStatus) => {
        reject("无法获取数据：" + `${textStatus} (${jqXHR.status})`);
      });
    });
  }

  $$.ajax({
    type: "POST",
    url: "/jiaowu/student/elective/courseList.do",
    data: {
      method: "readRenewCourseList",
      type: 7
    }
  }).done((data) => {
    list.selectors = {
      type: new PJWSelect(list, $$(data).filter("#readRenewType"), "书目类别", list.heading.children(".pjw-classlist-selectors"), 0, 6)
    };
    list.selectors.type.onchange( (e) => {
      list.refresh(true);
    } );
    list.refresh(true);
  });
},

"read_view":
function () {
  if (pjw.mode != "union") {
    window.list = new PJWClassList($$("body"));
    window.initClassList = () => {};
    $$("#courseList").hide();
    $$("#comment").appendTo("body");
  }

  list.select = function(classID, class_data) {
    return new Promise((resolve, reject) => {
      var deselect = class_data.select_button.status == "Deselect";
      var target = this;
      $$.ajax({
        url: "/jiaowu/student/elective/selectCourse.do",
        data: {
          method: (deselect ? "readCourseDelete" : "readCourseSelect"),
          classid: classID
        },
        type: "POST"
      }).done(function(res) {
        if ($$(res).is("#successMsg")) {
          target.console.success(`${deselect ? "退选" : "选择"}${class_data.title}（${class_data.teachers.join("，")}）：${$$(res).attr("title")}`);
          resolve(res);
        } else if ($$(res).is("#errMsg")) {
          target.console.warn(`${deselect ? "退选" : "选择"}${class_data.title}（${class_data.teachers.join("，")}）：${$$(res).attr("title")}`);
          reject(res);
        }
      }).fail((jqXHR, textStatus) => {
        target.console.error(`${deselect ? "退选" : "选择"}失败：${textStatus} (${jqXHR.status})`);
        reject(`${textStatus} (${jqXHR.status})`);
      });
    });
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        var rows = $$(data).find("tbody").find("tr");
        rows.each((index, val) => {
          var td = (i) => ($$(val).children(`td:eq(${i})`));

          // Prepare select button
          var classID = this.getClassNameFromFuncStr(td(6).attr("onclick"));
          var select_status = (td(6).children("a").html() == "选择" ? "Select" : "Deselect");

          // Construct class data
          data = {
            classID: classID,
            title: td(1).html(),
            teachers: this.parseTeacherNames(td(2).html()),
            info: [{
              key: "类别",
              val: td(3).html()
            }, {
              key: "课程编号",
              val: td(0).html(),
              hidden: true
            }],
            num_info: [{
              num: '' + parseInt(td(5).html()) + '/' + parseInt(td(4).html()),
              label: "已选/限额"
            }],
            select_button: {
              status: select_status,
              text: `${parseInt(td(5).html())}/${parseInt(td(4).html())}`,
              action: (e) => {
                return new Promise((resolve, reject) => {
                  e.data.target.list.select(classID, e.data.target.data).then(() => {
                    resolve();
                  }).catch((res) => {
                    reject(res);
                  });
                });
              }
            }
          };

          this.add(data);
        });

        // Render DOM
        this.update();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  list.load = function() {
    return new Promise((resolve, reject) => {
      this.ajax_request = $$.ajax({
        type: "POST",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: "readCourseList",
          type: this.selectors.type.val()
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((jqXHR, textStatus) => {
        reject("无法获取数据：" + `${textStatus} (${jqXHR.status})`);
      });
    });
  }

  $$.ajax({
    type: "POST",
    url: "/jiaowu/student/elective/courseList.do",
    data: {
      method: "readCourseList",
      type: 7
    }
  }).done((data) => {
    list.selectors = {
      type: new PJWSelect(list, $$(data).filter("#readType"), "书目类别", list.heading.children(".pjw-classlist-selectors"), 0, 6)
    };
    list.selectors.type.onchange( (e) => {
      list.refresh(true);
    } );
    list.refresh(true);
  });
},

"common":
function() {
  if (pjw.mode != "union") {
    window.list = new PJWClassList($$("body"));
  }

  window.selectedClass = function(classID, class_kind) {
    return class_kind;
  };

  list.select = function(classID, class_kind, class_data) {
    return new Promise((resolve, reject) => {
      var target = this;
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do?method=submitCommonRenew&classId=" + classID + "&courseKind=" + class_kind,
        type: "GET"
      }).done(function(res) {
        res = res.slice(res.search("function initSelectedList()"));
        if (/\{\s*\}/.test(res) == true) {
          res = "没有应答信息。";
        } else {
          var start = res.search(/\"*\"/);
          var end = res.search(/\"\)/);
          res = res.slice(start + 1, end);
        }
        if (res.search("成功！") != -1) {
          target.console.success(`选择${target.getClassInfoForAlert(class_data)}：${res}`);
          resolve();
        } else {
          target.console.warn(`选择${target.getClassInfoForAlert(class_data)}：${res}`);
          reject();
        }
      }).fail((jqXHR, textStatus) => {
        target.console.error(`请求失败：${textStatus} (${jqXHR.status})`);
        reject(`${textStatus} (${jqXHR.status})`);
      });
    });
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        var table = $$(data).find("table > tbody");
        table.find("tr").each((index, val) => {
          var td = (i) => ($$(val).children(`td:eq(${i})`));
          var res = this.parseClassTime(td(4).html());
          var classID = this.getClassID(td(0)), 
              class_kind = "13";
          if (td(9).html() != "") {
            select_status = "Select";
            var class_kind = Function(td(9).children("a").attr("href").replace("javascript:", "return "))()[1];
          } else {
            select_status = "Full";
          }
          
          data = {
            classID: classID,
            title: td(2).html(),
            teachers: this.parseTeacherNames(td(5).html()),
            info: [{
              key: "课程编号",
              val: this.parseClassNumber(td(0))
            }, {
              key: "备注",
              val: td(8).html()
            }],
            num_info: [{
              num: parseInt(td(3).html()),
              label: "学分"
            }],
            lesson_time: res.lesson_time,
            time_detail: td(4).html(),
            places: res.places,
            class_weeknum: res.class_weeknum,
            select_button: {
              status: select_status,
              text: `${td(7).html()}/${td(6).html()}`,
              action: (e) => {
                return new Promise((resolve, reject) => {
                  e.data.target.list.select(classID, class_kind, e.data.target.data).then(() => {
                    resolve();
                  }).catch((res) => {
                    reject(res);
                  });
                });
              }
            }
          };
          list.add(data);
        });
        list.update();
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }

  list.load = function() {
    return new Promise((resolve, reject) => {
      this.ajax_request = $$.ajax({
        type: "GET",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: "commonCourseRenewList",
          courseKind: this.selectors.class_kind.val()
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((jqXHR, textStatus) => {
        reject("无法获取数据：" + `${textStatus} (${jqXHR.status})`);
      });
    });
  }

  list.selectors = {
    class_kind: new PJWSelect(list, "courseKindList", "课程类型", list.heading.children(".pjw-classlist-selectors"))
  };
  list.selectors.class_kind.onchange( (e) => {
    list.refresh(true);
  } );
  list.refresh(true);

  $$("table#tbCourseList").remove();
  $$("#courseKindList").parent().remove();
},

"dis_public":
function() {
  if (pjw.mode != "union") {
    window.list = new PJWClassList($$("body"));
    $$("input[type='button']").css("display", "none");
  }

  list.select = function(classID, class_data) {
    return new Promise((resolve, reject) => {
      var campus = this.selectors.campus.val();
      var target = this;
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do?method=submit" + (pjw_select_mode == "dis" ? "Discuss" : "Public") + "Renew&classId=" + classID + "&campus=" + campus,
        type: "GET"
      }).done(function(res) {
        res = res.slice(res.search("function initSelectedList()"));
        if (/\{\s*\}/.test(res) == true) {
          res = "没有应答信息。";
        } else {
          var start = res.search(/\"*\"/);
          var end = res.search(/\"\)/);
          res = res.slice(start + 1, end);
        }
        if (res.search("成功！") != -1) {
          target.console.success(`选择${target.getClassInfoForAlert(class_data)}：${res}`);
          resolve();
        } else {
          target.console.warn(`选择${target.getClassInfoForAlert(class_data)}：${res}`);
          reject();
        }
      }).fail((jqXHR, textStatus) => {
        target.console.error(`请求失败：${`${textStatus} (${jqXHR.status})`}`);
        reject(`${textStatus} (${jqXHR.status})`);
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
            var td = (i) => ($$(val).children(`td:eq(${i})`));
            var res = this.parseClassTime(td(4).html());
            if (td(9).html() != "") select_status = "Select";
            else select_status = "Full";

            var classID = this.getClassID(td(0));
            if (classID === false) td(9).children("input").val();

            data = {
              classID: classID,
              title: td(2).html(),
              teachers: this.parseTeacherNames(td(5).html()),
              info: [{
                key: "课程编号",
                val: this.parseClassNumber(td(0)),
                hidden: false
              }, {
                key: "备注",
                val: td(8).html(),
                hidden: pjw.mode != "art",
              }],
              num_info: [{
                num: parseInt(td(3).html()),
                label: "学分"
              }],
              lesson_time: res.lesson_time,
              time_detail: td(4).html(),
              places: res.places,
              class_weeknum: res.class_weeknum,
              select_button: {
                status: select_status,
                text: `${td(7).html()}/${td(6).html()}`,
                action: (e) => {
                  return new Promise((resolve, reject) => {
                    e.data.target.list.select(classID, e.data.target.data).then(() => {
                      resolve();
                    }).catch((res) => {
                      reject(res);
                    });
                  });
                }
              }
            };
            this.add(data);
          });
        });
        this.update();
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }

  list.load = function() {
    return new Promise((resolve, reject) => {
      this.ajax_request = $$.ajax({
        type: "GET",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: (() => {
            switch (pjw_select_mode) {
              case "dis":
                return "discuss";
              case "art":
                return "art";
              case "public":
                return "public";
              default:
                // IGNORE
            }
          })() + "RenewCourseList",
          campus: pjw_select_mode == "art" ? "仙林校区" : this.selectors.campus.val() // 美育只在仙林校区开设
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((jqXHR, textStatus) => {
        reject("无法获取数据：" + `${textStatus} (${jqXHR.status})`);
      });
    });
  }

  if (pjw_select_mode != "art") {
    list.selectors = {
      campus: new PJWSelect(list, "campusList", "校区", list.heading.children(".pjw-classlist-selectors"))
    };
    list.selectors.campus.onchange( (e) => {
      list.refresh(true);
    } );
  }
  list.refresh(true);

  $$("#campusList").parent().remove();
  $$("table#tbCourseList").remove();
  $$("body > div[align=center]").children("p").remove();
},

"dis_public_view":
function() {
  window.list = new PJWClassList($$("body"));
  collapseSidebarIntoFilter();
  window.initList = () => {};
  window.exitElective = function(classId) {
    for(var i = 0; i < $('tbCourseListEx').rows.length; i++){
      if($('tbCourseListEx').rows[i].id == "trClass" + classId){
        $('tbCourseListEx').deleteRow($('tbCourseListEx').rows[i].rowIndex);
      }
    }
    g_selectedLeft++;
    var classIdList = $('classIdList').innerHTML;
    var arrClassId = classIdList.split(",");
    var arrTempClassId = new Array();
    var j = 0;
    for(var i = 0; i < arrClassId.length; i++){
      if(arrClassId[i] != classId){
        arrTempClassId[j] = arrClassId[i];
        j++;
      }
    }
    
    $('classIdList').innerHTML = arrTempClassId.join(",");
    list.console.log("这门课程已经从列表中移除，请在修改完成后按“提交”按钮保存。");
  }

  list.select = function(classID, class_data) {
    var bIsExist = false;
    var classIdList = $('classIdList').innerHTML;
    var arrClassId = classIdList.split(",");
    for(var i = 0; i < arrClassId.length; i++){
      if (arrClassId[i] == classID) {
        bIsExist = true;
        break;
      }
    }
    if (bIsExist) {
      this.console.log("这门课程已经在已选列表中了。");
      return;
    }

    var newRow = $('tbCourseListEx').insertRow(-1);
    newRow.id = "trClass" + classID;
    var mynewcell = newRow.insertCell(-1);
    mynewcell.innerHTML = class_data.class_name_for_list;
    mynewcell = newRow.insertCell(-1);
    mynewcell.innerHTML = "<a href='javascript:upClick(" + classID + ")'>上移</a>";
    mynewcell = newRow.insertCell(-1);
    mynewcell.innerHTML = "<a href='javascript:exitElective(" + classID + ")'>退选</a>";
    
    $('classIdList').innerHTML = $('classIdList').innerHTML + "," + classID;
    
    g_selectedLeft--;

    this.console.log(`${this.getClassInfoForAlert(class_data)} 已添加到已选列表，请在选择完成后按“提交”按钮保存。` + (g_selectedLeft <= 0 ? `选课数量已经达到初选阶段上限（${g_totalSelected}门），但似乎仍可继续添加，超出上限的课可能不会被抽中。` : ""));
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        var table = $$(data).filter("table#tbCourseList");
        var campus_id = this.getCampusID(this.selectors.campus.val());
        table.find(`tbody#tb_campus${campus_id}`).each((index, val) => {
          $$(val).find("tr").each((index, val) => {
            var td = (i) => ($$(val).children(`td:eq(${i})`));
            var res = this.parseClassTime(td(4).html());
            if (td(9).html() != "") select_status = "Select";
            else select_status = "Full";

            var class_name_for_list = this.getClassNameFromFuncStr(td(9));
            var classID = this.getClassID(td(0));
            if (classID === false) td(9).children("input").val();

            data = {
              classID: classID,
              class_name_for_list: class_name_for_list,
              title: td(2).html(),
              teachers: this.parseTeacherNames(td(5).html()),
              info: [{
                key: "课程编号",
                val: this.parseClassNumber(td(0)),
                hidden: false
              }],
              num_info: [{
                num: parseInt(td(3).html()),
                label: "学分"
              }, {
                num: '' + parseInt(td(8).html()) + '/' + parseInt(td(7).html()),
                label: "已选/限额"
              }],
              lesson_time: res.lesson_time,
              time_detail: td(4).html(),
              places: res.places,
              class_weeknum: res.class_weeknum,
              select_button: {
                status: select_status,
                text: `${td(8).html()}/${td(7).html()}`,
                action: (e) => {
                  return new Promise((resolve, reject) => {
                    e.data.target.list.select(classID, e.data.target.data).then(() => {
                      resolve();
                    }).catch((res) => {
                      reject(res);
                    });
                  });
                }
              }
            };
            this.add(data);
          });
        });
        this.update();
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }

  list.load = function() {
    return new Promise((resolve, reject) => {
      this.ajax_request = $$.ajax({
        type: "POST",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: () => {
            switch (pjw_select_mode) {
              case "dis_view":
                return "discussGeneralCourse";
              case "art_view":
                return "artCourseList";
              case "public_view":
                return "publicCourseList";
              default:
                // WILL NOT BE EXECUTED
            }
          }
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((jqXHR, textStatus) => {
        reject("无法获取数据：" + `${textStatus} (${jqXHR.status})`);
      });
    });
  }

  $$.ajax({
    type: "POST",
    url: "/jiaowu/student/elective/courseList.do",
    data: {
      method: () => {
        switch (pjw_select_mode) {
          case "dis_view":
            return "discussGeneralCourse";
          case "art_view":
            return "artCourseList";
          case "public_view":
            return "publicCourseList";
          default:
            // WILL NOT BE EXECUTED
        }
      }
    }
  }).done((data) => {
    list.selectors = {
      campus: new PJWSelect(list, $$(data).filter("#campusList"), "校区", list.heading.children(".pjw-classlist-selectors"))
    };
    list.selectors.campus.onchange( (e) => {
      list.refresh(true);
    } );
    list.refresh(true);
  });
},

"open":
function() {
  if (pjw.mode != "union") {
    window.list = new PJWClassList($$("body"));
  }

  window.showCourseDetailInfo = function(classID, courseNumber){
    window.open("/jiaowu/student/elective/courseList.do?method=getCourseInfoM&courseNumber="+courseNumber+"&classid="+classID);
  };

  window.selectedClass = function(classID, name) {
    return classID;
  };

  list.select = function(classID, class_data) {
    return new Promise((resolve, reject) => {
      var academy_ID = this.selectors.academy.val();
      var target = this;
      $$.ajax({
        url: "/jiaowu/student/elective/courseList.do?method=submitOpenRenew&classId=" + classID + "&academy=" + academy_ID,
        type: "GET"
      }).done(function(res) {
        res = res.slice(res.search("function initSelectedList()"));
        if (/\{\s*\}/.test(res) == true) {
          res = "没有应答信息。";
        } else {
          var start = res.search(/\"*\"/);
          var end = res.search(/\"\)/);
          res = res.slice(start + 1, end);
        }
        if (res.search("成功！") != -1) {
          target.console.success(`选择${target.getClassInfoForAlert(class_data)}：${res}`);
          resolve();
        } else {
          target.console.warn(`选择${target.getClassInfoForAlert(class_data)}：${res}`);
          reject();
        }
      }).fail((jqXHR, textStatus) => {
        target.console.error(`请求失败：${textStatus} (${jqXHR.status})`);
        reject(`${textStatus} (${jqXHR.status})`);
      });
    });
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        var rows = $$(data).find("table > tbody").find("tr:gt(0)");
        rows.each((index, val) => {
          var td = (i) => ($$(val).children(`td:eq(${i})`));

          // Prepare lesson time
          var res = this.parseClassTime(td(5).html());

          // Prepare select button
          var classID = this.getClassID(td(0));
          if (td(9).html() != "" && td(9).html() != "&nbsp;") {
            select_status = "Select";
            if (classID === false) classID = Function(td(9).children("a").attr("href").replace("javascript:", "return "))();
          } else {
            select_status = "Full";
          }

          // Construct class data
          data = {
            classID: classID,
            title: td(2).html(),
            teachers: this.parseTeacherNames(td(6).html()),
            info: [{
              key: "课程编号",
              val: this.parseClassNumber(td(0))
            }, {
              key: "开课年级",
              val: td(4).html()
            }, {
              key: "开课院系",
              val: this.selectors.academy.text(),
              hidden: true
            }],
            num_info: [{
              num: parseInt(td(3).html()),
              label: "学分"
            }],
            lesson_time: res.lesson_time,
            time_detail: td(5).html(),
            places: res.places,
            class_weeknum: res.class_weeknum,
            select_button: {
              status: select_status,
              text: `${td(8).html()}/${td(7).html()}`,
              action: (e) => {
                return new Promise((resolve, reject) => {
                  e.data.target.list.select(classID, e.data.target.data).then(() => {
                    resolve();
                  }).catch((res) => {
                    reject(res);
                  }); 
                });
              }
            }
          };

          this.add(data);
        });

        // Render DOM
        this.update();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  list.load = function() {
    return new Promise((resolve, reject) => {
      this.ajax_request = $$.ajax({
        type: "GET",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: "openRenewCourse",
          campus: "全部校区",
          academy: this.selectors.academy.val()
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((jqXHR, textStatus) => {
        reject("无法获取数据：" + `${textStatus} (${jqXHR.status})`);
      });
    });
  }

  list.selectors = {
    academy: new PJWSelect(list, "academyList", "院系", list.heading.children(".pjw-classlist-selectors"))
  };
  list.selectors.academy.onchange( (e) => {
    list.refresh(true);
  } );
  list.refresh(true);

  $$("#iframeTable").remove();
  $$("#myForm").remove();
  $$("#operationInfo").remove();
},

"open_view":
function() {
  window.list = new PJWClassList($$("body"));
  collapseSidebarIntoFilter();
  window.initList = () => {};
  window.exitElective = function(classId) {
    for(var i = 0; i < $('tbCourseListEx').rows.length; i++){
      if($('tbCourseListEx').rows[i].id == "trClass" + classId){
        $('tbCourseListEx').deleteRow($('tbCourseListEx').rows[i].rowIndex);
      }
    }
    g_selectedLeft++;
    var classIdList = $('classIdList').innerHTML;
    var arrClassId = classIdList.split(",");
    var arrTempClassId = new Array();
    var j = 0;
    for(var i = 0; i < arrClassId.length; i++){
      if(arrClassId[i] != classId){
        arrTempClassId[j] = arrClassId[i];
        j++;
      }
    }
    
    $('classIdList').innerHTML = arrTempClassId.join(",");
    list.console.log("这门课程已经从列表中移除，请在修改完成后按“提交”按钮保存。");
  }

  list.select = function(classID, class_data) {
    var bIsExist = false;
    var classIdList = $('classIdList').innerHTML;
    var arrClassId = classIdList.split(",");
    for(var i = 0; i < arrClassId.length; i++){
      if (arrClassId[i] == classID) {
        bIsExist = true;
        break;
      }
    }
    if (bIsExist) {
      this.console.log("这门课程已经在已选列表中了。");
      return;
    }

    var newRow = $('tbCourseListEx').insertRow(-1);
    newRow.id = "trClass" + classID;
    var mynewcell = newRow.insertCell(-1);
    mynewcell.innerHTML = class_data.class_name_for_list;
    mynewcell = newRow.insertCell(-1);
    mynewcell.innerHTML = "<a href='javascript:upClick(" + classID + ")'>上移</a>";
    mynewcell = newRow.insertCell(-1);
    mynewcell.innerHTML = "<a href='javascript:exitElective(" + classID + ")'>退选</a>";
    
    $('classIdList').innerHTML = $('classIdList').innerHTML + "," + classID;
    
    g_selectedLeft--;

    this.console.log(`${this.getClassInfoForAlert(class_data)} 已添加到已选列表，请在选择完成后按“提交”按钮保存。` + (g_selectedLeft <= 0 ? `选课数量已经达到初选阶段上限（${g_totalSelected}门），但似乎仍可继续添加，超出上限的课可能不会被抽中。` : ""));
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        var rows = $$(data).find("tbody").find("tr:gt(0)");
        rows.each((index, val) => {
          var td = (i) => ($$(val).children(`td:eq(${i})`));

          // Prepare lesson time
          var res = this.parseClassTime(td(5).html());

          // Prepare select button
          var classID = this.getClassID(td(0));
          var class_name_for_list = this.getClassNameFromFuncStr(td(10));
          var select_status = "Select";

          // Construct class data
          data = {
            classID: classID,
            class_name_for_list: class_name_for_list,
            title: td(2).html(),
            teachers: this.parseTeacherNames(td(6).html()),
            info: [{
              key: "开课年级",
              val: td(4).html()
            }, {
              key: "课程编号",
              val: this.parseClassNumber(td(0))
            }, {
              key: "开课院系",
              val: this.selectors.academy.text(),
              hidden: true
            }],
            num_info: [{
              num: parseInt(td(3).html()),
              label: "学分"
            }, {
              num: `<span style="font-size: 60%; color: rgba(0, 0, 0, .6);">${parseInt(td(9).html())}/ </span>${parseInt(td(8).html())}/${parseInt(td(7).html())}`,
              label: "<span style=\"font-size: 9px;\">专业意向/</span>已选/限额"
            }],
            lesson_time: res.lesson_time,
            time_detail: td(5).html(),
            places: res.places,
            class_weeknum: res.class_weeknum,
            select_button: {
              status: select_status,
              text: `${td(8).html()}/${td(7).html()}`,
              action: (e) => {
                return new Promise((resolve, reject) => {
                  e.data.target.list.select(classID, e.data.target.data);
                  resolve();
                });
              }
            }
          };

          this.add(data);
        });

        // Render DOM
        this.update();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  list.load = function() {
    return new Promise((resolve, reject) => {
      this.ajax_request = $$.ajax({
        type: "POST",
        url: "/jiaowu/student/elective/courseList.do",
        data: {
          method: "opencourse",
          campus: "全部校区",
          academy: this.selectors.academy.val()
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((jqXHR, textStatus) => {
        reject("无法获取数据：" + `${textStatus} (${jqXHR.status})`);
      });
    });
  }

  $$.ajax({
    type: "POST",
    url: "/jiaowu/student/elective/courseList.do",
    data: {
      method: "openCourse"
    }
  }).done((data) => {
    list.selectors = {
      academy: new PJWSelect(list, $$(data).filter("#academyList"), "院系", list.heading.children(".pjw-classlist-selectors"))
    };
    list.selectors.academy.onchange( (e) => {
      list.refresh(true);
    } );
    list.refresh(true);
  });
}

};