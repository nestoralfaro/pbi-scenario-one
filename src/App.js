// import React from 'react';
// import {
//   ChakraProvider,
//   Box,
//   Grid,
//   theme,
//   SimpleGrid,
// } from '@chakra-ui/react';
// import { ColorModeSwitcher } from './ColorModeSwitcher';
//
// function App() {
//   return (
//     <ChakraProvider theme={theme}>
//       <Grid minH="100vh" p={3}>
//         <ColorModeSwitcher justifySelf="flex-end" />
//         <SimpleGrid minH="100%" columns={2} spacing={10}>
//           <Box bg='aqua' height='80px'></Box>
//           <Box bg='gold' height='80px'></Box>
//         </SimpleGrid>
//       </Grid>
//     </ChakraProvider>
//   );
// }
//
// export default App;

import React, { useState } from 'react';
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

function App() {
  const [symbol1, setSymbol1] = useState('GLW');
  const [fromDate1, setFromDate1] = useState('2015-01-01');
  const [toDate1, setToDate1] = useState('2015-06-30');
  const [symbol2, setSymbol2] = useState('NVDA');
  const [fromDate2, setFromDate2] = useState('2015-01-01');
  const [toDate2, setToDate2] = useState('2015-06-30');
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const fetchData = async (symbol, fromDate, toDate, setData) => {
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
      setData(data.chart.result[0].indicators.quote[0].close);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleQuery1 = () => {
    fetchData(symbol1, fromDate1, toDate1, setData1);
  };

  const handleQuery2 = () => {
    fetchData(symbol2, fromDate2, toDate2, setData2);
  };

  return (
    <ChakraProvider theme={theme}>
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <SimpleGrid minH="100%" columns={2} spacing={10}>
          <Box>
            <Input placeholder="Symbol (Default: GLW)" value={symbol1} onChange={(e) => setSymbol1(e.target.value.toUpperCase())} mb={3} />
            <Input type="date" placeholder="From" value={fromDate1} onChange={(e) => setFromDate1(e.target.value)} mb={3} />
            <Input type="date" placeholder="To" value={toDate1} onChange={(e) => setToDate1(e.target.value)} mb={3} />
            <Button colorScheme="teal" onClick={handleQuery1}>Query</Button>
            <Text mt={5} fontWeight="bold">Symbol: {symbol1}</Text>
            <Text>Min Price: {data1.length > 0 ? Math.min(...data1).toFixed(2) : 'N/A'}</Text>
            <Text>Max Price: {data1.length > 0 ? Math.max(...data1).toFixed(2) : 'N/A'}</Text>
            <Text>Average Price: {data1.length > 0 ? (data1.reduce((acc, curr) => acc + curr, 0) / data1.length).toFixed(2) : 'N/A'}</Text>
          </Box>
          <Box>
            <Input placeholder="Symbol (Default: NVDA)" value={symbol2} onChange={(e) => setSymbol2(e.target.value.toUpperCase())} mb={3} />
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
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data1.map((price, index) => ({ t: index, c: price }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="c" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data2.map((price, index) => ({ t: index, c: price }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="c" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </SimpleGrid>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
