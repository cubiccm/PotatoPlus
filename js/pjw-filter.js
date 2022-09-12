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

          <button id="pjw-filter-avail-switch" class="mdc-switch mdc-switch--unselected" type="button" 
              role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__handle-track">
              <div class="mdc-switch__handle">
                <div class="mdc-switch__shadow">
                  <div class="mdc-elevation-overlay"></div>
                </div>
                <div class="mdc-switch__ripple"></div>
              </div>
            </div>
          </button>
        </div>

        <div class="content">
          <div class="pjw-switch-box" id="pjw-deselect-switch-box">
              <button id="pjw-deselect-switch"  class="mdc-switch mdc-switch--unselected" type="button" 
                  role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
              <div class="mdc-switch__track"></div>
              <div class="mdc-switch__handle-track">
                <div class="mdc-switch__handle">
                  <div class="mdc-switch__shadow">
                    <div class="mdc-elevation-overlay"></div>
                  </div>
                  <div class="mdc-switch__ripple"></div>
                </div>
              </div>
            </button>
            <label for="pjw-deselect-switch">隐藏已选课程</label>
          </div>
        </div>
      </div>
    `,
    intl: (space, list) => {
      space.dom = $$("#pjw-avail-filter");
      space.deselect_switch = new mdc.switchControl.MDCSwitch($$("#pjw-deselect-switch")[0]);

      space.keep_deselect = true;
      space.dom.find("#pjw-deselect-switch").on("click", null, {
        space: space,
        list: list
      }, (e) => {
        e.data.space.keep_deselect = !e.data.space.deselect_switch.selected;
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

  /* hours module v0.6 */
  hours: {
    html: `
      <div id="pjw-hours-filter" class="pjw-filter-module" data-switch="pjw-filter-hours-switch">
        <div class="pjw-filter-module-header">
          <span class="material-icons-round pjw-filter-module-icon">schedule</span>
          <div class="pjw-filter-module-title__container">
            <span class="pjw-filter-module-title">课程时间</span>
            <span class="pjw-filter-module-info">按上课时间筛选课程</span>
          </div>
          <button id="pjw-filter-hours-switch" class="mdc-switch mdc-switch--unselected" type="button"
              role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__handle-track">
              <div class="mdc-switch__handle">
                <div class="mdc-switch__shadow">
                  <div class="mdc-elevation-overlay"></div>
                </div>
                <div class="mdc-switch__ripple"></div>
              </div>
            </div>
          </button>
        </div>
        <div class="content">
          <div class="pjw-class-weekcal">
            <div class="pjw-class-weekcal-heading">
              <div class="pjw-class-weekcal-heading-day select-all">
                <i class="material-icons-round" style="font-size: 16px; line-height: 30px;">south_east</i>
              </div>
              <div class="pjw-class-weekcal-heading-day"><span>MO</span></div>
              <div class="pjw-class-weekcal-heading-day"><span>TU</span></div>
              <div class="pjw-class-weekcal-heading-day"><span>WE</span></div>
              <div class="pjw-class-weekcal-heading-day"><span>TH</span></div>
              <div class="pjw-class-weekcal-heading-day"><span>FR</span></div>
              <div class="pjw-class-weekcal-heading-day"><span>SA</span></div>
              <div class="pjw-class-weekcal-heading-day"><span>SU</span></div>
            </div>
            <div class="pjw-class-weekcal-calendar">
              <div class="pjw-class-weekcal-calendar-day select-time">
                <div><span>1</span></div>
                <div><span>2</span></div>
                <div><span>3</span></div>
                <div><span>4</span></div>
                <div><span>5</span></div>
                <div><span>6</span></div>
                <div><span>7</span></div>
                <div><span>8</span></div>
                <div><span>9</span></div>
                <div><span>10</span></div>
                <div><span>11</span></div>
                <div><span>12</span></div>
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
            <section>
              <button id="autosave-switch" class="mdc-switch mdc-switch--selected" type="button" role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
                <div class="mdc-switch__track"></div>
                <div class="mdc-switch__handle-track">
                  <div class="mdc-switch__handle">
                    <div class="mdc-switch__shadow">
                      <div class="mdc-elevation-overlay"></div>
                    </div>
                    <div class="mdc-switch__ripple"></div>
                  </div>
                </div>
                <span class="mdc-switch__focus-ring-wrapper">
                  <div class="mdc-switch__focus-ring"></div>
                </span>
              </button>
              <label for="autosave-switch">自动保存</label>
            </section>
            <section>
              <div id="clear-calendar" class="pjw-mini-button">清空</div>
              <div id="reset-calendar" class="pjw-mini-button">过滤冲突课程</div>
            </section>
          </div>
        </div>
      </div>
    `,
    intl: (space, list) => {
      space.data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      space.dom = $$("#pjw-hours-filter");
      space.cal = $$("#pjw-hours-filter").find(".pjw-class-weekcal");

      function saveData() {
        pjw.preferences.filter_autosave && (pjw.data.filter_autosave_data = space.data
            .map(array => array.join("")).join(","));
      }

      function loadData() {
        return pjw.preferences.filter_autosave && pjw.data.filter_autosave_data
            && (space.data = pjw.data.filter_autosave_data
                .split(",").map(str => str.split("").map(val => parseInt(val)))) 
            || false;
      }

      // Value: 0, 1
      function setValue(day, lesson, val, append = false) {
        if (append)
          space.data[day - 1][lesson - 1] |= val;
        else
          space.data[day - 1][lesson - 1] = val;
        const target_lesson = space.cal
            .find(`div.pjw-class-weekcal-calendar-day:eq(${day})`)
            .children(`span:eq(${lesson - 1})`);
        if (val == 1) target_lesson.addClass("selected");
        else target_lesson.removeClass("selected");
      };

      function clearCalendar() {
        for (let i = 1; i <= 7; i++)
          for (let j = 1; j <= 12; j++)
            setValue(i, j, 0);
        saveData();
      };

      function setLessonTime(lesson_time, include_odd_even = true) {
        for (const item of lesson_time) {
          if (include_odd_even || item.type == "normal") {
            for (let i = item.start; i <= item.end; i++)
              setValue(item.weekday, i, 1);
          }
        }
      };

      const update_interval = 300000;
      function loadMyClass(force_reload = false, include_odd_even = true) {
        return new Promise((resolve, reject) => {
          if (!force_reload && pjw.data.my_lesson_time && 
              new Date().getTime() - (pjw.data.my_lesson_time_update_timestamp || 0) < update_interval) {
            setLessonTime(pjw.data.my_lesson_time);
            resolve();
          } else {
            if (pjw.site == "xk") {
              const stu_info = JSON.parse(sessionStorage.studentInfo);
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
                  const lesson_time = [];
                  for (const item of res.dataList) {
                    lesson_time.push(...list.parseClassTime(item.teachingPlace).lesson_time);
                  }
                  pjw.data.my_lesson_time = lesson_time;
                  pjw.data.my_lesson_time_update_timestamp = new Date().getTime();
                  setLessonTime(lesson_time);
                  saveData();
                  resolve();
                },
                fail: (res) => {
                  list.console.error("课程时间筛选器无法加载已有课程：" + res);
                  reject();
                }
              });
            } else if (pjw.site == "jw") {
              $$.ajax({
                url: "/jiaowu/student/teachinginfo/courseList.do",
                data: {
                  method: "currentTermCourse"
                },
                method: "GET"
              }).done((res) => {
                const lesson_time = [];
                $$(res).find(".TABLE_BODY > tbody > tr:gt(0)").each((index, val) => {
                  lesson_time.push(...list.parseClassTime($$(val).children("td:eq(4)").html()).lesson_time);
                });
                pjw.data.my_lesson_time = lesson_time;
                pjw.data.my_lesson_time_update_timestamp = new Date().getTime();
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

      space.autosave_switch = new mdc.switchControl.MDCSwitch($$("#autosave-switch")[0]);
      pjw.preferences.filter_autosave === null && (pjw.preferences.filter_autosave = true);
      space.autosave_switch.selected = pjw.preferences.filter_autosave;
      space.autosave_switch.listen("click", function () {
        (pjw.preferences.filter_autosave = space.autosave_switch.selected)
            || delete pjw.data.filter_autosave_data;
        saveData();
      });

      // Update DOM if auto-save data is loaded
      loadData() ? (function() {
        for (let i = 0; i < 7; i++)
          for (let j = 0; j < 12; j++)
            if (space.data[i][j] == 1)
              space.cal
                   .find(`div.pjw-class-weekcal-calendar-day:eq(${i+1})`)
                   .children(`span:eq(${j})`)
                   .addClass("selected");
      })() : loadMyClass();

      $$("#clear-calendar").on("click", function () {
        clearCalendar();
        list.update();
      });

      $$("#reset-calendar").on("click", function () {
        clearCalendar();
        loadMyClass(force_reload = true).then(function () {
          list.update();
        });
      });

      // space.mouse_select = false;
      // function handleMouseUp() {
      //   if (space.mouse_select == true) {
      //     space.mouse_select = false;
      //     delete space.mouse_select_start_val;
      //     saveData();
      //   }
      // };

      // space.cal.on("mousedown", function () {
      //   space.mouse_select = true;
      // });

      // space.cal.on("mouseup", function () {
      //   handleMouseUp();
      // });

      // space.cal.find("div.pjw-class-weekcal-calendar-day:gt(0)").children("span").on("mousemove", function (e) {
      //   if (!space.mouse_select) return;
      //   const elem = $$(e.delegateTarget);
      //   const day = elem.parent().index();
      //   const lesson = elem.index() + 1;
      //   let val = 1;
      //   if (elem.hasClass("selected")) val = 0;
      //   if (typeof(space.mouse_select_start_val) == "undefined")
      //     space.mouse_select_start_val = val;
      //   else
      //     val = space.mouse_select_start_val;
      //   setValue(day, lesson, val);
      // });
      
      // Flip single item
      space.cal.find("div.pjw-class-weekcal-calendar-day:gt(0)").children("span").on("click", function (e) {
        const elem = $$(e.delegateTarget);
        const day = elem.parent().index();
        const lesson = elem.index() + 1;
        let val = 1;
        if (elem.hasClass("selected")) val = 0;
        // if (typeof(space.mouse_select_start_val) == "undefined")
        //   space.mouse_select_start_val = val;
        // else
        //   val = space.mouse_select_start_val;
        setValue(day, lesson, val);
        saveData();
        list.update();
      });

      // Flip whole row when header clicked
      space.cal.find(`div.pjw-class-weekcal-calendar-day:eq(0)`).children("div").on("click", function (e) {
        const elem = $$(e.delegateTarget);
        const lesson = elem.index() + 1;
        let val = 0;
        for (let i = 1; i <= 7; i++)
          if (space.data[i-1][lesson-1] != 1) {
            val = 1;
            break;
          }
        for (let i = 1; i <= 7; i++)
          setValue(i, lesson, val);
        saveData();
        list.update();
      });

      // Flip whole column when header clicked
      space.cal.find("div.pjw-class-weekcal-heading-day:gt(0)").on("click", function (e) {
        const elem = $$(e.delegateTarget);
        const day = elem.index();
        let val = 0;
        for (let j = 1; j <= 12; j++)
          if (space.data[day-1][j-1] != 1) {
            val = 1;
            break;
          }
        for (let j = 1; j <= 12; j++)
          setValue(day, j, val);
        saveData();
        list.update();
      });

      // Flip all items when header clicked
      space.cal.find("div.pjw-class-weekcal-heading-day.select-all").on("click", function () {
        let val = 0;
        for (let i = 1; i <= 7; i++)
          for (let j = 1; j <= 12; j++)
            if (space.data[i-1][j-1] != 1) {
              val = 1;
              break;
            }
        for (let i = 1; i <= 7; i++)
          for (let j = 1; j <= 12; j++)
            setValue(i, j, val);
        saveData();
        list.update();
      });

      // $$("body").on("mouseup", function () {
      //   handleMouseUp();
      // });
    }, 
    check: (space, data) => {
      if (!data.lesson_time || !data.lesson_time.length) return 0;
      let priority = 0.0;
      for (const item of data.lesson_time) {
        for (let i = item.start; i <= item.end; i++) {
          const this_priority = space.data[item.weekday-1][i-1] == 1 ? false : 0;
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
          <button id="pjw-filter-potatoes-switch" class="mdc-switch mdc-switch--unselected" type="button"
              role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__handle-track">
              <div class="mdc-switch__handle">
                <div class="mdc-switch__shadow">
                  <div class="mdc-elevation-overlay"></div>
                </div>
                <div class="mdc-switch__ripple"></div>
              </div>
            </div>
          </button>
        </div>
        <div class="content">
          <div class="pjw-switch-box">
            <button id="pjw-potatoes-switch" class="mdc-switch mdc-switch--unselected" type="button"
                role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
              <div class="mdc-switch__track"></div>
              <div class="mdc-switch__handle-track">
                <div class="mdc-switch__handle">
                  <div class="mdc-switch__shadow">
                    <div class="mdc-elevation-overlay"></div>
                  </div>
                  <div class="mdc-switch__ripple"></div>
                </div>
              </div>
            </button>
            <label for="pjw-potatoes-switch">自动选课</label>
          </div>
          <div class="pjw-switch-box">
            <button id="pjw-potatoes-continue-on-failure" class="mdc-switch mdc-switch--unselected" type="button"
                role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
              <div class="mdc-switch__track"></div>
              <div class="mdc-switch__handle-track">
                <div class="mdc-switch__handle">
                  <div class="mdc-switch__shadow">
                    <div class="mdc-elevation-overlay"></div>
                  </div>
                  <div class="mdc-switch__ripple"></div>
                </div>
              </div>
            </button>
            <label for="pjw-potatoes-continue-on-failure">选课失败后继续</label>
          </div>
          <div class="pjw-switch-box">
            <button id="pjw-potatoes-continue-on-success" class="mdc-switch mdc-switch--unselected" type="button"
                role="switch" aria-checked="false" data-mdc-auto-init="MDCRipple">
              <div class="mdc-switch__track"></div>
              <div class="mdc-switch__handle-track">
                <div class="mdc-switch__handle">
                  <div class="mdc-switch__shadow">
                    <div class="mdc-elevation-overlay"></div>
                  </div>
                  <div class="mdc-switch__ripple"></div>
                </div>
              </div>
            </button>
            <label for="pjw-potatoes-continue-on-success">选课成功后继续</label>
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
      space.dom.find("#pjw-potatoes-switch-input").on("click", null, {
        target: space,
      }, (e) => {
        e.data.target.status = e.data.target.switch.selected;
      });

      space.dom.find("#pjw-potatoes-continue-on-success-input").on("click", null, {
        target: space,
      }, (e) => {
        e.data.target.continue_on_success = e.data.target.continue_on_success_switch.selected;
      });

      space.dom.find("#pjw-potatoes-continue-on-failure-input").on("click", null, {
        target: space,
      }, (e) => {
        e.data.target.continue_on_failure = e.data.target.continue_on_failure_switch.selected;
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
      if (space.potatoes_queue.length == 0 || space.is_select_ongoing == false || space.switch.selected == false) {
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
            space.switch.selected = space.status = is_select_ongoing = false;
        }).catch((res) => {
          class_obj.list.console.debug("Got an error from the potatoes module: " + res);
          if (space.continue_on_failure == true)
            space.handlePotatoes(space);
          else 
            space.switch.selected = space.status = is_select_ongoing = false;
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

  /* frozen module v1.4 */
  frozen: {
    html: `
      <div id="pjw-frozen-filter" style="order: 3;">
        <div class="pjw-filter-module-header">  
          <span class="material-icons-round pjw-filter-module-icon" id="frozen-icon" title="Frozen Quote">
            ac_unit
          </span>
          <div class="pjw-filter-module-title__container">
            <span id="frozen-quotes">Frozen Quote</span>
          </div>
        </div>
      </div>
    `,
    intl: (space, list) => {
      space.mode = Math.random() > 0.5 ? "frozen" : "atw";
      $$("#frozen-icon").text(((mode) => {
        switch (mode) {
          case "atw":
            return "music_note";
          case "frozen":
            return "ac_unit";
        }
      })(space.mode));
      $$("#frozen-icon").attr("title", ((mode) => {
        switch (mode) {
          case "atw":
            return "Taylor Swift - All Too Well (10 Minute Version)";
          case "frozen":
            return "Frozen Quote";
        }
      })(space.mode));
      $$("#frozen-icon").on("click", null, {
        space: space
      }, (e) => {
        $$("#frozen-icon").css("transition", "transform .4s ease-out");
        $$("#frozen-icon").css("transform", "rotate(360deg)");
        window.setTimeout(() => {
          $$("#frozen-icon").css("transition", "");
          $$("#frozen-icon").css("transform", "rotate(0deg)");
        }, 450);
        e.data.space.target.html(e.data.space.getRandomQuotes(space));
      });
      space.target = $$("#frozen-quotes");
    },
    handleParseComplete: (space, list) => {
      space.target.html(space.getRandomQuotes(space));
    },
    getRandomQuotes: (space) => {
      var quotes_lib = space.mode == "frozen" ? frozen_quotes.split("\n") : atw_lyrics.split("\n");
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