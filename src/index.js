import React, { PureComponent } from 'react';
import {
  StatusBar,
  Navigator,
  AppRegistry,
  Dimensions,
  Platform,
  View,
} from 'react-native';
import App from './app';
const {width,height} = Dimensions.get('window');
//常用全局变量
global.WIDTH = width;
global.HEIGHT = height;
global.StatusBarHeight = Platform.OS==='ios'?20:(Platform.Version>19?StatusBar.currentHeight:0);

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
