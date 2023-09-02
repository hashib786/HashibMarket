export class AppError extends Error {
  public status?: string;
  public isOprational: boolean;
  constructor(public message: string, public statusCode?: number) {
    super(message);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOprational = true;
  }
}
