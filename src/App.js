import React, { Component } from "react";

// import data from './data';
import { Layout } from 'antd';
import View1 from './views/View1';

import * as d3 from "d3";
import "./App.css";

const { Content } = Layout;

function App() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    d3.csv("/athlete_events.csv").then((d) => {
      setData(d);
      setLoading(false);
    });
    return () => undefined;
  }, []);

  return (
    <div>
      <div className='title'>Visualising Olympics Data</div>
      <Layout style={{ height: 920 }}>
          <Layout>
            <Content style={{ height: 200, width: 300 }}>
              <View1 data={data}/>
            </Content>
          </Layout>
      </Layout>
</div>
  );
}

export default App;