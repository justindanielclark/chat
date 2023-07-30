import SocketConnection from "../../services/socketConnection";
export default function Page() {
  const socket = SocketConnection.getInstance();

  const handleButtonClick = () => {
    socket.emit("clientMessage", {
      date: new Date(),
      message: "I pushed a button",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        className="w-fit px-2 py-1 bg-green-700 text-white"
        onClick={handleButtonClick}
      >
        Click Me To Send Message
      </button>
    </div>
  );
}
