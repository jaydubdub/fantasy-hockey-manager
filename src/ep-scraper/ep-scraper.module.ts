import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EPScrapeDraftService } from './scrape-draft.service';
import { EPScrapePlayerService } from './scrape-player.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [EPScrapePlayerService, EPScrapeDraftService],
  exports: [EPScrapePlayerService, EPScrapeDraftService],
})
export class EpScraperModule {}
