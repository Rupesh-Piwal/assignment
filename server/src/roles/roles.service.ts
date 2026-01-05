import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';




@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async findByName(name: string): Promise<Role | null> {
        return this.prisma.role.findUnique({
            where: { name },
        });
    }

    async create(name: string): Promise<Role> {
        return this.prisma.role.create({
            data: { name },
        });
    }

    async findAll(): Promise<Role[]> {
        return this.prisma.role.findMany();
    }
}
