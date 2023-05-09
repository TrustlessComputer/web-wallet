export const ERROR_CODE = {
  CONNECT_WALLET: '0',
  EMPTY_USER: '-1',
};

export const ERROR_MESSAGE = {
  [ERROR_CODE.CONNECT_WALLET]: {
    message: 'Can not connect wallet.',
    desc: 'Can not connect wallet.',
  },
  [ERROR_CODE.EMPTY_USER]: {
    message: 'Please reconnect wallet.',
    desc: 'Please reconnect wallet.',
  },
};

class WError extends Error {
  message: string;
  code: string;
  desc: string;
  constructor(code: string, desc?: string) {
    super();
    const _error = ERROR_MESSAGE[code];
    this.message = `${_error.message} (${code})` || '';
    this.code = code;
    this.desc = desc || _error?.desc;
  }
  getMessage() {
    return this.message;
  }
}

export const getErrorMessage = (error: unknown, name: string) => {
  let message = 'Something went wrong. Please try again later.';
  let desc = 'Something went wrong. Please try again later.';
  if (error instanceof WError) {
    message = error.getMessage();
    desc = error.desc;
  } else if (error instanceof Error && error.message) {
    message = error.message;
    desc = error.message;
  }
  console.error('Error: ', desc, name);
  return {
    message: `${message} [${name}]`,
    desc,
  };
};

export default WError;
