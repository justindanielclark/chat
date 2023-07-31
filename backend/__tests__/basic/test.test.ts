describe("Jest Env is Working", () => {
  it("Is able to run a basic test case", () => {
    expect(1 + 1).toBe(2);
  });
  it("Recognizes Non-Truthy Values", () => {
    expect(false).toBe(false);
  });
  it("Can Run Mocks And Track Them", () => {
    const mockFn = jest.fn((i) => Math.pow(i, 2));
    for (let i = 0; i < 10; i += 2) {
      mockFn(i);
    }
    //Number of Calls
    expect(mockFn).toBeCalledTimes(5);
    //The First Argument of the First Call
    expect(mockFn.mock.calls[0][0]).toBe(0);
    //The First Argument of the Second Call
    expect(mockFn.mock.calls[1][0]).toBe(2);
    //...

    //The return value of the second call to the function was x, it was a number
    expect(mockFn.mock.results[1].value).toBe(4);
  });
});
