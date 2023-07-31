import { error } from "console";

class CustomError extends Error {
  public error_name: string = "Custom Error";
  public occurredInFilename: string;
  public occurredInFunction: string;
  public constructor(message: string, occurredInFileName: string, occurredInFunction: string) {
    super(message);
    this.occurredInFilename = occurredInFileName;
    this.occurredInFunction = occurredInFunction;
  }
}
export default CustomError;
