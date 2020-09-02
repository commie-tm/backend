import { Context } from "koa";
import applicationConfig from '../../config.json';
import { promises as fs } from 'fs'; 
import { join as pathJoin } from 'path';

export async function FrontendFallbackMiddleware(ctx: Context, next: () => void): Promise<void> {
  if (ctx.response.status === 404) {
    const file = await fs.readFile(pathJoin(applicationConfig.FRONTEND_PATH, 'index.html'));
    ctx.response.status = 200;
    ctx.response.body = file.toString();
    ctx.response.set('Content-Type', 'text/html');
    next();
  }
}
