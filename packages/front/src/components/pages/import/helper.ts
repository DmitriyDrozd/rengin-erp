import * as R from 'ramda';

export const AVERAGE_CREATE_TIME = 5; // ms
export const rejectFn = R.reject(R.anyPass([R.isEmpty, R.isNil]));
