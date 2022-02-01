// import { Controller, Get } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { EPScrapePlayerService, PlayerCareerStatsResponse, PlayerSeasonStatsResponse } from './scrape-player.service';

// @Controller('player-stats')
// export class EpScraperController {

//     constructor(private playerStatService: EPScrapePlayerService) {}

//     @Get('/season')
//     public getPlayerStats(): Observable<PlayerSeasonStatsResponse> {
//         return this.playerStatService.getPlayerCareerStatsBySeason(`71913/leon-draisaitl`);
//     }

//     @Get('/career')
//     public getCareerPlayerStats(): Observable<PlayerCareerStatsResponse> {
//         return this.playerStatService.getPlayerCareerStats(`71913/leon-draisaitl`);
//     }

//     @Get('/career')
//     public getDraftClass(): Observable<PlayerCareerStatsResponse> {
//         return this.playerStatService.get(`71913/leon-draisaitl`);
//     }
// }
