const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

export const logger = {
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
  debug: (...args: unknown[]) => logLevel === 'debug' && console.log('[DEBUG]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args)
};