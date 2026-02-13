export interface CallCloudOptions<T> {
  name: string;
  data?: Record<string, unknown>;
  timeout?: number;
  transform?: (result: unknown) => T;
}

export async function callCloudFunction<T>(options: CallCloudOptions<T>): Promise<T> {
  const { name, data, timeout = 10000, transform } = options;

  const response = await wx.cloud.callFunction({
    name,
    data,
    config: {
      timeout,
    },
  });

  const result = response.result as T;
  return transform ? transform(result) : result;
}
