import CustomError from "./CustomError";
class ProcessEnvNotConfiguredError extends CustomError {
  public error_name: string = "ProcessEnvNotConfiguredError";
  public constructor(occurrredInFilename: string, occurredInFunction: string) {
    super(
      `Attempt to use process.env property without property being initialized:\nOccurred In File: ${occurrredInFilename}\nOccurred In Func: ${occurredInFunction}`,
      occurredInFunction,
      occurrredInFilename,
    );
  }
}
export default ProcessEnvNotConfiguredError;
