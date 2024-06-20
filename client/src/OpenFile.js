import React from 'react';


function buildFileSelector() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    return fileSelector;
}

const OpenFile = () => {
    const fileSelector = buildFileSelector();

    const handleFileSelect = (e) => {
        e.preventDefault();
        fileSelector.click();
        console.log(fileSelector.files)
    }

    return (
        <div>
            <button onClick={handleFileSelect}>Open File</button>
        </div>
    );
}

export default OpenFile;