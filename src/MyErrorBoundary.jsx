import React, {Component} from 'react';

export default class MyErrorBoundary extends Component{
    constructor(props){
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error){
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true }
    }

    render() {
        if(this.state.hasError){
            return <h1>Something went wrong</h1>
        }
        return this.props.children;
    }
}