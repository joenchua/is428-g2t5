import React, { Component } from 'react';
import draw from './vis';

export default class BubbleChart extends Component {

    constructor(props) {
        super(props)
        this.bubbleChart = React.createRef()
        this.state = {
            countries: [],
            selectedCountry: ""
        }
    }

    componentDidMount() {
        const countrySet = new Set()
        this.props.data.forEach(country => {
            countrySet.add(country.NOC)
        })

        this.setState({ countries: Array.from(countrySet).sort() })
        draw(this.props, this.bubbleChart.current, this.state.selectedCountry);
    }

    componentDidUpdate() {
        if (this.state.selectedCountry.length === 0)
            return

        draw(this.props, this.bubbleChart.current, this.state.selectedCountry);
    }

    render() {
        return (
            <>
                <select onChange={e => this.setState({ selectedCountry: e.target.value })}>
                    {
                        this.state.countries.map(country => <option key={country} value={country}>{country}</option>)
                    }
                </select>
                <div key={this.state.selectedCountry} className='vis-bubblechart' ref={this.bubbleChart} style={{width: '500px'}}/>
            </>
        )
    }
}

