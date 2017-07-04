import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import MovieView from './pages/MovieView';
import CommunityView from './pages/CommunityView';
import ChannelView from './pages/ChannelView';
import MeView from './pages/MeView';
import FamilyView from './pages/FamilyView';

import TabNavigator from 'react-native-tab-navigator';
import TabItem from './compoents/TabItem';

const IconMovie = ()=><Image style={styles.ico} source={require('../img/tabico01.png')} />;
const IconMovieActive = ()=><Image style={styles.ico} source={require('../img/tabico01_active.png')} />;
const IconCommunity = ()=><Image style={styles.ico} source={require('../img/tabico02.png')} />;
const IconCommunityActive = ()=><Image style={styles.ico} source={require('../img/tabico02_active.png')} />;
const IconLive = ()=><Image style={styles.ico} source={require('../img/tabico03.png')} />;
const IconLiveActive = ()=><Image style={styles.ico} source={require('../img/tabico03_active.png')} />;
const IconMe = ()=><Image style={styles.ico} source={require('../img/tabico04.png')} />;
const IconMeActive = ()=><Image style={styles.ico} source={require('../img/tabico04_active.png')} />;
const IconFamily = ()=><Image style={styles.ico} source={require('../img/tabico05.png')} />;
const IconFamilyActive = ()=><Image style={styles.ico} source={require('../img/tabico05_active.png')} />;
const IconTV = ()=><Image style={styles.ico} source={require('../img/tabico06.png')} />;
const IconTVActive = ()=><Image style={styles.ico} source={require('../img/tabico06_active.png')} />;


export default class Home extends PureComponent {
    constructor(props) {
        super(props);
        const { navigator } = props;
        //定义Tab
        this.TabRoutes = {
            initialRoute:0,
            routes:[{
                    'label':'影视',
                    'flag':'Movie',
                    'icon':<IconMovie/>,
                    'iconActive':<IconMovieActive/>,
                    'screen':<MovieView navigator={navigator} />
                },{
                    'label':'直播',
                    'flag':'Live',
                    'icon':<IconTV/>,
                    'iconActive':<IconTVActive/>,
                    'screen':<ChannelView navigator={navigator} />
                },{
                    'label':'互动直播',
                    'flag':'Family',
                    'icon':<IconLive/>,
                    'iconActive':<IconLiveActive/>,
                    'screen':<FamilyView navigator={navigator} />
                },{
                    'label':'智慧生活',
                    'flag':'Community',
                    'icon':<IconCommunity/>,
                    'iconActive':<IconCommunityActive/>,
                    'screen':<CommunityView navigator={navigator} />
                },{
                    'label':'个人',
                    'flag':'Me',
                    'icon':<IconMe/>,
                    'iconActive':<IconMeActive/>,
                    'screen':<MeView navigator={navigator} />
                }
            ]
        }
        this.state = {
             selectedTab:this.TabRoutes.routes[this.TabRoutes.initialRoute].flag
        };
    }

    async componentDidMount() {
    	 // do anything while splash screen keeps, use await to wait for an async task.
        await SplashScreen.hide();
    }

    tabhandle = (selectedTab)=>{
        this.setState({selectedTab})
    }
    render(){
        const {selectedTab} = this.state;
        const tabBarHeight = 48;
        return (
            <TabNavigator
                tabBarShadowStyle={{backgroundColor:'#ececec'}}
                tabBarStyle={{ height: tabBarHeight,backgroundColor:'#fff' }}
                sceneStyle={{ paddingBottom: tabBarHeight }}
            >
                {
                    this.TabRoutes.routes.map((el,i)=>
                        <TabNavigator.Item
                            key={i}
                            tabStyle = {{paddingBottom:0}}
                            onPress={()=>{this.tabhandle(el.flag)}}
                            selected={selectedTab === el.flag}
                            renderIcon={() => <TabItem height={tabBarHeight} icon={el.icon} iconActive={el.iconActive} active={selectedTab === el.flag} label={el.label} />}
                        >
                            {el.screen}
                        </TabNavigator.Item>
                    )
                }
            </TabNavigator>
        )
    }
}

const styles = StyleSheet.create({
  ico: {
    width: 24,
    height: 24,
  }
});
