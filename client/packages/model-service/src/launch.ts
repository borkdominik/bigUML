/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import * as net from "net";
import * as rpc from "vscode-jsonrpc/node.js";
import { URI } from "vscode-uri";
import { ModelServer } from "./model-server.js";

const JSON_SERVER_PORT = 5999;
const JSON_SERVER_HOST = "localhost";

const currentConnections: rpc.MessageConnection[] = [];

/**
 * Creates a socket-based RCP model server that acts as a facade to the Langium-based semantic model index (documents).
 *
 * @param services language services
 * @returns a promise that is resolved as soon as the server is shut down or rejects if an error occurs
 */
export function startModelServer(services: any, _workspaceFolder: URI): Promise<void> {
  const netServer = net.createServer((socket) => createClientConnection(socket, services));
  netServer.listen(JSON_SERVER_PORT, JSON_SERVER_HOST);
  netServer.on("listening", () => {
    const addressInfo = netServer.address();
    if (!addressInfo) {
      console.error("Could not resolve JSON Server address info. Shutting down.");
      close(netServer);
      return;
    } else if (typeof addressInfo === "string") {
      console.error(`JSON Server is unexpectedly listening to pipe or domain socket "${addressInfo}". Shutting down.`);
      close(netServer);
      return;
    }
    console.log(`[Model-Server]:Startup completed. Accepting requests on port:${addressInfo.port}`);
  });
  netServer.on("error", (err) => {
    console.error("JSON server experienced error", err);
    close(netServer);
  });
  return new Promise((resolve, reject) => {
    netServer.on("close", () => resolve(undefined));
    netServer.on("error", (error) => reject(error));
  });
}

/**
 * Create a new connection for an incoming client on the given socket. Each client gets their own connection and model server instance.
 *
 * @param socket socket connection
 * @param services language services
 * @returns a promise that is resolved as soon as the connection is closed or rejects if an error occurs
 */
async function createClientConnection(socket: net.Socket, services: any): Promise<void> {
  console.info(`[ModelServer] Starting model server connection for client: '${socket.localAddress}'`);
  const connection = createConnection(socket);
  currentConnections.push(connection);

  const modelServer = new ModelServer(connection, services.shared.model.ModelService);
  connection.onDispose(() => modelServer.dispose());
  socket.on("close", () => modelServer.dispose());

  connection.listen();
  console.info(`[ModelServer] Connecting to client: '${socket.localAddress}'`);

  return new Promise((resolve, rejects) => {
    connection.onClose(() => resolve(undefined));
    connection.onError((error) => rejects(error));
  });
}

/**
 * Creates an RPC-message connection for the given socket.
 *
 * @param socket socket
 * @returns message connection
 */
function createConnection(socket: net.Socket): rpc.MessageConnection {
  return rpc.createMessageConnection(new rpc.SocketMessageReader(socket), new rpc.SocketMessageWriter(socket), console);
}

/**
 * Closes the server.
 *
 * @param netServer server to be closed
 */
function close(netServer: net.Server): void {
  currentConnections.forEach((connection) => connection.dispose());
  netServer.close();
}
