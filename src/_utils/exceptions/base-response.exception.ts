interface Response<T> {
  status?: number;
  message?: string;
  data?: T;
}

export class BaseResponse<T> {
  readonly status: number;
  readonly message: string;
  readonly data: T;

  constructor({ status, message, data }: Response<T>) {
    this.status = status || 200;
    this.message = message || 'Success';
    this.data = data || null;
  }
}
