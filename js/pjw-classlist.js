function ClassListPlugin() {
  const total_weeks = 17;

  /* 
    Class data format:
    data = {
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
      class_weeknum: [{
        start: <Integer>,
        end: <Integer>
      }, ...],
      select_button: {
        status: <String>, // "Available", "Full", "Selected", false
        text: [<String>, ...],
        action: <Function>
      }
      comment_button: {
        status: <Boolean>, // true, false
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
      function parseTitle(content) {
        content = content.split("<br>");
        if (content.length > 1) {
          if (!("info" in data)) data["info"] = [];
          data["info"].push({
            key: "附加信息",
            val: "".concat(content.slice(1)),
            hidden: true
          });
        }
        return content[0];
      }

      function getTeachers(content) {
        var is_first = true; var accu = "";
        for (var str of content) {
          if (!is_first) accu += "，";
          is_first = false;
          accu += `<span class="pjw-class-name-initial">${str[0]}</span>` + str.slice(1);
        }
        return accu;
      }

      function getClassInfo(content) {
        var appear_accu = "", hidden_accu = "";
        for (var item of content) {
          if ("key" in item) {
            if (item.val == "") continue;
            if (!item.hidden)
              appear_accu += `<p>${item.key}：${item.val}</p>`;
            else
              hidden_accu += `<p>${item.key}：${item.val}</p>`;
          } else {
            appear_accu += `<p>${item}</p>`;
          }
        }
        return `<div class="pjw-class-info-important">${appear_accu}</div><div class="pjw-class-info-additional">${hidden_accu}</div>`;
      }

      function getNumInfo(content) {
        var accu = "";
        for (var item of content)
          accu += `<div class="pjw-class-bignum"><span class="num">${item.num}</span><span class="label">${item.label}</span></div>`;
        return accu;
      }

      function getWeekNum(data) {
        var accu = "";
        for (var item of data) {
          var style = `left: ${String((item.start - 1) / total_weeks * 100) + "%"}; width: ${String((item.end - item.start + 1) / total_weeks * 100) + "%"}`;
          if (item.start != item.end)
            accu += `<div class="pjw-class-weeknum-bar__fill" style="${style}">${item.start}-${item.end}${item.end - item.start > 2 ? "周" : ""}</div>`;
          else
            accu += `<div class="pjw-class-weeknum-bar__fill" style="${style}">${item.start}</div>`;
        }
        return accu;
      }

      function getLessonTime(data) {
        var heading_html = ``;
        var body_html = ``;

        var weekend_flag = false;
        var has_class = [false, false, false, false, false, false, false, false];
        var class_class = [
          ["", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", ""]
        ];

        for (var item of data) {
          if (item.weekday > 5 && weekend_flag == false)
            weekend_flag = true;

          has_class[item.weekday] = true;

          var cssclass = "selected";
          if (item.type == "odd") cssclass += " sel-odd-class";
          else if (item.type == "even") cssclass += " sel-even-class";
          for (var i = item.start; i <= item.end; i++)
            class_class[item.weekday][i] = cssclass;
          class_class[item.weekday][item.start] += " sel-start";
          class_class[item.weekday][item.end] += " sel-end";
        }

        const weekday_display_name = ["", "MO", "TU", "WE", "TH", "FR", "SA", "SU"];

        for (var i = 1; i <= 7; i++) {
          if (i > 5 && weekend_flag == false) break;

          heading_html += `<div class="pjw-class-weekcal-heading-day` + (has_class[i] ? " selected" : "") + `">${weekday_display_name[i]}</div>`;

          var body_html_span = "";
          
          for (var j = 1; j <= 11; j++) {
            if (class_class[i][j] != "")
              body_html_span += `<span class="${class_class[i][j]}">${j}</span>`;
            else
              body_html_span += `<span>${j}</span>`;
          }

          body_html += `<div class="pjw-class-weekcal-calendar-day` + (has_class[i] ? " selected" : "") + `">${body_html_span}</div>`;
        }

        return `<div class="pjw-class-weekcal-heading">${heading_html}</div><div class="pjw-class-weekcal-calendar">${body_html}</div>`;
      }

      function getSelectButton(data, get_inner = false) {
        if (!data.status) return "";
        var label_text = "选择";
        var icon_text = "add_task";
        var disabled = "";
        if (data.status != "Available" && data.status !== true) {
          disabled = "disabled ";
          icon_text = "block";
          if (data.status == "Full")
            label_text = "满员";
          else if (data.status == "Selected")
            label_text = "已选";
        }

        var select_info = "";
        if (data.text)
          for (var item of data.text)
            select_info += `<div class="mdc-button__label pjw-class-select-button__status">${item}</div>`;
        var inner_html = `<div class="material-icons-round">${icon_text}</div><div class="pjw-class-select-button__container"><div class="mdc-button__label pjw-class-select-button__label" style="letter-spacing: 2px">${label_text}</div>${select_info}</div>`;
        if (get_inner === true)
          return {
            html: inner_html,
            disabled: (disabled == "disabled ")
          };
        return `<button data-mdc-auto-init="MDCRipple" ${disabled}class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-class-select-button">${inner_html}</button>`;
      }

      function getCommentButton(data) {
        var text = "";
        if (data.text) text = data.text;
        if (!data.status) return "";
        else return `<button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-class-comment-button">
          <div class="pjw-class-comment-button__container"><div class="material-icons-round pjw-class-comment-icon">forum</div><div class="mdc-button__label pjw-class-comment-button__status">${text}</div></div></button>`;
      }

      switch(attr) {
        case "title":
          if ("title" in data)
            return parseTitle(data.title);
          else return "";

        case "teachers":
          if ("teachers" in data)
            return getTeachers(data.teachers);
          else return "";

        case "info":
          if ("info" in data)
            return getClassInfo(data.info);
          else return "";

        case "numinfo":
          if ("num_info" in data)
            return getNumInfo(data.num_info);
          else return "";

        case "weeknum":
          if ("class_weeknum" in data)
            return getWeekNum(data.class_weeknum);
          else return "";

        case "lessontime":
          if ("lesson_time" in data && data.lesson_time.length > 0)
            return getLessonTime(data.lesson_time);
          else return `<div class="pjw-class-weekcal-heading">自由时间</div>`;

        case "selectbutton":
          if ("select_button" in data)
            return getSelectButton(data.select_button, options);
          else return "";

        case "commentbutton":
          if ("comment_button" in data)
            return getCommentButton(data.comment_button);
          else return "";
      }
    }

    set(data) {
      var class_html = `
        <div class="pjw-class-info">
          <div class="pjw-class-info-top">
            <p class="pjw-class-title">${this.getHTML(data, "title")}</p>
            <p class="pjw-class-teacher">${this.getHTML(data, "teachers")}</p>
          </div>
          <div class="pjw-class-info-bottom">${this.getHTML(data, "info")}</div>
        </div>
        <div class="pjw-class-sub">
          <div class="pjw-class-weekcal">${this.getHTML(data, "lessontime")}</div>
          <div class="pjw-class-sideinfo">
            <div class="pjw-class-weeknum-bar">${this.getHTML(data, "weeknum")}</div>
            <div class="pjw-class-num-info">${this.getHTML(data, "numinfo")}</div>
          </div>
        </div>
        <div class="pjw-class-operation">
          ${this.getHTML(data, "selectbutton")}
          ${this.getHTML(data, "commentbutton")}
        </div>
      `;
      this.dom.html(class_html);
    }

    updateSelectButton(data) {
      if (!this.initialized) return;
      var button_res = this.getHTML({select_button: data}, "selectbutton", true);
      this.select_button.html(button_res.html);
      this.select_button.prop("disabled", button_res.disabled);
    }

    constructor(DOMparent, data, listparent) {
      var class_html = `<div class="mdc-card pjw-class-container pjw-class-container--compressed" style="display: none;"></div>`;
      this.dom = $$(class_html).appendTo(DOMparent);
      this.data = data;
      this.list = listparent;
      this.initialized = false;
    }

    intl() {
      if (this.initialized) return;
      this.initialized = true;
      this.set(this.data);

      this.info = this.dom.children(".pjw-class-info");
      this.sub = this.dom.children(".pjw-class-sub");
      this.weekcal = this.sub.children(".pjw-class-weekcal");
      this.sideinfo = this.sub.children(".pjw-class-sideinfo");
      this.operation = this.dom.children(".pjw-class-operation");
      this.select_button = this.operation.children(".pjw-class-select-button");
      this.comment_button = this.operation.children(".pjw-class-comment-button");

      var data = this.data;

      // Set select button onclick event
      this.select_button.click({target: this, button_target: this.select_button}, data.select_button.action);

      // Initialize DOM trace variables
      this.display = false;
      this.priority = 0;

      // Set expand / collapse event of class comtainer
      this.sub.on("mouseenter", (e) => {
        var t = jQuery(e.delegateTarget).parent();
        t.removeClass("pjw-class-container--compressed");
      });
      this.info.on("click", (e) => {
        var t = jQuery(e.delegateTarget).parent();
        if (t.hasClass("pjw-class-container--compressed"))
          t.removeClass("pjw-class-container--compressed");
        else
          t.addClass("pjw-class-container--compressed");
      });
      this.dom.on("mouseleave", (e) => {
        var t = jQuery(e.delegateTarget);
        if (t.hasClass("pjw-class-container--compressed")) return;
        var comp_height = t.height();
        t.css("opacity", "0");
        t.addClass("pjw-class-container--compressed");

        window.setTimeout( () => {
          comp_height = (comp_height - t.height()) / 2;
          t.css({ "margin-top": `${comp_height}px`, "margin-bottom": `${comp_height}px` });
          t.animate({ "margin-top": "4px", "margin-bottom": "4px" }, 100, (x) => {
            return 1 - Math.cos(x * Math.PI / 2);
          });
          t.css("opacity", "1");
        }, 5);
      });
    }
  };

  window.PJWClassList = class {
    add(data) {
      if (!this.prepared_to_add) {
        this.intl();
        this.prepared_to_add = true;
      }
      function compareData(data1, data2) {
        if ("title" in data2 && data1.title == data2.title)
          if ("teachers" in data2 && data1.teachers[0] == data2.teachers[0])
            return true;
        return false;
      }

      if (data.title.trim() == "&nbsp;" || data.title.trim() == "") return;
      if (this.auto_inc < this.class_data.length && compareData(data, this.class_data[this.auto_inc].data) == true) {
        this.class_data[this.auto_inc].data = data;
        this.class_data[this.auto_inc].obj.updateSelectButton(data.select_button);
      } else {
        var item = {
          data: data,
          obj: new PJWClass(this.body, data, this),
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

    clear() {
      this.class_data = [];
      this.body.html("");
      this.auto_inc = 0;
      this.max_classes_loaded = this.class_load_size;
    }

    matchDegree(pattern, str) {
      function testString(keyword, str) {
        if (keyword.length != 1 && keyword[0] == "-") {
          if (testString(keyword.slice(1), str) !== 0)
            return false;
          else
            return 0;
        }
        var pos = str.search(keyword);
        if (pos == 0) {
          return 0.5 + (keyword.length / str.length) / 2;
        } else if (pos != -1) {
          return 0.3 + (keyword.length / str.length) / 2;
        } else if (keyword.length == 2) {
          if (str.search(keyword[1]) > str.search(keyword[0]) 
            && str.search(keyword[0]) != -1) {
            if (str.search(keyword[0]) == 0) return 0.5;
            else return 0.3;
          }
        }
        return 0;
      }
      pattern = pattern.trim().split(" ");
      if (pattern[0] == "") return 0;
      var pattern_num = pattern.length;
      var matched_num = 0;
      for (var keyword of pattern) {
        if (typeof(str) == "string") {
          var t = testString(keyword, str);
          if (t !== false) matched_num += t;
          else return false;
        } else {
          for (var substr of str) {
            var t = testString(keyword, substr);
            if (t !== false) matched_num += t;
            else return false;
          }
        }
      }
      return 100.0 * (matched_num / pattern_num);
    }

    search(data, search_str) {
      if (typeof(search_str) == "undefined" || search_str == "") {
        return 0;
      }
      var priority = 0.0;
      var priority_map = [[data.title, 4], [data.teachers, 2], [data.info.map((item) => (item.val)), 1]];
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

    checkFilter(data) {
      var priority = 0.0;
      /* Load filter modules... */

      var search_priority = this.search(data, this.search_string);
      if (search_priority === false) {
        data.priority = -1;
        return false;
      }
      priority += search_priority;
      data.priority = priority;
      return priority;
    }

    switchFilter() { 
      if (this.heading.children(".pjw-class-filter-switch-button").hasClass("on")) {
        this.filter_switch_button.removeClass("on");
        this.filter_switch_button.addClass("off");
        this.filter_switch_button.children(":eq(0)").html("toggle_off");
        this.filter_switch_button.children(":eq(1)").html("关");
      } else {
        this.filter_switch_button.removeClass("off");
        this.filter_switch_button.addClass("on");
        this.filter_switch_button.children(":eq(0)").html("toggle_on");
        this.filter_switch_button.children(":eq(1)").html("开");
      }
    }

    intl() {
      this.class_data.sort(function(a, b) {
        return a.id - b.id;
      });
      this.auto_inc = 0;
    }

    update() {
      if (this.auto_inc < this.class_data.length) {
        for (var item of this.class_data.slice(this.auto_inc))
          item.obj.remove();
        this.class_data = this.class_data.slice(0, this.auto_inc);
      }
      for (var item of this.class_data)
        if (this.checkFilter(item.data) === false)
          item.obj.hide();

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
        }
        this.class_data[i].obj.setPriority(this.class_data.length - i);
      }
      this.prepared_to_add = false;
    }

    checkScroll() {
      if ("scroll_lock" in this && this.scroll_lock == true) return;
      this.scroll_lock = true;
      if (this.class_data.length > this.max_classes_loaded && $$(window).scrollTop() + $$(window).height() + 1600 >= $$(document).height()) {
        for (var i = this.max_classes_loaded; i < this.max_classes_loaded + this.class_load_size && i < this.class_data.length && this.class_data[i].data.priority >= 0; i++)
          this.class_data[i].obj.show();
        this.max_classes_loaded += this.class_load_size;
      }
      this.scroll_lock = false;
    }

    refresh(hard_load = false) {
      if (hard_load) this.clear();
      return this.load();
    }

    toggleAutoRefresh(status) {
      if (status) {
        // Start Autorefresh
        function getNumberInNormalDistribution(mean, std_dev, lower_limit, upper_limit) {
          var res = Math.floor(mean + randomNormalDistribution() * std_dev);
          if (res >= upper_limit) return upper_limit;
          if (res >= mean) return res;
          res = mean - (mean-res) * 0.8;
          if (res < lower_limit) return lower_limit;
          return res;
        }

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

        var auto_refresh_loss_rate = 0.2;

        auto_refresh_loss_rate = 0.1 + getNumberInNormalDistribution(10, 10, 0, 20) / 100;
        var auto_check_times = 1;
        var random_interval = (1.0 / this.auto_refresh_frequency) * getNumberInNormalDistribution(Math.floor(Math.random() * 600) + 1400, 800, 800, 3000);
        this.auto_refresh_interval_id = window.setInterval(function(target) {
          if (Math.random() < window.auto_refresh_loss_rate) return;
          window.setTimeout(function(target) {
            target.refresh().then(() => {
              console.log("Count: " + auto_check_times++);
            }).catch((e) => {
              console.log(e);
            });
          }, getNumberInNormalDistribution(random_interval * 0.3, random_interval * 0.3, 60, random_interval * 0.8), target);
        }, random_interval, this);
      } else {
        window.clearInterval(this.auto_refresh_interval_id);
      }
    }

    updateRefreshButton() {
      const max_frequency = 10.0;
      if (this.auto_refresh_frequency <= 4.0)
        this.auto_refresh_frequency *= 1.1;
      else if (this.auto_refresh_frequency <= 8.0)
        this.auto_refresh_frequency += 0.4;
      else if (this.auto_refresh_frequency < max_frequency)
        this.auto_refresh_frequency += 0.1;
      else
        this.auto_refresh_frequency = max_frequency;
      $$("#autorefresh-label").html(this.auto_refresh_frequency.toFixed(1) + "x");
    }

    autoRefreshButtonEvent(status) {
      if ($$("#autorefresh-switch").hasClass("off")) return;
      if (status) {
        if (typeof(this.show_refresh_level_timeout_id) != "undefined")
          clearInterval(this.show_refresh_level_timeout_id);
        this.toggleAutoRefresh(false);
        this.auto_refresh_frequency = 1.0;
        $$("#autorefresh-label").html("1.0x");
        this.refresh_button_interval_id = window.setInterval((target) => {
          target.updateRefreshButton();
        }, 50, this);
      } else {
        var text = "";
        if (this.auto_refresh_frequency <= 4.0)
          text = "标准";
        else if (this.auto_refresh_frequency <= 8.0)
          text = "快";
        else if (this.auto_refresh_frequency < 10.0)
          text = "极速";
        else
          text = "封号退学";
        this.show_refresh_level_timeout_id = setTimeout( (text) => {
          $$("#autorefresh-label").html(text);
        }, 1500, text);
        this.toggleAutoRefresh(true);
        clearInterval(this.refresh_button_interval_id);
      }
    }

    triggerSwitch(id) {
      var status = $$("#"+id).hasClass("on");
      if (id == "autorefresh-switch") {
        if (!status) {
          $$("#autorefresh-icon").html("autorenew");
          $$("#autorefresh-label").html("刷新");
          if (typeof(this.refresh_button_interval_id) != "undefined")
            window.clearInterval(this.refresh_button_interval_id);
          if (typeof(this.show_refresh_level_timeout_id) != "undefined")
            clearInterval(this.show_refresh_level_timeout_id);
        } else {
          $$("#autorefresh-icon").html("speed");
          $$("#autorefresh-label").html("标准");
        }
        this.auto_refresh_frequency = 1.0;
        this.toggleAutoRefresh(status);
      } else if (id == "filter-switch") {

      }
    }

    constructor(parent) {
      const list_html = `
      <div class="pjw-classlist">
        <div class="pjw-classlist-heading">
          <div class="pjw-classlist-selectors">
          </div>
          <div class="pjw-classlist-controls">
            <section id="autoreload-control-section">
              <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-classlist-heading-button">
                <div class="material-icons-round" id="autorefresh-icon">autorenew</div>
                <div class="mdc-button__label pjw-classlist-heading-button__label" style="letter-spacing: 2px" id="autorefresh-label">刷新</div>
              </button>

              <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-classlist-heading-switch-button off" id="autorefresh-switch">
                <div class="material-icons-round">toggle_off</div>
                <div class="mdc-button__label pjw-classlist-heading-button__label" style="letter-spacing: 2px" data-off="手动" data-on="自动">手动</div>
              </button>
            </section>

            <section id="filter-control-section">
              <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-classlist-heading-button">
                <div class="material-icons-round">filter_alt</div>
                <div class="mdc-button__label pjw-classlist-heading-button__label" style="letter-spacing: 2px">课程筛选</div>
              </button>

              <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-classlist-heading-switch-button off" id="filter-switch">
                <div class="material-icons-round">toggle_off</div>
                <div class="mdc-button__label pjw-classlist-heading-button__label" style="letter-spacing: 2px" data-off="关闭" data-on="开启">关闭</div>
              </button>
            </section>

            <section id="search-section">
              <label class="mdc-text-field mdc-text-field--outlined" id="pjw-classlist-search-field" data-mdc-auto-init="MDCTextField">
                <input type="text" class="mdc-text-field__input" aria-labelledby="pjw-class-search-input__label" id="pjw-class-search-input">
                <span class="mdc-notched-outline">
                  <span class="mdc-notched-outline__leading"></span>
                  <span class="mdc-notched-outline__notch">
                    <span class="mdc-floating-label" id="pjw-class-search-input__label"><span style="font-family:Material Icons Round;">search</span>搜索</span>
                  </span>
                  <span class="mdc-notched-outline__trailing"></span>
                </span>
              </label>
            </section>
          </div>
        </div>
        <div class="pjw-classlist-body"></div>
      </div>`;

      this.dom = $$(list_html).appendTo(parent);
      this.heading = this.dom.children(".pjw-classlist-heading");
      this.selectors = this.heading.children(".pjw-classlist-selectors");
      this.controls = this.heading.children(".pjw-classlist-controls");
      this.body = this.dom.children(".pjw-classlist-body");
      this.refresh_button = this.controls.children("#autoreload-control-section").children(".pjw-classlist-heading-button");
      this.heading_switch_button = this.controls.children("section").children(".pjw-classlist-heading-switch-button");
      this.search_input = this.controls.find("#pjw-class-search-input");

      this.class_load_size = 30;

      this.search_input.on("input", null, {
        target: this
      }, (e) => {
        e.data.target.search_string = this.search_input.val();
        e.data.target.max_classes_loaded = this.class_load_size;
        e.data.target.update();
      });

      this.refresh_button.on("click", null, {
        target: this
      }, (e) => {
        if ($$("#autorefresh-switch").hasClass("off"))
          e.data.target.refresh();
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

      $$(window).on("scroll", null, {
        target: this
      }, (e) => {
        e.data.target.checkScroll();
      });

      this.clear();

      window.mdc.autoInit();
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
      this.obj.selectedIndex = parseInt(this.list.find(`[data-text=${text}]`).attr("data-index"));
    }

    setByValue(val) {
      this.obj.selectedIndex = parseInt(this.list.find(`[data-value=${val}]`).attr("data-index"));
    }

    onchange(func) {
      this.obj.listen('MDCSelect:change', func);
    }

    convert(item) {
      return `<li data-value="${item.value}" data-text="${item.innerHTML}" data-index="${this.count++}" class="mdc-list-item"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">${item.innerHTML}</span></li>`;
    }

    addItem(item) {
      this.list.append(this.convert(item));
    }

    clear() {
      this.obj.selectedIndex = -1;
      this.list.html("");
      this.count = 0;
    }

    constructor(id, name, target, start = 1) {
      var list = $$(`#${id}`)[0].options;
      var list_html = "";
      this.count = 0;
      for (var item of list) {
        if (start-- > 0) continue;
        list_html += this.convert(item);
      }

      var html = `<div class="mdc-select mdc-select--outlined" id="pjw-select-${id}">
        <div class="mdc-select__anchor" aria-labelledby="pjw-select-${id}-outlined-label">
          <span id="pjw-select-${id}-selected-text" class="mdc-select__selected-text"></span>
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
        <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth" role="listbox">
          <ul class="mdc-list pjw-select-list" role="option">${list_html}</ul>
        </div>
      </div>`;

      this.id = id;
      this.dom = $$(html).appendTo(target);
      this.obj = new mdc.select.MDCSelect(this.dom[0]);
      this.list = this.dom.children(".mdc-menu-surface").children(".pjw-select-list");
      this.obj.selectedIndex = 0;
      $$("#" + id).hide();
    }
  }

  window.parseTeacherNames = function(text) {
    if (text == "") return [];
    return text.split(/[,，]\s/g);
  }

  window.parseClassTime = function(text) {
    var classes = text.split("<br>");
    const weekday_to_num = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "日": 7};

    var weeks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var ans = [];

    for (var item of classes) {
      var words = item.split(/\s|\&nbsp;/g);
      var weekday = 0;
      var is_odd = false, is_even = false;
      var has_week_info = false;
      var has_lesson_time_info = false;

      for (var jtem of words) {
        if (jtem[0] == "周") {
          weekday = weekday_to_num[jtem[1]];
        } else if (jtem[jtem.length - 1] == "周") {
          has_week_info = true;
          if (jtem.search("单周") != -1) {
            for (var i = 1; i <= total_weeks; i += 2)
              weeks[i] = 1;
            ans[ans.length - 1].type = "odd";
          } else if (jtem.search("双周") != -1) {
            for (var i = 2; i <= total_weeks; i += 2)
              weeks[i] = 1;
            ans[ans.length - 1].type = "even";
          } else {
            var num_arr = jtem.match(/(\d+)+/g);
            if (num_arr.length == 1)
              weeks[parseInt(num_arr[0])] = 1;
            else if (num_arr.length == 2)
              for (var i = parseInt(num_arr[0]); i <= parseInt(num_arr[1]); i++)
                weeks[i] = 1;
          }
        } else if (jtem.search(/从第(\d+)周开始/) != -1) {
          has_week_info = true;
          start_week = parseInt(jtem.match(/(?:从第)(\d+)(?:周开始)/)[1]);
          if (jtem.search("单周") != -1) {
            for (var i = start_week; i <= total_weeks; i += 2)
              weeks[i] = 1;
            ans[ans.length - 1].type = "odd";
          } else if (jtem.search("双周") != -1) {
            for (var i = start_week; i <= total_weeks; i += 2)
              weeks[i] = 1;
            ans[ans.length - 1].type = "even";
          }
        } else if (jtem[jtem.length - 1] == "节") {
          var num_arr = jtem.match(/(\d+)+/g);
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
        }
      }

      if (has_week_info == false && has_lesson_time_info == true)
        for (var i = 1; i <= total_weeks; i++)
          weeks[i] = 1;
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
    return {lesson_time: ans, class_weeknum: ans_weeks};
  }
}