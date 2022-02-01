import { Module } from '@nestjs/common';
import { EpScraperModule } from 'src/ep-scraper/ep-scraper.module';
import { PlayerController } from './player.controller';

@Module({
  imports: [EpScraperModule],
  controllers: [PlayerController]
})
export class PlayerModule {}
