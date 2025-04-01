import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewModule } from './review/review.module';
import {TypeOrmModule} from "@nestjs/typeorm";

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type:'mysql',
        host:'localhost',
        port:3306,
        username:'root',
        password:'',
        database:'nextlearn',
        autoLoadEntities:true,
        synchronize:true,
      })
      ,ReviewModule, UserModule, AuthModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
