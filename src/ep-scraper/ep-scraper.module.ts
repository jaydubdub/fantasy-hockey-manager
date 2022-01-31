import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EpScraperController } from './ep-scraper.controller';
import { EPScrapePlayerService } from './scrape-player.service';

@Module({
  imports: [HttpModule],
  controllers: [EpScraperController],
  providers: [EPScrapePlayerService]
})
export class EpScraperModule {}
