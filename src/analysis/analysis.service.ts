import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { PROSPECT_ROSTER } from 'src/data/prospect-roster';
import { EPScrapePlayerService, PlayerCareerLeagueStat } from 'src/ep-scraper/scrape-player.service';
import { FARM_ROSTER } from 'src/data/farm-roster';
import { FARM_GOALIE_MAX_GP, FARM_MAX_GP, PROSPECT_MAX_GP } from 'src/config/league.config';

export interface IPlayerGpRemaining {
    name: string;
    gamesRemaining: number;
    playerUrl: string;
    draftYear: string;
}

@Injectable()
export class AnalysisService {

    constructor(private statScraper: EPScrapePlayerService) {}

    /**
     * Calculate Remaining Games Played
     * @description Returns the games played for each player based on their prospect / farm status and max GP threshold
     * @param gpMax {number} The threshold for maximum games played
     * @returns Observable<IPlayerGpRemaining[]>
     */
    public calculateRemainingGamesPlayed(type: 'prospect' | 'farm'): Observable<IPlayerGpRemaining[]> {
        const roster = type === 'prospect' ? PROSPECT_ROSTER : FARM_ROSTER;
        const playerCareerStatCalls: Observable<PlayerCareerLeagueStat> [] = roster.map(p => {
            return this.statScraper.getPlayerCareerStatsByLeague(p.url.replace(`https://www.eliteprospects.com/player/`, '') , 'NHL')
        });

        return forkJoin(playerCareerStatCalls).pipe(
            map((playerResponses: PlayerCareerLeagueStat[]): IPlayerGpRemaining[] => {

                const playerGpList = playerResponses.map((s, i) => {
                    return {
                        name: roster[i].name,
                        gamesRemaining: this.calcMaxGp(s, type, roster[i].position),
                        gamesPlayed: s?.regularSeason?.gamesPlayed || 0,
                        playerUrl: roster[i].url,
                        draftYear: roster[i].year
                    }
                });

                return playerGpList;
            })
        );
    }

    private calcMaxGp(season: PlayerCareerLeagueStat, type: 'prospect' | 'farm', position): number {
        if (!season) {
            return type === 'prospect' ? 
                PROSPECT_MAX_GP : 
                position === 'G' ? FARM_GOALIE_MAX_GP : FARM_MAX_GP
        }

        if (type === 'prospect') {
            const remaining = PROSPECT_MAX_GP - season?.regularSeason?.gamesPlayed || PROSPECT_MAX_GP;
            return remaining > 0 ? remaining : 0;
        } else {
            const remaining = (position === 'G' ? FARM_GOALIE_MAX_GP : FARM_MAX_GP) - season?.regularSeason?.gamesPlayed || position === 'G' ? FARM_GOALIE_MAX_GP : FARM_MAX_GP;
            return remaining > 0 ? remaining : 0;
        }
    }
}
