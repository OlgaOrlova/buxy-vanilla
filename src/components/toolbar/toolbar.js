import template from "./toolbar.html";

export class ToolbarComponent {
  constructor(mountPoint, props) {
    this.mountPoint = mountPoint;
    this.props = props;
  }

  querySelectors() {
    this.menu = this.mountPoint.querySelector(".toolbar__menu");
  }

  addEventListeners() {
    this.menu.addEventListener("click", this.onMenuClicked.bind(this));
  }

  onMenuClicked() {
    this.props.onMenuClicked();
  }

  mount() {
    this.mountPoint.innerHTML = template();
    this.querySelectors();
    this.addEventListeners();
  }
}
