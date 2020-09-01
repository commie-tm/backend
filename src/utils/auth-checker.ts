import { AuthChecker } from "type-graphql";
import { GQLContext } from "./context-builder";
import * as jwt from 'jsonwebtoken';
import applicaitonConfig from '../../config.json';
import { AuthObject } from "./authenticator";

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

  return true;
};
