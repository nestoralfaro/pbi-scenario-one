import React, { useState, PureComponent } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  SimpleGrid,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-5)" fontSize={12}>
          {payload.value}
        </text>
      </g>
    );
  }
}

const CustomTooltip = () => {
};

function App() {
  const [symbol1, setSymbol1] = useState('GLW');
  const [fromDate1, setFromDate1] = useState('2015-01-01');
  const [toDate1, setToDate1] = useState('2015-06-30');
  const [symbol2, setSymbol2] = useState('NVDA');
  const [fromDate2, setFromDate2] = useState('2015-01-01');
  const [toDate2, setToDate2] = useState('2015-06-30');
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [plottedData1, setPlottedData1] = useState([]);
  const [plottedData2, setPlottedData2] = useState([]);
  const [priceChanges1, setPriceChanges1] = useState([]);
  const [priceChanges2, setPriceChanges2] = useState([]);

  const fetchData = async (symbol, fromDate, toDate, setData, setPlottedData, setPriceChange) => {
    try {
      /* BE WARNED!
      * due to CORS from the query1.finance.yahoo API, I am querying through https://allorigins.win/.
      * ideally, I would fetch like:
      * -> const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?symbol=${symbol}&period1=${new Date(fromDate).getTime() / 1000}&period2=${new Date(toDate).getTime() / 1000}&interval=1d`);
      * from a reverse proxy server; however, since this is a temporary frontend friendly project, `allorigins` is enough.
      * again, I would be way more cautious implementing this approach on a production environment. 
      */
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?symbol=${symbol}&period1=${new Date(fromDate).getTime() / 1000}&period2=${new Date(toDate).getTime() / 1000}&interval=1d`)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      const data = JSON.parse(jsonData.contents);
      const count = data.chart.result[0].indicators.quote[0].close.length;
      const dataArray = [];
      for(let i = 0; i < count; ++i) {
        dataArray.push({
          date: timeStampSecToDate(data.chart.result[0].timestamp[i]),
          closing: data.chart.result[0].indicators.quote[0].close[i].toFixed(2)
        });
      }
      setPlottedData(dataArray);
      setData(data.chart.result[0].indicators.quote[0].close);
      const priceChanges = [];
      setPriceChange(priceChanges);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleQuery1 = () => {
    fetchData(symbol1, fromDate1, toDate1, setData1, setPlottedData1);
  };

  const handleQuery2 = () => {
    fetchData(symbol2, fromDate2, toDate2, setData2, setPlottedData2);
  };

  const timeStampSecToDate = (ts) => {
    // pass it as ms
    const convertedDate = new Date(ts * 1000);
    return `${convertedDate.getMonth() + 1}/${convertedDate.getDate()}/${convertedDate.getFullYear()}`;
  };

  return (
    <ChakraProvider theme={theme}>
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <SimpleGrid minH="100%" columns={2} spacing={10}>
          <Box>
            <Input placeholder="Symbol. Example: GLW" value={symbol1} onChange={(e) => setSymbol1(e.target.value.toUpperCase())} mb={3} />
            <Input type="date" placeholder="From" value={fromDate1} onChange={(e) => setFromDate1(e.target.value)} mb={3} />
            <Input type="date" placeholder="To" value={toDate1} onChange={(e) => setToDate1(e.target.value)} mb={3} />
            <Button colorScheme="teal" onClick={handleQuery1}>Query</Button>
            <Text mt={5} fontWeight="bold">Symbol: {symbol1}</Text>
            <Text>Min Price: {data1.length > 0 ? Math.min(...data1).toFixed(2) : 'N/A'}</Text>
            <Text>Max Price: {data1.length > 0 ? Math.max(...data1).toFixed(2) : 'N/A'}</Text>
            <Text>Average Price: {data1.length > 0 ? (data1.reduce((acc, curr) => acc + curr, 0) / data1.length).toFixed(2) : 'N/A'}</Text>
          </Box>
          <Box>
            <Input placeholder="Symbol. Example: NVDA)" value={symbol2} onChange={(e) => setSymbol2(e.target.value.toUpperCase())} mb={3} />
            <Input type="date" placeholder="From" value={fromDate2} onChange={(e) => setFromDate2(e.target.value)} mb={3} />
            <Input type="date" placeholder="To" value={toDate2} onChange={(e) => setToDate2(e.target.value)} mb={3} />
            <Button colorScheme="teal" onClick={handleQuery2}>Query</Button>
            <Text mt={5} fontWeight="bold">Symbol: {symbol2}</Text>
            <Text>Min Price: {data2.length > 0 ? Math.min(...data2).toFixed(2) : 'N/A'}</Text>
            <Text>Max Price: {data2.length > 0 ? Math.max(...data2).toFixed(2) : 'N/A'}</Text>
            <Text>Average Price: {data2.length > 0 ? (data2.reduce((acc, curr) => acc + curr, 0) / data2.length).toFixed(2) : 'N/A'}</Text>
          </Box>
        </SimpleGrid>
        <SimpleGrid minH="100%" columns={2} spacing={10}>
          <Box>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={plottedData1}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tick={<CustomizedAxisTick />} height={50} dataKey="date" label={{ value: 'Days', position: 'insideBottom', offset: -2 }} />
                <YAxis label={{ value: 'Closing Price', angle: -90, position: 'insideLeft' }}/>
                <Tooltip content={<CustomTooltip/>} />
                <Legend verticalAlign='top' height={36}/>
                <Line type="monotone" dot={false} dataKey="closing" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={plottedData2}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tick={<CustomizedAxisTick />} height={50} dataKey="date" label={{ value: 'Days', position: 'insideBottom', offset: -2 }} />
                <YAxis label={{ value: 'Closing Price', angle: -90, position: 'insideLeft' }}/>
                <Tooltip />
                <Legend verticalAlign='top' height={36}/>
                <Line type="monotone" dot={false} dataKey="closing" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </SimpleGrid>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
