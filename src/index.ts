import Signal from "@rbxts/signal";

const logPrefix = "[RSM]: ";

namespace RSM {
	enum Indicator {
		Defer = "*RSM_DEFER_STATE"
	}

	export const { Defer } = Indicator;

	interface StateMachineOptions {
		readonly warnInvalidState?: boolean;
	}

	export class StateMachine<T> {
		private readonly stateChanged = new Signal<(from: T, to: T) => void>;
		private state: T;
		private deferred = false;

		public constructor(
			initialState: T,
			private readonly options?: StateMachineOptions
		) {
			this.state = initialState;
		}

		public get(): T {
			return this.state;
		}

		public transition<M extends StateMachine<T>>(name: keyof Omit<M, ExtractKeys<StateMachine<T>, Callback>>, ...args: unknown[]): void {
			if (this.deferred) return;
			const method = <Callback>(<M><unknown>this)[name];
			method(this, ...args);
			this.deferred = false;
		}

		public onStateChanged(callback: (from: T, to: T) => void | Indicator): RBXScriptConnection {
			return this.stateChanged.Connect((from, to) => {
				const indicator = callback(from, to);
				if (indicator === undefined) return;

				switch (indicator) {
					case Indicator.Defer: {
						this.deferred = true;
						break;
					}
				}
			});
		}

		protected change(from: T | "*", to: T): void {
			if (this.deferred) return;
			if (this.state !== from && from !== "*")
				return this.options?.warnInvalidState === undefined ? undefined : warn(logPrefix + `Invalid state change! Attempt to change from "${from}" to "${to}".`);

			const oldState = this.state;
			this.state = to;
			this.stateChanged.Fire(oldState, this.state);
		}
	}
}

export = RSM;