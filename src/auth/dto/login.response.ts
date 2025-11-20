import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
class UserInfo {
    @Field()
    username: string;

    @Field()
    id: number; 
}
@ObjectType()
export class LoginResponse {
    @Field()
    accessToken: string;

    @Field()
    expiresIn: number;

    @Field()
    user: UserInfo
}

