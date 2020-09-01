import { InputType, Field } from "type-graphql";

@InputType()
export class UserAuthInput {
  @Field()
  public username!: string;

  @Field()
  public password!: string;
}