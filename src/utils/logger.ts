import logger from 'loglevel';

const originalFactory = logger.methodFactory;

logger.methodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  const devider = ':';
  const name = loggerName && typeof loggerName === 'string' ? devider + loggerName : '';
  const prefix = `(Sundial${name}) => `;

  return (...messages) => {
    rawMethod(prefix, ...messages);
  };
};

logger.setDefaultLevel(logger.levels.INFO);

function setGlobalLevel(level: any) {
  Object.values(logger.getLoggers()).forEach(lg => {
    lg.setLevel(level);
  });
}

export { logger, setGlobalLevel };
