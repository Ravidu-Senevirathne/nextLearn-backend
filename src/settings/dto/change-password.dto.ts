import { IsString, MinLength, Matches } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    currentPassword: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    newPassword: string;

    @IsString()
    @Match('newPassword', { message: 'Passwords do not match' })
    confirmNewPassword: string;
}
