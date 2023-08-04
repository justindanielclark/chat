import CustomError from "./CustomError";
class DatabaseNotInitializedError extends CustomError {
  public error_name: string = "PortInUseError";
  public constructor(occurrredInFilename: string, occurredInFunction: string) {
    super(
      "Database method called which requires initialization prior to initialization being completed.",
      occurredInFunction,
      occurrredInFilename,
    );
  }
}
export default DatabaseNotInitializedError;
