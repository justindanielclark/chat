export default function getPort(args: {
  portIfProcessEnvUninstantiated: number;
}): number {
  const port = process.env.PORT;
  if (port) {
    const parsedPort = parseInt(port);
    if (!isNaN(parsedPort)) {
      return parsedPort;
    }
  }
  return args.portIfProcessEnvUninstantiated;
}
