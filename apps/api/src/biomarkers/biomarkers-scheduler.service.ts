import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BiomarkersService } from './biomarkers.service';
import { Biomarker } from './biomarker.model';

@Injectable()
export class BiomarkersSchedulerService {
  private readonly logger = new Logger(BiomarkersSchedulerService.name);

  constructor(private readonly biomarkersService: BiomarkersService) {}

  // Run every 3 seconds using cron expression: */3 * * * * * (every 3 seconds)
  // Note: NestJS schedule uses 6-field cron (seconds, minutes, hours, day, month, weekday)
  @Cron('*/1 * * * * *')
  updateRandomBiomarkers() {
    const allBiomarkers = this.biomarkersService.getAllBiomarkers();

    if (allBiomarkers.length === 0) {
      return;
    }

    // Randomly select 20-40% of biomarkers to update
    const updateCount = Math.floor(
      allBiomarkers.length * (0.2 + Math.random() * 0.2),
    );
    const shuffled = [...allBiomarkers].sort(() => Math.random() - 0.5);
    const toUpdate = shuffled.slice(0, updateCount);

    const updated: Biomarker[] = [];

    for (const biomarker of toUpdate) {
      const newValue = this.generateRandomValue(biomarker);
      const measuredAt = new Date().toISOString();

      const updatedBiomarker = this.biomarkersService.updateBiomarkerValue(
        biomarker.id,
        newValue,
        measuredAt,
      );

      if (updatedBiomarker) {
        updated.push(updatedBiomarker);
      }
    }
  }

  private generateRandomValue(biomarker: Biomarker): number {
    const { min, max } = biomarker.referenceRange;
    const range = max - min;

    // Generate value that can be within or outside reference range
    // 70% chance to be within range, 30% chance to be outside
    const withinRange = Math.random() < 0.7;

    if (withinRange) {
      // Value within reference range
      const variance = range * 0.1; // Small variance within range
      const base = min + range / 2;
      const value = base + (Math.random() - 0.5) * variance * 2;
      return Number(Math.max(min, Math.min(max, value)).toFixed(2));
    } else {
      // Value outside reference range (high or low)
      const isHigh = Math.random() < 0.5;
      if (isHigh) {
        // Value above max
        const excess = range * (0.1 + Math.random() * 0.3); // 10-40% above max
        return Number((max + excess).toFixed(2));
      } else {
        // Value below min
        const deficit = range * (0.1 + Math.random() * 0.3); // 10-40% below min
        return Number(Math.max(0, min - deficit).toFixed(2));
      }
    }
  }
}
