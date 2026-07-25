type ServiceResponse<
  T extends Record<string, unknown> = Record<string, never>,
> = {
  status: number;
  success: boolean;
  message: string;
} & Partial<T>;

export const serviceResponse = <
  T extends Record<string, unknown> = Record<string, never>,
>(
  status: number,
  success: boolean,
  message: string,
  data?: T,
): ServiceResponse<T> =>
  ({
    status,
    success,
    message,
    ...(data ?? {}),
  }) as ServiceResponse<T>;
