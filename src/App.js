import React from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  SimpleGrid,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <SimpleGrid minH="100%" columns={2} spacing={10}>
          <Box bg='aqua' height='80px'></Box>
          <Box bg='gold' height='80px'></Box>
        </SimpleGrid>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
