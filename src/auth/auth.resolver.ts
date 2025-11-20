import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginResponse } from './dto/login.response';
import { LoginInput } from './dto/login.input';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput): Promise<LoginResponse> {
    const user = await this.authService.ValidateUser(
      input.username,
      input.password,
    );

    return this.authService.login(user);
  }
}
