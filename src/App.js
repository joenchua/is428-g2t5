import React, { useEffect, useState } from "react";
import { csv } from 'd3';

import logo from './assets/logo.png';

import { Layout, Row, Col } from 'antd';
import Loader from "react-loader-spinner";
import View1 from './views/View1';
import View2 from './views/View2';
import View3 from './views/View3';
// import View4 from './views/View4';
import View5 from './views/View5';
import View6 from './views/View6';
import View7 from './views/View7';

// import * as d3 from "d3";
import "./App.css";

const { Content } = Layout;

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
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
    getData();
  },[])

  return (
    <div>
      <div className='title' style={{margin: '20px 0'}}><img src={logo} alt="logo" width='70' style={{marginRight: '10px'}} />Olympics Insights<img src={logo} alt="logo" width='70' style={{marginLeft: '10px'}} /></div>
      {loading && <Loader type="Rings" color="#00BFFF" height={80} width={80} timeout={5000} />}
      {!loading && 
        <Layout>
            <Row>
              <Col span={12}>              
                <Content>
                  <View2 data={data} />
                </Content>
              </Col>
              <Col span={12}>              
                <Content>
                  <View6 data={data} />
                </Content>
              </Col>
            </Row>
            <Row>
              <Content>
                <View3 data={data}/>
              </Content>
            </Row>
            <Row>
              <Content>
                <View7 data={data}/>
              </Content>
            </Row>
            <Row>
              <Content>
                <View5 data={data} />
              </Content>
            </Row>
            <Row>
                <Content>
                  <View1 data={data}/>
                </Content>
            </Row>
      </Layout>
      }
</div>
  );
}

export default App;