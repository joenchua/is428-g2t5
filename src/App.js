import React, { useEffect, useState } from "react";
import { csv } from 'd3';
import logo from './assets/logo.png';

import { Layout } from 'antd';
import View1 from './views/View1';
import View2 from './views/View2';
import View3 from './views/View3';
// import View4 from './views/View4';
import View5 from './views/View5';

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
      <div className='title'><img src={logo} width='70' style={{marginRight: '10px'}} />Olympics Insights<img src={logo} width='70' style={{marginLeft: '10px'}} /></div>
      {loading && <div>loading</div>}
      {!loading && 
        <Layout style={{ height: 2000, "float": "left" }}>
            {/* <Layout>
              <Content style={{ height: 200, width: 300 }}>
                <View1 data={data}/>
              </Content>
            </Layout> */}
            <Layout>
              <Content style={{ height: 550, width: 750 }}>
                <View2 data={data}/>
              </Content>
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
        </Layout>
      }
</div>
  );
}

export default App;