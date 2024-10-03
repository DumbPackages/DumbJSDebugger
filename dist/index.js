var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _Dumbdebugger_instances, _Dumbdebugger_originalConsoleError, _Dumbdebugger_originalFetch, _Dumbdebugger_debouncedCaptureScreenshot, _Dumbdebugger_captureLogs, _Dumbdebugger_captureNetwork, _Dumbdebugger_captureScreenshot, _Dumbdebugger_addData;
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
export class Dumbdebugger {
    constructor({ maxData = { logs: 30, screenshots: 8, network: 30 }, screenshotCallback }) {
        _Dumbdebugger_instances.add(this);
        _Dumbdebugger_originalConsoleError.set(this, void 0);
        _Dumbdebugger_originalFetch.set(this, void 0);
        _Dumbdebugger_debouncedCaptureScreenshot.set(this, void 0);
        if (screenshotCallback && typeof screenshotCallback !== 'function') {
            throw new Error("screenshotCallback must be a function");
        }
        this.data = { logs: [], network: [], screenshots: [] };
        this.maxData = maxData;
        this.screenshotCallback = screenshotCallback;
        __classPrivateFieldSet(this, _Dumbdebugger_originalConsoleError, console.error, "f");
        __classPrivateFieldSet(this, _Dumbdebugger_originalFetch, window.fetch.bind(window), "f");
        __classPrivateFieldSet(this, _Dumbdebugger_debouncedCaptureScreenshot, debounce(__classPrivateFieldGet(this, _Dumbdebugger_instances, "m", _Dumbdebugger_captureScreenshot).bind(this), 350), "f");
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
        return Object.assign({ system: Object.assign({ screen: `${screen.width} x ${screen.height}`, userAgent: window.navigator.userAgent }, (() => {
                const nav = navigator;
                if (nav.userAgentData) {
                    return {
                        mobile: nav.userAgentData.mobile,
                        platform: nav.userAgentData.platform,
                    };
                }
                return {};
            })()) }, this.data);
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
_Dumbdebugger_originalConsoleError = new WeakMap(), _Dumbdebugger_originalFetch = new WeakMap(), _Dumbdebugger_debouncedCaptureScreenshot = new WeakMap(), _Dumbdebugger_instances = new WeakSet(), _Dumbdebugger_captureLogs = function _Dumbdebugger_captureLogs() {
    console.error = (...args) => {
        __classPrivateFieldGet(this, _Dumbdebugger_instances, "m", _Dumbdebugger_addData).call(this, 'logs', {
            type: 'error',
            message: args[0],
            arguments: args
        });
        __classPrivateFieldGet(this, _Dumbdebugger_originalConsoleError, "f").call(this, ...args);
        if (!args[0].startsWith('dumbjsdebugger')) {
            void __classPrivateFieldGet(this, _Dumbdebugger_debouncedCaptureScreenshot, "f").call(this);
        }
    };
}, _Dumbdebugger_captureNetwork = function _Dumbdebugger_captureNetwork() {
    window.fetch = (...args) => {
        return __classPrivateFieldGet(this, _Dumbdebugger_originalFetch, "f").call(this, ...args).then((response) => __awaiter(this, void 0, void 0, function* () {
            const clonedResponse = response.clone(); // Clone la réponse
            __classPrivateFieldGet(this, _Dumbdebugger_instances, "m", _Dumbdebugger_addData).call(this, 'network', {
                url: encodeURI(clonedResponse.url),
                status: clonedResponse.status,
                body: clonedResponse.status === 500 ? yield clonedResponse.text() : 'Not Recorded'
            });
            return response;
        }));
    };
}, _Dumbdebugger_captureScreenshot = function _Dumbdebugger_captureScreenshot() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!this.screenshotCallback) {
                return;
            }
            const screenshotData = yield this.screenshotCallback();
            __classPrivateFieldGet(this, _Dumbdebugger_instances, "m", _Dumbdebugger_addData).call(this, 'screenshots', screenshotData);
        }
        catch (error) {
            console.warn('dumbjsdebugger : Screenshot capture failed:', error);
        }
    });
}, _Dumbdebugger_addData = function _Dumbdebugger_addData(type, data) {
    this.data[type].push(data);
    if (this.data[type].length > this.maxData[type]) {
        this.data[type].shift();
    }
};
