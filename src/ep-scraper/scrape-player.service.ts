import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import * as cheerio from 'cheerio'
import { map, Observable } from 'rxjs';

export type PlayerSeasonStats = {
    year: string;
    team: string;
    league: string;
    teamStatUrl: string;
    leagueStatUrl: string;
    regularSeason: {
        gamesPlayed: number;
        goals: number;
        assists: number;
        points: number;
        pim: number;
        plusMinus: number;
    };

    postSeason: {
        gamesPlayed: number | null;
        goals: number | null;
        assists: number | null;
        points: number | null;
        pim: number | null;
        plusMinus: number | null;
    };
}

export type PlayerSeasonStatsResponse = {
    seasonStats: PlayerSeasonStats[]
}

export type PlayerCareerLeagueStat = {
    league: string;
    leagueStatUrl: string;
    seasons: number;
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
    pim: number;
    plusMinus: number;
    postSeasonSeasons: number;
    postSeasonGoals: string | null;
    postSeasonAssists: string | null;
    postSeasonPoints: string | null;
    postSeasonPim: string | null;
    postSeasonPlusMinus: string | null;
}

export type PlayerCareerStatsResponse = {
    careerStats: PlayerCareerLeagueStat[];
}

const PLAYER_BASE_URL = `https://www.eliteprospects.com/player/`;

@Injectable()
export class EPScrapePlayerService {

    private _columnClassMap = new Map([
        ['gp', 'gamesPlayed'],
        ['g', 'goals'],
        ['a', 'assists'],
        ['tp', 'points'],
        ['pim', 'pim'],
        ['pm', 'plusMinus'],
    ])

    constructor(private http: HttpService) {}

    public getPlayerCareerStatsBySeason(playerPath: string): Observable<PlayerSeasonStatsResponse> {
        const seasonStats = [];
        return this.http.get(`https://www.eliteprospects.com/player/${playerPath}`).pipe(
            map(({ data }) => {
                const $ = cheerio.load(data);
                const playerTableRows = $(`table.player-stats tbody tr`);
                playerTableRows.each((idx, el) => {
                    let regularSeason = {};
                    let postSeason = {};
                    // Season column
                    const seasonCol = $(el).children('td.season')[0];
                    const season = $(seasonCol).text().trim();

                    // Team column
                    const teamCol = $(el).children('td.team')[0];
                    const teamColDetail = $(teamCol).find('a')[0];
                    const teamStatUrl = $(teamColDetail).attr('href');
                    const team = $(teamColDetail).text().trim();

                    // League Column
                    const leagueCol = $(el).children('td.league')[0];
                    const leagueColDetail = $(leagueCol).find('a')[0];
                    const leagueStatUrl = $(leagueColDetail).attr('href');
                    const league = $(leagueColDetail).text().trim();

                    // Regular season stats
                    const regularSeasonCols = $(el).children('td.regular');
                    if (regularSeasonCols.length) {
                        regularSeason = this.parseStatisticalColumns(regularSeasonCols, $);
                        // regularSeasonCols.each((i, ele) => {
                        //     const classMapName = $(ele).attr('class').split(' ')[1] || null;
                        //     if (classMapName) {
                        //         const text = $(ele).text().trim();
                        //         regularSeason[this._columnClassMap.get(classMapName) || i] = parseInt(text);
                        //     }
                        // })
                    }

                    // Postseason stats
                    const postSeasonCols = $(el).children('td.postseason');
                    if (postSeasonCols.length) {
                        postSeason = this.parseStatisticalColumns(postSeasonCols, $);
                        // postSeasonCols.each((i, ele) => {
                        //     const classMapName = $(ele).attr('class').split(' ')[1] || null;
                        //     if (classMapName) {
                        //         const text = $(ele).text().trim();
                        //         postSeason[this._columnClassMap.get(classMapName) ? `postSeason${this._columnClassMap.get(classMapName)[0].toUpperCase()}${this._columnClassMap.get(classMapName).substring(1)}` : i] = parseInt(text);
                        //     }
                                
                        // })
                    }

                    const seasonData = { season, team, teamStatUrl, leagueStatUrl, league, regularSeason, postSeason };
                    seasonStats.push(seasonData);
                });
                return { seasonStats };
            })
        );
    }

    // public getPlayerCareerStats(playerPath: string): Observable<PlayerCareerStatsResponse> {
    //     return this.http.get(`${PLAYER_BASE_URL}${playerPath}`).pipe(
    //         map(({ data}) = > {

    //         })
    //     )
    // }

    private parseStatisticalColumns(cols, cherrioContext): any {
        const $ = cherrioContext;
        let stats = {};
        cols.each((i, ele) => {
            const classMapName = $(ele).attr('class').split(' ')[1];
            if (classMapName) {
                const text = $(ele).text().trim();
                stats[this._columnClassMap.get(classMapName) || `unknownCol${i}`] = parseInt(text);
            }
        });
        console.log(stats)
        return stats;
    }

}
