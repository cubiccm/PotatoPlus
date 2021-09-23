var pjw_filter = {
  /* avail module v1.3 */
  avail: {
    html: `
      <div id="pjw-avail-filter" class="pjw-filter-module" data-switch="pjw-filter-avail-switch">
        <div class="pjw-filter-module-header">
          <span class="material-icons-round pjw-filter-module-icon">add_task</span>
          <div class="pjw-filter-module-title__container">
            <span class="pjw-filter-module-title">满额课程</span>
            <span class="pjw-filter-module-info">过滤人数已满课程</span>
          </div>
          <div class="mdc-switch" id="pjw-filter-avail-switch">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__thumb-underlay">
              <div class="mdc-switch__thumb"></div>
              <input type="checkbox" class="mdc-switch__native-control" role="switch" aria-checked="false">
            </div>
          </div>
        </div>

        <div class="content">
          <div class="pjw-switch-box" id="pjw-deselect-switch-box">
            <div class="mdc-switch" id="pjw-deselect-switch">
              <div class="mdc-switch__track"></div>
              <div class="mdc-switch__thumb-underlay">
                <div class="mdc-switch__thumb"></div>
                <input type="checkbox" id="pjw-deselect-switch-input" class="mdc-switch__native-control" role="switch" aria-checked="false">
              </div>
            </div>
            <label for="pjw-deselect-switch-input">隐藏已选课程</label>
          </div>
        </div>
      </div>
    `,
    intl: (space, list) => {
      space.dom = $$("#pjw-avail-filter");
      space.deselect_switch = new mdc.switchControl.MDCSwitch($$("#pjw-deselect-switch")[0]);

      space.keep_deselect = true;
      space.dom.find("#pjw-deselect-switch").on("change", null, {
        space: space,
        list: list
      }, (e) => {
        e.data.space.keep_deselect = !e.data.space.deselect_switch.checked;
        e.data.list.update();
      });
    },
    check: (space, data) => {
      if ("select_button" in data && data.select_button.status !== false) {
        if (data.select_button.status == "Deselect" && space.keep_deselect)
          return 0;
        else if (data.select_button.status != "Select")
          return false;
      }
      return 0;
    }
  }, 

  /* hours module v0.5 */
  hours: {
    html: `
      <div id="pjw-hours-filter" class="pjw-filter-module" data-switch="pjw-filter-hours-switch">
        <div class="pjw-filter-module-header">
          <span class="material-icons-round pjw-filter-module-icon">schedule</span>
          <div class="pjw-filter-module-title__container">
            <span class="pjw-filter-module-title">课程时间</span>
            <span class="pjw-filter-module-info">按上课时间筛选课程</span>
          </div>
          <div class="mdc-switch" id="pjw-filter-hours-switch">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__thumb-underlay">
              <div class="mdc-switch__thumb"></div>
              <input type="checkbox" class="mdc-switch__native-control" role="switch" aria-checked="false">
            </div>
          </div>
        </div>
        <div class="content">
          <div class="pjw-class-weekcal">
            <div class="pjw-class-weekcal-heading">
              <div class="pjw-class-weekcal-heading-day select-all">ALL</div>
              <div class="pjw-class-weekcal-heading-day">MO</div>
              <div class="pjw-class-weekcal-heading-day">TU</div>
              <div class="pjw-class-weekcal-heading-day">WE</div>
              <div class="pjw-class-weekcal-heading-day">TH</div>
              <div class="pjw-class-weekcal-heading-day">FR</div>
              <div class="pjw-class-weekcal-heading-day">SA</div>
              <div class="pjw-class-weekcal-heading-day">SU</div>
            </div>
            <div class="pjw-class-weekcal-calendar">
              <div class="pjw-class-weekcal-calendar-day select-time">
                <span>1&gt;</span><span>2&gt;</span><span>3&gt;</span><span>4&gt;</span><span>5&gt;</span><span>6&gt;</span><span>7&gt;</span><span>8&gt;</span><span>9&gt;</span><span>10&gt;</span><span>11&gt;</span><span>12&gt;</span>
              </div>
              <div class="pjw-class-weekcal-calendar-day">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              </div>
              <div class="pjw-class-weekcal-calendar-day">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              </div>
              <div class="pjw-class-weekcal-calendar-day">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              </div>
              <div class="pjw-class-weekcal-calendar-day">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              </div>
              <div class="pjw-class-weekcal-calendar-day">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              </div>
              <div class="pjw-class-weekcal-calendar-day">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              </div>
              <div class="pjw-class-weekcal-calendar-day">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              </div>
            </div>
          </div>
          <div id="pjw-hours-filter-control">
            <div id="clear-calendar" class="pjw-mini-button">清空</div>
            <div id="reset-calendar" class="pjw-mini-button">过滤冲突课程</div>
          </div>
          <span>可单击表头全选整行/整列。</span>
        </div>
      </div>
    `,
    intl: (space, list) => {
      space.data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
      space.dom = $$("#pjw-hours-filter");
      space.cal = $$("#pjw-hours-filter").find(".pjw-class-weekcal");

      // Value: 0, false
      space.setValue = function(day, lesson, val) {
        this.data[day][lesson] = val;
        var target_lesson = this.cal.find(`div.pjw-class-weekcal-calendar-day:eq(${day})`).children(`span:eq(${lesson - 1})`);
        if (val === false) target_lesson.addClass("selected");
        else target_lesson.removeClass("selected");
      };

      space.clear = function() {
        for (var i = 1; i <= 7; i++)
          for (var j = 1; j <= 12; j++)
            space.setValue(i, j, 0);
      };

      space.loadMyClass = function(force_reload = false, include_odd_even = true) {
        var setLessonTime = (space, lesson_time, include_odd_even = true) => {
          for (var item of lesson_time) {
            if (include_odd_even || item.type == "normal") {
              for (var i = item.start; i <= item.end; i++)
                space.setValue(item.weekday, i, false);
            }
          }
        };
        return new Promise((resolve, reject) => {
          if (!force_reload && store.has("my_lesson_time") && store.has("my_lesson_time_update_timestamp") && 
              new Date().getTime() - store.get("my_lesson_time_update_timestamp") < 300000) {
            setLessonTime(space, store.get("my_lesson_time"));
            resolve();
          } else {
            if (pjw_mode == "course") {
              var stu_info = JSON.parse(sessionStorage.studentInfo);
              $$.ajax({
                url: "/xsxkapp/sys/xsxkapp/elective/courseResult.do",
                data: {
                  querySetting: JSON.stringify({
                    data: {
                      "studentCode": stu_info.code,
                      "electiveBatchCode": stu_info.electiveBatch.code,
                    },
                  })
                },
                headers: {
                  "token": sessionStorage.token
                },
                method: "POST",
                success: (res) => {
                  var lesson_time = [];
                  for (var item of res.dataList) {
                    lesson_time = lesson_time.concat(list.parseClassTime(item.teachingPlace).lesson_time);
                  }
                  store.set("my_lesson_time", lesson_time);
                  store.set("my_lesson_time_update_timestamp", new Date().getTime());
                  setLessonTime(space, lesson_time);
                  resolve();
                },
                fail: (res) => {
                  list.console.error("课程时间筛选器无法加载已有课程：" + res);
                  reject();
                }
              });
            } else {
              $$.ajax({
                url: "/jiaowu/student/teachinginfo/courseList.do",
                data: {
                  method: "currentTermCourse"
                },
                method: "GET"
              }).done((res) => {
                var lesson_time = [];
                $$(res).find(".TABLE_BODY > tbody > tr:gt(0)").each((index, val) => {
                  lesson_time = lesson_time.concat(list.parseClassTime($$(val).children("td:eq(4)").html()).lesson_time);
                });
                store.set("my_lesson_time", lesson_time);
                store.set("my_lesson_time_update_timestamp", new Date().getTime());
                setLessonTime(space, lesson_time);
                resolve();
              }).catch((res) => {
                list.console.error("课程时间筛选器无法加载已有课程：" + res);
                reject();
              });
            }
          }
        });
      };

      space.loadMyClass();

      $$("#clear-calendar").on("click", null, {
        space: space,
        list: list
      }, (e) => {
        e.data.space.clear();
        e.data.list.update();
      });

      $$("#reset-calendar").on("click", null, {
        space: space,
        list: list
      }, (e) => {
        e.data.space.clear();
        e.data.space.loadMyClass(force_reload = true).then(() => {e.data.list.update();});
      });

      space.mouse_select = false;
      space.handleMouseUp = function() {
        if (space.mouse_select == true) {
          space.mouse_select = false;
          delete space.mouse_select_start;
        }
      };

      space.cal.on("mousedown", null, {
        space: space
      }, (e) => {
        e.data.space.mouse_select = true;
      });

      space.cal.on("mouseup", null, {
        space: space
      }, (e) => {
        e.data.space.handleMouseUp();
      });

      space.cal.find("div.pjw-class-weekcal-calendar-day:gt(0)").children("span").on("mousemove", null, {
        space: space,
        list: list
      }, (e) => {
        if (!e.data.space.mouse_select) return;
        var elem = $$(e.delegateTarget);
        var day = elem.parent().index();
        var lesson = elem.index() + 1;
        var val = false;
        if (elem.hasClass("selected")) val = 0;
        if (typeof(e.data.space.mouse_select_start) == "undefined")
          e.data.space.mouse_select_start = val;
        else
          val = e.data.space.mouse_select_start;
        e.data.space.setValue(day, lesson, val);
      });

      space.cal.find("div.pjw-class-weekcal-calendar-day:gt(0)").children("span").on("mousedown", null, {
        space: space,
        list: list
      }, (e) => {
        var elem = $$(e.delegateTarget);
        var day = elem.parent().index();
        var lesson = elem.index() + 1;
        var val = false;
        if (elem.hasClass("selected")) val = 0;
        if (typeof(e.data.space.mouse_select_start) == "undefined")
          e.data.space.mouse_select_start = val;
        else
          val = e.data.space.mouse_select_start;
        e.data.space.setValue(day, lesson, val);
      });

      space.cal.find("div.pjw-class-weekcal-calendar-day:gt(0)").children("span").on("mouseup", null, {
        space: space,
        list: list
      }, (e) => {
        e.data.list.update();
      });

      space.cal.find(`div.pjw-class-weekcal-calendar-day:eq(0)`).children("span").on("click", null, {
        space: space,
        list: list
      }, (e) => {
        var elem = $$(e.delegateTarget);
        var lesson = elem.index() + 1;
        var val = 0;
        for (var i = 1; i <= 7; i++)
          if (e.data.space.data[i][lesson] !== false) {
            val = false;
            break;
          }
        for (var i = 1; i <= 7; i++)
          e.data.space.setValue(i, lesson, val);
        e.data.list.update();
      });

      space.cal.find("div.pjw-class-weekcal-heading-day:gt(0)").on("click", null, {
        space: space,
        list: list
      }, (e) => {
        var elem = $$(e.delegateTarget);
        var day = elem.index();
        var val = 0;
        for (var j = 1; j <= 12; j++)
          if (e.data.space.data[day][j] !== false) {
            val = false;
            break;
          }
        for (var j = 1; j <= 12; j++)
          e.data.space.setValue(day, j, val);
        e.data.list.update();
      });

      space.cal.find("div.pjw-class-weekcal-heading-day.select-all").on("click", null, {
        space: space,
        list: list
      }, (e) => {
        var val = 0;
        for (var i = 1; i <= 7; i++)
          for (var j = 1; j <= 12; j++)
            if (e.data.space.data[i][j] !== false) {
              val = false;
              break;
            }
        for (var i = 1; i <= 7; i++)
          for (var j = 1; j <= 12; j++)
            e.data.space.setValue(i, j, val);
        e.data.list.update();
      });

      $$("body").on("mouseup", null, {
        target: space
      }, (e) => {
        e.data.target.handleMouseUp();
      });
    }, 
    check: (space, data) => {
      if (!data.lesson_time || !data.lesson_time.length) return 0;
      var priority = 0.0;
      for (var item of data.lesson_time) {
        for (var i = item.start; i <= item.end; i++) {
          var this_priority = space.data[item.weekday][i];
          if (this_priority === false)
            return false;
          else priority += this_priority / (item.end - item.start + 1);
        }
      }
      return priority / data.lesson_time.length;
    }
  },

  /* advanced module v1.1 */
  advanced: {
    html: `
      <div id="pjw-advanced-filter" class="pjw-filter-module">
        <div class="pjw-filter-module-header">
          <span class="material-icons-round pjw-filter-module-icon">settings_input_component</span>
          <div class="pjw-filter-module-title__container">
            <span class="pjw-filter-module-title">更多规则</span>
            <span class="pjw-filter-module-info">来自搜索框和自定义的筛选规则</span>
          </div>
        </div>
    
        <div class="content">
          <ul id="pjw-filter-advanced-list">
            <li id="pjw-filter-advanced-search-item"></li>
          </ul>
        </div>
      </div>
    `,
    intl: (space, list) => {
      space.enabled = true;
      space.rules = [];
      space.list_dom = $$("#pjw-filter-advanced-list");
      space.rid = 0;
      space.list_dom.on("click", ".pjw-filter-advanced-list-delete", {
        space: space,
        list: list
      }, (e) => {
        e.data.space.removeRule(e.data.space, e.data.list, $$(e.currentTarget).parents("li").attr("data-ruleid"));
      });
      space.addRule(space, {}, "所有课程", "include", 0);
    },
    onswitch: (space, list) => {
      space.updateSearch(list.search_string);
    },
    updateSearch: (str) => {
      if (!str || str == "") $$("#pjw-filter-advanced-search-item").hide();
      else $$("#pjw-filter-advanced-search-item").show();
      $$("#pjw-filter-advanced-search-item").text(`搜索关键词：${str}`);
    },
    addRule: (space, data, name, type = "include", priority = true) => {
      space.rules.unshift({
        "id": space.rid,
        "data": data,
        "type": type,
        "priority": priority
      });
      space.list_dom.append(`<li class="pjw-filter-advanced-list-item" data-ruleid="${space.rid}"><span class="pjw-filter-advanced-list-delete material-icons-round">close</span> <span>${type == "include" ? "包含" : "隐藏"} ${name}</span></li>`);
      return space.rid++;
    },
    removeRule: (space, list, rid) => {
      if (rid == "0") {
        var target = space.list_dom.children(`li[data-ruleid="0"]`).children(".pjw-filter-advanced-list-delete");
        target_rule = space.rules[space.rules.length - 1];
        if (target.text() == "add") {
          target.text("close");
          target_rule.type = "include";
        } else {
          target.text("add");
          target_rule.type = "exclude";
        }
      } else {
        space.list_dom.children(`li[data-ruleid=${rid}]`).remove();
        space.rules.forEach((data, index) => {
          if (!data) return;
          if (String(data.id) == rid) {
            space.rules.splice(index, 1);
          }
        });
      }
      list.update();
    },
    matchRule(rule, data) {
      var flag = true;
      for (let key in rule) {
        if (!(key in data && rule[key] == data[key])) {
          flag = false;
          return false;
        }
      }
      return flag;
    },
    check: (space, data) => {
      for (let rule of space.rules) {
        if (rule.type == "include") {
          if (space.matchRule(rule.data, data)) return rule.priority;
        } else if (rule.type == "exclude") {
          if (space.matchRule(rule.data, data)) return false;
        }
      }
      return false;
    }
  },

  /* potatoes module v0.3 */
  potatoes: {
    html: `
      <div id="pjw-potatoes-filter" class="pjw-filter-module" data-switch="pjw-filter-potatoes-switch">
        <div class="pjw-filter-module-header">
          <span class="material-icons-round pjw-filter-module-icon">flight_takeoff</span>
          <div class="pjw-filter-module-title__container">
            <span class="pjw-filter-module-title">自动选课</span>
            <span class="pjw-filter-module-info">Take care & Good luck!</span>
          </div>
          <div class="mdc-switch" id="pjw-filter-potatoes-switch">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__thumb-underlay">
              <div class="mdc-switch__thumb"></div>
              <input type="checkbox" class="mdc-switch__native-control" role="switch" aria-checked="false">
            </div>
          </div>
        </div>
        <div class="content">
          <div class="pjw-switch-box">
            <div class="mdc-switch" id="pjw-potatoes-switch">
              <div class="mdc-switch__track"></div>
              <div class="mdc-switch__thumb-underlay">
                <div class="mdc-switch__thumb"></div>
                <input type="checkbox" id="pjw-potatoes-switch-input" class="mdc-switch__native-control" role="switch" aria-checked="false">
              </div>
            </div>
            <label for="pjw-potatoes-switch-input">自动选课</label>
          </div>
          <div class="pjw-switch-box">
            <div class="mdc-switch" id="pjw-potatoes-continue-on-failure">
              <div class="mdc-switch__track"></div>
              <div class="mdc-switch__thumb-underlay">
                <div class="mdc-switch__thumb"></div>
                <input type="checkbox" id="pjw-potatoes-continue-on-failure-input" class="mdc-switch__native-control" role="switch" aria-checked="false">
              </div>
            </div>
            <label for="pjw-potatoes-continue-on-failure-input">选课失败后继续</label>
          </div>
          <div class="pjw-switch-box">
            <div class="mdc-switch" id="pjw-potatoes-continue-on-success">
              <div class="mdc-switch__track"></div>
              <div class="mdc-switch__thumb-underlay">
                <div class="mdc-switch__thumb"></div>
                <input type="checkbox" id="pjw-potatoes-continue-on-success-input" class="mdc-switch__native-control" role="switch" aria-checked="false">
              </div>
            </div>
            <label for="pjw-potatoes-continue-on-success-input">选课成功后继续</label>
          </div>
          <p>*使用前请确认课程筛选正确并开启自动刷新开关。</p>
        </div>
      </div>
    `,
    intl: (space, list) => {
      space.dom = $$("#pjw-potatoes-filter");
      space.switch = new mdc.switchControl.MDCSwitch($$("#pjw-potatoes-switch")[0]);
      space.continue_on_success_switch = new mdc.switchControl.MDCSwitch($$("#pjw-potatoes-continue-on-success")[0]);
      space.continue_on_failure_switch = new mdc.switchControl.MDCSwitch($$("#pjw-potatoes-continue-on-failure")[0]);

      space.status = false;
      space.dom.find("#pjw-potatoes-switch-input").on("change", null, {
        target: space,
      }, (e) => {
        e.data.target.status = e.data.target.switch.checked;
      });

      space.dom.find("#pjw-potatoes-continue-on-success-input").on("change", null, {
        target: space,
      }, (e) => {
        e.data.target.continue_on_success = e.data.target.continue_on_success_switch.checked;
      });

      space.dom.find("#pjw-potatoes-continue-on-failure-input").on("change", null, {
        target: space,
      }, (e) => {
        e.data.target.continue_on_failure = e.data.target.continue_on_failure_switch.checked;
      });

      space.potatoes_queue = [];
      space.is_select_ongoing = false;
    },
    check: (space, data, class_obj) => {
      if (!space.status || space.queue_lock) return 0;
      space.potatoes_queue.push([data, class_obj]);
      return 0;
    },
    handlePotatoes: (space) => {
      if (space.potatoes_queue.length == 0 || space.is_select_ongoing == false || space.switch.checked == false) {
        space.is_select_ongoing = false;
        return;
      }
      data = space.potatoes_queue[0][0];
      class_obj = space.potatoes_queue[0][1];
      space.potatoes_queue = space.potatoes_queue.slice(1);
      if (data.select_button && data.select_button.action && data.select_button.status == "Select") {
        var e = {data: {target: class_obj}};
        data.select_button.action(e).then(() => {
          class_obj.list.console.debug("Got a success from the potatoes module!");
          if (space.continue_on_success == true)
            space.handlePotatoes(space);
          else
            space.switch.checked = space.status = is_select_ongoing = false;
        }).catch((res) => {
          class_obj.list.console.debug("Got an error from the potatoes module: " + res);
          if (space.continue_on_failure == true)
            space.handlePotatoes(space);
          else 
            space.switch.checked = space.status = is_select_ongoing = false;
        });
      } else {
        space.handlePotatoes(space);
      }
    },
    handleParseComplete: (space, list) => {
      space.is_select_ongoing = false;
      space.potatoes_queue = [];
      space.queue_lock = false;
    },
    handleRefreshComplete: (space, list) => {
      if (!space.status) return;
      space.is_select_ongoing = true;
      space.queue_lock = true;
      space.handlePotatoes(space);
    }
  },

  /* frozen module v1.3 */
  frozen: {
    html: `
      <div id="pjw-frozen-filter" style="order: 3;">
        <div class="pjw-filter-module-header">  
          <span class="material-icons-round pjw-filter-module-icon" id="frozen-icon" title="Frozen Quote">ac_unit</span>
          <div class="pjw-filter-module-title__container">
            <span id="frozen-quotes">Frozen Quote</span>
          </div>
        </div>
      </div>
    `,
    intl: (space, list) => {
      $$("#frozen-icon").on("click", null, {
        space: space
      }, (e) => {
        $$("#frozen-icon").css("transition", "transform .4s ease-out");
        $$("#frozen-icon").css("transform", "rotate(180deg)");
        window.setTimeout(() => {
          $$("#frozen-icon").css("transition", "");
          $$("#frozen-icon").css("transform", "rotate(0deg)");
        }, 450);
        e.data.space.target.html(e.data.space.getRandomQuotes());
      });
      space.target = $$("#frozen-quotes");
    },
    handleParseComplete: (space, list) => {
      space.target.html(space.getRandomQuotes());
    },
    getRandomQuotes: () => {
      var quotes_lib = frozen_quotes.split("\n");
      return quotes_lib[Math.floor(Math.random() * quotes_lib.length)];
    }
  },

  acl_major_switch: {
    html: `
      <div>
        <div class="pjw-filter-module-header">  
          <span class="material-icons-round pjw-filter-module-icon acl-major-switch-button">arrow_forward</span>
          <div class="pjw-filter-module-title__container">
            <span class="pjw-filter-module-title acl-major-switch-button">转至我的专业</span>
            <span id="acl-major-switch-label" class="pjw-filter-module-info"></span>
          </div>
        </div>
      </div>
    `,
    intl: (space, list) => {

    }
  }
}