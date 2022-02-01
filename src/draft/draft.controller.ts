import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { EPScrapeDraftService, DraftedPlayer } from 'src/ep-scraper/scrape-draft.service';

@Controller('draft')
export class DraftController {

    constructor(private draftService: EPScrapeDraftService) { }

    @Get('/:year')
    public getDraftByYear(
        @Param('year') year,
        @Query('maxGpThreshold') maxGp = 40
    ): Observable<DraftedPlayer[]> {
        // year out of range
        if (year >= new Date().getFullYear()) {
            throw new HttpException(`${year} draft has not yet taken place.`, HttpStatus.BAD_REQUEST);
        }

        return this.draftService.getDraftClassByYear(year).pipe(
            map(players => {
                if (maxGp) {
                    return players.filter(p => p.gamesPlayed <= maxGp && p.gamesPlayed >= maxGp - 10);
                } else {
                    return players;
                }
            })
        );
    }

}
