import React, { useEffect, useState } from "react";
import { csv } from 'd3';

import { Layout } from 'antd';
import View1 from './views/View1';
import View5 from './views/View5';
// import data from '/athlete_events.csv';

// import * as d3 from "d3";
import "./App.css";

const { Content } = Layout;

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   csv("athlete_events.csv").then(data => {
  //     setData(data);
  //     setLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    const getClassDetails = async () => {
      try {
        const data = await csv("athlete_events.csv");
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

  return (
    <div>
      <div className='title'>Visualising Olympics Data</div>
      {loading && <div>loading</div>}
      {!loading && 
        <Layout style={{ height: 920 }}>
            <Layout>
              <Content style={{ height: 200, width: 300 }}>
                <View1 data={data}/>
              </Content>
            </Layout>
            <Layout>
              <Content style={{ height: 500, width: 750 }}>
                <View5 data={data}/>
              </Content>
            </Layout>
        </Layout>
      }
</div>
  );
}

export default App;