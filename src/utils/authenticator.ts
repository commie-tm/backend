import { ObjectType, Field } from "type-graphql";

export interface AuthObject {
  username: string;
  exp: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  public jwt!: string;
}