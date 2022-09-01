import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { SearchRoundDto } from './round/dto/search-round.dto'
import { RoundService } from './round/round.service'
import { ROUND_TYPE } from './round-type/enum/round-type.enum'

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)
  constructor(
    @Inject(forwardRef(() => RoundService))
    private roundService: RoundService
  ) {}

  getHealthz(): string {
    return 'Lotto Service Online!'
  }

  // https://github.com/nestjs/schedule/blob/master/lib/enums/cron-expression.enum.ts
  @Cron('*/1 * * * *')
  async roundTime(): Promise<any> {
    this.logger.debug('Checked server time', new Date())
    const searchRoundDto = new SearchRoundDto()
    searchRoundDto.isEnabled = true
    searchRoundDto.isActive = true
    const { data } = await this.roundService.findAllAndPagination(searchRoundDto)

    if (data?.length > 0) {
      for (const round of data) {
        if (round.roundType.name === ROUND_TYPE.DAY) {
          console.log(round.name + ' ' + round.roundType.name)
        }

        if (round.roundType.name === ROUND_TYPE.DATE) {
          console.log(round.name + ' ' + round.roundType.name)
        }
      }
    }
  }
}
