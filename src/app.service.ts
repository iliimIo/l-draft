import { AwardService } from './award/award.service'
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { SearchRoundDto } from './round/dto/search-round.dto'
import { RoundService } from './round/round.service'
import { ROUND_TYPE } from './round-type/enum/round-type.enum'
import { ROUND_DAY } from './round/enum/round.enum'
import { CreateAwardDto } from './award/dto/create-award.dto'
import { generateKeywordAward, generateRoundRewardEndTime } from './common/utils/round'
import { formatRoundDate } from './common/utils/date'

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)
  constructor(
    @Inject(forwardRef(() => RoundService))
    private roundService: RoundService,
    @Inject(forwardRef(() => AwardService))
    private awardService: AwardService
  ) {}

  getHealthz(): string {
    return 'Lotto Service Online!'
  }

  // https://github.com/nestjs/schedule/blob/master/lib/enums/cron-expression.enum.ts
  @Cron('0 0 * * *')
  async roundTime(): Promise<any> {
    const isDayTz = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
    const toDay = new Date(new Date(isDayTz).getTime())
    this.logger.debug('Checked server time', toDay)

    const searchRoundDto = new SearchRoundDto()
    searchRoundDto.isEnabled = true
    searchRoundDto.isActive = true
    searchRoundDto.exchangeIsEnabled = true
    searchRoundDto.groupIsEnabled = true
    const { data } = await this.roundService.findAllAndPagination(searchRoundDto)

    if (data?.length > 0) {
      for (const round of data) {
        // ex. [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
        const daily = new Date(new Date(isDayTz).getTime())
        daily.setDate(daily.getDate() + 1)
        const nextDaily = new Date(new Date(isDayTz).getTime())

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
          const dayName = days[daily.getDay()]

          if (round.rewardDay.split(',').includes(`${dayName}`)) {
            for (const exchange of JSON.parse(JSON.stringify(round.group.exchange))) {
              if (!exchange.isEnabled) return
              const createAwardDto = new CreateAwardDto()
              createAwardDto.number = generateKeywordAward(exchange.quantity, exchange.type.digit)
              createAwardDto.rewardDate = formatRoundDate(nextDaily, round.rewardTime)
              createAwardDto.startDate = formatRoundDate(daily, '02:00:00')
              createAwardDto.endDate = formatRoundDate(nextDaily, generateRoundRewardEndTime(round.rewardTime))
              createAwardDto.exchangeId = exchange.id
              await this.awardService.create(createAwardDto)
            }
          }
        }

        // ex. [1, 16, 17, 18, 19, 20]
        if (round.roundType.name === ROUND_TYPE.DATE) {
          const isDate = new Date(new Date(isDayTz).getTime())
          isDate.setDate(daily.getDate() + 10)
          if (round.rewardDay.split(',').includes(`${isDate.getDate()}`)) {
            for (const exchange of JSON.parse(JSON.stringify(round.group.exchange))) {
              if (!exchange.isEnabled) return
              const createAwardDto = new CreateAwardDto()
              createAwardDto.number = generateKeywordAward(exchange.quantity, exchange.type.digit)
              createAwardDto.rewardDate = formatRoundDate(isDate, round.rewardTime)
              createAwardDto.startDate = formatRoundDate(toDay, '02:00:00')
              createAwardDto.endDate = formatRoundDate(isDate, generateRoundRewardEndTime(round.rewardTime))
              createAwardDto.exchangeId = exchange.id
              await this.awardService.create(createAwardDto)
            }
          }
        }

        // ex. every day
        if (round.roundType.name === ROUND_TYPE.EVERYDAY) {
          for (const exchange of JSON.parse(JSON.stringify(round.group.exchange))) {
            if (!exchange.isEnabled) return
            const createAwardDto = new CreateAwardDto()
            createAwardDto.number = generateKeywordAward(exchange.quantity, exchange.type.digit)
            createAwardDto.rewardDate = formatRoundDate(toDay, round.rewardTime)
            createAwardDto.startDate = formatRoundDate(toDay, '02:00:00')
            createAwardDto.endDate = formatRoundDate(toDay, generateRoundRewardEndTime(round.rewardTime))
            createAwardDto.exchangeId = exchange.id
            await this.awardService.create(createAwardDto)
          }
        }
      }
    }
  }
}
