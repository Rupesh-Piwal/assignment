import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithRole } from './dto/user-with-role';
import { Prisma } from '@prisma/client';



@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string): Promise<UserWithRole | null> {
        return this.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<UserWithRole> {
        return this.prisma.user.create({
            data,
            include: { role: true },
        });
    }
}
