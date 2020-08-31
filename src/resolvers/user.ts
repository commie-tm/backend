import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { User, PublicUser } from "../entities/user";
import { UserInput } from "../inputs/user";

@Resolver(User)
export class UserResolver {
  @Mutation(type => User)
  public async addUser(@Arg("user") userInput: UserInput): Promise<User> {
    const user = User.create({
      ...userInput,
      createdAt: new Date()
    });
    await user.save();
    return user;
  }

  @Query(type => PublicUser)
  public async User(@Arg("username") username: string): Promise<PublicUser> {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");
    return {
      name: user.name,
      username: user.username,
      createdAt: user.createdAt
    }
  }
}