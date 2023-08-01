import CustomError from "./CustomError";
class ServerNameAlreadyExistsError extends CustomError {
  public error_name: string = "ServerNameAlreadyExistsError";
  public constructor(occurrredInFilename: string, occurredInFunction: string) {
    super("Cannot Call Function, Server Name Supplied Already In Use", occurredInFunction, occurrredInFilename);
  }
}
export default ServerNameAlreadyExistsError;
