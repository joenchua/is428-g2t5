import React, { Component, createRef} from 'react';
import draw from './vis';

export default class BubbleChart extends Component {

    constructor(props) {
        super(props)
        this.bubbleChart = createRef()
        this.state = {
            countries: [],
            selectedCountry: ""
        }
    }

    componentDidMount() {
        const countrySet = new Set()
        this.props.data.forEach(country => {
            if (country.Medal !== "NA")
                countrySet.add(country.NOC)
        })

        this.setState({ countries: Array.from(countrySet).sort(), selectedCountry: "LTU" })
        draw(this.props, this.bubbleChart.current, this.state.selectedCountry);
    }

    componentDidUpdate() {
        draw(this.props, this.bubbleChart.current, this.state.selectedCountry);
    }

    render() {
        return (
            <>
                <select value={this.selectedCountry} onChange={e => this.setState({ selectedCountry: e.target.value })}>
                    {
                        this.state.countries.map(country => <option key={country} value={country}>{country}</option>)
                    }
                </select>
                <div key={this.state.selectedCountry} className='vis-bubblechart' ref={this.bubbleChart} style={{ width: '500px', height: '600px', margin: 'auto' }} />
            </>
        )
    }
}

