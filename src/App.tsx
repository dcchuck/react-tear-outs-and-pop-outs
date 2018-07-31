import * as React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Tearout from './Tearout';
import TearoutChildWithState from './TearoutChildWithState';

function TearoutChild() {
    return (
        <p>
            Tearout child elements via this.props.children
        </p>
    )
}

function DraggableElement(props: any) {
    return (
        <div
            className="draggable-region" {...props}
        />
    )
}

// TODO: create one element from the Tearout & TearoutChild

function ContainedTearout() {
    return (
        <div className="flex-container">
            <Tearout draggableElement={DraggableElement} childName='Unique-To-Child-Parent-Pair'>
                <TearoutChild />
            </Tearout>
        </div>
    )
}

function ContainedTearoutState() {
    return (
        <div className="flex-container">
            <TearoutChildWithState draggableElement={DraggableElement} childName='Can-Not-Repeat-In-Other-Pair'>
                <TearoutChild />
            </TearoutChildWithState>
        </div>
    )
}

function Home() {
    return (
        <div className="flex-container">
            <Tearout minDragDistance={200} draggableElement={DraggableElement} childName='Unique-To-Child-Parent-Pair'>
                <TearoutChild />
            </Tearout>
            <TearoutChildWithState draggableElement={DraggableElement} childName='Can-Not-Repeat-In-Other-Pair'>
                <TearoutChild />
            </TearoutChildWithState>
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
                <Route exact={true} path='/tearout-state' component={ContainedTearoutState} />
            </div>
        );
    }
}

export default App;
