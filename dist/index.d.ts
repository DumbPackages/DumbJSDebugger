interface DumbdebuggerOptions {
    screenshotCallback?: () => Promise<string>;
    networkBodyCallback?: (response: Response) => string;
    maxData?: MaxData;
}
interface DebugData {
    system?: {
        screen: string;
        userAgent: string;
        mobile?: boolean;
        platform?: string;
    };
    logs: Array<any>;
    network: Array<any>;
    screenshots: Array<string>;
}
interface MaxData {
    logs: number;
    network: number;
    screenshots: number;
}
export declare class Dumbdebugger {
    #private;
    data: DebugData;
    maxData: MaxData;
    screenshotCallback: () => Promise<string>;
    networkBodyCallback: (response: Response) => string;
    constructor({ maxData, screenshotCallback, networkBodyCallback }: DumbdebuggerOptions);
    start(capturing: any): void;
    read(): {
        system: {
            screen: string;
            userAgent: string;
            mobile?: boolean;
            platform?: string;
        } | {
            mobile: any;
            platform: any;
            screen: string;
            userAgent: string;
        };
        logs: any[];
        network: any[];
        screenshots: string[];
    };
    stop(capturing: any): void;
}
export {};
