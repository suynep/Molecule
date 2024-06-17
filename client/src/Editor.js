import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
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

// function BasicSelect() {
//     const [age, setAge] = React.useState('');

//     const languageOptions = [
//         { value: 'python', label: 'Python' },
//         { value: 'javascript', label: 'JavaScript' },
//         { value: 'java', label: 'Java' },
//         { value: 'c', label: 'C' },
//         // Add more language options as needed
//     ];
//     const handleChange = (event) => {
//         setAge(event.target.value);
//     };

//     return (
//         <Box sx={{ minWidth: 120 }}>
//             <FormControl fullWidth>
//                 <InputLabel id="demo-simple-select-label">Age</InputLabel>
//                 <Select
//                     labelId="demo-simple-select-label"
//                     id="demo-simple-select"
//                     value={age}
//                     label="Age"
//                     onChange={handleChange}
//                 >
//                     {languageOptions.map((option) => (
//                         <MenuItem value={option.value}>
//                             {option.label}
//                         </MenuItem>
//                     ))}
//                     {/* <MenuItem value={10}>Ten</MenuItem>
//                     <MenuItem value={20}>Twenty</MenuItem>
//                     <MenuItem value={30}>Thirty</MenuItem> */}
//                 </Select>
//             </FormControl>
//         </Box>
//     );
// }

// const theme = createTheme({
//     palette: {
//         primary: blueGrey,
//         secondary: yellow
//     },
// });

const MyEditor = () => {

    let [editorValue, setEditorValue] = useState('print("Hello, World!")');
    let [opValue, setOpValue] = useState('');
    let [errVal, setErrVal] = useState('');
    let [language, setLanguage] = useState('python');

    console.log({ message: editorValue });

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
                    <Drawer className='menu-drawer' />
                </div>
                {/* <select value={language} onChange={handleLanguageChange}>
                    {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select> */}
                <Editor
                    height='70vh'
                    language={language}
                    defaultValue={editorValue}
                    onChange={(value, event) => { setEditorValue(value) }}
                    theme='vs-dark'
                />
                <div className='editor-footer'>
                    <button className="compile-btn" onClick={() => { handleCompileClick(); }}>Compile</button>
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
            </div>
        </>
    );
};

export default MyEditor;