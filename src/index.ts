
export class Dumbdebugger {
  private readonly data: { logs: any[]; network: any[] };
   readonly #originalConsoleError: (...data: any[]) => void;
   readonly #originalFetch: (input: (RequestInfo | URL), init?: RequestInit) => Promise<Response>;
  constructor() {
    this.data = { logs: [], network: [] };
    this.#originalConsoleError = console.error;
    this.#originalFetch = window.fetch.bind(window);
  }
  #captureLogs() {
    console.error = (...args) => {
      this.#addData('logs', {
        type: 'error',
        message: args[0],
        arguments: args
      });
      this.#originalConsoleError(...args);
    };
  }

   #captureNetwork() {
    window.fetch = (...args) => {
      return this.#originalFetch(...args).then(response => {
        this.#addData('network', {
          url: encodeURI(response.url),
          status: response.status,
          body: response.status === 500 ? response.text() : 'Not Recorded'
        });
        return response;
      });
    };
  }

  #addData(type, data) {
    this.data[type].push(data);
    if (this.data[type].length > 30) {
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
      screen: `${screen.width} x ${screen.height}`,
      userAgent: window.navigator.userAgent,
      ...(()=>{
        const nav = navigator as any;
        if(nav.userAgentData){
          return {
            mobile:nav.userAgentData.mobile,
            platform: nav.userAgentData.platform,
          }
        }
        return {}
      })(),
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
