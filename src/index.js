import React, { PureComponent } from 'react';
import {
  StatusBar,
  Navigator,
  AppRegistry,
  Dimensions,
  View,
} from 'react-native';
import App from './app';
const {width} = Dimensions.get('window');
global.WIDTH = width;

//非开发环境去掉log
if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {},
  };
}

class Assemble extends PureComponent {

    renderScene(route, navigator) {
        let Component = route.name;
        return (
          <Component navigator={navigator} route={route} />
        );
    }

    render() {
        return (
          <View style={{ flex: 1 }}>
            <StatusBar translucent={true} backgroundColor='transparent' />
            <Navigator
                initialRoute={{ name: App }}
                configureScene={(route) => Object.assign(Navigator.SceneConfigs.PushFromRight, { gestures: null })}
                renderScene={this.renderScene}
            />
          </View>
        )
    }
}

AppRegistry.registerComponent('CoshipAssemble', () => Assemble);
