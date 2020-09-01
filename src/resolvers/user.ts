import { Resolver, Mutation, Arg, Query, Authorized } from "type-graphql";
import { User, PublicUser, convertToPublicUser } from "../entities/user";
import { UserInput } from "../inputs/user";
import { Service } from "typedi";
import { LoggerProvider } from "../services/logger-provider";
import { hash } from 'bcrypt';
import { UserFlag } from "../entities/user-flag";
import { AuthRoles } from "../utils/auth-checker";
import { LoginResponse } from '../utils/authenticator';
import { compare } from 'bcrypt';
import { sign } from "jsonwebtoken";
import applicationConfig from '../../config.json';
import { UserAuthInput } from "../inputs/user-auth";

@Service()
@Resolver(User)
export class UserResolver {
  public constructor(
    private readonly logger: LoggerProvider
  ) {}

  @Mutation(type => PublicUser)
  public async addUser(@Arg("user") userInput: UserInput): Promise<PublicUser> {
    const userFlags = UserFlag.create({
      isAdmin: false,
      isModerator: false
    });
    await userFlags.save();

    const user = User.create({
      ...userInput,
      createdAt: new Date(),
      password: await hash(userInput.password, 8),
      flags: userFlags
    });
    await user.save()
    
    await UserFlag.update({ id: userFlags.id }, { user });

    return convertToPublicUser(user);
  }

  @Query(type => PublicUser)
  public async User(@Arg("username") username: string): Promise<PublicUser> {
    const user = await User.findOne({ username }, {
      relations: ['flags']
    });

    if (!user) {
      this.logger.getLogger().error(`User not found for requested username: ${username}`);
      throw new Error("User not found");
    }

    return convertToPublicUser(user);
  }

  @Mutation(type => PublicUser)
  @Authorized(AuthRoles.MODERATOR, AuthRoles.ADMIN)
  public async deleteUser(@Arg('username') username: string): Promise<PublicUser> {
    const user = await User.findOne({ username }, { relations: ['flags'] });

    if (!user) {
      this.logger.getLogger().error(`User not found for requested username: ${username}`);
      throw new Error("User not found");
    }

    await user.flags.remove();
    return convertToPublicUser(await user.remove());
  }

  @Query(type => LoginResponse)
  public async UserLogin(@Arg('userAuth') userAuth: UserAuthInput): Promise<LoginResponse> {
    const user = await User.findOne({ username: userAuth.username });

    if (!user) {
      this.logger.getLogger().error(`User not found for requested username: ${userAuth.username}`);
      throw new Error("User not found");
    }

    if (await compare(userAuth.password, user.password)) {
      return {
        jwt: sign({ username: user.username, }, applicationConfig.JWT_SECRET)
      };
    } else {
      this.logger.getLogger().info(`Authentication failed for user: ${userAuth.username}`);
      throw new Error(`Username and password do not match for username: ${userAuth.username}`);
    }
  }
}