import React, { Component } from 'react';
import Select from "react-select";
// import "react-select/dist/react-select.css";
import './viewBumpChart.css';
import BumpChart from '../../charts/BumpChart';
import { components } from "react-select";

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

export default class viewBumpChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
          selectValue: [],
          filterOptions: [],
          data: [],
        };
    
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }
    handleDropdownChange(option) {
        // console.log("e.target.value:", e.target.value)
        this.setState((state) => {
            return {
                selectValue: option
        };
    });

    }
    componentWillReceiveProps = (nextProps) => {
        // console.log("hi", nextProps.data)
        if (nextProps.data !== this.props.data) {
        //   this.moveMap(nextProps.data)
        // console.log("Array:", Array.from(new Set(nextProps.data.flatMap(d => [d.NOC]))))
        var filterOptions = Array.from(new Set(nextProps.data.flatMap(d => [d.NOC]))).map(data=>({"value": data, "label": data}))
        this.setState({data: nextProps.data, filterOptions: filterOptions})
        }
      }
    

    render() {
        // const {data} = this.props;
        const width = 2000;
        const height = 1000;
        const countries = ["CHN", "IND", "USA", "GER", "FIN", "NOR", "ROU", "EST", "FRA", "MAR"]
        // console.log("options:", this.state.filterOptions)
        // console.log(countries)
        // console.log(data)
        // const allCountries = Array.from(new Set(data.flatMap(d => [d.NOC])))
        return (
            <div id='viewBumpChart' className='pane'>
                <div>
                    <Select name="filters"
                    placeholder="Filters"
                    value={this.state.selectValue}
                    options={this.state.filterOptions}
                    onChange={this.handleDropdownChange}
                    components={{
                        Option
                    }}
                    isMulti
                    />
                </div>
                {console.log("value:", this.state.selectValue)}
                <div className='header'>Medals Ranking</div>
                <BumpChart data={this.state.data} width={width} height={height} countries={this.state.selectValue.map(data=>data.value)}/>
            </div>
        )
    }
}