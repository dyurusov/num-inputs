export default class Input {
  constructor (elOrId) {
    this._host = elOrId instanceof HTMLElement
      ? elOrId
      : document.getElementById(elOrId);
    this._render();
  }

  _render () {
    if (this._host) {
      this._host.innerHTML = this._host.id;
    }
  }

  get host () {
    return this._host;
  }

  get isMounted () {
    return !!this.host;
  }
}
