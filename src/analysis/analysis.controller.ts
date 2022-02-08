import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { PROSPECT_MAX_GP } from 'src/config/league.config';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {

    constructor(private analysisService: AnalysisService) {}

    @Get(':type/max-games')
    public getMaxGames(
        @Param('type') type: 'prospect' | 'farm',
        @Query('sort') sort = 'asc'
    ) {
        if (!type) {
            throw new HttpException('No `type` provided.  Please provide prospect or farm param', HttpStatus.BAD_REQUEST);
        }

        return this.analysisService.calculateRemainingGamesPlayed(type).pipe(
            map(players => {
                if (players.length) {
                    return sort === 'asc' ? players.sort((a,b) => a.gamesRemaining - b.gamesRemaining) : players.sort((a,b) => b.gamesRemaining - a.gamesRemaining);
                }

                return [];
            }),
            catchError(err => {
                console.log(err);
                switch(err.response.status) {
                    case 403:
                        throw new HttpException(`Request limit exceeded.  Oopsie.`,  HttpStatus.FORBIDDEN);
                    default:
                        throw new HttpException(`Unhandled exception has occured`,  HttpStatus.SERVICE_UNAVAILABLE);
                }
                
            })
        );
    }
}
