export interface ICustomResponseInterceptor {
  success: boolean;
  code: number;
  data: any;
}
