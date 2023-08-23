type DatabaseActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      failure_id: string;
    };

type DatabaseActionResultWithReturnValue<T> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      failure_id: string;
    };

export { DatabaseActionResult, DatabaseActionResultWithReturnValue };
export default DatabaseActionResultWithReturnValue;
