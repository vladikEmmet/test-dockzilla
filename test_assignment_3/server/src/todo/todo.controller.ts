import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(
      @Query('limit') limit?:number,
        @Query('offset') offset?:number,
  ) {
    return this.todoService.findAll(+limit, +offset);
  }

  // @Get('date')
  // findOne(@Param('id') id: string) {
  //   return this.todoService.findOne(+id);
  // }

  // @Get('find/')
}
