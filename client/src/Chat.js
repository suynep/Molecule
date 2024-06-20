import React, { useEffect } from "react";
import { useRef, createElement, useState } from "react";
import { socket } from './socket';
import './Chat.css';
import Drawer from './SelectComponent';
import { useLocation } from "react-router-dom";
import LogoComponent from "./LogoComponent";

const Chat = () => {
    // const form = document.getElementById('send_container');
    // const messageInput = document.getElementById('messageInput');
    // const messageContainer = document.querySelector(".container");

    const locationState = useLocation().state;

    let messageInpRef = useRef('');
    let [messageContainer, setMessageContainer] = useState([]);

    // var audio = new Audio('pep.mp3');

    const append = (message, position) => {
        setMessageContainer([...messageContainer, { element: message, position: position }]);

    }

    // form.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     const message = messageInput.value;
    //     append(`You: ${message}`, 'right');
    //     socket.emit('sendChat', message);
    //     messageInput.value = '';
    // })

    function handleSubmit(e) {
        e.preventDefault();
        const message = messageInpRef.current.value;
        append(`You: ${message}`, 'right');
        socket.emit('sendChat', message, locationState.username, locationState.roomId);
        messageInpRef.current.value = '';

    }

    // const name = prompt("Enter your name to chat") || 'anonymous';
    // socket.emit('new-user-joined', name);
    socket.on('connect', () => {
        socket.emit('join-chat', locationState.roomId, locationState.username);
    });

    useEffect(() => {
        socket.emit('join-chat', locationState.roomId, locationState.username);
        console.log(locationState.username, locationState.roomId);
    }, []);

    socket.on('user-joined', name => {
        append(`${name} joined the chat`, 'right');

    });

    socket.on('receive', data => {
        append(`${data.name}: ${data.message}`, 'left')
    });

    socket.on('left', name => {
        append(`${name} left the chat`, 'right')
    });

    socket.on('disconnect', () => {
        socket.emit('left-chat', locationState.username, locationState.roomId);
    });

    // let pending = true;

    // useEffect(() => {
    //     function beforeUnload(e) {
    //         socket.emit('left-chat', locationState.username, locationState.roomId);
    //         pending = false;
    //         if (!pending) return;
    //         e.preventDefault();
    //     }

    //     window.addEventListener('beforeunload', beforeUnload);

    //     return () => {
    //         window.removeEventListener('beforeunload', beforeUnload);
    //     };
    // }, [pending]);



    return (
        <>
            <div className='editor-header'>
                <LogoComponent roomId={locationState.roomId} username={locationState.username}/>
                <div className='divider'></div>
                <Drawer />
            </div>
            {/* <nav>
                <img className="logo" src="chat.png" alt="chat-logo" />
            </nav> */}
            <h1 className="title-text">Welcome to Molecule Chat</h1>
            <div className="container" >
                {messageContainer.map((message, position) => (
                    <div className={`message_box ${position}`}>
                        {message.element}
                    </div>
                ))}

                {/* <!-- <div class="message_box left">hi this is messege left</div>
                <div class="message_box right">hi this is messege right</div> --> */}
            </div >

            <div className="send">
                <form onSubmit={handleSubmit} id="send_container">
                    <input type="text" id="messageInput" ref={messageInpRef} />
                    <button className="btn" type="submit">Send</button>
                </form>
            </div>
        </>);
}

export default Chat;