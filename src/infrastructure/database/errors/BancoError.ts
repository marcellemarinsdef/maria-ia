export class BancoError extends Error {
  readonly code = "BANCO_ERROR";

  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);

    this.name = "BancoError";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}