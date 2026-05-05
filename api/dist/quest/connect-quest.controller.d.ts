import { ConnectQuestService } from "./connect-quest.service";
export declare class ConnectQuestController {
    private readonly connectQuestService;
    private readonly logger;
    constructor(connectQuestService: ConnectQuestService);
    getPin(): Promise<string>;
    getPerPin(pin: string): Promise<string | undefined>;
}
