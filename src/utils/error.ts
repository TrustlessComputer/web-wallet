export const ERROR_CODE = {
  CONNECT_WALLET: '0',
};

export const ERROR_MESSAGE = {
  [ERROR_CODE.CONNECT_WALLET]: {
    message: 'Can not connect wallet.',
    desc: 'Can not connect wallet.',
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

export default WError;
