import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.todoService.findAll(+limit, +offset);
  }

  @Get('/date')
  findByDate(
    @Query('from') from?: number,
    @Query('to') to?: number,
    @Query('status') status?: boolean,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.todoService.findByDate(from, to, status, +limit, +offset);
  }
}
