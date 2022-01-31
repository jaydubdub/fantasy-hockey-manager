import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EpScraperModule } from './ep-scraper/ep-scraper.module';

@Module({
	imports: [
		HttpModule,
		EpScraperModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
