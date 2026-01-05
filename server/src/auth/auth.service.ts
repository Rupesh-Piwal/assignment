import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserWithRole } from '../users/dto/user-with-role';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.passwordHash && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async signup(signupInput: any): Promise<UserWithRole> {
        const hashedPassword = await bcrypt.hash(signupInput.password, 10);
        return this.usersService.create({
            email: signupInput.email,
            passwordHash: hashedPassword,
            role: {
                connectOrCreate: {
                    where: { name: 'STORE_KEEPER' },
                    create: { name: 'STORE_KEEPER' },
                },
            },
        });
    }

    async login(user: UserWithRole) {
        const payload = { email: user.email, sub: user.id, role: user.role?.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateToken(token: string) {
        return this.jwtService.verify(token);
    }

    async oauthLogin(provider: string, code: string) {
        console.log(`OAuth Login with ${provider}, code: ${code}`);
        // Mock user return
        return this.usersService.findOne("admin@example.com"); // Return admin for demo
    }
}
