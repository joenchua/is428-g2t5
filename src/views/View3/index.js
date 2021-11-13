import React, { Component } from 'react';
import './view3.css';
import ViolinChart from '../../charts/ViolinChart';


export default class View3 extends Component {
    render() {
        const {data} = this.props;
        // const width = 1000;
        // const height = 1000;
        return (
            <div id='view3' className='pane'>
                <div className='header'>Violin Chart for Height</div>
                <ViolinChart data={data} />
            </div>
        )
    }


}

