import '../../index';
import {
  StatusBar,
  PixelRatio,
  Platform,
  Dimensions
} from 'react-native';

const { width, height} = Dimensions.get('window');
const STATUS_HEIGHT = Platform.OS==='ios'?20:(Platform.Version>19?StatusBar.currentHeight:0);
//const STATUS_HEIGHT = Platform.OS==='ios'?20:0;
const colors = {
  mainColor:'#4aa3fe',
  subColor:'#a6a6a6'
}


global.$ = {
  STATUS_HEIGHT: STATUS_HEIGHT,
  COLORS:colors,
  WIDTH: width,
  HEIGHT: height,
  PixelRatio: PixelRatio.get(),
}