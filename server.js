import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3000 });

const users = new Map();

wss.on('connection', ws => {
  console.log('users joined');

  ws.on('message', message => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'new-user':
        users.set(ws, data.name);
        broadcast({ type: 'user connected', name: data.name }, ws);
        break;

      case 'send message':
        broadcast({ type: 'chat-message', name: users.get(ws), message: data.message }, ws);
        break;
    }
  });

  ws.on('close', () => {
    const name = users.get(ws);
    users.delete(ws);
    if (name) {
      broadcast({ type: 'user-disconnected', name: name }, ws);
    }
    console.log(`Users ${name} deleted`);
  });
});

function broadcast(data, sender) {
  wss.clients.forEach(client => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

