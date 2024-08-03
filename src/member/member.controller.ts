import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InfoMemberDto } from './dto/info-member.dto';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  private readonly logger = new Logger(MemberController.name);

  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'add Member', description: 'add Member' })
  @ApiCreatedResponse({
    description: '가입 Member 정보 반환',
    type: [InfoMemberDto],
  })
  @ApiConflictResponse({
    description: '가입 실패',
  })
  @ApiBadRequestResponse({
    description: '가입 실패(이메일 충돌)',
  })
  async create(@Body() createMemberDto: CreateMemberDto) {
    try {
      return await this.memberService.create(createMemberDto);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      } else {
        this.logger.error('알 수 없는 오류 발생', err);
        throw err;
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'get All Members', description: 'get All Members' })
  @ApiOkResponse({ description: '모든 멤버 반환', type: [InfoMemberDto] })
  async findAll() {
    return this.memberService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get Member By ID',
    description: 'get Member By ID',
  })
  @ApiOkResponse({
    description: 'ID 해당하는 멤버 반환',
    type: InfoMemberDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 멤버' })
  // main.ts -> enableImplicitConversion 설정으로  ParseIntPipe 미사용도 number
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<InfoMemberDto> {
    try {
      return await this.memberService.findOne(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        this.logger.error('알 수 없는 오류 발생', err);
        throw err;
      }
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'update Member', description: 'update Member' })
  @ApiCreatedResponse({
    description: '수정 Member 정보 반환',
    type: [InfoMemberDto],
  })
  @ApiConflictResponse({
    description: '수정 실패',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    try {
      return this.memberService.update(id, updateMemberDto);
    } catch (err) {
      if (err instanceof (BadRequestException || NotFoundException)) {
        throw err;
      } else {
        this.logger.error('알 수 없는 오류 발생', err);
        throw err;
      }
    }
  }

  @ApiOperation({ summary: 'delete Member', description: 'delete Member' })
  @ApiOkResponse({
    description: 'Member 삭제 성공',
  })
  @ApiInternalServerErrorResponse({
    description: '삭제 실패',
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return this.memberService.remove(id);
    } catch (err) {
      throw err;
    }
  }
}
