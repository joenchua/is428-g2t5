import React, { Component } from 'react';
import './view2.css';
import AreaChart from '../../charts/AreaChart';

export default class View2 extends Component {
    render() {
        const {data} = this.props;
        const width = 900;
        const height = 500;
        return (
            <div id='view2' className='pane'>
                <div className='header'>Area Chart for Gender</div>
                <AreaChart data={data} width={width} height={height} />
            </div>
        )
    }
}