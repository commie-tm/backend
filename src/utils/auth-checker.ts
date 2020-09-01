import { AuthChecker } from "type-graphql";
import { GQLContext } from "./context-builder";
import * as jwt from 'jsonwebtoken';
import applicaitonConfig from '../../config.json';
import { AuthObject } from "./authenticator";
import { User } from "../entities/user";

export enum AuthRoles {
  ADMIN,
  MODERATOR,
  SELF
}

export const authChecker: AuthChecker<GQLContext, AuthRoles> = async ( { context }, roles ) => {
  if (!context.jwt) return false;
  if (!jwt.verify(context.jwt, applicaitonConfig.JWT_SECRET)) {
    return false;
  }

  const auth = jwt.decode(context.jwt) as AuthObject;
  const user = await User.findOne({ username: auth.username }, { relations: ['flags'] });
  if (!user) {
    return false;
  }

  if (roles.includes(AuthRoles.ADMIN)) {
    return user.flags.isAdmin;
  }
  if (roles.includes(AuthRoles.MODERATOR)) {
    return user.flags.isModerator;
  }
  if (roles.includes(AuthRoles.SELF)) {
    // We have already verified that the user is logged in
    return true;
  }

  return true;
};
