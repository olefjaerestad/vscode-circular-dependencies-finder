import styles from './tabs-component.scss';
console.log(styles);

export class TabsComponent extends HTMLElement {
  connectedCallback() {
    console.log(this);
    this.querySelectorAll('[data-role="panels"] > *').forEach((el) => el.classList.add(styles.panel));
    this.querySelectorAll('[data-role="tabs"] > *').forEach((el) => el.classList.add(styles.tab));
  }
}
!window.customElements.get('wc-tabs') && window.customElements.define('wc-tabs', TabsComponent);
