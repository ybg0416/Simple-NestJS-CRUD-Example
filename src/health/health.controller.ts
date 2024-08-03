import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly memory: MemoryHealthIndicator,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    // https://github.com/nestjs/terminus/releases/tag/10.0.0-beta.0 || https://docs.nestjs.com/recipes/terminus
    return this.health.check([
      () => this.prisma.pingCheck('prisma', this.prismaService),
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      () => this.http.pingCheck('swagger', 'http://localhost:3000/swagger'),
    ]);
  }
}
