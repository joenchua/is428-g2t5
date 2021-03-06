import React, { Component } from 'react';
import BubbleChart from '../../charts/BubbleChart';
import './view5.css';
export default class View5 extends Component {
    render() {
        const {data} = this.props;
        const width = 800;
        const height = 700;

        return (
            <div id='view5' className='pane'>
                <div className='header'>Packed Bubbles Chart for each Event</div>
                <BubbleChart data={data} width={width} height={height} />
            </div>
        )
    }
}