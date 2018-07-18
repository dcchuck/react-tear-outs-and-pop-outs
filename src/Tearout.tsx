declare var fin: any;
import * as React from 'react';

interface ITearoutState {
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    dragged: boolean;
    standalone: boolean;
}

export default class Tearout extends React.Component<{}, ITearoutState> {
    private minDragDistance: number;
    private childTearoutname: string;
    private childWin: any;
    private onOpenFin: boolean;

    constructor(props: {}) {
        super(props);
        this.minDragDistance = 500;
        this.onOpenFin = (typeof fin !== 'undefined');
        this.state = {
            dragged: false,
            standalone: false,
            xEnd: 0,
            xStart: 0,
            yEnd: 0,
            yStart: 0,
        }

        this.setDragStartLocation = this.setDragStartLocation.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.childTearoutname = 'child-tearout';
        if (this.onOpenFin) {
            const childWin = new fin.desktop.Window({
                autoShow: false,
                name: this.childTearoutname,
                url: '/tearout'
            }, () => {
                childWin.addEventListener('closed', () => {
                    this.setState({ dragged: false });
                })
                this.childWin = childWin;
            });
        }
    }

    public render() {
        // tslint:disable-next-line:no-console
        console.log(this)
        // tslint:disable-next-line:no-console
        console.log(this.onOpenFin);
        if (this.state.dragged) {
            return null
        } else {
            return (
                <div className="elements" >
                    <div
                        className="draggable-region"
                        draggable={true}
                        onDragStart={this.setDragStartLocation}
                        onDragEnd={this.endDrag}
                    />
                    {this.onOpenFin ? (this.state.standalone ? 'Close Me To Restore' : 'Drag Me!') : 'Launch Me On OpenFin!'}
                </div>
            )
        }
    }

    public componentDidMount() {
        if (this.onOpenFin) {
            const mainAppWindowName = fin.desktop.Application.getCurrent().getWindow().name;
            const thisWindowName = fin.desktop.Window.getCurrent().name;
            this.setState({ standalone: !(mainAppWindowName === thisWindowName) });
        }
    }

    public componentDidUpdate() {
        if (this.state.dragged) {
            this.childWin.showAt(this.state.xEnd, this.state.yEnd);
        }

        if (this.onOpenFin) {
            const childWin = new fin.desktop.Window({
                autoShow: false,
                name: this.childTearoutname,
                url: '/tearout'
            }, () => {
                childWin.addEventListener('closed', () => {
                    this.setState({ dragged: false });
                })
                this.childWin = childWin;
            });
        }
    }

    private setDragStartLocation(e: any) {
        this.setState({ xStart: e.screenX, yStart: e.screenY })
    }

    private endDrag(e: any) {
        const distance = Math.sqrt(
            Math.pow(e.screenX - this.state.xStart, 2) + Math.pow(e.screenY - this.state.yStart, 2)
        )

        this.setState({
            dragged: (distance > this.minDragDistance),
            xEnd: e.screenX,
            yEnd: e.screenY
        })
    }
}