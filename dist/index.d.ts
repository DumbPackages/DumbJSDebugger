export declare class Dumbdebugger {
    #private;
    private readonly data;
    constructor();
    start(capturing: any): void;
    read(): {
        logs: any[];
        network: any[];
        mobile: any;
        platform: any;
        screen: string;
        userAgent: string;
    } | {
        logs: any[];
        network: any[];
        mobile?: undefined;
        platform?: undefined;
        screen: string;
        userAgent: string;
    };
    stop(capturing: any): void;
}
