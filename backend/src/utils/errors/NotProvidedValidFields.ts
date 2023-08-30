import CustomError from "./CustomError";
class NotProvidedValidFields extends CustomError {
  public error_name: string = "NotProvidedValidFieldsError";
  public constructor(occurrredInFilename: string, occurredInFunction: string) {
    super("Database method called without being provided the correct fields.", occurredInFunction, occurrredInFilename);
  }
}
export default NotProvidedValidFields;
