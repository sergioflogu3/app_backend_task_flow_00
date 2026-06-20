export const apiResponse = (
  status: number,
  message: string,
  data?: any,
  error?: string
) => ({
  status,
  message,
  ...(data !== undefined && { data }),
  ...(error && { error }),
  timestamp: new Date().toISOString(),
});
