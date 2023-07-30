type ClientMessage = {
  message: string;
  date: Date;
};

interface ClientToServerEvents {
  clientMessage: (clientMessage: ClientMessage) => void;
}
export default ClientToServerEvents;
