import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from '@/pages/App';
import Notfound from '@/pages/Notfound'

const root = ReactDOM.createRoot(document.getElementById('root'));
const Root = props => {
    return (
        <HashRouter>
            <Routes>
                <Route path='404' element={<Notfound />} />
                <Route path='*' element={<App />} />
            </Routes>
        </HashRouter>
    )
}
root.render(<Root />);