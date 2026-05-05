import { ConfigurationName } from "src/enums/configuration.enum";
import { UpdateConfigurationRequestDTO } from "./update-configuration-request.dto";
export declare class AddConfigurationRequestDTO extends UpdateConfigurationRequestDTO {
    name: ConfigurationName;
}
