/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
declare namespace RSM {
    enum Indicator {
        Defer = "*RSM_DEFER_STATE"
    }
    export const Defer: Indicator;
    interface StateMachineOptions {
        readonly warnInvalidState?: boolean;
    }
    export class StateMachine<T> {
        private readonly options?;
        private readonly stateChanged;
        private state;
        private deferred;
        constructor(initialState: T, options?: StateMachineOptions | undefined);
        get(): T;
        transition<M extends StateMachine<T>>(name: keyof Omit<M, ExtractKeys<StateMachine<T>, Callback>>, ...args: unknown[]): void;
        onStateChanged(callback: (from: T, to: T) => void | Indicator): RBXScriptConnection;
        protected change(from: T | "*", to: T): void;
    }
    export {};
}
export = RSM;
