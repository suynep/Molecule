import { io } from 'socket.io-client';

const url = 'http://localhost:5555';

export const socket = io(url, {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
});