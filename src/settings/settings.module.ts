import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { User } from '../user/entities/user.entity';
import { NotificationSettings } from './entities/notification-settings.entity';
import { ConnectedAccounts } from './entities/connected-accounts.entity';
import { Session } from './entities/session.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            NotificationSettings,
            ConnectedAccounts,
            Session,
        ]),
    ],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule { }
