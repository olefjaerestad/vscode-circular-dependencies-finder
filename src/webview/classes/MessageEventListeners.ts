import { IMessageEventPayload } from "../../types";
import { vscode } from "../vscode-api";

export class MessageEventListeners {
	private static active: boolean = false;

	constructor () {
		throw Error('MessageEventListeners cannot be instantiated. Use it\'s static methods instead.');
	}

	static add() {
		if (MessageEventListeners.active) {
			return;
		}

		window.addEventListener('message', handleMessage);

		MessageEventListeners.active = true;
	}

	static remove() {
		window.removeEventListener('message', handleMessage);

		MessageEventListeners.active = false;
	}
}

function handleMessage(event: MessageEvent<IMessageEventPayload<string>>) {
	switch(event.data.type) {
		case 'search': {
			vscode.setState({
				...vscode.getState(),
				search: event.data.data,
			});
		}
		default: {
			return;
		}
	}
}
