const socket = new WebSocket('ws://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const name = prompt('Enter your name');
appendMessage('You joined');
socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'new-user', name: name }));
});

socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'chat-message':
      appendMessage(`${data.name}: ${data.message}`);
      break;

    case 'user-connected':
      appendMessage(`${data.name} connected`);
      break;

    case 'user-disconnected':
      appendMessage(`${data.name} disconnected`);
      break;
  }
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.send(JSON.stringify({ type: 'send-chat-message', message: message }));
  messageInput.value = '';
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
