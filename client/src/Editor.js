import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useState, useRef } from 'react';
import './Editor.css';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { blueGrey, yellow } from '@mui/material/colors';
import Drawer from './SelectComponent';
import LogoComponent from './LogoComponent';
import { socket } from './socket';
import { useLocation } from 'react-router-dom';
import OpenFile from './OpenFile';


const MyEditor = () => {

    let [editorValue, setEditorValue] = useState('print("Hello, World!")');
    let [opValue, setOpValue] = useState('');
    let [errVal, setErrVal] = useState('');
    let [language, setLanguage] = useState('python');
    let inpRef = useRef(null);
    let docOpRef = useRef(null);
    const state = useLocation().state;

    socket.on('searchDocs', (data) => {
        docOpRef.current.innerHTML = data;
    });

    socket.on('connect', () => {
        socket.emit('joinRoom', state.roomId, state.username);
    })

    socket.on('userJoined', (socketId) => {
        console.log('User joined with socket id: ', socketId);
    });

    socket.on('changedEditorValue', (val) => {
        console.log('editorvaluechanged')
        setEditorValue(val);
    });

    // useEffect(() => {
    //     socket.emit('changedEditorValue', editorValue, state.roomId);
    // }, [editorValue]);

    function searchDocs() {
        let searchQuery = inpRef.current.value;
        socket.emit('searchDocs', searchQuery, language);
        inpRef.current.value = '';
    }

    function searchDocsOnEnter(event) {
        if (event.key === 'Enter') {
            searchDocs();
        }
    }

    function handleCompileClick() {
        fetch('/someEndPoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: editorValue, language: language })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                setOpValue(data.message);
                setErrVal(data.error);
            })
            .catch((error) => {
                // setErrVal(error);
                console.error('Error:', error);
            });
    }


    function handleLanguageChange(event) {
        setLanguage(event.target.value);
    }

    const languageOptions = [
        { value: 'python', label: 'Python' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'java', label: 'Java' },
        { value: 'c', label: 'C' },
        // Add more language options as needed
    ];


    return (
        <>
            <div className='whole-wrapper'>
                <div className='editor-header'>
                    <LogoComponent />
                    <Box className="lang-select-box" >
                        <FormControl >
                            <InputLabel id="demo-simple-select-label">Language</InputLabel>
                            <Select
                                labelId="lang-select"
                                id="lang-select"
                                value={language}
                                label="Select Language"
                                onChange={handleLanguageChange}
                            >
                                {languageOptions.map((option) => (
                                    <MenuItem value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <div className='divider'></div>
                    <OpenFile />
                    <Drawer className='menu-drawer' />
                </div>
                {/* <select value={language} onChange={handleLanguageChange}>
                    {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select> */}
                <div className='editor-op-wrapper'>
                    <Editor
                        height='70vh'
                        language={language}
                        defaultValue={editorValue}
                        value={editorValue}
                        onChange={(value, event) => { setEditorValue(value); socket.emit('changedEditorValue', value, state.roomId);}}
                        theme='vs-dark'
                        className='editor-wrapper'
                    />
                    <div className='op-err-wrapper'>
                        <div className='op-wrapper'>
                            <p className='op-text'>Output:</p>
                            <p>{opValue}</p>
                        </div>
                        <div className='err-wrapper'>
                            <p className='err-text'>Debug Info:</p>
                            <p>{errVal}</p>
                        </div>
                    </div>
                </div>
                <div className='editor-footer'>
                    <button className="compile-btn" onClick={() => { handleCompileClick(); }}>Compile</button>
                    <div className='docs-wrapper'>
                        <div className='doc-search'>
                            {/* <label htmlFor="Docs" className='search-dummy'>Search Keyword: </label> */}
                            <input type="text" name="docs" id="inp-search" onKeyDown={searchDocsOnEnter} ref={inpRef} />
                            <button className="compile-btn" onClick={searchDocs} type="button">SearchDocs</button>
                        </div>
                        <div className='doc-op-wrapper'>
                            <p ref={docOpRef}></p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default MyEditor;