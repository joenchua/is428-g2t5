import React, { Component } from 'react';
import './view7.css';
import ViolinChart2 from '../../charts/ViolinChart2';


export default class View7 extends Component {
    render() {
        const {data} = this.props;
        const width = 1000;
        const height = 1000;
        return (
            <div id='view7' className='pane'>
                <div className='header'>Violin Chart for Weight</div>
                <ViolinChart2 data={data} width={width} height={height} />
            </div>
        )
    }


}

