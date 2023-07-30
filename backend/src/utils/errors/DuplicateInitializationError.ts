class DuplicateInitializationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "DuplicateInitializationError";
  }
}

export default DuplicateInitializationError;
