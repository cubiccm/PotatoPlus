window.PJWConsole = class {
  show(stay = false) {
    this.dom.css({
      "bottom": "10px",
      "opacity": "1"
    });
    if (typeof(this.stay_timeout) != "undefined")
      clearTimeout(this.stay_timeout);
    if (stay) this.mouse_stay = true;
    if (!this.mouse_stay)
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
    this.history.css("display", "flex");
    this.history[0].scrollTop = this.history[0].scrollHeight;
  }

  collapse() {
    this.history.css("display", "none");
  }

  setColor(color = "rgba(0, 0, 0, .2)") {
    this.dom.css("filter", `drop-shadow(0px 0px 6px ${color}`);
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

    var action = {
      error: [true, "#b4220a"],
      warning: [true, "#b74710"],
      done: [true, "limegreen"],
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

  constructor() {
    var html = `
    <div id="pjw-console" class="mdc-card">
      <div id="pjw-console-history">
      </div>
      <div class="pjw-console-item">
        <div class="pjw-console-icon material-icons-round">emoji_people</div>
        <div class="pjw-console-text">PotatoPlus v${window.pjw_version}</div>
      </div>
    </div>`;

    this.dom = $$(html).appendTo("body");
    this.history = this.dom.children("#pjw-console-history");

    $$(document).on("mousemove", null, {
      target: this
    }, function(e) {
      if (e.clientY >= $$(window).height() - 60)
        e.data.target.show();
    });

    this.dom.on("click", null, {
      target: this
    }, function(e) {
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
      target.stay_timeout = setTimeout((target) => {
        target.hide();
      }, 200, target);
    });
  }
}