import styles from './json-component.scss';
import { IMessageEventPayload, TJsonData, TDependencyArray } from '../../types';

class JsonComponent extends HTMLElement {
	static get observedAttributes() {
		return ['json'];
	}

	constructor() {
		super();

		this.classList.add(styles.viewer);
		this.handleMessage = this.handleMessage.bind(this);
	}

	attributeChangedCallback(attr: 'json', oldVal: TJsonData | undefined, newVal: TJsonData | undefined) {
		try {
			if (!newVal) {
				throw Error('Missing required "json" attribute.');
			}

			const parsed: TDependencyArray = JSON.parse(newVal);
			const mapped = parsed.map((circularDeps) => {
				return circularDeps.map((dep) => {
					return `<span class='dep'>${dep}</span>`;
				});
			});
			this.innerHTML = JSON.stringify(mapped, null, 2);
		} catch (error) {
			this.innerHTML = '<p>Found no circular dependencies</p>';
		}
	}

	connectedCallback() {
		window.addEventListener('message', this.handleMessage);
	}
	
	disconnectedCallback() {
		window.removeEventListener('message', this.handleMessage);
	}

	private handleMessage(event: MessageEvent<IMessageEventPayload<string>>) {
		switch(event.data.type) {
			case 'search': {
				this.search(event.data.data || '');
			}
			default: {
				return;
			}
		}
	}

	private search(query: string) {
		const queryLowerCase = query.toLocaleLowerCase();

		this.querySelectorAll('.dep').forEach((el) => {
			el.classList.remove(styles.highlight);

			if (queryLowerCase && el.innerHTML.toLocaleLowerCase().includes(queryLowerCase)) {
				el.classList.add(styles.highlight);
			}
		});
	}
}

!customElements.get('wc-json') && customElements.define('wc-json', JsonComponent);
