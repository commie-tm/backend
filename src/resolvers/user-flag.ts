import { Resolver, Query, Arg } from "type-graphql";
import { Service } from "typedi";
import { UserFlag } from "../entities/user-flag";
import { LoggerProvider } from "../services/logger-provider";
import { User } from "../entities/user";

@Service()
@Resolver(UserFlag)
export class UserFlagResolver {
  public constructor(
    private readonly logger: LoggerProvider
  ) { }
  
  @Query(type => UserFlag)
  public async UserFlag(@Arg("username") username: string): Promise<UserFlag> {
    const userId = (await User.findOneOrFail({ username })).id;
    const flags = await UserFlag.findOne({ user: { id: userId } }, { relations: ['user'] });

    if (!flags) {
      this.logger.getLogger().error(`Cannot find flags for user: ${username}`);
      throw new Error('Cannot find user flags');
    }

    return flags;
  }
}