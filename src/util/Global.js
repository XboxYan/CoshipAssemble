import '../../index';
import {
  StatusBar,
  PixelRatio,
  Platform,
  Dimensions
} from 'react-native';

const { width, height} = Dimensions.get('window');
const STATUS_HEIGHT = Platform.OS==='ios'?20:(Platform.Version>19?StatusBar.currentHeight:0);

global.$ = {
  STATUS_HEIGHT: STATUS_HEIGHT,
  THEME_INDEX:0,
  WIDTH: width,
  HEIGHT: height,
  PixelRatio: PixelRatio.get(),
}