import { AppRegistry } from 'react-native';
import App from './app';

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {},
  };
}

AppRegistry.registerComponent('CoshipAssemble', () => App);
