interface IListenerAdder {
	add: () => void;
	remove: () => void;
}

export class EventListeners {
	private static instance: EventListeners;
	private static active: boolean = false;

	constructor (private listenerAdders: IListenerAdder[]) {
		if (EventListeners.instance) {
			return EventListeners.instance;
		}

		EventListeners.instance = this;
	}

	add() {
		if (EventListeners.active) {
			return;
		}

		this.listenerAdders.forEach((adder) => adder.add());

		EventListeners.active = true;
	}

	remove() {
		this.listenerAdders.forEach((adder) => adder.remove());

		EventListeners.active = false;
	}
}
