// src/pages/Chat/socket.js
import { Client } from '@stomp/stompjs';

const stompClient = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  reconnectDelay: 5000,
  debug: (str) => {
    console.log('[STOMP DEBUG]', str);
  },
});

export default stompClient;
