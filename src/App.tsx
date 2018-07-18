import * as React from 'react';
import './App.css';

class App extends React.Component {
    public render() {
        return (
            <div>
                <div className="flex-container">
                    <div>
                        <div className="draggable-region" draggable={true} />
                        111
                    </div>
                    <div>2</div>
                    <div>3</div>
                </div>
            </div>
        );
    }
}

export default App;
