import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async ValidateUser(username: string, password: string): Promise<User> {
     const user = await this.usersService.findByUsername(username);
     if(!user) throw new UnauthorizedException("Invalid credentials");

     const isPasswordValid = await bcrypt.compare(password, user.password);
     if(!isPasswordValid) throw new UnauthorizedException("Invalid credentials")

    return user;
  }

    async login(user: User) {
        const payload = { username: user.username, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
            expiresIn: 3600, // 1 hour expiration,
            user: {
              username: user.username,
              id: user.id
            }
        };
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
}
