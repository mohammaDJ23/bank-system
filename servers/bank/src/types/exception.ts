export type Exception =
  | {
      message: string;
      statusCode: number;
      error: string;
    }
  | string;
