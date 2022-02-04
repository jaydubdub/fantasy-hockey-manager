import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EpScraperModule } from './ep-scraper/ep-scraper.module';
import { PlayerModule } from './player/player.module';
import { DraftModule } from './draft/draft.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
	imports: [
		HttpModule,
		EpScraperModule,
		PlayerModule,
		DraftModule,
		AnalysisModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
