// Types the messages from the server to the client, e.g. socket.emit('exampleEmit', { name: 'Rain', age: 21 })
export interface ServerToClientEvents {
  // exampleEmit: (data: ExampleEmitData) => void;
}

// Types the messages from the client to the server, e.g., socket.on('hello', () => {})
export interface ClientToServerEvents {
  //hello: () => void;
}

// Types the inter-server communication using io.serverSideEmit('ping')
export interface InterServerEvents {
  // ping: () => void;
}

// Types the socket.data attribute
export interface SocketData {
  // userId: string
}
