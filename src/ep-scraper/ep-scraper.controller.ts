import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EPScrapePlayerService, PlayerSeasonStatsResponse } from './scrape-player.service';

@Controller('ep-scraper')
export class EpScraperController {

    constructor(private playerStatService: EPScrapePlayerService) {}

    @Get('/player-stats')
    public getPlayerStats(): Observable<PlayerSeasonStatsResponse> {
        return this.playerStatService.getPlayerCareerStatsBySeason(`71913/leon-draisaitl`);
    }
}
