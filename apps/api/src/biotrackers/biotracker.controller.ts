import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BiotrackersService } from './biotracker.service';
import { Biotracker } from './biotracker.model';

@Controller('api/patients/:id/biotrackers')
export class BiotrackersController {
  constructor(private readonly biotrackersService: BiotrackersService) {}

  @Get()
  getBiotrackers(
    @Param('id', ParseIntPipe) id: number,
    @Query('category') category?: string,
  ): Biotracker[] {
    return this.biotrackersService.getBiotrackers(id, category);
  }
}
