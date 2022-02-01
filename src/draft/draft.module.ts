import { Module } from '@nestjs/common';
import { EpScraperModule } from 'src/ep-scraper/ep-scraper.module';
import { DraftController } from './draft.controller';

@Module({
  imports: [EpScraperModule],
  controllers: [DraftController]
})
export class DraftModule {
}
