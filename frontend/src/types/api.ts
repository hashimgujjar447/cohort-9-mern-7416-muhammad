export interface ApiResponse<T = undefined> {
  note: any;
  success: boolean;
  message: string;
  data?: T;
}
