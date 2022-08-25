import { Test, TestingModule } from '@nestjs/testing'
import { RoundTypeService } from './round-type.service'

describe('RoundTypeService', () => {
  let service: RoundTypeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundTypeService]
    }).compile()

    service = module.get<RoundTypeService>(RoundTypeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
