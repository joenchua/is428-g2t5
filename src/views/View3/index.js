import React, { Component } from 'react';
import './view3.css';
import ViolinChart from '../../charts/ViolinChart';
import {default as ReactSelect} from "react-select";


export default class View3 extends Component {
    render() {
        const {data} = this.props;
        const width = 1000;
        const height = 1000;
        return (
            <div id='view3' className='pane'>
                <div className='header'>Violin Chart for Height</div>
                <ViolinChart data={data} width={width} height={height} />
            </div>
        )
    }


}

