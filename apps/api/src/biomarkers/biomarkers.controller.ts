import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BiomarkersService } from './biomarkers.service';
import { Biomarker } from './biomarker.model';

@Controller('api/patients/:id/biomarkers')
export class BiomarkersController {
  constructor(private readonly biomarkersService: BiomarkersService) {}

  @Get()
  getBiomarkers(
    @Param('id', ParseIntPipe) id: number,
    @Query('category') category?: string,
  ): Biomarker[] {
    return this.biomarkersService.getBiomarkers(id, category);
  }
}
