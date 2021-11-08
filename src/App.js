import React, { useEffect, useState } from "react";
import { csv } from 'd3';

import logo from './assets/logo.png';

import { Layout, Row, Col } from 'antd';
import View2 from './views/View2';
import View3 from './views/View3';
// import View4 from './views/View4';
import View5 from './views/View5';
import View6 from './views/View6';
import BumpChart from './views/BumpChartView';

// import * as d3 from "d3";
import "./App.css";

const { Content } = Layout;

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greaterThenAge, setgreaterThenAge] = useState(1990);

  // useEffect(() => {
  //   csv("athlete_events.csv").then(data => {
  //     setData(data);
  //     setLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    const getClassDetails = async () => {
      try {
        const data = await csv("athlete_events_summer.csv");
        if (data.length > 0) {
          setData(data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
        return () => undefined;
    };
    getClassDetails();
  },[])

  function changeGreaterThenAge(value) {
    console.log(greaterThenAge)
    setgreaterThenAge(value);
  }
  
  const filteredData = data.filter(d=>d.year>greaterThenAge);

  return (
    <div>
      <div className='title' style={{margin: '20px 0'}}><img src={logo} width='70' style={{marginRight: '10px'}} />Olympics Insights<img src={logo} width='70' style={{marginLeft: '10px'}} /></div>
      {loading && <div>loading</div>}
      {!loading && 
        <Layout>
            <Row>
              <Col>              
                <Content style={{ height: 500, width: 750 }}>
                  <View2 data={data}/>
                </Content>
              </Col>
              <Col>              
                <Content style={{ height: 500, width: 750 }}>
                  <View6 data={data} />
                </Content>
              </Col>
            </Row>
            <Layout>
            </Layout>
            <Layout>
              <Content style={{ height: 550, width: 1500 }}>
                <View3 data={data}/>
              </Content>
            </Layout>
            {/*<Layout>*/}
            {/*  <Content style={{ height: 500, width: 750 }}>*/}
            {/*    <View4 changeGreaterThenAge={greaterThenAge}/>*/}
            {/*  </Content>*/}
            {/*</Layout>*/}
            <Layout>
              <Content style={{ height: 800, width: 750 }}>
                <View5 data={data} />
              </Content>
          </Layout>
          <Layout style={{ height: 2000 }}>
          <Layout>
            <Content style={{ height: 1000, width: 2000 }}>
              <BumpChart data={data}/>
            </Content>
          </Layout>
      </Layout>
        </Layout>
      }
</div>
  );
}

export default App;