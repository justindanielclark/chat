class FailureToInitializeError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "FailureToInitializeError";
  }
}

export default FailureToInitializeError;
