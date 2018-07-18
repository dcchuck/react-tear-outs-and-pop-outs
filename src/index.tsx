import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const AppWithRouter = () => {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    )
}

ReactDOM.render(
    <AppWithRouter />,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
