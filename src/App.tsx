import * as React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Tearout from './Tearout';

function ContainedTearout() {
    return (
        <div className="flex-container">
            <Tearout />
        </div>
    )
}

function Home() {
    return (
        <div className="flex-container">
            <Tearout />
            <div className="elements">2</div>
            <div className="elements">3</div>
        </div>
    )
}

class App extends React.Component {
    public render() {
        return (
            <div>
                <Route exact={true} path='/' component={Home} />
                <Route exact={true} path='/tearout' component={ContainedTearout} />
            </div>
        );
    }
}

export default App;
