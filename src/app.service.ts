import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHealthz(): string {
    return 'Lotto Service Online!'
  }
}
