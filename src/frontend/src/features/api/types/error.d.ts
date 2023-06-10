interface ResponseError {
  errors: Array<{ message: string; path: string[] | null }>;
  type: string;
}

export { ResponseError };
