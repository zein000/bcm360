import { PageOptionsDTO } from "src/common/dto";
import { UserSearchField } from "src/enums/user-search-field.enum";
export declare class UserSearchParamsDTO extends PageOptionsDTO {
    fieldName?: UserSearchField;
    value: string;
    companyId: number;
}
