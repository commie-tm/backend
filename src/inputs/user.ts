import { InputType, Field } from "type-graphql";

@InputType()
export class UserInput {
  @Field()
  public username!: string;

  @Field()
  public name!: string;

  @Field()
  public password!: string;

  @Field()
  public email!: string;
}