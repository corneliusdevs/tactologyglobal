import { Field, InputType } from "@nestjs/graphql";
import { IsString, MinLength } from "class-validator";

@InputType()
export class LoginInput {
    @Field()
    @IsString()
    username: string

    @Field()
    @IsString()
    @MinLength(8)
    password: string; // Validations can be added based on requirements
}