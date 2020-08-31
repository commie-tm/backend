import { AuthChecker } from "type-graphql";
import { GQLContext } from "./context-builder";
import * as jwt from 'jsonwebtoken';
import applicaitonConfig from '../../config.json';

export const authChecker: AuthChecker<GQLContext> = (
  { args, context, info, root },
  roles
) => {
  if (!context.jwt) return false;

  if (!jwt.verify(context.jwt, applicaitonConfig.JWT_SECRET)) {
    return false;
  }
  return true;
};
