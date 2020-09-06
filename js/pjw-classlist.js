function ClassListPlugin() {
  window.total_weeks = 17;

  /* 
    Class data format:
    data = {
      title: <String>,
      teachers: [<String>, ...],
      info: [<String>, ...],
      additional_info: [<String>, ...],
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
        status: <Bool>, // true, false
        text: <String>,
        action: <Function>
      }
    };
  */

  window.PJWClass = class {
    setTeacher(data, target) {
      var is_first = true;
      var accu = "";
      for (var str of data) {
        if (!is_first) accu += "，";
        is_first = false;
        accu += `<span class="pjw-class-name-initial">${str[0]}</span>` + str.slice(1);
      }
      target.html(accu);
    }

    setClassInfo(data, target) {
      var accu = "";
      for (var item of data)
        accu += `<p>${item}</p>`;
      target.html(accu);
    }

    setNumInfo(data, target) {
      var accu = "";
      for (var item of data)
        accu += `<div class="pjw-class-bignum"><span class="num">${item.num}</span><span class="label">${item.label}</span></div>`;
      target.html(accu);
    }

    setLessonTime(data, target) {
      target.find(".selected").removeClass("selected");
      target.find(".sel-start").removeClass("sel-start");
      target.find(".sel-end").removeClass("sel-end");
      for (var item of data) {
        target.find(".pjw-class-weekcal-heading > div:eq(" + (item.weekday - 1) + ")").addClass("selected");
        var target_day = target.children(".pjw-class-weekcal-calendar").children(`div:eq(${(item.weekday - 1)})`);
        target_day.addClass("selected");
        target_day.children(`span:eq(${(item.start - 1)})`).addClass("sel-start");
        target_day.children(`span:eq(${(item.end - 1)})`).addClass("sel-end");
        var classes = "selected";
        if (item.type == "odd") classes += " sel-odd-class";
        else if (item.type == "even") classes += " sel-even-class";
        target_day = target.find(`.pjw-class-weekcal-calendar > div:eq(${(item.weekday - 1)})`);
        for (var i = item.start; i <= item.end; i++)
          target_day.children(`span:eq(${(i - 1)})`).addClass(classes);
      }
    }

    setWeekNum(data, target) {
      target.html("");
      for (var item of data) {
        var res;
        if (item.start != item.end)
          res = $$(`<div class="pjw-class-weeknum-bar__fill" >${item.start}-${item.end}${item.end - item.start > 2 ? "周" : ""}</div>`).appendTo(target);
        else
          res = $$(`<div class="pjw-class-weeknum-bar__fill" >${item.start}</div>`).appendTo(target);
        res.css({
          left: String((item.start - 1) / total_weeks * 100) + "%",
          width: String((item.end - item.start + 1) / total_weeks * 100) + "%"
        });
      }
    }

    updateSelButton(data, target) {
      if (data === false) {
        target.hide();
      } else {
        target.show();
      }
      if (data == "Available") {
        target.css("display", "flex");
        target.prop("disabled", false);
        target.children(".material-icons-round").html("add_task");
        target.find(".pjw-class-select-button__label").html("选择");
      } else {
        target.prop("disabled", true);
        target.children(".material-icons-round").html("block");
        var text;
        if (data == "Full")
          text = "已满";
        else if (data == "Selected")
          text = "已选";
        else
          text = "选择";
        target.find(".pjw-class-select-button__label").html(text);
      }
    }

    setSelText(data, target) {
      target.find(".pjw-class-select-button__status").remove();
      for (var item of data)
        target.append(`<div class="mdc-button__label pjw-class-select-button__status">` + item + `</div>`)
    }

    setCommentScore(data, target) {
      target.find(".pjw-class-comment-button__status").remove();
      target.append(`<div class="mdc-button__label pjw-class-comment-button__status">` + data + `</div>`);
    }

    update(data) {
      var info_top = this.info.children(".pjw-class-info-top");
      if ("title" in data) info_top.children(".pjw-class-title").html(data.title);
      if ("teachers" in data) this.setTeacher(data.teachers, info_top.children(".pjw-class-teacher"));

      var info_bottom = this.info.children(".pjw-class-info-bottom");
      if ("info" in data) this.setClassInfo(data.info, info_bottom.children(".pjw-class-info-important"));
      if ("additional_info" in data) this.setClassInfo(data.additional_info, info_bottom.children(".pjw-class-info-additional"));

      if ("num_info" in data) this.setNumInfo(data.num_info, this.sideinfo.children(".pjw-class-num-info"));
      if ("lesson_time" in data) this.setLessonTime(data.lesson_time, this.weekcal);
      if ("class_weeknum" in data) this.setWeekNum(data.class_weeknum, this.sideinfo.children(".pjw-class-weeknum-bar"));

      if ("select_button" in data) {
        var sel_data = data["select_button"];
        if ("status" in sel_data) this.updateSelButton(sel_data.status, this.select_button);
        if ("text" in sel_data) this.setSelText(sel_data.text, this.select_button.children(".pjw-class-select-button__container"));
        if ("action" in sel_data) this.select_button.on("click", sel_data.action);
      }

      if ("comment_button" in data) {
        var com_data = data["comment_button"];
        if ("status" in com_data)
          com_data.status ? this.comment_button.show() : this.comment_button.hide();
        if ("text" in com_data) this.setCommentScore(com_data.text, this.comment_button.children(".pjw-class-comment-button__container"));
        if ("action" in com_data) this.comment_button.on("click", com_data.action);
      }
    }

    constructor(parent) {
      const class_html = `
        <div class="mdc-card pjw-class-container pjw-class-container--compressed">
          <div class="pjw-class-info">
            <div class="pjw-class-info-top">
              <p class="pjw-class-title"></p>
              <p class="pjw-class-teacher"></p>
            </div>
            <div class="pjw-class-info-bottom">
              <div class="pjw-class-info-important"></div>
              <div class="pjw-class-info-additional"></div>
            </div>
          </div>
          <div class="pjw-class-main">
            <div class="pjw-class-sub">
              <div class="pjw-class-weekcal">
                <div class="pjw-class-weekcal-heading">
                  <div class="pjw-class-weekcal-heading-day">MO</div>
                  <div class="pjw-class-weekcal-heading-day">TU</div>
                  <div class="pjw-class-weekcal-heading-day">WE</div>
                  <div class="pjw-class-weekcal-heading-day">TH</div>
                  <div class="pjw-class-weekcal-heading-day">FR</div>
                </div>
                <div class="pjw-class-weekcal-calendar"><div class="pjw-class-weekcal-calendar-day"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span></div><div class="pjw-class-weekcal-calendar-day"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span></div><div class="pjw-class-weekcal-calendar-day"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span></div><div class="pjw-class-weekcal-calendar-day"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span></div><div class="pjw-class-weekcal-calendar-day"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span></div></div>
              </div>
              <div class="pjw-class-sideinfo">
                <div class="pjw-class-weeknum-bar"></div>
                <div class="pjw-class-num-info"></div>
              </div>
            </div>
            <div class="pjw-class-operation">
              <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-class-select-button">
                <div class="material-icons-round">add_task</div>
                <div class="pjw-class-select-button__container">
                  <div class="mdc-button__label pjw-class-select-button__label" style="letter-spacing: 2px">选择</div>
                </div>
              </button>
              <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-class-comment-button">
                <div class="pjw-class-comment-button__container"><div class="material-icons-round">bar_chart</div></div>
              </button>
            </div>
          </div>
        </div>
      `;
      this.dom = $$(class_html).appendTo(parent);
      this.info = this.dom.children(".pjw-class-info");
      this.main = this.dom.children(".pjw-class-main");
      this.sub = this.main.children(".pjw-class-sub");
      this.weekcal = this.sub.children(".pjw-class-weekcal");
      this.sideinfo = this.sub.children(".pjw-class-sideinfo");
      this.operation = this.main.children(".pjw-class-operation");
      this.select_button = this.operation.children(".pjw-class-select-button")
      this.comment_button = this.operation.children(".pjw-class-comment-button")

      this.sub.on("mouseenter", (e) => {
        var t = jQuery(e.delegateTarget).parent().parent();
        t.removeClass("pjw-class-container--compressed");
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
          t.animate({ "margin-top": "6px", "margin-bottom": "6px" }, 200, (x) => {
            return 1 - Math.cos(x * Math.PI / 2);
          });
          t.css("opacity", "1");
        }, 10);
      });
    }
  };

  window.PJWClassList = class {
    add(data) {
      var item = new PJWClass(this.dom);
      item.update(data);
      this.class_data.push({
        data: data,
        obj: item,
        display: true
      });
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

    constructor(parent) {
      const list_html = `
      <div class="pjw-classlist">
        <div class="pjw-classlist-heading">
          <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-class-filter-button">
            <div class="material-icons-round">filter_alt</div>
            <div class="mdc-button__label pjw-class-filter-button__label" style="letter-spacing: 2px">课程筛选</div>
          </button>

          <button data-mdc-auto-init="MDCRipple" class="mdc-button mdc-button--raised mdc-ripple-upgraded pjw-class-filter-switch-button off">
            <div class="material-icons-round">toggle_off</div>
            <div class="mdc-button__label pjw-class-filter-button__label" style="letter-spacing: 2px">关</div>
          </button>

          <!--<div class="mdc-switch" data-mdc-auto-init="MDCSwitch">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__thumb-underlay">
              <div class="mdc-switch__thumb"></div>
              <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch" aria-checked="false">
            </div>
          </div>-->

          <label class="mdc-text-field mdc-text-field--outlined pjw-class-search-field" data-mdc-auto-init="MDCTextField">
            <input type="text" class="mdc-text-field__input" aria-labelledby="pjw-class-search-input">
            <span class="mdc-notched-outline">
              <span class="mdc-notched-outline__leading"></span>
              <span class="mdc-notched-outline__notch">
                <span class="mdc-floating-label" id="pjw-class-search-input"><span style="font-family:Material Icons Round;">search</span>搜索</span>
              </span>
              <span class="mdc-notched-outline__trailing"></span>
            </span>
          </label>
        </div>
      </div>`;
      this.dom = $$(list_html).appendTo(parent);
      this.heading = this.dom.children(".pjw-classlist-heading");
      this.filter_switch_button = this.heading.children(".pjw-class-filter-switch-button");
      this.filter_switch_button.on("click", (e) => {
        var t = $$(e.delegateTarget);
        if (t.hasClass("on")) {
          t.removeClass("on");
          t.addClass("off");
          t.children(":eq(0)").html("toggle_off");
          t.children(":eq(1)").html("关");
        } else {
          t.removeClass("off");
          t.addClass("on");
          t.children(":eq(0)").html("toggle_on");
          t.children(":eq(1)").html("开");
        }
      });
      this.class_data = [];
      window.mdc.autoInit();
    }
  };

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
      var words = item.split(" ");
      var weekday = 0;
      var is_odd = false, is_even = false;
      var has_week_info = true;

      for (var jtem of words) {
        if (has_week_info == false)
          for (var i = 1; i <= total_weeks; i++)
            weeks[i] = 1;
        has_week_info = false;
        if (jtem[0] == "周") {
          weekday = weekday_to_num[jtem[1]];
        } else if (jtem[jtem.length - 1] == "周") {
          has_week_info = true;
          if (jtem[jtem.length - 2] == "单") {
            for (var i = 1; i <= total_weeks; i += 2)
              weeks[i] = 1;
            ans[ans.length - 1].type = "odd";
          } else if (jtem[jtem.length - 2] == "双") {
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
        } else if (jtem[jtem.length - 1] == "节") {
          var num_arr = jtem.match(/(\d+)+/g);
          if (num_arr.length == 1)
            num_arr.push(num_arr[0]);

          if (weekday != 0 && num_arr.length)
            ans.push({
              weekday: weekday,
              start: parseInt(num_arr[0]),
              end: parseInt(num_arr[1]),
              type: "normal"
            });
        }
      }
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