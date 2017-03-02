
const ALERT_TYPES = ["success", "info", "warning", "danger"];

export default class ReplaceFlash {
  static element(parent) {
    let $parent = $(parent);
    return $parent.length ? $parent : $('body .container:first');
  }

  static _display(type, message, parent) {
    let html = `
      <div class="alert fade in alert-${type}">
        ${message}
      </div>`;
    (parent ? $(parent) : this.element()).replaceWith($(html).delay(5000));
  }
}

ALERT_TYPES.forEach((type) => {
  ReplaceFlash[type] = function(message, parent) {
    this._display(type, message, parent);
  }
});