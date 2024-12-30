import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('urls')
@Controller('urls')
export class UrlsController {}
