import { Service } from "typedi";
import Logger, { createLogger } from 'bunyan';
import { join as pathJoin } from 'path';

@Service()
export class LoggerProvider {
  private logger = createLogger({
    name: 'commie-backend',
    streams: [{
      level: 'info',
      stream: process.stdout
    }]
  });

  public getLogger(): Logger {
    return this.logger;
  }
}