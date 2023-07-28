export default function getPort(defaultPort: number): number {
  const port = process.env.PORT;
  if (port) {
    const parsedPort = parseInt(port);
    if (!isNaN(parsedPort)) {
      return parsedPort;
    }
  }
  return defaultPort;
}
