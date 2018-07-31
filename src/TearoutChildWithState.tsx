declare var fin: any;
import * as React from 'react';

interface ITearoutState {
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    draggedOut: boolean;
    standalone: boolean;
    value: string;
}

interface ITearoutProps {
    minDragDistance?: number;
    draggableElement: (props: any) => JSX.Element;
}

export default class TearoutChildWithState extends React.Component<ITearoutProps, ITearoutState> {
    private minDragDistance: number;
    private childWin: any;
    private onOpenFin: boolean;
    private myBroadcastChannel: BroadcastChannel;

    constructor(props: ITearoutProps) {
        super(props);
        this.minDragDistance = this.props.minDragDistance || 200;
        this.onOpenFin = (typeof fin !== 'undefined');
        this.state = {
            draggedOut: false,
            standalone: false,
            value: 'Persist Me!',
            xEnd: 0,
            xStart: 0,
            yEnd: 0,
            yStart: 0
        }

        this.setDragStartLocation = this.setDragStartLocation.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.createChildWin = this.createChildWin.bind(this);
        this.myBroadcastChannel = new BroadcastChannel('child-tearout-state');
        this.myBroadcastChannel.onmessage = (m) => this.setState({ value: m.data.toString() })
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const draggableProps = {
            draggable: true,
            onDragEnd: this.endDrag,
            onDragStart: this.setDragStartLocation
        }

        if (this.state.draggedOut) {
            return (
                null
            )
        } else {
            return (
                <div className="elements" >
                    {this.state.standalone ?
                        null
                        :
                        <this.props.draggableElement {...draggableProps} />
                    }
                    <div>
                        <input onChange={this.handleChange} value={this.state.value} />
                    </div>
                    {this.state.value}
                    {this.props.children}
                </div>
            )
        }
    }

    public componentDidMount() {
        if (this.onOpenFin) {
            const mainAppWindowName = fin.desktop.Application.getCurrent().getWindow().name;
            const thisWindow = fin.desktop.Window.getCurrent();
            const thisWindowName = thisWindow.name;
            const standalone = !(mainAppWindowName === thisWindowName);
            if (!standalone) {
                this.createChildWin();
            } else {
                thisWindow.addEventListener('close-requested', () => {
                    this.myBroadcastChannel.postMessage(this.state.value);
                    thisWindow.close(true);
                })
            }
            this.setState({ standalone });
        }
    }

    private handleChange(e: any) {
        this.setState({ value: e.target.value });
    }

    private createChildWin() {
        // tslint:disable-next-line:no-console
        console.log('Child win called')
        const newChildWin = new fin.desktop.Window({
            autoShow: false,
            name: 'child-tearout-state',
            url: '/tearout-state'
        }, () => {
            this.childWin = newChildWin;
            newChildWin.addEventListener('closed', () => {
                this.setState({ draggedOut: false }, () => this.createChildWin());
            })
        }, (e: any) => {
            // tslint:disable-next-line:no-console
            console.log(`Error creating child window: ${e}`);
        })
    }

    private setDragStartLocation(e: any) {
        this.setState({ xStart: e.screenX, yStart: e.screenY })
    }

    private endDrag(e: any) {
        if (!this.state.standalone && this.onOpenFin) {
            const distance = Math.sqrt(
                Math.pow(e.screenX - this.state.xStart, 2) + Math.pow(e.screenY - this.state.yStart, 2)
            )

            if (distance > this.minDragDistance) {
                this.setState({
                    draggedOut: true,
                    xEnd: e.screenX,
                    yEnd: e.screenY
                }, () => {
                    if (this.onOpenFin) {
                        this.childWin.showAt(this.state.xEnd, this.state.yEnd, false, () => {
                            this.myBroadcastChannel.postMessage(this.state.value);
                        })
                    }
                })
            }
        }
    }
}