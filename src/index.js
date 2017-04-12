import { AppRegistry } from 'react-native';
import App from './app';

//非开发环境去掉log
if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {},
  };
}

AppRegistry.registerComponent('CoshipAssemble', () => App);
