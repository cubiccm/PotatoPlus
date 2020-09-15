var pjw_filter = {
  avail: {
    html: `
      <div id="pjw-avail-filter">
        <div class="mdc-switch">
          <div class="mdc-switch__track"></div>
          <div class="mdc-switch__thumb-underlay">
            <div class="mdc-switch__thumb"></div>
            <input type="checkbox" class="mdc-switch__native-control" role="switch" aria-checked="false">
          </div>
        </div>
        <label for="basic-switch">过滤不可选课程</label>
      </div>
    `,
    intl: (space, list) => {
      space.dom = $$("#pjw-avail-filter");
      space.switch = new mdc.switchControl.MDCSwitch($$("#pjw-avail-filter > .mdc-switch")[0]);
      space.switch.checked = true;
      space.status = true;
      space.dom.find(".mdc-switch__native-control").on("change", null, {
        target: space,
        list: list
      }, (e) => {
        e.data.target.status = e.data.target.switch.checked;
        e.data.list.update();
      });
    },
    check: (space, data) => {
      if (!space.status) return 0;
      if ("select_button" in data && data.select_button.status !== false && data.select_button.status != "Select") {
        return false;
      }
      return 0;
    }
  }
}