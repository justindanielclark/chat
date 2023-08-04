type DatabaseActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: boolean;
    };

type DatabaseActionResultWithReturnValue<T> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      error: boolean;
    };

export { DatabaseActionResult, DatabaseActionResultWithReturnValue };
export default DatabaseActionResultWithReturnValue;
