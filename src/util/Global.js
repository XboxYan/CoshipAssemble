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

global.Base = 'http://10.9.216.1:8080/';

global.$ = {
  STATUS_HEIGHT: STATUS_HEIGHT,
  COLORS:colors,
  WIDTH: width,
  HEIGHT: height,
  PixelRatio: PixelRatio.get(),
}

global.API = {
  Base:Base,
  GetRootContents:`${Base}GetRootContents`,//获取一级栏目
  GetAssociatedFolderContents:`${Base}GetAssociatedFolderContents`,//获取推荐栏目
}