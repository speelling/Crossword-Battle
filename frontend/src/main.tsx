import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Register from './pages/Register';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});


createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
  <StrictMode>
    <Register/>
  </StrictMode>
  </ApolloProvider>
);
