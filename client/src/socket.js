import { io } from 'socket.io-client';

const url = 'httop://localhost:5555';

export const socket = io(url);