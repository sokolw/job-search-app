export enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export type StatusType = Status.IDLE | Status.LOADING | Status.SUCCEEDED | Status.FAILED;
