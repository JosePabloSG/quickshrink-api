import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('qr-codes')
@Controller('api/v1/qr-codes')
export class QrCodesController {}
