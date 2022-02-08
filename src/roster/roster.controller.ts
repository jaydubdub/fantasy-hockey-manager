import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { FARM_ROSTER } from 'src/data/farm-roster';
import { PROSPECT_ROSTER } from 'src/data/prospect-roster';

@Controller('roster')
export class RosterController {

    @Get('/:type')
    public getRosterByType(
        @Param('type') type: 'farm' | 'prospect'
    ): any[] {
        if (type !== 'farm' && type !== 'prospect') {
            throw new HttpException('Invalid roster type provided', HttpStatus.BAD_REQUEST);
        }

        return type === 'farm' ? FARM_ROSTER :PROSPECT_ROSTER;
    }
}
