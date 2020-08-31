import { Context } from "koa";

export interface GQLContext {
  jwt?: string;
}

export function buildContext(ctx: Context): GQLContext {
  return {
    jwt: ctx.request.headers["Authorization"]
  };
}