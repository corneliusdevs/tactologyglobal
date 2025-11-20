import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import passport from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Find user by username
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

    
   // Returns all users WITHOUT passwords
  async findAll(): Promise<Omit<User, "password">[]> {
    // Option 1: use select to exclude password
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt'],
    });
  }

  // Create user with hashed password for seeding the user since project requirements does not specify a create user endpoint or signup endpoint
  async createUser(input: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = this.userRepository.create({
      ...input,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }
}
