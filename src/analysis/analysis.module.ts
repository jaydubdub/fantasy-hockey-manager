import { Module } from '@nestjs/common';
import { EpScraperModule } from 'src/ep-scraper/ep-scraper.module';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  imports: [EpScraperModule],
  controllers: [AnalysisController],
  providers: [AnalysisService]
})
export class AnalysisModule {}
