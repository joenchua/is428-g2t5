import React, {Component} from 'react';
import draw from './vis';
import drawSubChart from './subchart';
// import '../view7.css';
// nimport {default as ReactSelect} from "react-select/dist/declarations/src/stateManager";
import {default as ReactSelect} from "react-select";

import {components} from "react-select";

export default class ViolinChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
        optionSelected: '',
        data: []
    };
  }

    componentDidMount() {
     // console.log("running here...");
     // console.log(this.props);
        draw(this.props.data.filter(d => d.Sport == 'Basketball' || d.Sport == 'Athletics' || d.Sport == 'Gymnastics'))
        drawSubChart(this.props.data);
    }

    componentDidUpdate(preProps) {
      // console.log("running here..2.");
      // console.log(this.state.data);
      // console.log(preProps);
        draw(this.state.data);
        // drawSubChart(this.props);
    }
    render() {


    //
    // console.log("i am here");
    // console.log(this.props);


    let handleChange = (selected) => {
        let currentSports = selected.map(x => x.value);
        // console.log(currentSports);
        // console.log(selected);
        this.setState(
            {
                optionSelected: selected,
                data: passData.filter(function (d) {
                    return currentSports.includes(d.Sport);
                }
            )
            })
        // console.log(this.state);
        //
    };

    let passData = this.props.data;
    let dataSport = new Set()
    // console.log(passData);

    for (let i = 0; i < passData.length; i++) {
        dataSport.add(passData[i].Sport);
    }
    let dataSportArray = Array.from(dataSport);
    let dataSportObject = [];

    for (let i = 0; i < dataSportArray.length; i++) {
        dataSportObject.push({
            "value": dataSportArray[i],
            "label": dataSportArray[i],
            "color": "#FF0000"
        });
    }
    // console.log(dataSport);
    // console.log(dataSportObject);

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

        return (


        <div >

             <ReactSelect
                defaultValue={[dataSportObject[0], dataSportObject[4], dataSportObject[8]]}
                options={dataSportObject}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                onChange={handleChange}
                components={{
                    Option
                }}
                allowSelectAll={true}
                value={dataSportObject.value}
            />
            <div>
            <div className='vis-ViolinChart' style = {{"float": "left"}}></div>
            <div style = {{"marginLeft": "750px"}}>
                <svg className='vis-subPhysicalChart'></svg>
            </div></div>


        </div>
    )
    }
}

