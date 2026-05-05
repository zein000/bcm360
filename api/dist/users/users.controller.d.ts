import RequestWithUser from "src/interfaces/request-with-user.interface";
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { InviteUserDTO } from "./dto/invite-user.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { BaseResponseDTO } from "../common/dto/base-response.dto";
import { AuthResponseDTO } from "../auth/dto/auth-response.dto";
import { TwoFAEnabledDTO } from "./dto/2fa-enabled.dto";
import { UserAuthResponseDTO } from "./dto/auth-response.dto";
import { ConfirmEmailDTO } from "./dto/confirm-email.dto";
import { DeleteUserDTO } from "./dto/delete-user.dto";
import { LoginDTO } from "./dto/login.dto";
import { PaginatedUsersDTO } from "./dto/paginated-users.dto";
import { SetPasswordDTO } from "./dto/set-password.dto";
import { UserIdParamDTO } from "./dto/user-id-parm.dto";
import { UserInfoDTO } from "./dto/user-info.dto";
import { UserSearchParamsDTO } from "./dto/user-search-params.dto";
import { UsersService } from "./users.service";
import { AcceptInvitationDto } from "./dto/accept-invitation.dto";
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    setPassword(body: SetPasswordDTO): Promise<UserAuthResponseDTO>;
    acceptInvitation(invitationData: AcceptInvitationDto): Promise<UserAuthResponseDTO>;
    confirmEmail(body: ConfirmEmailDTO): Promise<void>;
    invite({ user }: RequestWithUser, body: {
        users: InviteUserDTO[];
        companyId?: number;
    }): Promise<UserInfoDTO[]>;
    resendInviteEmail(body: InviteUserDTO): Promise<UserInfoDTO>;
    findAll({ user }: RequestWithUser, userSearchParamsDTO: UserSearchParamsDTO): Promise<PaginatedUsersDTO>;
    findMe({ user }: RequestWithUser): UserInfoDTO;
    findOneById({ user }: RequestWithUser, { id }: UserIdParamDTO): Promise<UserInfoDTO>;
    changePassword({ user }: RequestWithUser, { oldPassword, password, confirmPassword }: ChangePasswordDTO): Promise<UserInfoDTO>;
    resetPassword({ email }: ResetPasswordDTO): Promise<BaseResponseDTO<null>>;
    updateMe({ user }: RequestWithUser, data: UpdateUserDTO): Promise<UserInfoDTO>;
    resetUserPassword({ id }: UserIdParamDTO): Promise<BaseResponseDTO<null>>;
    updateUser(data: UpdateUserDTO, { user }: RequestWithUser, { id }: UserIdParamDTO): Promise<UserInfoDTO>;
    loginAs({ id }: {
        id: number;
    }): Promise<AuthResponseDTO | TwoFAEnabledDTO>;
    login(req: RequestWithUser, body: LoginDTO): Promise<AuthResponseDTO | TwoFAEnabledDTO>;
    refreshToken(req: RequestWithUser): Promise<AuthResponseDTO>;
    deleteUser({ user }: RequestWithUser, { id }: UserIdParamDTO): Promise<DeleteUserDTO>;
    logout(req: RequestWithUser): Promise<BaseResponseDTO<null>>;
}
