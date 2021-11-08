import React, { Component } from 'react';
import './view6.css';
import BarChart from '../../charts/BarChart';

export default class View6 extends Component {
    render() {
        const {data} = this.props;
        const width = 900;
        const height = 500;
        return (
            <div id='view6' className='pane'>
                <div className='header'>Top 5 Countries </div>    
                {/* <div class="tooltip"></div> */}
                <BarChart data={data} width={width} height={height} />
            </div>
        )
    }
}