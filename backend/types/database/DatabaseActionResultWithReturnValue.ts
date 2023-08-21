type DatabaseActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      failure_id: number;
    };

type DatabaseActionResultWithReturnValue<T> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      failure_id: number;
    };

export { DatabaseActionResult, DatabaseActionResultWithReturnValue };
export default DatabaseActionResultWithReturnValue;
