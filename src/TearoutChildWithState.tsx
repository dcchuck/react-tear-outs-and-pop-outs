import * as React from 'react';

interface ITearoutChildWithStateState {
    value: string
}

export default class TearoutChildWithState extends React.Component<{}, ITearoutChildWithStateState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            value: 'Persist State'
        }
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (
            <div className='elements'>
                <div>{this.state.value}</div>
                <input onChange={this.handleChange} />
            </div>
        )
    }

    private handleChange(e: any) {
        this.setState({
            value: e.target.value
        });
    }
}