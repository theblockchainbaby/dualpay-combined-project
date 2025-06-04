const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('WebSocket server started on ws://localhost:8080');
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error.message);
});

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.send(JSON.stringify({ message: 'Hello from test server' }));
  ws.on('message', (message) => console.log('Received:', message));
  ws.on('close', () => console.log('Client disconnected'));
});

console.log('Test WebSocket script started');
