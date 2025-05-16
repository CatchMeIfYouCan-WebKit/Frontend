// src/pages/Chat/components/socket.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const stompClient = new Client({
    // SockJS factory 사용
    webSocketFactory: () => new SockJS('/ws'),
    reconnectDelay: 5000,
    debug: (str) => console.log('[STOMP]', str),
});

// export default instance
export default stompClient;
