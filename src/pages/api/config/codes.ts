export const EXCEPTION_USER = {
  NOT_LOGIN: {
    code: 1001,
    msg: 'not login',
  },
  NOT_FOUND: {
    code: 1002,
    msg: 'user is not exist',
  },
};

export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: 'publish failed',
  },
  UPDATE_FAILED: {
    code: 2002,
    msg: 'update failed',
  },
  NOT_FOUND: {
    code: 2003,
    msg: 'article non-exist',
  },
};

export const EXCEPTION_TAG = {
  FOLLOW_FAILED: {
    code: 3001,
    msg: 'subscribe/unsubscribe fail',
  },
};

export const EXCEPTION_COMMENT = {
  PUBLISH_FAILED: {
    code: 4001,
    msg: 'comment fail',
  },
};
