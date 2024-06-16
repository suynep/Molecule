import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useState } from 'react';

const MyEditor = () => {

    let [editorValue, setEditorValue] = useState('print("Hello, World!")');
    let [opValue, setOpValue] = useState('');
    let [errVal, setErrVal] = useState('');
    let [language, setLanguage] = useState('python');

    console.log({message: editorValue});

    function handleCompileClick() {
        fetch('/someEndPoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: editorValue, language: language})
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
            <div>
                <select value={language} onChange={handleLanguageChange}>
                    {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <Editor
                    height='70vh'
                    language={language}
                    defaultValue={editorValue}
                    onChange={(value, event) => { setEditorValue(value) }}
                    theme='vs-dark'
                />
                <button onClick={() => { handleCompileClick(); }}>Compile</button>
            </div>
            <div className='op-wrapper'>
                <h3>{opValue}</h3>
            </div>
            <div className='err-wrapper'>
                <h3>{errVal}</h3>
            </div>
        </>
    );
};

export default MyEditor;