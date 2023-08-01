import CustomError from "./CustomError";
class PortAlreadyInUseError extends CustomError {
  public error_name: string = "PortInUseError";
  public constructor(occurrredInFilename: string, occurredInFunction: string) {
    super("Cannot Call Function, Port Supplied Already In Use", occurredInFunction, occurrredInFilename);
  }
}
export default PortAlreadyInUseError;
