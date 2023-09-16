export default function Page() {
  return (
    <div className="">
      <form className="p-2 max-w-sm bg-red-200 mx-auto">
        <div>
          <h1 className="text-xl font-bold">Sign-In:</h1>
          <div className="flex flex-col">
            <label>Username:</label>
            <input type="text" name="" id="" />
          </div>
          <div className="flex flex-col">
            <label>Password:</label>
            <input type="text" name="" id="" />
          </div>
        </div>
        <hr className="border-black m-4" />
        <div className="w-full flex flex-col">
          <h1 className="text-xl font-bold">Sign-Up:</h1>
          <button className=" bg-green-400 p-2 rounded-lg mx-auto">
            Click Here To Sign-Up!
          </button>
        </div>
      </form>
    </div>
  );
}
