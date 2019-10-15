export default class Input {
  constructor (elOrId) {
    this._element = elOrId instanceof HTMLElement
      ? elOrId
      : document.getElementById(elOrId);
    this.render();
  }

  render () {
    if (this._element) {
      this._element.innerHTML = this._element.id;
    }
  }
}
