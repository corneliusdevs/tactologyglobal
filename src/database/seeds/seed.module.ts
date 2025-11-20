import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { AdminSeederService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule, // Make sure ConfigModule is available here
  ],
  providers: [AdminSeederService],
  exports: [AdminSeederService], // Export so it can be used in AppModule
})
export class SeederModule {}
