import { Field, ID, InputType } from "@nestjs/graphql";
import { IsString, MinLength } from "class-validator";

@InputType()
export class UpdateDepartmentInput {
  @Field(() => ID)
  id: number;

  @Field()
  @IsString()
  @MinLength(2)
  name: string;
}