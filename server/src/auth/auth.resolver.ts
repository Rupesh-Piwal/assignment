import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { User } from 'src/users/models/user.model';


@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => User)
    async login(@Args('loginInput') loginInput: LoginInput, @Context() context) {
        const user = await this.authService.validateUser(loginInput.email, loginInput.password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const { access_token } = await this.authService.login(user);

        context.res.cookie('Authentication', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return user;
    }

    @Mutation(() => User)
    async signup(@Args('signupInput') signupInput: SignupInput, @Context() context) {
        const user = await this.authService.signup(signupInput);
        const { access_token } = await this.authService.login(user)

        context.res.cookie('Authentication', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return user;
    }

    @Mutation(() => Boolean)
    async logout(@Context() context) {
        context.res.clearCookie('Authentication');
        return true;
    }

    @Mutation(() => User)
    async oauthLogin(
        @Args('provider') provider: string,
        @Args('code') code: string,
        @Context() context
    ) {
        const user = await this.authService.oauthLogin(provider, code);
        if (!user) throw new Error("OAuth failed");

        const { access_token } = await this.authService.login(user as any);

        context.res.cookie('Authentication', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        return user;
    }
}
