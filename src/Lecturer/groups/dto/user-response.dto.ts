import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../user/entities/user.entity';

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    mobile: string;

    @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
    role: UserRole;
}