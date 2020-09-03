import { Context } from "koa";
import applicationConfig from '../../config.json';
import { promises as fs } from 'fs'; 
import { join as pathJoin } from 'path';

export async function FrontendFallbackMiddleware(ctx: Context, next: () => Promise<void>): Promise<void> {
  try {
    await next();
    const status = ctx.response.status || 404;
    if (status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.response.status = err.status || 500;
    if (ctx.response.status === 404) {
      const file = await fs.readFile(pathJoin(applicationConfig.FRONTEND_PATH, 'index.html'));
      ctx.response.status = 200;
      ctx.response.body = file.toString();
      ctx.response.set('Content-Type', 'text/html');
    }
  }
}
