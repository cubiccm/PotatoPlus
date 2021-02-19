window.PJWConsole = class {
  show(stay) {
    this.dom.css({
      "bottom": "6px",
      "opacity": "1"
    });
    if (typeof(this.stay_timeout) != "undefined")
      clearTimeout(this.stay_timeout);
    if (stay === true) this.mouse_stay = true;
    else if (stay === false) this.mouse_stay = false;
    if (!this.mouse_stay && !this.history_expanded)
      this.stay_timeout = setTimeout((target) => {
        target.hide();
      }, 2500, this);
  }

  hide() {
    this.collapse();
    this.dom.css({
      "bottom": "-70px",
      "opacity": "0"
    });
    this.setColor();
  }

  expand() {
    if (this.history_expanded) {
      this.collapse();
      return;
    }
    this.history.css("display", "flex");
    this.history[0].scrollTop = this.history[0].scrollHeight;
    this.history_expanded = true;
    this.setColor("rgba(0, 0, 0, .5)");
  }

  collapse() {
    this.history.css("display", "none");
    this.history_expanded = false;
    this.setColor();
  }

  setColor(color) {
    var shadow_width = "6px";
    if (!color) {
      color = "rgba(0, 0, 0, .2)";
      shadow_width = "3px";
    }
    if (this.history_expanded) {
      shadow_width = "6px";
    }
    this.dom.css("filter", `drop-shadow(0px 0px ${shadow_width} ${color}`);
  }

  // type: error warning info done code
  log(text, channel = null, type = "info") {
    if (channel) {
      channel = `data-channel="${channel}"`;
      this.dom.find(`[${channel}]`).remove();
    }
    var html = `
      <div class="pjw-console-item" ${channel}>
        <div class="pjw-console-icon material-icons-round ${type}">${type}</div>
        <div class="pjw-console-text">${text}</div>
      </div>
    `;

    this.dom.children(".pjw-console-item").appendTo(this.history);
    this.dom.append(html);
    if (this.history_expanded)
      this.history[0].scrollTop = this.history[0].scrollHeight;

    var action = {
      error: [true, "#b4220a"],
      warning: [true, "#b74710"],
      done: [true, "limegreen"],
      favorite: [false, "rgb(255, 99, 144)"],
      info: [false],
      alarm: [true, "#9eb314"],
      code: [false]
    };
    
    this.setColor(action[type][1]);
    if (type == "code") return;
    this.show(action[type][0]);
  }

  error(text, channel = null) {
    this.log(text, channel, "error");
  }

  success(text, channel = null) {
    this.log(text, channel, "done");
  }

  warn(text, channel = null) {
    this.log(text, channel, "warning");
  }

  debug(text, channel = null) {
    this.log(text, channel, "code");
  }

  info(text, channel = null) {
    this.log(text, channel, "info");
  }

  alert(text, channel = null) {
    this.log(text, channel, "alarm");
  }

  love(text, channel = null) {
    this.log(text, channel, "favorite")
  }

  constructor() {
    var html = `
    <div id="pjw-console" class="mdc-card">
      <div id="pjw-console-history">
        <div class="pjw-mini-brand"><span class="material-icons-round" style="font-size: 14px; color: rgba(0, 0, 0, .5);">assignment</span><p style="font-size: 10px;">PotatoPlus Floating Panel</p></div>
      </div>
      <div class="pjw-console-item">
        <div class="pjw-console-icon material-icons-round">emoji_people</div>
        <div class="pjw-console-text">The PotatoPlus Project</div>
      </div>
    </div>`;

    this.dom = $$(html).appendTo("body");
    this.history = this.dom.children("#pjw-console-history");

    $$("body").css("margin-bottom", "40px");

    $$(document).on("mousemove", null, {
      target: this
    }, function(e) {
      if (e.clientY >= $$(window).height() - 40)
        e.data.target.show();
    });

    $$(document).on("mousedown", null, {
      target: this
    }, function(e) {
      if (e.data.target.history_expanded && !e.data.target.mouse_stay && window.getSelection().toString() == "") {
        e.data.target.hide();
      }
    });

    this.dom.on("click", null, {
      target: this
    }, function(e) {
      if (window.getSelection().toString() == "")
        e.data.target.expand();
    });

    this.dom.on("mouseenter", null, {
      target: this
    }, function(e) {
      var target = e.data.target;
      target.mouse_stay = true;
      target.setColor();
      clearTimeout(target.stay_timeout);
    });

    this.dom.on("mouseleave", null, {
      target: this
    }, function(e) {
      var target = e.data.target;
      target.mouse_stay = false;
      if (target.history_expanded) return;
      target.stay_timeout = setTimeout((target) => {
        target.hide();
      }, 200, target);
    });
  }
}