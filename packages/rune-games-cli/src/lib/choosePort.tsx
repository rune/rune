import isPortReachable from "is-port-reachable"

const RANDOM_PORT = 0

export async function choosePort(portsToTry: (number | undefined)[]) {
  for (const port of portsToTry) {
    if (
      typeof port === "number" &&
      !(await isPortReachable(port, { host: "localhost" }))
    ) {
      return port
    }
  }

  return RANDOM_PORT
}
