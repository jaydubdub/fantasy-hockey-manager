import { Controller, Get, Param, Query } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { EPScrapePlayerService, PlayerCareerStatsResponse, PlayerSeasonStatsResponse } from '../ep-scraper/scrape-player.service';


@Controller('stats')
export class PlayerController {

    constructor(private playerStatService: EPScrapePlayerService) {}

    @Get('/season/:playerId/:playerName')
    public getPlayerStats(
        @Param('playerId') playerId: string,
        @Param('playerName') playerName: string,
        @Query('league') league: string
    ): Observable<PlayerSeasonStatsResponse> {
        return this.playerStatService.getPlayerCareerStatsBySeason(`${playerId}/${playerName}`).pipe(
            map(results => {
                if (results.seasonStats.length && league) {
                    const seasonStats = results.seasonStats.filter(s => s.league.toLowerCase() === league.toLowerCase());
                    return { seasonStats };
                }
                return results;
            })
        );
    }

    @Get('/career/:playerId/:playerName')
    public getCareerPlayerStats(
        @Param('playerId') playerId: string,
        @Param('playerName') playerName: string
    ): Observable<PlayerCareerStatsResponse> {
        return this.playerStatService.getPlayerCareerStats(`${playerId}/${playerName}`);
    }

}
