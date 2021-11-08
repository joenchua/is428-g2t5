import React, { Component } from 'react';
import { Slider, Divider } from 'antd';
// import './view4.css';

const View4 = (props) => {
    function onChangeSilder(value) {
        props.changeGreaterThenAge(value);
    }

    return (
        <div id='view4' className='pane'>
            <div className='header'>Filter</div>
            <Divider />
            <h3>Year</h3>
            <Slider default={1990} onChange={onChangeSilder}/>
        </div>
    )
}

export default View4;