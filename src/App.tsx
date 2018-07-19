import * as React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Tearout from './Tearout';

function TearoutChild() {
    return (
        <p>
            Tearout child elements via this.props.children
        </p>
    )
}

function ContainedTearout() {
    return (
        <div className="flex-container">
            <Tearout>
                <TearoutChild />
            </Tearout>
        </div>
    )
}

function Home() {
    return (
        <div className="flex-container">
            <Tearout minDragDistance={200} />
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
