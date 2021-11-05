import React, { useEffect, useState} from "react";

// import data from './data';
import { Layout } from 'antd';
import View1 from './views/View1';
import View5 from './views/View5';
import { csv } from "d3";

import * as d3 from "d3";
import "./App.css";

const { Content } = Layout;

function App() {
  const [data, setData] = useState([]);
  const [bubbleLoading, setBubbleLoading] = useState(false);

  useEffect(() => {
    const getClassDetails = async () => {
      try {
        const data = await csv("athlete_events_summer.csv");
        if (data.length > 0) {
          setData(data);
          setBubbleLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
      return () => undefined;
    };
    getClassDetails();
  }, [])

  return (
    <div>
      <div className='title'>Visualising Olympics Data</div>
      {bubbleLoading && <div>loading</div>}
      {!bubbleLoading &&
        <Layout style={{ height: 920 }}>
          <Layout>
            <Content style={{ height: 200, width: 300 }}>
              <View1 data={data} />
            </Content>
            <Content style={{ height: 400, width: 900 }}>
              <View5 data={data} />
            </Content>
          </Layout>
        </Layout>
      }
    </div>
  );
}

export default App;