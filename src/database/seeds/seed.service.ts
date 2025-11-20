import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdminSeederService {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async seedAdminUser() {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminUsername || !adminPassword) {
      this.logger.warn('ADMIN_USERNAME or ADMIN_PASSWORD environment variables are not set. Skipping admin user seed.');
      return;
    }

    // 1. Check if the admin user already exists
    const existingAdmin = await this.userRepository.findOne({ where: { username: adminUsername } });

    if (existingAdmin) {
      this.logger.log('Admin user already exists. Skipping seed.');
      return;
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // 3. Create and save the new admin user
    const newAdmin = this.userRepository.create({
      username: adminUsername,
      password: hashedPassword,
      firstname: "Admin",
      lastname: "User",
      role: "admin"
    });

    await this.userRepository.save(newAdmin);
    this.logger.log(`Admin user "${adminUsername}" seeded successfully.`);
  }
}
