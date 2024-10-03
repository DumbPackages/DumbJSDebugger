interface DumbdebuggerOptions {
    screenshotCallback?: () => Promise<string>;
    networkBodyCallback?: (response:Response) => string;
    maxData?: MaxData;
}

interface DebugData {
    system?: {
        screen: string,
        userAgent: string,
        mobile?: boolean,
        platform?: string
    }
    logs: Array<any>;
    network: Array<any>;
    screenshots: Array<string>;
}

interface MaxData {
    logs: number;
    network: number;
    screenshots: number;
}

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    } as T;
}

export class Dumbdebugger {
    data: DebugData;
    maxData: MaxData;
    readonly #originalConsoleError: any;
    readonly #originalFetch: any;
    screenshotCallback: () => Promise<string>;
    networkBodyCallback: (response:Response) => string;
    #debouncedCaptureScreenshot: any;

    constructor({maxData = {logs: 30, screenshots: 8, network: 30}, screenshotCallback, networkBodyCallback}: DumbdebuggerOptions) {
        if (screenshotCallback && typeof screenshotCallback !== 'function') {
            throw new Error("screenshotCallback must be a function");
        }
        if (networkBodyCallback && typeof networkBodyCallback !== 'function') {
            throw new Error("networkBodyCallback must be a function");
        }
        this.data = {logs: [], network: [], screenshots: []};
        this.maxData = maxData;
        this.screenshotCallback = screenshotCallback;
        this.networkBodyCallback = networkBodyCallback;
        this.#originalConsoleError = console.error;
        this.#originalFetch = window.fetch.bind(window);
        this.#debouncedCaptureScreenshot = debounce(this.#captureScreenshot.bind(this), 350);
    }

    #captureLogs() {
        console.error = (...args) => {
            this.#addData('logs', {
                type: 'error',
                message: args[0],
                arguments: args
            });
            this.#originalConsoleError(...args);
            if (!args[0].startsWith('dumbjsdebugger')) {
                void this.#debouncedCaptureScreenshot()
            }
        };
    }

    #captureNetwork() {
        window.fetch = (...args) => {
            return this.#originalFetch(...args).then(async response => {
                const clonedResponse = response.clone(); // Clone la réponse
                const url = encodeURI(clonedResponse.url)
                const status = clonedResponse.status;
                let body = "No body"
                if(this.networkBodyCallback){
                    body = this.networkBodyCallback(clonedResponse)
                }
                this.#addData('network', {
                    url: url,
                    status: status,
                    body: body
                });
                return response;
            });
        };
    }

    async #captureScreenshot() {
        try {
            if (!this.screenshotCallback) {
                return;
            }
            const screenshotData = await this.screenshotCallback();
            this.#addData('screenshots', screenshotData);
        } catch (error) {
            console.warn('dumbjsdebugger : Screenshot capture failed:', error);
        }
    }

    #addData(type, data) {
        this.data[type].push(data);
        if (this.data[type].length > this.maxData[type]) {
            this.data[type].shift();
        }
    }

    start(capturing) {
        capturing.forEach(c => {
            if (c === 'logs') this.#captureLogs();
            if (c === 'network') this.#captureNetwork();
        });
    }

    read() {
        return {
            system: {
                screen: `${screen.width} x ${screen.height}`,
                userAgent: window.navigator.userAgent,
                ...(() => {
                    const nav = navigator as any;
                    if (nav.userAgentData) {
                        return {
                            mobile: nav.userAgentData.mobile,
                            platform: nav.userAgentData.platform,
                        }
                    }
                    return {}
                })()
            },
            ...this.data
        };
    }

    stop(capturing) {
        if (capturing.includes('logs')) {
            console.error = this.#originalConsoleError;
        }
        if (capturing.includes('network')) {
            window.fetch = this.#originalFetch;
        }
    }
}
