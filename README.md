# Scenario 1
You have been tasked with analyzing the security price movements of two companies, Corning, Inc. (*GLW* US) and Nvidia Corporation, Inc. (*NVDA* US) from 1/1/2015 to 6/30/2015. Please find pricing data.

Please use any data sources you see fit to find and analyze this data.

Using a programming language/framework/stack of your choice, achieve the following to the best of your ability:
- Calculate and report the min, max, and average closing price for each security over the period.
- Identify and report the most significant positive spike in the price. Please provide a possible explanation for the spike.
- Calculate the return on investment for 1,000 shares from 1/1/2015 to the date of any one significant price spike. You may choose either security for this exercise.
- Please create a data visualization using a medium of your choice to show the price moves and highlight any abnormal price moves.

## Implementation
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), [Chakra UI](https://v2.chakra-ui.com/docs/components), [Recharts](https://recharts.org/en-US/api), and an [Open Source ChatGPT-like LLM](https://github.com/PawanOsman/ChatGPT). The data is fetched from the free [Yahoo API](https://query1.finance.yahoo.com/v8/finance/chart/GLW?symbol=GLW&period1=1420070400&period2=1435622400&interval=1d) through [allOrigins](https://allorigins.win/) (for demo purposes only). Check it out [here](https://nestoralfaro.github.io/pbi-scenario-one/)!

## Available Commands
### `npm start`
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`
Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`
Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
