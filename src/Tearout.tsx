declare var fin: any;
import * as React from 'react';

interface ITearoutState {
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    draggedOut: boolean;
    standalone: boolean;
}

interface ITearoutProps {
    minDragDistance?: number;
    draggableElement: (props: any) => JSX.Element;
}

export default class Tearout extends React.Component<ITearoutProps, ITearoutState> {
    private minDragDistance: number;
    private childWin: any;
    private onOpenFin: boolean;

    constructor(props: ITearoutProps) {
        super(props);
        this.minDragDistance = this.props.minDragDistance || 200;
        this.onOpenFin = (typeof fin !== 'undefined');
        this.state = {
            draggedOut: false,
            standalone: false,
            xEnd: 0,
            xStart: 0,
            yEnd: 0,
            yStart: 0,
        }

        this.setDragStartLocation = this.setDragStartLocation.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.createChildWin = this.createChildWin.bind(this);
        if (this.onOpenFin) {
            this.createChildWin();
        }
    }

    public render() {
        const draggableProps = {
            draggable: true,
            onDragEnd: this.endDrag,
            onDragStart: this.setDragStartLocation
        }

        if (this.state.draggedOut) {
            return null
        } else {
            return (
                <div className="elements" >
                    {this.state.standalone ?
                        null
                        :
                        <this.props.draggableElement {...draggableProps} />
                    }
                    {this.props.children}
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

    private createChildWin() {
        const newChildWin = new fin.desktop.Window({
            autoShow: false,
            name: 'child-tearout',
            url: '/tearout'
        }, () => {
            this.childWin = newChildWin;
            newChildWin.addEventListener('closed', () => {
                this.setState({ draggedOut: false }, () => this.createChildWin());
            })
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
                        this.childWin.showAt(this.state.xEnd, this.state.yEnd, false)
                    }
                })
            }
        }
    }
}