import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  findAll(limit?: number, offset?: number) {
    return `This action returns all todo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
