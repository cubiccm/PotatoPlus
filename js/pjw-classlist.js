function ClassListPlugin() {
  let total_weeks = 16;
  const campus_id_map = {
    "仙林校区": 3,
    "浦口校区": 2,
    "鼓楼校区": 1
  };

  if (window.proto_backup) Array.prototype.reduce = window.proto_backup.reduce;

  /* 
    Class data format:
    data = {
      classID: <Integer>,
      title: <String>,
      teachers: [<String>, ...],
      info: [{
        key: <String>,
        val: <String>,
        hidden: <Boolean>
      }, ...],
      num_info: [{
        num: <Integer>,
        label: <String>
      }, ...],
      lesson_time: [{
        start: <Integer>,
        end: <Integer>,
        type: <String>, // "normal", "odd", "even"
        weekday: <Integer>
      }, ...],
      time_detail: <String>,
      class_weeknum: [{
        start: <Integer>,
        end: <Integer>
      }, ...],
      select_button: {
        status: <String>, // "Select", "Deselect", "Full", "Selected", false
        text: <String>,
        action: <Function>
      }
    };
  */

  window.PJWClass = class {
    show() {
      if (!this.initialized) this.intl();
      if (this.display == true) return;
      this.display = true;
      this.dom.css("display", "flex");
    }

    hide() {
      if (!this.initialized || this.display == false) return;
      this.display = false;
      this.dom.css("display", "none");
    }

    remove() {
      if (!this.initialized) return;
      this.dom.remove();
    }

    setPriority(priority = this.data.priority) {
      if (!this.initialized) return;
      if (priority === false || priority == -1) { this.hide(); return; }
      if (this.priority == priority) return;
      this.priority = priority;
      this.dom.css("order", -priority);
    }

    getHTML(data, attr, options = {}) {
      function getTitle(content) {
        return data.title;
      }

      function getTeachers(content) {
        var is_first = true; var html = `<span class="material-icons-round pjw-class-teacher-icon">school</span>`;
        for (var str of content) {
          if (!is_first) html += "，";
          is_first = false;
          html += `<span class="pjw-class-name-initial">${str[0]}</span>` + str.slice(1);
        }
        return html;
      }

      function getClassInfo(content, classID) {
        if (!classID || classID < 0) classID = "0";
        let appear_html = [], hidden_html = "";
        for (const item of content) {
          if ("key" in item) {
            if (item.key == "课程编号") {
              if (pjw.site == "jw") {
                const link = `/jiaowu/student/elective/courseList.do?method=getCourseInfoM&courseNumber=${item.val}&classid=${classID}`;
                item.val = `<span class="pjw-class-course-number pjw-no-expand" onclick="openLinkInFrame('${link}');">${item.val}<span class="material-icons-round" style="font-size: 12px; margin-left: 1px;">info</span></span>`;
              } else if (pjw.site == "xk") {
                if (typeof pjw.showCourseInfo !== "function") {
                  // Find "jxbInfoWindow" method (originally located in grablessons.js) in jQuery click event
                  const events = jQuery._data(document.querySelector(".result-container"), "events");
                  for (const event of events["click"]) {
                    if (event.selector == ".cv-jxb-detail") {
                      pjw.showCourseInfo = function(target) {
                        event.handler({
                          stopPropagation: () => {},
                          preventDefault: () => {},
                          currentTarget: target,
                        });
                      }
                      break;
                    }
                  }
                }
                item.val = `<span class="pjw-class-course-number pjw-no-expand" data-teachingclassid="${classID}" data-number="${item.val}" onclick="pjw.showCourseInfo(this);">${item.val}<span class="material-icons-round" style="font-size: 12px; margin-left: 1px;">info</span></span>`;
              }
            }
            if (!item.val) continue;
            if (!item.hidden)
              appear_html.push(`${item.val}`);
            hidden_html += `<p>${item.key}：${item.val}</p>`;
          } else {
            hidden_html += `<p>${item}</p>`;
          }
        }
        return `<div class="pjw-class-info-important"><p>${appear_html.join(" / ")}</p></div><div class="pjw-class-info-additional">${hidden_html}</div>`;
      }

      function getNumInfo(content) {
        var html = "";
        for (var item of content) {
          if (item.num !== null)
            html += 
            `<div class="pjw-class-bignum">
              <span class="num">${item.num}</span>
              <span class="label">${item.label}</span>
            </div>`;
        }
        return html;
      }

      function getWeeksBar(data) {
        var html = "";
        for (var item of data) {
          var style = `left: ${String((item.start - 1.4) / total_weeks * 100) + "%"}; width: ${String((item.end - item.start + 1.8) / total_weeks * 100) + "%"}`;
          if (item.start != item.end)
            html += `<div class="pjw-class-weeknum-bar__fill" style="${style}">${item.start}-${item.end}${item.end - item.start > 2 ? "周" : ""}</div>`;
          else
            html += `<div class="pjw-class-weeknum-bar__fill" style="${style}">${item.start}</div>`;
        }
        return html;
      }

      function getWeeks(data) {
        let html = "";
        const weeks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let item of data) {
          for (let i = item.start; i <= item.end; i++)
            weeks[i] = 1;
          weeks[item.start] = 2;
          weeks[item.end] = 2;
        }
        for (let i = 1; i <= total_weeks; i++) {
          const s = [229, 119, 180];
          const e = [123, 11, 94];
          const x = (i - 1) / (total_weeks - 1);
          const _x = 1 - x;
          const rgb = [s[0]*x+e[0]*_x, s[1]*x+e[1]*_x, s[2]*x+e[2]*_x];
          const fill_color = `rgb(${rgb.join(",")})`;
          if (weeks[i] == 1) {
            html += `
              <svg height="15" width="5">
                <path d="M 0.7 5.5 L 0.7 9.5 L 4.3 7.5 Z" fill="${fill_color}"></path>
              </svg>`;
          } else if (weeks[i] == 2) {
            html += `<svg height="15" width="${i > 9 ? 15 : 10}">
              <text x="50%" y="50%" dy="1" dominant-baseline="middle" text-anchor="middle" 
                  style="fill: ${fill_color}; font: bold 11px sans-serif;">${i}</text>
            </svg>`;
          } else {
            html += `<svg height="15" width="3.5">
              <circle cx="50%" cy="50%" r="1" fill="gray"/>
            </svg>`;
          }
        }
        return html;
      }

      function getLessonTime(data) {
        var heading_html = ``;
        var body_html = ``;

        var weekend_flag = false;
        var has_lecture = [0, 0, 0, 0, 0, 0, 0, 0];
        var hourly_css_class = [
          ["", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", ""]
        ];

        for (var item of data) {
          if (item.weekday > 5 && weekend_flag == false)
            weekend_flag = true;

          has_lecture[item.weekday]++;

          var css_class = "selected ";
          if (item.type == "odd") css_class += "sel-odd-class ";
          else if (item.type == "even") css_class += "sel-even-class ";
          for (var i = item.start; i <= item.end; i++) {
            hourly_css_class[item.weekday][i] += css_class;
          }
          hourly_css_class[item.weekday][item.start] += "sel-start ";
          hourly_css_class[item.weekday][item.end] += "sel-end ";
        }

        const weekday_display_name = ["", "M", "TU", "W", "TH", "F", "SA", "SU"];

        for (var i = 1; i <= 7; i++) {
          if (i > 5 && weekend_flag == false) break;

          var data_arc = hourly_css_class[i].map((x) => (
            x == "" ? "0" : (x.includes("even") || x.includes("odd") ? "2" : "1")
          )).join('').slice(1);

          heading_html += `
            <div class="pjw-class-weekcal-heading-day` + (has_lecture[i] ? " selected" : "") + `">
              <span>${has_lecture[i] ? weekday_display_name[i][0] : weekday_display_name[i]}</span>
              ${has_lecture[i] ? `<canvas class="pjw-class-weekcal-arc" data-arc="${data_arc}" width="100" height="100"></canvas><canvas class="pjw-class-weekcal-arc-white" data-arc="${data_arc}" width="100" height="100"></canvas>` : ''}
            </div>`;

          var body_html_span = "";
          
          for (var j = 1; j <= 12; j++) {
            if (hourly_css_class[i][j] != "")
              body_html_span += `<span class="${hourly_css_class[i][j]}">${j}</span>`;
            else if (j != 12)
              body_html_span += `<span>${j}</span>`;
          }

          body_html += `<div class="pjw-class-weekcal-calendar-day` + (has_lecture[i] ? " selected" : "") + `">${body_html_span}</div>`;
        }

        return `<div class="pjw-class-weekcal-heading">${heading_html}</div><div class="pjw-class-weekcal-calendar">${body_html}</div>`;
      }

      function getSelectButton(data, get_inner = false) {
        if (!data.status) return "";
        var label_text = "";
        var icon_text = "";
        var disabled = "";
        var extra_classes = "";

        // status: "Select", "Deselect", "Full", "Selected", false
        switch (data.status) {
          case "Select":
            label_text = "选择";
            icon_text = "control_point";
            break;
          case "Deselect":
            label_text = "退选";
            icon_text = "delete_outline";
            extra_classes = "deselect";
            break;
          case "Full":
            label_text = "满额";
            disabled = "disabled";
            icon_text = "block";
            break;
          case "Selected":
            label_text = "已选";
            disabled = "disabled";
            icon_text = "check_box";
            break;
        }

        var info_text = "";
        if (data.text)
          info_text = `<div class="pjw-class-select-button__status">${data.text}</div>`;

        var inner_html = `<div class="mdc-button__ripple"></div><div class="material-icons-round">${icon_text}</div><div class="pjw-class-select-button__container"><div class="pjw-class-select-button__label">${label_text}</div>${info_text}</div>`;
        if (get_inner === true)
          return {
            html: inner_html,
            disabled: (disabled == "disabled"),
            extra_classes: extra_classes
          };
        return `<div class="pjw-class-select-button__wrapper"><button data-mdc-auto-init="MDCRipple" ${disabled} class="mdc-button mdc-button--raised pjw-class-select-button ${extra_classes}" data-extra-class="${extra_classes}">${inner_html}</button>`
          + (data.extra_text ? `<span class="pjw-class-select-button-extra-text">${data.extra_text}</span></div>` : "</div>")
          + `<div class="pjw-class-splitter"></div>`;
      }

      function getMenuButtons(index, classID, class_name, teachers) {
        var teacher_str = teachers.length ? `（${teachers.join("，")}）`: "";
        var html = `<div style="margin: 1px 3px; display: flex;">
        <div class="mdc-menu-surface--anchor">
          <button class="mdc-fab pjw-class-menu-button pjw-class-filter-button" style="background-color: rgba(0, 0, 0, .7);" data-mdc-auto-init="MDCRipple">
            <div class="mdc-fab__ripple"></div>
            <span class="mdc-fab__icon material-icons-round pjw-class-menu-icon">filter_alt</span>
          </button>
          <div class="mdc-menu mdc-menu-surface pjw-class-filter-menu">
            <ul class="mdc-deprecated-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
              <li class="mdc-deprecated-list-item pjw-class-menu-filter-include pjw-class-menu-item" data-mdc-auto-init="MDCRipple" role="menuitem">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__graphic material-icons-round pjw-class-menu-item-icon">
                  filter_alt
                  <span class="material-icons-round">add</span>
                </span>
                <span class="mdc-deprecated-list-item__text">筛选器：包含此课程</span>
              </li>
              <li class="mdc-deprecated-list-item pjw-class-menu-filter-exclude pjw-class-menu-item" data-mdc-auto-init="MDCRipple" role="menuitem">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__graphic material-icons-round pjw-class-menu-item-icon">
                  filter_alt
                  <span class="material-icons-round">remove</span>
                </span>
                <span class="mdc-deprecated-list-item__text">筛选器：隐藏此课程</span>
              </li>
              <li class="mdc-deprecated-list-item pjw-class-menu-search-similar pjw-class-menu-item" data-mdc-auto-init="MDCRipple" role="menuitem">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__graphic material-icons-round">
                  search
                </span>
                <span class="mdc-deprecated-list-item__text">搜索相似课程</span>
              </li>
              <li class="mdc-deprecated-list-item${teachers.length ? "" : " mdc-deprecated-list-item--disabled"} pjw-class-menu-search-teacher pjw-class-menu-item" data-mdc-auto-init="MDCRipple" role="menuitem">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__graphic material-icons-round pjw-class-menu-item-icon">
                  search
                  <span class="material-icons-round">school</span>
                </span>
                <span class="mdc-deprecated-list-item__text">搜索该教师</span>
              </li>
              <li class="mdc-deprecated-list-divider" role="separator"></li>
              <li class="mdc-deprecated-list-item mdc-deprecated-list-item--disabled pjw-class-menu-item" data-mdc-auto-init="MDCRipple" role="menuitem">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__text">${class_name}${teacher_str}</span>
              </li>
              <li class="mdc-deprecated-list-item mdc-deprecated-list-item--disabled pjw-class-menu-item" data-mdc-auto-init="MDCRipple" role="menuitem">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__text">选课号：${classID > 0 ? classID : "无法选择"}</span>
              </li>
              <li class="mdc-deprecated-list-item mdc-deprecated-list-item--disabled pjw-class-menu-item" data-mdc-auto-init="MDCRipple" role="menuitem">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__text">列表排序：${index}</span>
              </li>
            </ul>
          </div>
        </div>`;
        if (data.fav_button) {
          html += `<button class="mdc-fab pjw-class-menu-button pjw-class-fav-button" style="background-color: #ec407a; data-mdc-auto-init="MDCRipple">
            <div class="mdc-fab__ripple"></div>
            <span class="mdc-fab__icon material-icons-round pjw-class-menu-icon">${data.fav_button.type ? "remove_circle" : "favorite"}</span>
          </button></div>`;
        }
        return html;
      }

      switch(attr) {
        case "title":
          if ("title" in data)
            return getTitle(data.title);
          else return "";

        case "teachers":
          if ("teachers" in data && data.teachers.length > 0)
            return getTeachers(data.teachers);
          else return "";

        case "info":
          if ("info" in data)
            return getClassInfo(data.info, data.classID);
          else return "";

        case "numinfo":
          if ("num_info" in data)
            return getNumInfo(data.num_info);
          else return "";

        case "weeksbar":
          if ("class_weeknum" in data) {
            if (data.class_weeknum.length)
              return `<div class="pjw-class-weeknum-bar">${getWeeksBar(data.class_weeknum)}</div>`
            else
              return `<div class="pjw-class-weeknum-bar" style="display: none;"></div>`;
          } else {
            return "";
          }

        case "weeks":
          if ("class_weeknum" in data && data.class_weeknum.length) {
            return `<div class="pjw-class-weeknums">${getWeeks(data.class_weeknum)}</div>`
          } else {
            return "";
          }

        case "lessontime":
          if ("lesson_time" in data && data.lesson_time.length > 0)
            return getLessonTime(data.lesson_time);
          else return "";

        case "timedetail":
          if ("time_detail" in data && data.time_detail.length > 0)
            return `<div class="pjw-class-time-detail">${data.time_detail}</div>`;
          else return "";

        case "selectbutton":
          if ("select_button" in data)
            return getSelectButton(data.select_button, options);
          else return "";

        case "menubuttons":
          return getMenuButtons(this.index, data.classID, data.title, data.teachers);
      }
    }

    set(data) {
      var class_html = `
        <div class="pjw-class-info">
          <div class="pjw-class-info-top">
            <span class="pjw-class-title">${this.getHTML(data, "title")}</span>
            <span class="pjw-class-teacher">${this.getHTML(data, "teachers")}</span>
          </div>
          <div class="pjw-class-info-bottom">${this.getHTML(data, "info")}</div>
        </div>
        <div class="pjw-class-sub">
          <div class="pjw-class-weekcal">
            ${this.getHTML(data, "lessontime")}
          </div>

          <div class="pjw-class-places">
            ${this.getHTML(data, "weeks")}
            <span>${(!("places" in data) || data.places == "") ? "" : data.places}</span>
          </div>
          
          <div class="pjw-class-sideinfo">
            ${this.getHTML(data, "timedetail")}
            ${this.getHTML(data, "weeksbar")}
            <div class="pjw-class-num-info">${this.getHTML(data, "numinfo")}</div>
          </div>
        </div>
        <div class="pjw-class-operation pjw-no-expand">
          ${this.getHTML(data, "selectbutton")}
          ${this.getHTML(data, "menubuttons")}
        </div>
      `;
      this.dom.html(class_html);
    }

    updateSelectButton(data) {
      if (!this.initialized) return;
      var button_res = this.getHTML({select_button: data}, "selectbutton", true);
      this.select_button.html(button_res.html);
      this.select_button.prop("disabled", button_res.disabled);

      if (this.select_button.attr("data-extra-class"))
        this.select_button.removeClass(this.select_button.attr("data-extra-class"));
      this.select_button.addClass(button_res.extra_classes);
      this.select_button.attr("data-extra-class", button_res.extra_classes);
    }

    updateNumInfo(data) {
      if (!this.initialized) return;
      if (this.sideinfo.children(".pjw-class-num-info").length)
        this.sideinfo.children(".pjw-class-num-info").html(this.getHTML(data, "numinfo"));
    }

    constructor(DOMparent, data, index, listparent) {
      var class_html = `<div class="mdc-card pjw-class-container pjw-class-container--compressed" style="display: none;"></div>`;
      this.dom = $$(class_html).appendTo(DOMparent);
      this.data = data;
      this.index = index;
      this.list = listparent;
      this.initialized = false;
    }

    intl() {
      if (this.initialized) return;
      this.initialized = true;

      var data = this.data;
      
      this.set(data);

      this.info = this.dom.children(".pjw-class-info");
      this.sub = this.dom.children(".pjw-class-sub");
      this.weekcal = this.sub.children(".pjw-class-weekcal");
      this.sideinfo = this.sub.children(".pjw-class-sideinfo");
      this.operation = this.dom.children(".pjw-class-operation");
      this.select_button = this.operation.find(".pjw-class-select-button");
      this.filter_button = this.operation.find(".pjw-class-filter-button");
      this.favorite_button = this.operation.find(".pjw-class-fav-button");
      this.filter_menu = new mdc.menu.MDCMenu(this.operation.find(".pjw-class-filter-menu")[0]);
      this.operation.find(".pjw-class-filter-menu").click({
        target: this.filter_menu
      }, (e) => {
        e.data.target.menuSurface.close();
      });

      // Draw weekday lesson time rings
      var deg_list = [
        [0,2],[2,4],
        [5,7],[7,9],
        [10,12],[12,14],
        [15,17],[17,19],
        [20,22],[22,24],[24,26]
      ];
      var color_list = [
        "yellow", "yellow",
        "white", "white",
        "#e5ffc7", "#e5ffc7",
        "#ff5400", "#ff5400",
        "#8178f9", "#8178f9", "#8178f9"
      ];
      this.weekcal.find("canvas").each((index, val) => {
        var ctx = val.getContext("2d");
        var arc_list = $$(val).attr("data-arc");

        for (var i = 0; i < 11; i++) {
          ctx.beginPath();  
          if ($$(val).hasClass("pjw-class-weekcal-arc")) {
            ctx.lineWidth = 8;
            // Stroke color in compressed calendar
            ctx.strokeStyle = arc_list[i] == "0" ? "rgba(255, 255, 255, .2)" : color_list[i];
          } else {
            ctx.lineWidth = 6;
            // Stroke color in expanded calendar
            ctx.strokeStyle = arc_list[i] == "0" ? "#7b97ca" : "rgba(255, 255, 255, 1)";
          }
          var deg_start = (deg_list[i][0] * (2/27) - 1.2037) * Math.PI - 0.02;
          var deg_end = (deg_list[i][1] * (2/27) - 1.2037) * Math.PI + 0.02;
          if (arc_list[i] == "2" || arc_list[i] == "0") {
            // Draw dotted line
            var deg_mid = (deg_start + deg_end) / 2, deg_gap = (deg_end - deg_start) / 6;
            deg_start = deg_mid - (arc_list[i] == "0" ? 1 : 2) * deg_gap;
            deg_end = deg_mid + deg_gap;
          }
          ctx.arc(50, 50, 35, deg_start, deg_end);
          ctx.stroke();
        }
      });

      // Set select button click event
      this.select_button.click({
        target: this,
        action: ("action" in data.select_button ? data.select_button.action : () => {})
      }, (e) => {
        e.data.target.select_button.prop("disabled", true);
        e.data.action(e).finally(() => {
          e.data.target.select_button.prop("disabled", false);
          e.data.target.list.refresh(false);
        });
      });

      this.favorite_button.click({
        target: this,
        action: (data.fav_button && "action" in data.fav_button ? data.fav_button.action : () => {})
      }, (e) => {
        e.data.target.favorite_button.prop("disabled", true);
        e.data.action(e).then(() => {
          e.data.target.favorite_button.prop("disabled", false);
          e.data.target.favorite_button.find("span").text(e.data.target.data.fav_button.type ? "remove_circle" : "favorite");
        }).catch(() => {
          e.data.target.favorite_button.prop("disabled", false);
        });
      });
      
      // Set filter button click event
      this.filter_button.click({
        target: this
      }, (e) => {
        e.data.target.filter_menu.menuSurface.open();
      });

      this.filter_menu.menuSurface.setAnchorCorner(mdc.menu.Corner.TOP_RIGHT);
      
      // Set filter menu click event
      this.operation.find(".pjw-class-menu-search-similar").click({
        target: this
      }, (e) => {
        if (e.data.target.data.teachers.length)
          e.data.target.list.search_field.value = e.data.target.data.title + " " + e.data.target.data.teachers.join(" ");
        else
          e.data.target.list.search_field.value = e.data.target.data.title;
        e.data.target.list.search_input.trigger("input");
        document.documentElement.scrollTop = 0;
      });

      this.operation.find(".pjw-class-menu-search-teacher").click({
        target: this
      }, (e) => {
        if (e.data.target.data.teachers.length) {
          e.data.target.list.search_field.value = e.data.target.data.teachers.join(" ");
          e.data.target.list.search_input.trigger("input");
          document.documentElement.scrollTop = 0;
        }
      });
      
      function addAdvancedRule(class_data, adv_filter, type) {
        if (class_data.classID && class_data.classID > 0) {
          adv_filter.addRule(adv_filter, {
            "classID": class_data.classID
          }, `选课编号：${class_data.classID}（${class_data.title} ${class_data.teachers.join("/")}）`, type);
        } else {
          adv_filter.addRule(adv_filter, {
            "title": class_data.title,
            "teachers": class_data.teachers,
            "time_detail": class_data.time_detail
          }, `${class_data.title} ${class_data.teachers.join("/")} ${class_data.time_detail}`, type);
        }
      }

      this.operation.find(".pjw-class-menu-filter-include").click({
        target: this
      }, (e) => {
        var class_data = e.data.target.data;
        var adv_filter = e.data.target.list.filters.advanced;
        addAdvancedRule(class_data, adv_filter, "include");
        e.data.target.list.update();
      });

      this.operation.find(".pjw-class-menu-filter-exclude").click({
        target: this
      }, (e) => {
        var class_data = e.data.target.data;
        var adv_filter = e.data.target.list.filters.advanced;
        addAdvancedRule(class_data, adv_filter, "exclude");
        e.data.target.list.update();
      });

      // Initialize DOM trace variables
      this.display = false;
      this.priority = 0;

      this.dom.on("click", null, {
        target: this
      }, (e) => {
        if (window.getSelection().toString() != "") return;
        if ($$(e.target).is("button")) return;
        if ($$(e.target).parents("button").length) return;
        if ($$(e.target).is(".pjw-no-expand")) return;
        if ($$(e.target).parents(".pjw-no-expand").length) return;
        var t = jQuery(e.delegateTarget);
        var list = e.data.target.list;
        if (t.hasClass("pjw-class-container--compressed")) {
          list.current_expanded && list.current_expanded.addClass("pjw-class-container--compressed");
          t.removeClass("pjw-class-container--compressed");
          list.current_expanded = t;
        } else {
          t.addClass("pjw-class-container--compressed");
          list.current_expanded = null;
        }
      });
    }
  };

  window.PJWClassList = class {
    // Adds class into list
    add(data) {
      if (!this.prepared_to_add) {
        this.intl();
        this.prepared_to_add = true;
      }

      function compareData(data1, data2) {
        if ("title" in data2 && data1.title == data2.title)
          if ("teachers" in data2 && data1.teachers.join() == data2.teachers.join()) {
            if (data1.places == data2.places && data1.lesson_time == data2.lesson_time) {
              return true;
            }
          }
        return false;
      }

      // Process Title
      if (data.title.trim() == "&nbsp;" || data.title.trim() == "") return;

      data.title = data.title.split("<br>");
      if (data.title.length > 1) {
        if (!("info" in data)) data["info"] = [];
        data["info"].push({
          key: "附加信息",
          val: "".concat(data.title.slice(1)),
          hidden: true
        });
      }
      data.title = data.title[0];

      // Check soft refresh
      var data_compare_res = false;
      if (this.soft_refresh && this.auto_inc < this.class_data.length)
        data_compare_res = compareData(data, this.class_data[this.auto_inc].data);

      if (!data.classID)
        data.classID = -1;

      if (data_compare_res) {
        // Conduct soft refresh
        this.class_data[this.auto_inc].data = data;
        var target = this.class_data[this.auto_inc].obj;
        target.data = data;
        if (data_compare_res !== false) { 
          target.updateSelectButton(data.select_button);
          if (data_compare_res == 1)
            target.updateNumInfo(data);
        }
      } else {
        // Conduct hard refresh
        this.soft_refresh = false;

        var item = {
          data: data,
          obj: new PJWClass(this.body, data, this.auto_inc, this),
          id: this.auto_inc
        };
        if (this.auto_inc < this.class_data.length) {
          this.class_data[this.auto_inc].obj.remove();
          this.class_data[this.auto_inc] = item;
        } else {
          this.class_data.push(item);
        }
      }
      this.auto_inc++;
    }

    // Resets classlist
    clear() {
      this.class_data = [];
      this.body.html("");
      this.auto_inc = 0;
      this.max_classes_loaded = this.class_load_size;
    }

    // Get campus ID
    getCampusID(text) {
      return campus_id_map[text];
    }

    // Set total weeks
    setTotalWeeks(weeks) {
      total_weeks = weeks;
    }

    // Checks match of the search string ($pattern) in target string ($str)
    matchDegree(pattern, str) {
      if (!pattern || !str) return 0;

      function testString(keyword, str) {
        if (!str) return 0;
        if (keyword.length != 1 && keyword[0] == "-") {
          if (testString(keyword.slice(1), str) !== 0)
            return false;
          else
            return 0;
        }

        if (keyword == "*") return 1;

        keyword = keyword.toUpperCase();
        str = str.toUpperCase();
        var pos = str.indexOf(keyword);

        // Generate Pinyin initials
        if (pos == -1 && /^[a-zA-Z]+$/.test(keyword)) {
          var initials = "";
          for (var char of str)
            initials += Pinyin.convertToPinyin(char)[0];
          str = initials;
          pos = str.indexOf(keyword);
        }

        if (pos == 0) {
          return 0.6 + (keyword.length / str.length) * 0.4;
        } else if (pos != -1) {
          return 0.3 + (keyword.length / str.length) * 0.5;
        } else if (keyword.length == 2) {
          if (str.indexOf(keyword[1]) > str.indexOf(keyword[0]) 
            && str.indexOf(keyword[0]) != -1) {
            if (str.indexOf(keyword[0]) == 0) return 0.5;
            else if (/^[a-zA-Z]+$/.test(keyword)) return 0.05;
            else return 0.4;
          }
        }
        return 0;
      }

      pattern = pattern.trim().split(" ");
      if (pattern[0] == "") return 0;
      var pattern_num = pattern.length;
      var total_matched_num = 0;

      for (var keyword of pattern) {
        var matched_num = 0;
        if (typeof(str) == "string") {
          var t = testString(keyword, str);
          if (t !== false) matched_num += t;
          else return false;
        } else if (typeof(str) == "object") {
          for (var substr of str) {
            var t = testString(keyword, substr);
            if (t !== false) matched_num += t;
            else return false;
          }
        }
        total_matched_num += matched_num;
      }
      return 100.0 * (total_matched_num / pattern_num);
    }

    // Searches search_str in data
    search(data, search_str) {
      if (typeof(search_str) == "undefined" || search_str == "") {
        return 0;
      }
      var priority = 0.0;
      var priority_map = [
        [data.title, 8], 
        [data.teachers, 6], 
        [data.info.map((item) => (item.val)), 3],
        [data.places || "", 1]
      ];
      for (var item of priority_map) {
        var res = this.matchDegree(search_str, item[0]);
        if (res === false) return false;
        priority += item[1] * res;
      }
      if (priority == 0) {
        return false;
      } else {
        return priority;
      }
    }

    // Returns class priority
    // Returns false when the class do not match the filter
    checkFilter(data, class_obj) {
      var priority = 0.0;

      /* Search module */
      if (this.filters.advanced)
        this.filters.advanced.updateSearch(this.search_string);
      var search_priority = this.search(data, this.search_string);
      if (search_priority === false) {
        priority = -1;
      } else {
        priority += search_priority;
      }

      /* Filter modules */
      for (var name in this.filters) {
        if (typeof(this.filters[name]["check"]) != "function") continue;
        if (priority < 0 && name != "advanced") continue;
        if ("enabled" in this.filters[name] && this.filters[name].enabled == false) continue;
        var res = this.filters[name].check(this.filters[name], data, class_obj);
        if (res === false) {
          priority = -1;
        } else if (res === true) {
          if (priority < 0) priority = 0;
          return data.priority = priority;
        } else {
          priority += res;
        }
      }
      
      return data.priority = priority;
    }

    // Initializes class data before adding first class
    intl() {
      this.addFilterHook("handleParseComplete");
      this.class_data.sort(function(a, b) {
        return a.id - b.id;
      });
      this.auto_inc = 0;
      this.soft_refresh = true;
    }

    // Rearranges classes
    // Call this function when class_data is updated
    update() {
      if (this.auto_inc < this.class_data.length) {
        for (var item of this.class_data.slice(this.auto_inc))
          item.obj.remove();
        this.class_data = this.class_data.slice(0, this.auto_inc);
      }

      this.class_load_count = this.class_data.length;
      for (var item of this.class_data)
        if (this.checkFilter(item.data, item.obj) < 0) {
          item.obj.hide();
          this.class_load_count--;
        }

      this.class_data.sort(function(a, b) {
        if (parseInt(b.data.priority) == parseInt(a.data.priority))
          return a.id - b.id;
        else if (b.data.priority > a.data.priority)
          return 1;
        else
          return -1;
      });

      for (var i = 0; i < this.class_data.length; i++) {
        if (i < this.max_classes_loaded && this.class_data[i].data.priority >= 0) {
          this.class_data[i].obj.intl();
          this.class_data[i].obj.show();
        } else {
          this.class_data[i].obj.hide();
        }
        this.class_data[i].obj.setPriority(this.class_data.length - i);
      }
      this.handleResize();
      this.prepared_to_add = false;
      window.mdc.autoInit();
      this.setStatus(true);
    }

    getClassInfoForAlert(data) {
      if (data.teachers.length == 0)
        return `《${data.title}》`;
      return `《${data.title}》（${data.teachers.join("，")}）`;
    }

    getPlacesString(places) {
      return places.map((x) => (x ? x.replace(new RegExp("/", 'g'), " ") : x))
                   .filter((v, i, s) => (s.indexOf(v) === i && v))
                   .join('/')
                   .replace(new RegExp("Ⅱ", 'g'), "II").replace(new RegExp("Ⅰ", 'g'), "I").replace(new RegExp("、", 'g'), " ")
    }

    parseTeacherNames(text) {
      if (!text || text == "") return [];
      return text.split(/[,，]\s/g);
    }

    parsePlaces(weeks_list) {
      if (!weeks_list) return "";
      let places = [];
      for (const week of weeks_list) {
        places.push(week.teachingPlace);
      }
      return this.getPlacesString(places);
    }

    parseWeekNum(weeks_list) {
      if (!weeks_list) return [];
      let weeks = new Array(20).fill(0);
      for (const item of weeks_list) {
        for (let index = 0; index < item.week.length && index < total_weeks; index++) {
          weeks[index + 1] |= (item.week[index] == "1" ? 1 : 0);
        }
      }
      let ans_weeks = [];
      for (let i = 1; i <= total_weeks + 1; i++) {
        if (weeks[i] == 1 && weeks[i-1] == 0) {
          ans_weeks.push({
            start: i,
            end: i
          });
        } else if (weeks[i] == 0 && weeks[i-1] == 1) {
          ans_weeks[ans_weeks.length - 1].end = i-1;
        }
      }
      return ans_weeks;
    }
    
    // "normal", "odd", "even"
    parseWeekType(weeks) {
      if (!weeks) return "normal";
      var odd_flag = false, even_flag = false;
      for (var i = 0; i < total_weeks; i++) {
        if (weeks[i] == "1" && i % 2 == 0) odd_flag = true;
        if (weeks[i] == "1" && i % 2) even_flag = true;
      }
      if (odd_flag && even_flag)
        return "normal";
      if (odd_flag)
        return "odd";
      return "even";
    }
    
    // Converts new system lesson time to potatoplus lesson time
    // For new system
    parseLessonTime(data) {
      let lesson_time = [];
      if (!data) return [];
      for (const item of data) {
        if (item.endSection == 0) continue;
        lesson_time.push({
          start: parseInt(item.beginSection),
          end: parseInt(item.endSection),
          type: this.parseWeekType(item.week),
          weekday: parseInt(item.dayOfWeek)
        });
      }
      return lesson_time;
    }
    

    parseClassNumber(obj) {
      return obj.children("a").children("u").html();
    }

    // Converts the class time string to a friendly array
    // For old system
    /* Returns object {
      lesson_time: [{
        weekday: Integer,
        start: Integer,
        end: Integer,
        type: String ("normal", "odd", "even")
      }],
      ans_weeks: [{
        start: Integer,
        end: Integer
      }, ...]
    }*/
    parseClassTime(text) {
      if (!text) {
        return {
          lesson_time: [],
          class_weeknum: [],
          places: ""
        };
      }
      var classes = text.split(/<br>|;/);
      const weekday_to_num = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "日": 7};

      var weeks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var ans = [];
      var places = [];

      for (var item of classes) {
        if (item == "") continue;
        var words = item.split(/\s|\&nbsp;|,/g);
        var weekday = 0;
        var has_week_info = false;
        var has_lesson_time_info = false;
        var place = [];

        for (var word of words) {
          if (word[0] == "周") {
            weekday = weekday_to_num[word[1]];
          } else if (/周(\((单|双)\))?$/.test(word)) {
            has_week_info = true;
            if (word.search("单") != -1) {
              for (var i = 1; i <= total_weeks; i += 2)
                weeks[i] = 1;
              ans[ans.length - 1].type = "odd";
            } else if (word.search("双") != -1) {
              for (var i = 2; i <= total_weeks; i += 2)
                weeks[i] = 1;
              ans[ans.length - 1].type = "even";
            } else {
              var num_arr = word.match(/(\d+)+/g);
              if (num_arr.length == 1)
                weeks[parseInt(num_arr[0])] = 1;
              else if (num_arr.length == 2)
                for (var i = parseInt(num_arr[0]); i <= Math.min(total_weeks, parseInt(num_arr[1])); i++)
                  weeks[i] = 1;
            }
          } else if (/从第(\d+)周开始/.test(word)) {
            has_week_info = true;
            var start_week = parseInt(word.match(/(?:从第)(\d+)(?:周开始)/)[1]);
            if (word.search("单周") != -1) {
              for (var i = start_week; i <= total_weeks; i += 2)
                weeks[i] = 1;
              ans[ans.length - 1].type = "odd";
            } else if (word.search("双周") != -1) {
              for (var i = start_week; i <= total_weeks; i += 2)
                weeks[i] = 1;
              ans[ans.length - 1].type = "even";
            }
          } else if (word[word.length - 1] == "节") {
            var num_arr = word.match(/(\d+)+/g);
            if (num_arr.length == 1)
              num_arr.push(num_arr[0]);
            if (weekday != 0 && num_arr.length) {
              has_lesson_time_info = true;
              ans.push({
                weekday: weekday,
                start: parseInt(num_arr[0]),
                end: parseInt(num_arr[1]),
                type: "normal"
              });
            }
          } else {
            place.push(word);
          }
        }

        if (has_week_info == false && has_lesson_time_info == true)
          for (var i = 1; i <= total_weeks; i++)
            weeks[i] = 1;

        places.push(place.join(' '));
      }

      var ans_weeks = [];
      for (var i = 1; i <= total_weeks + 1; i++) {
        if (weeks[i] == 1 && weeks[i-1] == 0) {
          ans_weeks.push({
            start: i,
            end: i
          });
        } else if (weeks[i] == 0 && weeks[i-1] == 1) {
          ans_weeks[ans_weeks.length - 1].end = i-1;
        }
      }
      return {
        lesson_time: ans,
        class_weeknum: ans_weeks,
        places: this.getPlacesString(places)
      };
    }

    checkScroll() {
      if ("scroll_lock" in this && this.scroll_lock == true) return;
      this.scroll_lock = true;
      if (this.class_data.length > this.max_classes_loaded 
          && $$(window).scrollTop() + $$(window).height() + 1800 >= $$(document).height()) {
        var count = 0;
        for (var i = this.max_classes_loaded; 
            i < this.max_classes_loaded + this.class_load_size 
            && i < this.class_data.length 
            && this.class_data[i].data.priority >= 0; i++) {
          this.class_data[i].obj.show();
          count++;
        }

        this.max_classes_loaded += count;
        window.mdc.autoInit();
        setTimeout((t) => {t.scroll_lock = false;}, 100, this);
      } else if (this.max_classes_loaded >= 2 * this.class_load_size 
          && $$(window).scrollTop() + $$(window).height() + this.class_load_size * 150 + 1800 <= $$(document).height()) {
        var orig_classes_count = this.max_classes_loaded;
        this.max_classes_loaded -= this.class_load_size * parseInt(
          ($$(document).height() - $$(window).scrollTop() - $$(window).height() - 1800) / 150 / this.class_load_size
        );
        this.max_classes_loaded = Math.max(this.class_load_size, this.max_classes_loaded);

        for (var i = this.max_classes_loaded; i < orig_classes_count; i++)
          this.class_data[i].obj.hide();
        
        setTimeout((t) => {t.scroll_lock = false;}, 100, this);
      } else {
        this.scroll_lock = false;
      }
    }

    setStatus(text) {
      var target = $$("#pjw-classlist-status");
      if (text === true) {
        if (this.class_data.length == 0) {
          target.text("没有发现课程 : (");
        } else if (this.class_data.length == this.class_load_count) {
          target.text(`共计 ${this.class_data.length} 门课程 `);
        } else {
          target.text(`已展示 ${this.class_load_count} / ${this.class_data.length} 门课程`);
        }
      } else {
        target.html(text);
      } 
    }

    refresh(hard_load = false) {
      if (this.ajax_request) {
        this.ajax_request.abort();
        this.ajax_request = null;
      }
      if (hard_load) {
        this.clear();
        this.body.css("transition", "");
        this.body.css("opacity", "0");
      }
      this.setStatus("正在加载...");
      this.auto_inc = 0;
      return this.load().then(() => {
        this.addFilterHook("handleRefreshComplete");
        this.setStatus(true);
        this.body.css("transition", "opacity .8s cubic-bezier(0.5, 0.5, 0, 1)");
        this.body.css("opacity", "1");
      }).catch((e) => {
        if (e && e.statusText == "abort") return;
        this.setStatus("加载失败 : (");
        this.console.error("无法加载课程列表：" + e);
      });
    }

    addFilterHook(name) {
      for (var filter in this.filters)
        if (typeof(this.filters[filter][name]) == "function")
          this.filters[filter][name](this.filters[filter], this);
    }

    // Increases refresh speed when pressing speed adjustment button
    speedUp() {
      if (!this.max_frequency)
        this.max_frequency = 8.0;
      if (this.auto_refresh_frequency <= 3.0)
        this.auto_refresh_frequency *= 1.06;
      else if (this.auto_refresh_frequency <= 6.0)
        this.auto_refresh_frequency += 0.2;
      else if (this.auto_refresh_frequency < this.max_frequency)
        this.auto_refresh_frequency += 0.1;
      else
        this.auto_refresh_frequency = this.max_frequency;

      // Updates button label to current speed
      $$("#autorefresh-label").html(this.auto_refresh_frequency.toFixed(1) + "x");
    }

    // Triggered by speed adjustment button
    autoRefreshButtonEvent(status) {
      if ($$("#autorefresh-switch").hasClass("off")) return;
      if (status) {
        if (typeof(this.refresh_button_interval_id) != "undefined")
          clearInterval(this.refresh_button_interval_id);
        if (typeof(this.show_refresh_level_timeout_id) != "undefined")
          clearTimeout(this.show_refresh_level_timeout_id);
        this.toggleAutoRefresh(false);
        this.auto_refresh_frequency = 1.0;
        $$("#autorefresh-label").html("1.0x");
        this.refresh_button_interval_id = window.setInterval((target) => {
          target.speedUp();
        }, 50, this);
      } else {
        // Shows speed in natural language after releasing speed adjustment button
        var text = "";
        if (this.auto_refresh_frequency <= 3.0)
          text = "标准";
        else if (this.auto_refresh_frequency <= 6.0)
          text = "快";
        else
          text = "极速";
        this.show_refresh_level_timeout_id = setTimeout( (text) => {
          $$("#autorefresh-label").html(text);
        }, 1000, text);
        this.toggleAutoRefresh(true);
        clearInterval(this.refresh_button_interval_id);
      }
    }

    // Toggle auto refresh
    toggleAutoRefresh(status) {
      if (status) {
        // Start Autorefresh
        this.console.debug("自动刷新已打开。")

        function randomNormalDistribution() {
          var u=0.0, v=0.0, w=0.0, c=0.0;
          do {
            u = Math.random()*2 - 1.0;
            v = Math.random()*2 - 1.0;
            w = u*u + v*v;
          } while (w == 0.0 || w >= 1.0)
          c = Math.sqrt((-2 * Math.log(w)) / w);
          return u * c;
        }

        function getNumberInNormalDistribution(mean, std_dev, lower_limit, upper_limit) {
          var res = Math.floor(mean + randomNormalDistribution() * std_dev);
          if (res >= upper_limit) return upper_limit;
          if (res >= mean) return res;
          res = mean - (mean-res) * 0.8;
          if (res < lower_limit) return lower_limit;
          return res;
        }

        $$("#autoreload-control-section").css("filter", "drop-shadow(2px 4px 6px rgb(16, 141, 255))");

        var auto_refresh_loss_rate = 0.2;

        auto_refresh_loss_rate = 0.1 + getNumberInNormalDistribution(10, 10, 0, 20) / 100;
        var auto_refresh_count = 1;
        var random_interval = (1.0 / this.auto_refresh_frequency) * getNumberInNormalDistribution(Math.floor(Math.random() * 300) + 1500, 600, 1000, 2500);

        this.auto_refresh_interval_id = window.setInterval(function(target) {
          // Random skip
          if (Math.random() < window.auto_refresh_loss_rate) return;

          window.setTimeout(function(target) {
            if ($$("#autorefresh-switch").hasClass("off")) return;

            $$("#autoreload-control-section").css("filter", "drop-shadow(2px 4px 6px rgb(255, 109, 75))");
            target.refresh(false).then(() => {
              if ($$("#autorefresh-switch").hasClass("on"))
                $$("#autoreload-control-section").css("filter", "drop-shadow(2px 4px 6px rgb(16, 141, 255))");
              target.console.debug("自动刷新计数：" + auto_refresh_count++, "auto-refresh-count");
            }).catch((e) => {
              target.console.error(e);
            });
          }, getNumberInNormalDistribution(random_interval * 0.3, random_interval * 0.3, 30, random_interval * 0.8), target);
        }, random_interval, this);
      } else {
        this.console.debug("自动刷新已关闭。")
        $$("#autoreload-control-section").css("filter", "");
        window.clearInterval(this.auto_refresh_interval_id);
      }
    }

    // Triggered by auto-refreshment and filter switch
    triggerSwitch(id) {
      var status = $$("#"+id).hasClass("on");
      if (id == "autorefresh-switch") {
        if (!status) {
          $$("#autorefresh-icon").html("autorenew");
          $$("#autorefresh-label").html("");
          if (typeof(this.refresh_button_interval_id) != "undefined")
            clearInterval(this.refresh_button_interval_id);
          if (typeof(this.show_refresh_level_timeout_id) != "undefined")
            clearInterval(this.show_refresh_level_timeout_id);
        } else {
          $$("#autorefresh-icon").html("speed");
          $$("#autorefresh-label").html("标准");
        }
        this.auto_refresh_frequency = 1.0;
        this.toggleAutoRefresh(status);
      }
    }

    handleResize() {
      var width = this.main.width();
      if (width < 900) {
        this.dom.addClass("view-single-column");
        if (typeof(this.is_filter_panel_shown) == "undefined") this.is_filter_panel_shown = false;
        if (!this.is_filter_panel_shown) this.filter_panel.hide();
        $$("#filter-control-section").show();
      } else {
        this.dom.removeClass("view-single-column");
        this.filter_panel.show();
        $$("#filter-control-section").hide();
      }
      if (width < 500) {
        this.dom.addClass("view-mobile");
        this.dom.addClass("view-narrow-desktop");
      } else if (width < 1150) {
        this.dom.removeClass("view-mobile");
        this.dom.addClass("view-narrow-desktop");
      } else {
        this.dom.removeClass("view-narrow-desktop");
        this.dom.removeClass("view-mobile");
      }
    }

    getClassID(obj) {
      if (obj.children("a").length == 0) return false;
      var str = obj.children("a").attr("href");
      if (str == "" || !str) return false;
      var res = str.match(/[0-9]+/);
      if (res.length >= 1)
        return res[0];
      return false;
    }

    getClassNameFromFuncStr(obj) {
      if (typeof(obj) == "undefined") {
        return false;
      } else if (typeof(obj) == "string") {
        var str = obj;
      } else {
        if (obj.children("a").length == 0) return false;
        var str = obj.children("a").attr("href");
        if (str == "" || !str) return false;
      }

      var res = str.match(/(?:')(.*?)(?:')/);
      if (res.length >= 2)
        return res[1];
      return false;
    }

    constructor(parent, modules = ["avail", "hours", "advanced", "frozen"]) {
      if (modules != [] && pjw.preferences.privilege == "root") {modules.push("potatoes"); this.max_frequency = 15.0;}
      this.filter_modules = modules;

      // Deploy filter DOM
      var filter_modules = "";
      for (var item of this.filter_modules)
        filter_modules += pjw_filter[item].html;

      var list_html = `
      <div class="pjw-classlist">
        <div class="pjw-classlist-heading">
          <div class="pjw-classlist-selectors">
          </div>
          <div class="pjw-classlist-controls">
            <section id="filter-control-section" style="display: none;">
              <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised pjw-classlist-heading-button pjw-classlist-heading-filter-button">
                <div class="mdc-button__ripple"></div>
                <div class="material-icons-round">filter_alt</div>
                <div class="mdc-button__label pjw-classlist-heading-button__label" style="letter-spacing: 2px" id="filter-control-label">筛选器</div>
              </button>
            </section>

            <section id="autoreload-control-section">
              <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised pjw-classlist-heading-button pjw-classlist-heading-refresh-button">
                <div class="mdc-button__ripple"></div>
                <div class="material-icons-round" id="autorefresh-icon">autorenew</div>
                <div class="mdc-button__label pjw-classlist-heading-refresh-button__label" style="letter-spacing: 2px" id="autorefresh-label"></div>
              </button>

              <button class="mdc-button mdc-button--raised pjw-classlist-heading-button pjw-classlist-heading-switch-button off" id="autorefresh-switch">
                <div class="material-icons-round">toggle_off</div>
                <div class="mdc-button__label pjw-classlist-heading-refresh-button__label" style="letter-spacing: 2px" data-off="手动" data-on="自动">手动</div>
              </button>
            </section>

            <section id="search-section">
              <label id="pjw-classlist-search-field"
                  class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-leading-icon mdc-text-field--with-trailing-icon">
                <span class="mdc-notched-outline">
                  <span class="mdc-notched-outline__leading"></span>
                  <span class="mdc-notched-outline__notch">
                    <span class="mdc-floating-label" id="pjw-classlist-search-input__label">${pjw.mode == "course" ? "本地搜索" : "搜索"}</span>
                  </span>
                  <span class="mdc-notched-outline__trailing"></span>
                </span>
                
                <i class="material-icons-round mdc-text-field__icon mdc-text-field__icon--leading pjw-classlist-search-icon" role="button">search</i>
                <input id="pjw-classlist-search-input" class="mdc-text-field__input" type="text" 
                    aria-labelledby="pjw-classlist-search-input__label" autocorrect="off" autocapitalize="off" spellcheck="false">
                <i class="material-icons-round mdc-text-field__icon mdc-text-field__icon--trailing pjw-classlist-search-clear"
                    role="button">clear</i>
              </label>

            </section>
          </div>
        </div>
        <div class="pjw-classlist-main">
          <div class="pjw-filter-panel">  
            ${filter_modules}
            <div class="pjw-mini-brand" style="order: 10;">
              <span class="material-icons-round" style="font-size: 18px; color: rgba(0, 0, 0, .7);">dashboard</span><p>PotatoPlus Filter Panel</p>
            </div>
          </div>
          <div class="pjw-classlist-body__container">
            <div class="pjw-classlist-body"></div>
            <div class="pjw-mini-brand">
              <p id="pjw-classlist-status">列表尚未加载</p>
            </div>
            <div class="pjw-mini-brand">
              <span class="material-icons-round" style="font-size: 18px; color: rgba(0, 0, 0, .7);">insights</span><p>PotatoPlus Course List</p>
            </div>
          </div>
        </div>
      </div>`;

      this.dom = $$(list_html).appendTo(parent);
      this.heading = this.dom.children(".pjw-classlist-heading");
      this.selectors = this.heading.children(".pjw-classlist-selectors");
      this.controls = this.heading.children(".pjw-classlist-controls");
      this.main = this.dom.children(".pjw-classlist-main");
      this.body = this.main.children(".pjw-classlist-body__container").children(".pjw-classlist-body");
      this.refresh_button = this.controls.children("#autoreload-control-section").children(".pjw-classlist-heading-refresh-button");
      this.filter_button = this.controls.children("#filter-control-section").children(".pjw-classlist-heading-filter-button");
      this.heading_switch_button = this.controls.children("section").children(".pjw-classlist-heading-switch-button");
      this.search_input = this.controls.find("#pjw-classlist-search-input");
      this.search_field = new mdc.textField.MDCTextField(document.getElementById("pjw-classlist-search-field"));
      this.filter_panel = this.main.children(".pjw-filter-panel");
      this.class_load_size = 30;

      /* Initializes filters */
      this.filters = {};
      for (var name of this.filter_modules) {
        this.filters[name] = pjw_filter[name];
        var cur_filter = this.filters[name];
        cur_filter.dom = $$(`#pjw-${name}-filter`);
        if (cur_filter.dom.attr("data-switch")) {
          cur_filter.enabled = false;
          var switch_dom = document.getElementById(cur_filter.dom.attr("data-switch"));
          cur_filter.enabled_switch = new mdc.switchControl.MDCSwitch(switch_dom);
          cur_filter.dom.find(".content").hide();
          $$(switch_dom).on("click", null, {
            space: cur_filter,
            list: this
          }, (e) => {
            e.data.space.enabled = e.data.space.enabled_switch.selected;
            if (typeof(e.data.space["onswitch"]) == "function")
              e.data.space.onswitch(e.data.space, e.data.list);
            if (e.data.space.dom.find(".content").length) {
              if (e.data.space.enabled == true) {
                e.data.space.dom.find(".content").show();
              } else {
                e.data.space.dom.find(".content").hide();
              }
            }
            e.data.list.update();
          });
        } else {
          this.enabled = true;
        }
        if (typeof(cur_filter["intl"]) == "function")
          cur_filter.intl(cur_filter, this);
      }

      /* Initializes search field */
      this.search_obj = new mdc.textField.MDCTextField(this.controls.find(".mdc-text-field")[0]);

      this.search_input.on("input", null, {
        target: this
      }, (e) => {
        if (typeof(e.data.target.input_timeout_id) != "undefined")
          clearTimeout(e.data.target.input_timeout_id);
        if (e.data.target.search_obj.value != "") {
          this.controls.find("#pjw-classlist-search-field").addClass("inputting");
          this.controls.find("#pjw-classlist-search-field").removeClass("mdc-text-field--with-leading-icon");
        } else {
          this.controls.find("#pjw-classlist-search-field").removeClass("inputting");
          this.controls.find("#pjw-classlist-search-field").addClass("mdc-text-field--with-leading-icon");
        }
        if (e.data.target.class_data.length <= 100) {
          e.data.target.search_string = this.search_input.val();
          e.data.target.max_classes_loaded = this.class_load_size;
          e.data.target.update();
        } else {
          e.data.target.input_timeout_id = setTimeout( (e) => {
            e.data.target.search_string = this.search_input.val();
            e.data.target.max_classes_loaded = this.class_load_size;
            e.data.target.update();
          }, 150, e);
        }
      });

      this.controls.find(".pjw-classlist-search-clear").on("click", null, {
        target: this
      }, (e) => {
        e.data.target.search_obj.value = "";
        e.data.target.search_input.trigger("input");
      });

      /* Initializes refresh & filter button */
      this.refresh_button.on("click", null, {
        target: this
      }, (e) => {
        if ($$("#autorefresh-switch").hasClass("off")) {
          e.data.target.refresh();
          $$("#autorefresh-icon").css("transition", "transform .4s ease-out");
          $$("#autorefresh-icon").css("transform", "rotate(180deg)");
          window.setTimeout(() => {
            $$("#autorefresh-icon").css("transition", "");
            $$("#autorefresh-icon").css("transform", "rotate(0deg)");
          }, 450);
        }
      });

      this.refresh_button.on("mousedown", null, {
        target: this
      }, (e) => {
        e.data.target.autoRefreshButtonEvent(true);
      });

      this.refresh_button.on("mouseup", null, {
        target: this
      }, (e) => {
        e.data.target.autoRefreshButtonEvent(false);
      });

      this.heading_switch_button.on("click", null, {
        target: this
      }, (e) => {
        var t = $$(e.delegateTarget);
        if (t.hasClass("on")) {
          t.removeClass("on");
          t.addClass("off");
          t.children(":eq(0)").html("toggle_off");
          t.children(":eq(1)").html(t.children(":eq(1)").attr("data-off"));
        } else {
          t.removeClass("off");
          t.addClass("on");
          t.children(":eq(0)").html("toggle_on");
          t.children(":eq(1)").html(t.children(":eq(1)").attr("data-on"));
        }
        e.data.target.triggerSwitch(t.attr("id"));
      });

      this.filter_button.on("click", null, {
        target: this
      }, (e) => {
        if (typeof(e.data.target.is_filter_panel_shown) == "undefined")
          e.data.target.is_filter_panel_shown = true;
        if (e.data.target.is_filter_panel_shown)
          e.data.target.filter_panel.hide();
        else
          e.data.target.filter_panel.show();
        e.data.target.is_filter_panel_shown = !e.data.target.is_filter_panel_shown;
      });

      /* Handle window scroll and resize event */
      $$(window).on("scroll", null, {
        target: this
      }, (e) => {
        e.data.target.checkScroll();
      });

      $$(window).on("resize", null, {
        target: this
      }, (e) => {
        e.data.target.handleResize();
      });

      this.clear();
      this.handleResize();
      window.mdc.autoInit();

      this.console = new PJWConsole();
    }
  };

  window.PJWSelect = class {
    val() {
      return this.obj.value;
    }

    text() {
      return this.obj.selectedText.innerHTML;
    }

    setByText(text) {
      var find_res = this.list.find(`[data-text=${text}]`);
      if (find_res.length)
        this.obj.selectedIndex = parseInt(find_res.attr("data-index"));
      else
        this.obj.selectedIndex = 0;
    }

    setByValue(val) {
      var find_res = this.list.find(`[data-value=${val}]`);
      if (find_res.length)
        this.obj.selectedIndex = parseInt(find_res.attr("data-index"));
      else
        this.obj.selectedIndex = 0;
    }

    onchange(func) {
      this.obj.listen('MDCSelect:change', func);
    }

    convert(val, text) {
      if (val == "pjw_custom_term") {
        if (typeof(this.current_custom_term) != "undefined")
          this.current_custom_term = "20221";
        window.setCustomTerm = function() {
          var target = list.selectors.term;
          if (!target) return;
          var term = prompt("请输入学期编码，格式为[四位年份][1/2]：", target.current_custom_term);
          if (term == null) return;
          target.current_custom_term = term;
          $$("#pjw-custom-term-option").attr("data-value", target.current_custom_term);
          $$("#pjw-custom-term-option").attr("data-text", "*自定学期：" + target.current_custom_term);
          $$("#pjw-custom-term-option").children("span.mdc-deprecated-list-item__text").text("*自定学期：" + target.current_custom_term);
          target.obj.menuItemValues[0] = target.current_custom_term;
          if (target.obj.selectedIndex == 0) {
            // The change event would not be triggered if the selectedIndex remains the same
            // Trigger the change even manually
            target.obj.foundation.handleChange();
          }
        };
        return `<li class="mdc-deprecated-list-item" data-value="20222" data-text="${text}" data-index="-2" aria-selected="false" role="option" id="pjw-custom-term-option" onclick="setCustomTerm();"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text">${text}</span></li>`;
      }
      return `<li class="mdc-deprecated-list-item" data-value="${val}" data-text="${text}" data-index="${this.count++}" aria-selected="false" role="option"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text">${text}</span></li>`;
    }

    addItem(item) {
      this.list.append(this.convert(item.value, item.innerHTML));
    }

    clear() {
      this.obj.selectedIndex = -1;
      this.list.html("");
      this.count = 0;
    }

    constructor(parent_list, id, name, target, start = 1, select_index = 0, opt_data = "") {
      var list_html = "";
      this.count = 0;

      function preload(l) {
        if (!(pjw_select_mode in options_data)) {
          return;
        }
        if (pjw.mode != "union") {
          parent_list.console.info("没有获取到课程选择器，正在使用预加载的选择器", "preloader");
        }
        // Load from pre-determined option data
        if (opt_data == "") opt_data = JSON.parse(options_data[pjw_select_mode]);
        else opt_data = JSON.parse(opt_data);
        for (var item of opt_data) {
          list_html += l.convert(item.value, item.text);
        }
        id = options_id[pjw_select_mode];
      }

      if (pjw.mode == "union" || !id) {
        preload(this);
      } else {
        var list;
        if (typeof(id) == "string") {
          if (!$$(`#${id}`).length) {
            preload(this);
          } else {
            list = $$(`#${id}`)[0].options;
            $$(`#${id}`).hide();
          }
        } else {
          if (!id.length) {
            preload(this);
          } else {
            id.hide();
            list = id[0].options;
            id = id.attr("id");
          }
        }
        if (list_html == "")
          for (var item of list) {
            if (start-- > 0) continue;
            list_html += this.convert(item.value, item.innerHTML);
          }
      }

      var html = `
      <div class="mdc-select mdc-select--outlined" id="pjw-select-${id}">
        <div class="mdc-select__anchor" aria-labelledby="pjw-select-${id}-outlined-label">
          <span class="mdc-select__selected-text-container">
            <span id="pjw-select-${id}-selected-text" class="mdc-select__selected-text"></span>
          </span>
          <span class="mdc-select__dropdown-icon">
            <svg
                class="mdc-select__dropdown-icon-graphic"
                viewBox="7 10 10 5" focusable="false">
              <polygon
                  class="mdc-select__dropdown-icon-inactive"
                  stroke="none"
                  fill-rule="evenodd"
                  points="7 10 12 15 17 10">
              </polygon>
              <polygon
                  class="mdc-select__dropdown-icon-active"
                  stroke="none"
                  fill-rule="evenodd"
                  points="7 15 12 10 17 15">
              </polygon>
            </svg>
          </span>   
          <div class="mdc-notched-outline mdc-notched-outline--upgraded">
            <div class="mdc-notched-outline__leading"></div>
            <div class="mdc-notched-outline__notch" style="">
              <label id="pjw-select-${id}-outlined-label" class="mdc-floating-label" style="">${name}</label>
            </div>
            <div class="mdc-notched-outline__trailing"></div>
          </div>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
          <ul class="mdc-deprecated-list pjw-select-list" role="listbox">${list_html}</ul>
        </div>
      </div>
      `;

      this.id = id;
      this.dom = $$(html).appendTo(target);
      this.obj = new mdc.select.MDCSelect(this.dom[0]);
      this.list = this.dom.children(".mdc-menu-surface").children(".pjw-select-list");
      this.obj.selectedIndex = select_index;
    }
  };

  /*
    MiniClass Data Format: 
    data = {
      title: <String>,
      note: <String>,
      num_info: [{
        num: <Integer>,
        label: <String>
      }],
      button: [{
        icon: <String>,
        text: <String>,
        action: <Function>
      }]
    }
  */

  window.PJWMiniClass = class {
    getNumInfo(data) {
      var html = "";
      for (var item of data) {
        html += `<div class="pjw-miniclass-num">
        <span class="label">${item.label}</span>
        <span class="num">${item.hidden ? `<span class="material-icons-round click-to-show" data-value="${item.num}">visibility_off</span>`: item.num}</span>
        </div>`;
      }
      return html;
    }

    constructor(data) {
      var class_html = `
        <div class="pjw-miniclass">
          <div class="pjw-miniclass-index">${data.index}</div>
          <div class="pjw-miniclass-info">
            <div class="pjw-miniclass-title">${data.title || ""}</div>
            <div class="pjw-miniclass-note">${data.note || ""}</div>
          </div>
          <div class="pjw-miniclass-sideinfo">
            <div class="pjw-miniclass-num">
              ${this.getNumInfo(data.num_info)}
            </div>
          </div>
          <div class="pjw-miniclass-operation">
            <div class="mdc-button pjw-miniclass-button pjw-miniclass-add-to-calc" data-mdc-auto-init="MDCRipple" data-index="${data.index}" data-status="add">
              <div class="mdc-button__ripple"></div>
              <div class="pjw-miniclass-button__inner">
                <div class="material-icons-round pjw-miniclass-button__icon">calculate</div>
                <div class="mdc-button__label pjw-miniclass-button__label">添加</div>
              </div>
            </div>
          </div>
        </div>
      `;
      this.data = data;
      this.dom = $$(class_html);
    }
  };

  window.PJWMiniList = class {
    add(data) {
      data.index = this.class_data.length + 1;
      var new_class = new PJWMiniClass(data);
      this.body.append(new_class.dom);
      this.class_data.push(new_class);
    }

    constructor() {
      var list_html = `
      <div class="pjw-minilist">
        <div class="pjw-minilist-heading"></div>
        <div class="pjw-minilist-body"></div>
        <div class="pjw-mini-brand">
          <span class="material-icons-round" style="font-size: 18px; color: rgba(0, 0, 0, .7);">drag_indicator</span><p>PotatoPlus Mini List</p>
        </div>
      </div>`;

      this.dom = $$(list_html);
      this.body = this.dom.children(".pjw-minilist-body");

      this.class_data = [];
    }
  };

  (() => {
    $$(window).on("scroll", () => {
      $$(".pjw-float--floating").each((index, val) => {
        if ($$(val).parent().offset().top >= $$(window).scrollTop()) {
          $$(val).css({
            "position": "",
            "top": "",
            "z-index": "",
            "border": "",
            "border-radius": "",
            "padding": "",
            "background": ""
          });
          $$(val).addClass("pjw-float--fixed");
          $$(val).removeClass("pjw-float--floating");
        }
      });
      $$(".pjw-float--fixed").each((index, val) => {
        if ($$(val).offset().top + 100 < $$(window).scrollTop()) {
          $$(val).css({
            "position": "fixed",
            "top": "10px",
            "z-index": "100",
            "border": "1px solid #000",
            "border-radius": "14px",
            "padding": "3px 15px",
            "background": "rgba(0, 0, 0, .1)"
          });
          $$(val).removeClass("pjw-float--fixed");
          $$(val).addClass("pjw-float--floating");
        }
      });
    });

    window.openLinkInFrame = (link) => {
      if (!$$("#pjw-inner-frame").length) {
        $$("body").append(`<iframe id="pjw-inner-frame"></iframe><div id="pjw-frame-mask"></div>`);
        $$("#pjw-frame-mask").on("click", () => {
          $$("#pjw-frame-mask").css("display", "none");
          $$("#pjw-inner-frame").css("display", "none");
          $$("#pjw-inner-frame").attr("src", "");
        });
      }
      $$("#pjw-frame-mask").css("display", "block");
      $$("#pjw-inner-frame").css("display", "block");
      $$("#pjw-inner-frame").attr("src", link);
    };
  })();
}