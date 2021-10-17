import styles from './tabs-component.scss';

/**
 * @description
 * Display a tab component.
 * 
 * @requires
 * 2 child elements. 1 with `[data-role="tabs"]`, 1 with `[data-role="panels"]`.
 * `[data-role="tabs"]` requires direct children with `[data-for="panel-target"]`, 
 * where `panel-target` corresponds to the `[data-id]` of the panels.
 * `[data-role="panels"]` requires direct children with `[data-id="panel-target"]`, 
 * where `panel-target` corresponds to the `[data-for]` of the tabs.
 * 
 * @example
 * ```html
 * <wc-tabs>
    <nav data-role="tabs">
      <button type="button" data-for="panel-1">Tab 1</button>
      <button type="button" data-for="panel-2">Tab 2</button>
    </nav>
    <section data-role="panels">
      <div data-id="panel-1">I am panel 1</div>
      <div data-id="panel-2">I am panel 2</div>
    </section>
  </wc-tabs>
  ```
 */
export class TabsComponent extends HTMLElement {
  private get currentTab(): string | null {
    return this.querySelector(`.${styles.panel}.${styles.active}`)?.getAttribute('data-for') || null;
  };

  private handleTabClick(e: Event) {
    const id = (e.target as HTMLElement).closest('[data-for]')?.getAttribute('data-for');
    if (id) {
      this.closeAllTabs();
      this.openTab(id);
    }
  }

  private addEventListeners() {
    this.querySelectorAll('[data-role="tabs"]').forEach((el) => el.addEventListener(
      'click', 
      this.handleTabClick.bind(this)
    ));
  }

  private addInitialClasses() {
    this.querySelectorAll('[data-role="tabs"]').forEach((el) => el.classList.add(styles.tabs));
    this.querySelectorAll('[data-role="tabs"] > *').forEach((el) => el.classList.add(styles.tab));
    this.querySelectorAll('[data-role="panels"] > *').forEach((el) => el.classList.add(styles.panel));
  }

  private closeAllTabs() {
    this.querySelectorAll(`.${styles.tab}`).forEach((el) => el.classList.remove(styles.active));
    this.querySelectorAll(`.${styles.panel}`).forEach((el) => el.classList.remove(styles.active));
  }

  connectedCallback() {
    this.addInitialClasses();
    this.addEventListeners();
    this.openFirstTabIfNoneOpen();
  }


  private openFirstTabIfNoneOpen() {
    if (!this.currentTab) {
      this.closeAllTabs();
      this.querySelector(`.${styles.tab}`)?.classList.add(styles.active);
      this.querySelector(`.${styles.panel}`)?.classList.add(styles.active);
    }
  }

  openTab(id: string) {
    this.closeAllTabs();
    this.querySelectorAll(`.${styles.tab}[data-for="${id}"]`).forEach((el) => el.classList.add(styles.active));
    this.querySelectorAll(`.${styles.panel}[data-id="${id}"]`).forEach((el) => el.classList.add(styles.active));
  }
}
!window.customElements.get('wc-tabs') && window.customElements.define('wc-tabs', TabsComponent);
