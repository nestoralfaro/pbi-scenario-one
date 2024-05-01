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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';

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

const CustomTooltip = ({active, payload, label}) => {
  if (active && payload && payload.length) {
    const { arrow, closing, date, diff, stat } = payload[0].payload;
    return (
      <>
        {
          arrow === 'none'
          ?
            <Stat>
              <StatLabel>{label}</StatLabel>
              <StatNumber>${payload[0].value.toFixed(2)}</StatNumber>
              <StatHelpText>{stat}%</StatHelpText>
            </Stat>
          :
            <Stat>
              <StatLabel>{label}</StatLabel>
              <StatNumber>${payload[0].value.toFixed(2)}</StatNumber>
              <StatHelpText>
                <StatArrow type={arrow}/>
                {stat}%
              </StatHelpText>
            </Stat>
        }
      </>
    );
  }
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
  const [mostSigSpike1, setMostSigSpike1] = useState([]);
  const [mostSigSpike2, setMostSigSpike2] = useState([]);

  const fetchData = async (symbol, fromDate, toDate, setData, setPlottedData, setMostSigSpike) => {
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
      const closingPrices = data.chart.result[0].indicators.quote[0].close;
      const dates = data.chart.result[0].timestamp.map(d => timeStampSecToDate(d));
      const count = closingPrices.length;
      // const dataArray = [];
      // for(let i = 0; i < count; ++i) {
      //   dataArray.push({
      //     date: timeStampSecToDate(data.chart.result[0].timestamp[i]),
      //     closing: closingPrices[i].toFixed(2)
      //   });
      // }
      // setPlottedData(dataArray);
      setData(closingPrices);

      // const dataMap = new Map();
      // dataMap.set(dates[0], {amount: closingPrices[0], diff: 0, stat: 0, arrow: 'none'});
      // for (let i = 1; i < count; ++i) {
      //   const change = closingPrices[i] - closingPrices[i - 1];
      //   const percentage = (change/closingPrices[i - 1]) * 100;
      //   dataMap.set(
      //     dates[i],
      //     {
      //       amount: closingPrices[i],
      //       diff: change,
      //       stat: percentage.toFixed(2),
      //       arrow: percentage[i] > percentage[i - 1] ? 'increase' : 'decrease'
      //     }
      //   );
      // }

      let calcMostSigSpike = {date: dates[0], closing: closingPrices[0], diff: 0, stat: 0, arrow: 'none'};
      const priceChanges = [{date: dates[0], closing: closingPrices[0], diff: 0, stat: 0, arrow: 'none'}];
      for (let i = 1; i < count; ++i) {
        const change = closingPrices[i] - closingPrices[i - 1];
        const percentage = (change/closingPrices[i - 1]) * 100;
        priceChanges.push({
          date: dates[i],
          closing: closingPrices[i],
          diff: change,
          stat: percentage.toFixed(2),
          arrow: percentage > priceChanges[i - 1].stat ? 'increase' : 'decrease'
        });
        if (change > calcMostSigSpike.diff) {
          calcMostSigSpike = {
            date: dates[i],
            closing: closingPrices[i],
            diff: change,
            stat: percentage.toFixed(2),
            arrow: percentage > priceChanges[i - 1].stat ? 'increase' : 'decrease'
          };
        }
      }
      console.log();
      setPlottedData(priceChanges);
      setMostSigSpike(calcMostSigSpike);

      const key = 'pk-mhaKqaHjvYAWeRCTppFSSZwFetrQhEEEsgXFdQGqnuTGmPsO';
      const res = await fetch('https://api.pawan.krd/v1/chat/completions',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
          },
          body: JSON.stringify({
            model: "pai-001-light",
            temperature: 0.7,
            max_tokens: 256,
            messages: [
              { role: "user", content: `Provide with confidence, and in a couple of sentences an explanation for the significant price spike from the following closing prices for the company with stock symbol ${symbol}, and the most significant positive price spike of ${calcMostSigSpike.stat}% from the following closing price history: ${JSON.stringify(priceChanges.map(e => ({ date: e.date, price: e.closing })))}` },
            ]
          })
        }
      );
      const j = await res.json();
      console.log(j.choices[0].message);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleQuery1 = () => {
    fetchData(symbol1, fromDate1, toDate1, setData1, setPlottedData1, setMostSigSpike1);
  };

  const handleQuery2 = () => {
    fetchData(symbol2, fromDate2, toDate2, setData2, setPlottedData2, setMostSigSpike2);
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
                <Legend verticalAlign='top' height={36} iconType='plainline'/>
                <Line type="monotone" dot={false} dataKey="closing" stroke="#3182CE" activeDot={{ r: 8 }} />
                <ReferenceLine x={mostSigSpike1.date} stroke="#C05621" label="Spike"/>
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={plottedData2}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tick={<CustomizedAxisTick />} height={50} dataKey="date" label={{ value: 'Days', position: 'insideBottom', offset: -2 }} />
                <YAxis label={{ value: 'Closing Price', angle: -90, position: 'insideLeft' }}/>
                <Tooltip content={<CustomTooltip/>} />
                <Legend verticalAlign='top' height={36} iconType='plainline'/>
                <Line type="monotone" dot={false} dataKey="closing" stroke="#C05621" activeDot={{ r: 8 }} />
                <ReferenceLine x={mostSigSpike2.date} stroke="#3182CE" label="Spike"/>
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </SimpleGrid>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
