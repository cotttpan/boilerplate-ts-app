import { h, Component } from 'preact';

interface S {
    count: number;
}

export default class App extends Component<void, S> {
    tid: any;
    state = { count: 0 };

    tick = () => this.setState({ count: this.state.count + 1 });

    componentDidMount() {
        this.tid = setInterval(this.tick, 1000);
    }
    compoenntWillUnMount() {
        clearTimeout(this.tid);
    }

    render(_: any, state: S) {
        return (
            <div>{state.count}</div>
        );
    }
}

