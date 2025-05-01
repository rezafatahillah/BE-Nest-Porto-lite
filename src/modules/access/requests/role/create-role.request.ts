import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';
import { IsExists } from 'src/middlewares/validators';

export class CreateRoleRequest {
  @ApiProperty({
    description: 'The role name',
    minLength: 3,
    maxLength: 50,
    type: String,
  })
  @IsString()
  @Length(3, 50, {
    message: 'Name has to be between 3 and 50 characters.',
  })
  public name!: string;

  @ApiProperty({
    type: [Number],
    description: 'The permissions id',
  })
  @ArrayMinSize(1)
  @IsArray()
  @IsExists('Permission', 'id', { each: true })
  public permissions: number[];
}
