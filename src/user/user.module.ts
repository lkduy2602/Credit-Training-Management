import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ClassEntity } from 'src/class/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ClassEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
