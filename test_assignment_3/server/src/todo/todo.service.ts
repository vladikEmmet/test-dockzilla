import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(limit?: number, offset?: number) {
    const client = await this.databaseService.getClient();
    try {
      let query = `
        SELECT * FROM Task_entity
        ORDER BY id
      `;

      const values: any[] = [];

      if (!isNaN(limit)) {
        if (
          typeof limit !== 'number' ||
          limit < 0 ||
          !Number.isInteger(limit)
        ) {
          throw new BadRequestException('Limit must be a non-negative integer');
        }

        query += ` LIMIT $${values.length + 1}`;
        values.push(Number(limit));
      }

      if (!isNaN(offset)) {
        if (
          typeof offset !== 'number' ||
          offset < 0 ||
          !Number.isInteger(offset)
        ) {
          throw new BadRequestException(
            'Offset must be a non-negative integer',
          );
        }

        query += ` OFFSET $${values.length + 1}`;
        values.push(Number(offset));
      }

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async findByDate(
    from?: number,
    to?: number,
    status?: boolean,
    limit?: number,
    offset?: number,
  ) {
    const client = await this.databaseService.getClient();
    try {
      let query = `
      SELECT * FROM Task_entity
      WHERE TRUE
    `;

      const values: any[] = [];

      if (from) {
        query += ` AND date >= TO_TIMESTAMP($${values.length + 1} / 1000.0)`;
        values.push(from);
      }

      if (to) {
        query += ` AND date <= TO_TIMESTAMP($${values.length + 1} / 1000.0)`;
        values.push(to);
      }

      if (status) {
        query += ` AND status = $${values.length + 1}`;
        values.push(status);
      }

      query += ` ORDER BY id`;

      if (!isNaN(limit)) {
        if (
          typeof limit !== 'number' ||
          limit < 0 ||
          !Number.isInteger(limit)
        ) {
          throw new BadRequestException('Limit must be a non-negative integer');
        }

        query += ` LIMIT $${values.length + 1}`;
        values.push(Number(limit));
      }

      if (!isNaN(offset)) {
        if (
          typeof offset !== 'number' ||
          offset < 0 ||
          !Number.isInteger(offset)
        ) {
          throw new BadRequestException(
            'Offset must be a non-negative integer',
          );
        }

        query += ` OFFSET $${values.length + 1}`;
        values.push(Number(offset));
      }

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async findByName(name: string) {
    const client = await this.databaseService.getClient();
    try {
      const query = `
        SELECT * FROM Task_entity
        WHERE name ILIKE $1
      `;

      const result = await client.query(query, [`%${name}%`]);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
