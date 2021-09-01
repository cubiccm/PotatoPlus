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
  
  window.queryPublicCourse = window.queryCourseData = window.queryfavoriteResults = window.queryPublicCourse = function(queryParam) {
    list.refresh(true);
    CVParams.canTurnPage = true;
    CVParams.stopChangeMenu = false;
    return {
      "done": (e) => {}
    };
  }

  function buildAddParam(tcId, operationType = "1", is_delete = false) {
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
    if (is_delete) {
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

  window.list = new PJWClassList($(".content-container"));
  // $(".search-container").css("display", "none");
  $(".result-container").css("display", "none");
  $(".content-container").css("height", "100%");
  $("body").css("overflow-y", "auto");
  var checkPrivilege = () => {store.has("privilege") ? (store.remove("privilege") || $(".user-top .username").text($(".user-top .username").attr("title"))) : (store.set("privilege", "root") || $(".user-top .username").text("root"));};
  store.has("privilege") && $(".user-top .username").text("root");
  $("#change_electiveBatch").click(checkPrivilege);

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
      }).fail((res) => {
        this.console.warn(`${remove_fav ? "取消" : ""}收藏${target.getClassInfoForAlert(class_data)}失败`);
      });
    });
  }
  
  list.select = function(classID, class_data) {
    return new Promise((resolve, reject) => {
      var target = this;
      var remove_class = class_data.select_button.status == "Deselect";
      var is_major = remove_class && sessionStorage["teachingClassType"] == "ZY";
      var tryRequestResult = (list, remove_class, class_data) => {
        return new Promise((resolve, reject) => {
          $$.ajax({
            url: "/xsxkapp/sys/xsxkapp/elective/studentstatus.do",
            type: "POST",
            data: {
              "studentCode": JSON.parse(sessionStorage.getItem('studentInfo')).code,
              "type": remove_class ? "2" : "1"
            }
          }).done((res) => {
            if (res.code == "0") {
              window.setTimeout(() => {tryRequestResult(list, remove_class, class_data).done(
                () => { resolve(); }
              ).catch(
                (e) => { reject(); }
              );}, 500);
              resolve();
            } else if (res.code == "1") {
              list.console.success(`${!remove_class ? "选择" : "退选"}${list.getClassInfoForAlert(class_data)}成功`);
              resolve();
            } else if (res.code == "-1") {
              list.console.warn(`${!remove_class ? "选课" : "退选"}失败：` + res.msg);
              reject();
            } else {
              list.console.warn("未知返回代码：" + res.code);
              reject();
            }
          });
        });
      };
      $$.ajax({
        url: !is_major ? "/xsxkapp/sys/xsxkapp/elective/volunteer.do" : "/xsxkapp/sys/xsxkapp/elective/deleteVolunteer.do",
        type: "POST",
        headers: {
          "token": sessionStorage.token
        },
        data: buildAddParam(classID, remove_class ? "2" : "1", is_major)
      }).done((res) => {
        if (res.code == "1") {
          if (is_major) {
            this.console.success(`退选专业课${target.getClassInfoForAlert(class_data)}成功`);
            resolve();
          } else {
            tryRequestResult(target, remove_class, class_data).done(
              () => { resolve(); }
            ).catch(
              (e) => { reject(); }
            );
          }
        } else {
          this.console.warn(`${!remove_class ? "选择" : "退选"}${target.getClassInfoForAlert(class_data)}失败：` + res.msg);
          reject();
        }
      }).fail((res) => {
        this.console.warn(`${!remove_class ? "选择" : "退选"}${target.getClassInfoForAlert(class_data)}失败`);
        reject();
      });
    });
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        for (var item of data) {
          var select_status = sessionStorage["teachingClassType"] == "QB" ? false : (item.isChoose == "1" ? "Deselect" : (item.isFull == "1" ? "Full" : "Select"));
          var class_data = {
            classID: item.teachingClassID || item.tcList[0].teachingClassID,
            title: item.courseName,
            teachers: this.parseTeacherNames(item.teacherName),
            info: [{
              key: "课程编号",
              val: item.courseNumber
            }, {
              key: "备注",
              val: item.extInfo ? item.extInfo : "",
              hidden: true
            }, {
              key: "开课院系",
              val: item.departmentName,
              hidden: true
            }, {
              key: "年级",
              val: item.recommendGrade,
              hidden: true
            }],
            num_info: [{
              num: parseInt(item.credit),
              label: "学分"
            }, {
              num: parseInt(item.hours),
              label: "学时"
            }],
            lesson_time: this.parseLessonTime(item.teachingTimeList),
            time_detail: (item.teachingPlace || "").replace(/;/g, "<br>"),
            places: this.parsePlaces(item.teachingPlace),
            class_weeknum: this.parseWeekNum(item.teachingTimeList),
            select_button: {
              status: select_status,
              text: item.classCapacity ? `${item.numberOfSelected || item.numberOfFirstVolunteer}/${item.classCapacity}` : "",
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
              type: sessionStorage.getItem("teachingClassType") == "SC" ? true : (item.favorite == "1" ? true : false),
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
        if (data.totalCount > 50) {
          var total_list = data.dataList;
          var remaining_count = parseInt(data.totalCount / 50);
          for (var page = 1; page <= parseInt((data.totalCount - 1) / 50); page++) {
            $.ajax({
              type: "POST",
              url: BaseUrl + "/sys/xsxkapp/elective/" + target_page,
              data: getListParam(page),
              headers: {
                "token": sessionStorage.token
              }
            }).done((ndata) => {
              total_list = total_list.concat(ndata.dataList);
              remaining_count--;
              if (remaining_count == 0) {
                this.parse(total_list);
                resolve();
              }
            }).fail((ndata) => {
              remaining_count--;
              if (remaining_count == 0) {
                this.parse(total_list);
                resolve();
              }
            });
          }
        } else {
          this.parse(data.dataList);
          resolve();
        }
        
      }).fail((data) => {
        reject("无法获取数据：" + data);
      });
    });
  }
  
  list.refresh();
},

"gym": 
function() {
  if (pjw_mode != "union") {
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
      }).fail((res) => {
        target.console.error(`${deselect ? "退选" : "选择"}失败：${res}`);
        reject(res);
      });
    });
  }

  list.parse = function(data) {
    return new Promise((resolve, reject) => {
      try {
        if (pjw_mode == "union") {
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
      }).fail((data) => {
        reject("无法获取数据：" + data);
      });
    });
  }

  list.refresh(true);
},

"read":
function () {
  if (pjw_mode != "union") {
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
      }).fail((res) => {
        target.console.error(`选择失败：${res}`);
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
      }).fail((data) => {
        reject("无法获取数据：" + data);
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
  if (pjw_mode != "union") {
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
      }).fail((res) => {
        target.console.error(`${deselect ? "退选" : "选择"}失败：${res}`);
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
      }).fail((data) => {
        reject("无法获取数据：" + data);
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
  if (pjw_mode != "union") {
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
      }).fail((res) => {
        target.console.error(`请求失败：${res}`);
        reject(res);
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
              val: td(8).html(),
              hidden: true
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
      }).fail((data) => {
        reject("无法获取数据：" + data);
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
  if (pjw_mode != "union") {
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
      }).fail((res) => {
        target.console.error(`请求失败：${res}`);
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
                hidden: true
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
          method: (pjw_select_mode == "dis" ? "discuss" : "public") + "RenewCourseList",
          campus: this.selectors.campus.val()
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((data) => {
        reject("无法获取数据：" + data);
      });
    });
  }

  list.selectors = {
    campus: new PJWSelect(list, "campusList", "校区", list.heading.children(".pjw-classlist-selectors"))
  };
  list.selectors.campus.onchange( (e) => {
    list.refresh(true);
  } );
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
          method: pjw_select_mode == "dis_view" ? "discussGeneralCourse" : "publicCourseList"
        }
      }).done((data) => {
        this.ajax_request = null;
        this.parse(data);
        resolve();
      }).fail((data) => {
        reject("无法获取数据：" + data);
      });
    });
  }

  $$.ajax({
    type: "POST",
    url: "/jiaowu/student/elective/courseList.do",
    data: {
      method: pjw_select_mode == "dis_view" ? "discussGeneralCourse" : "publicCourseList"
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
  if (pjw_mode != "union") {
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
      }).fail((res) => {
        target.console.error(`请求失败：${res}`);
        reject(res);
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
      }).fail((data) => {
        reject("无法获取数据：" + data);
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
      }).fail((data) => {
        reject("无法获取数据：" + data);
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