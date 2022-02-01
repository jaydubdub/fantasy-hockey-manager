import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import * as cheerio from 'cheerio'
import { map, Observable } from 'rxjs';

export type DraftedPlayer = {
    round: number;
    selected: number;
    selectedBy: string;
    firstName: string;
    lastName: string;
    fullName: string;
    position: string;
    seasons: number;
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
    pim: number;
    playerProfileUrl:string;
}

export type DraftedPlayersResponse = {
    players: DraftedPlayer[];
}

const PLAYER_BASE_URL = `https://www.eliteprospects.com/draft/nhl-entry-draft/`;

@Injectable()
export class EPScrapeDraftService {

    private _columnClassMap = new Map([
        ['overall', 'selected'],
        ['team', 'selectedBy'],
        ['a', 'assists'],
        ['tp', 'points'],
        ['pim', 'pim'],
        ['seasons', 'seasons'],
        ['g', 'goals']
    ])

    constructor(private http: HttpService) {}

    public getDraftClassByYear(year: string): Observable<DraftedPlayer[]> {
        return this.http.get(`${PLAYER_BASE_URL}${year}`).pipe(
            map(({ data}) => {
                const players = [];

                const $ = cheerio.load(data);
                const rounds = $(`table.players tbody`);

                rounds.each((indx, el) => {
                    if ($(el).children('tr').length > 1) {
                        const playerRows = $(el).children('tr:not(.title)');
                        playerRows.each((i, row) => {
                            let detail: DraftedPlayer = {
                                round: indx,
                                selected: null,
                                selectedBy: null,
                                firstName: null,
                                lastName: null,
                                fullName: null,
                                position: null,
                                seasons: null,
                                gamesPlayed: null,
                                goals: null,
                                assists: null,
                                points: null,
                                pim: null,
                                playerProfileUrl: null
                            };

                            // Selected
                            const selectedCol = $(row).children('td.overall')[0];
                            detail.selected = parseInt($(selectedCol).text().trim().replace('#','')) || null;
        
                            // Team
                            const teamCol = $(row).children('td.team')[0];
                            detail.selectedBy = $(teamCol).text().trim() || null;
        
                            // Player
                            const playerCol = $(row).children('td.player').find('a')[0];
                            const playerTxt = $(playerCol).text().trim() || null;
                            const playerProfileUrl = $(playerCol).attr('href')|| null;
                            if (playerTxt) {
                                const [firstName, lastName, pos] = playerTxt.split(' ');
                                detail = { ...detail, firstName, lastName, fullName: `${firstName} ${lastName}`, position: pos ? pos.replace(')', '').replace('(', '') : null, playerProfileUrl }
                            }
        
                            // Seasons
                            const seasonsCol = $(row).children('td.seasons')[0];
                            detail.seasons = parseInt($(seasonsCol).text().trim()) || null;
        
                            // GP
                            const gpCol = $(row).children('td.gp')[0];
                            detail.gamesPlayed = parseInt($(gpCol).text().trim()) || null;
        
                            // Goals
                            const goalsCol = $(row).children('td.g')[0];
                            detail.goals = parseInt($(goalsCol).text().trim()) || null;
        
                            // Assists
                            const assistsCol = $(row).children('td.a')[0];
                            detail.assists = parseInt($(assistsCol).text().trim()) || null;
        
                            // Points
                            const pointsCol = $(row).children('td.tp')[0];
                            detail.points = parseInt($(pointsCol).text().trim()) || null;
        
                            // PIM
                            const pimCol = $(row).children('td.pim')[0];
                            detail.pim = parseInt($(pimCol).text().trim()) || null;
        
        
                            players.push(detail);
                        })
                    }
                });
                return players;
            })
        )
    }

    private parseDraftColumns(cols, cheerioContext): any {
        const $ = cheerioContext;
        let stats = {};
        cols.each((i, ele) => {
            const classMapName = $(ele).attr('class').split(' ')[1];
            if (classMapName) {
                const text: string = $(ele).text().trim();
                stats[this._columnClassMap.get(classMapName) || `unknownCol${i}`] = text.includes('.') ? parseFloat(text) : parseInt(text);
            }
        });
        return stats;
    }

}
