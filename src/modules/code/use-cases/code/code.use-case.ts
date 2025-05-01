import { Injectable } from '@nestjs/common';
import {
  QueryCodeRequest,
} from '../../requests';
import { CodeService } from 'src/services';

@Injectable()
export class CodeUseCase {
  constructor(
    private readonly educationService: CodeService,
  ) {}

  async findAll(query: QueryCodeRequest, type?: string, sortBy?: string) {
    return await this.educationService.findAll(query, type, sortBy);
  }

}
