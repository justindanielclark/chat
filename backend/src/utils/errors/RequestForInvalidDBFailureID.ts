import CustomError from "./CustomError";
class RequestForInvalidDBFailureIDError extends CustomError {
  public error_name: string = "RequestForInvalidDBFailureID";
  public constructor(occurrredInFilename: string, occurredInFunction: string) {
    super("Failure due to requesting an id that doesn't exist", occurredInFunction, occurrredInFilename);
  }
}
export default RequestForInvalidDBFailureIDError;
