import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { SearchRoundDto } from './round/dto/search-round.dto'
import { RoundService } from './round/round.service'
import { ROUND_TYPE } from './round-type/enum/round-type.enum'
import { ROUND_DAY } from './round/enum/round.enum'
import { CreateAwardDto } from './award/dto/create-award.dto'

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
  @Cron('0 01 * * *')
  async roundTime(): Promise<any> {
    const toDay = new Date()
    this.logger.debug('Checked server time', toDay)
    const searchRoundDto = new SearchRoundDto()
    searchRoundDto.isEnabled = true
    searchRoundDto.isActive = true
    const { data } = await this.roundService.findAllAndPagination(searchRoundDto)

    if (data?.length > 0) {
      for (const round of data) {
        // ex. [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
        if (round.roundType.name === ROUND_TYPE.DAY) {
          const days = [
            ROUND_DAY.SUN,
            ROUND_DAY.MON,
            ROUND_DAY.TUE,
            ROUND_DAY.WED,
            ROUND_DAY.THU,
            ROUND_DAY.FRI,
            ROUND_DAY.SAT
          ]
          const dayName = days[toDay.getDay()]
          if (round.day.split(',').includes(`${dayName}`)) {
            // console.log(
            //   round.name +
            //     ' ' +
            //     round.roundType.name +
            //     ' : ' +
            //     dayName +
            //     ' : ' +
            //     round.day.split(',').includes(`${dayName}`)
            // )

            for (const exchange of JSON.parse(JSON.stringify(round.group.exchange))) {
              const createAwardDto = new CreateAwardDto()
              createAwardDto.number = ''
              createAwardDto.rewardDate = ''
              createAwardDto.startDate = ''
              createAwardDto.endDate = ''
              createAwardDto.exchangeId = exchange.id
              console.log(createAwardDto)
            }
          }
        }

        // ex. [1, 16, 17, 18, 19, 20]
        if (round.roundType.name === ROUND_TYPE.DATE) {
          const isDate = toDay.getDate()
          if (round.date.split(',').includes(`${isDate}`)) {
            // console.log(
            //   round.name +
            //     ' ' +
            //     round.roundType.name +
            //     ' : ' +
            //     isDate +
            //     ' : ' +
            //     round.date.split(',').includes(`${isDate}`)
            // )
          }
        }
      }
    }
  }
}
