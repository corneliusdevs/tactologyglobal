import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

@InputType()
export class SubDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;
}

@InputType()
export class CreateDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => [SubDepartmentInput], { nullable: true })
  @ValidateIf((o, value) => value !== null && value !== undefined)
  @ArrayNotEmpty({ message: "subDepartments cannot be empty if provided" })
  @ArrayMinSize(1, {
    message: "subDepartments must contain at least one item",
  })
  @ValidateNested({ each: true })
  @Type(() => SubDepartmentInput)
  subDepartments: SubDepartmentInput[];
}
