import { Controller, Get, UseGuards } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Observable<{ hello: string }> {
    return of(this.appService.getHello());
  }
}
