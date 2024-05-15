var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Dumbdebugger_instances, _Dumbdebugger_originalConsoleError, _Dumbdebugger_originalFetch, _Dumbdebugger_captureLogs, _Dumbdebugger_captureNetwork, _Dumbdebugger_addData;
export class Dumbdebugger {
    constructor() {
        _Dumbdebugger_instances.add(this);
        _Dumbdebugger_originalConsoleError.set(this, void 0);
        _Dumbdebugger_originalFetch.set(this, void 0);
        this.data = { logs: [], network: [] };
        __classPrivateFieldSet(this, _Dumbdebugger_originalConsoleError, console.error, "f");
        __classPrivateFieldSet(this, _Dumbdebugger_originalFetch, window.fetch.bind(window), "f");
    }
    start(capturing) {
        capturing.forEach(c => {
            if (c === 'logs')
                __classPrivateFieldGet(this, _Dumbdebugger_instances, "m", _Dumbdebugger_captureLogs).call(this);
            if (c === 'network')
                __classPrivateFieldGet(this, _Dumbdebugger_instances, "m", _Dumbdebugger_captureNetwork).call(this);
        });
    }
    read() {
        return Object.assign(Object.assign({ screen: `${screen.width} x ${screen.height}`, userAgent: window.navigator.userAgent }, (() => {
            const nav = navigator;
            if (nav.userAgentData) {
                return {
                    mobile: nav.userAgentData.mobile,
                    platform: nav.userAgentData.platform,
                };
            }
            return {};
        })()), this.data);
    }
    stop(capturing) {
        if (capturing.includes('logs')) {
            console.error = __classPrivateFieldGet(this, _Dumbdebugger_originalConsoleError, "f");
        }
        if (capturing.includes('network')) {
            window.fetch = __classPrivateFieldGet(this, _Dumbdebugger_originalFetch, "f");
        }
    }
}
_Dumbdebugger_originalConsoleError = new WeakMap(), _Dumbdebugger_originalFetch = new WeakMap(), _Dumbdebugger_instances = new WeakSet(), _Dumbdebugger_captureLogs = function _Dumbdebugger_captureLogs() {
    console.error = (...args) => {
        __classPrivateFieldGet(this, _Dumbdebugger_instances, "m", _Dumbdebugger_addData).call(this, 'logs', {
            type: 'error',
            message: args[0],
            arguments: args
        });
        __classPrivateFieldGet(this, _Dumbdebugger_originalConsoleError, "f").call(this, ...args);
    };
}, _Dumbdebugger_captureNetwork = function _Dumbdebugger_captureNetwork() {
    window.fetch = (...args) => {
        return __classPrivateFieldGet(this, _Dumbdebugger_originalFetch, "f").call(this, ...args).then(response => {
            __classPrivateFieldGet(this, _Dumbdebugger_instances, "m", _Dumbdebugger_addData).call(this, 'network', {
                url: encodeURI(response.url),
                status: response.status,
                body: response.status === 500 ? response.text() : 'Not Recorded'
            });
            return response;
        });
    };
}, _Dumbdebugger_addData = function _Dumbdebugger_addData(type, data) {
    this.data[type].push(data);
    if (this.data[type].length > 30) {
        this.data[type].shift();
    }
};
//# sourceMappingURL=index.js.map