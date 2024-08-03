import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InfoMemberDto } from './dto/info-member.dto';
import { plainToInstance } from 'class-transformer';
import { Member } from '@prisma/client';

@Injectable()
export class MemberService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MemberService.name);

  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    if (!this.prisma.member.count()) {
      await this.prisma.member.create({
        data: {
          email: 'admin@mail.com',
          name: '테스트',
          phone: '010-1234-5678',
        },
      });
    }
  }

  async create(param: CreateMemberDto) {
    if (await this.isExistingEmail(param.email)) {
      throw new BadRequestException(`Email already exists : ${param.email}`);
    }

    let member: Member;
    try {
      member = await this.prisma.member.create({
        data: plainToInstance(InfoMemberDto, param),
      });
    } catch (err) {
      throw err;
    }
    return plainToInstance(InfoMemberDto, member);
  }

  async findAll(): Promise<InfoMemberDto> {
    return plainToInstance(InfoMemberDto, this.prisma.member.findMany());
  }

  async findOne(id: number): Promise<InfoMemberDto> {
    const member: Member = await this.prisma.member.findUnique({
      where: {
        id: id,
      },
    });
    this.logger.log(member);

    if (!member) {
      throw new NotFoundException(`Find Member with id: ${id} doesn't exist`);
    }

    return plainToInstance(InfoMemberDto, member);
  }

  async update(id: number, param: UpdateMemberDto) {
    const member: Member = await this.prisma.member.findUnique({
      where: {
        id: id,
      },
    });

    if (!member) {
      throw new NotFoundException(`Update Member with id: ${id} doesn't exist`);
    }

    if (param.email !== member.email) {
      if (await this.isExistingEmail(param.email)) {
        throw new BadRequestException(
          `Update Email already exists : ${param.email}`,
        );
      }
    }
    try {
      return this.prisma.member.update({
        where: { id: id },
        data: plainToInstance(InfoMemberDto, param),
      });
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    const member: Member = await this.prisma.member.findUnique({
      where: {
        id: id,
      },
    });

    if (!member) {
      throw new NotFoundException(`Delete Member with id: ${id} doesn't exist`);
    }
  }

  async isExistingEmail(email: string): Promise<boolean> {
    // exists == .then(Boolean) OR https://www.prisma.io/docs/orm/prisma-client/client-extensions/model#example-1
    return this.prisma.member.count({ where: { email: email } }).then(Boolean);
  }
}
