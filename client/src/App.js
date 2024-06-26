import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Home';
import EditorPage from './Editor';
import Chat from './Chat';

function App() {
    return (
        <>
            <div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        success: {
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                    }}
                ></Toaster>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/editor/:roomId"
                        element={<EditorPage />}
                    ></Route>
                    <Route path="/os-check" element={<Navigate push to="/importCheck.html" />}></Route>
                    <Route path="/editor/:roomId/chat" element={<Chat />}></Route>

                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
