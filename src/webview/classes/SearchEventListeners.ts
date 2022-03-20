import { vscode } from "../vscode-api";

export class SearchEventListeners {
	private static active: boolean = false;

	constructor () {
		throw Error('SearchEventListeners cannot be instantiated. Use it\'s static methods instead.');
	}

	static add() {
		if (SearchEventListeners.active) {
			return;
		}

		window.addEventListener('keydown', handleKeyDown);

		SearchEventListeners.active = true;
	}

	static remove() {
		window.removeEventListener('keydown', handleKeyDown);

		SearchEventListeners.active = false;
	}
}

function handleKeyDown(event: KeyboardEvent) {
	if (
		event.key.toLocaleLowerCase() !== 'f' 
		|| !event.metaKey 
		|| event.shiftKey 
		|| event.altKey
	) {
		return;
	}

	vscode.postMessage({
		type: 'initSearch',
	});
}
