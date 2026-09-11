type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private level: LogLevel = 'info';

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.level];
  }

  private format(level: LogLevel, message: string, context?: any) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    });
  }

  debug(message: string, context?: any) {
    if (this.shouldLog('debug')) {
      console.debug(this.format('debug', message, context));
    }
  }

  info(message: string, context?: any) {
    if (this.shouldLog('info')) {
      console.info(this.format('info', message, context));
    }
  }

  warn(message: string, context?: any) {
    if (this.shouldLog('warn')) {
      console.warn(this.format('warn', message, context));
    }
  }

  error(message: string, error?: any, context?: any) {
    if (this.shouldLog('error')) {
      const errorDetails = error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error;

      console.error(this.format('error', message, { ...context, error: errorDetails }));
    }
  }
}

export const logger = new Logger();
