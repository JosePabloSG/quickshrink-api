import { Body, Controller, Ip, Post } from '@nestjs/common';
import { ClicksService } from './clicks.service';
import { CreateClickDto } from './dto/create-click.dto';

@Controller('clicks')
export class ClicksController {
  constructor(private readonly clicksService: ClicksService) {}

  @Post()
  async create(
    @Body() createClickDto: CreateClickDto,
    @Ip() ip: string,
    @Body('userAgent') userAgent: string,
  ) {
    createClickDto.ipAddress = ip;
    createClickDto.userAgent = userAgent;

    return await this.clicksService.registerClick(createClickDto);
  }
}
