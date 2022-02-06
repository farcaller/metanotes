import { StrictMode } from 'react';
import { AppRegistry } from 'react-native';

import App from './app/App';

const Root = () => (
  <StrictMode>
    <App />
  </StrictMode>
);

AppRegistry.registerComponent('main', () => Root);
AppRegistry.runApplication('main', {
  rootTag: document.getElementById('root'),
});
