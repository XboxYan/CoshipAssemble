import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';

import MovieView from './pages/MovieView';
import CommunityView from './pages/CommunityView';
import LiveView from './pages/LiveView';
import MeView from './pages/MeView';

import TabNavigator from 'react-native-tab-navigator';
import TabItem from './compoents/TabItem';

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
                    'icon':'movie',
                    'screen':<MovieView navigator={navigator} />
                },{
                    'label':'惠生活',
                    'flag':'Community',
                    'icon':'business',
                    'screen':<CommunityView navigator={navigator} />
                },{
                    'label':'同洲直播',
                    'flag':'Live',
                    'icon':'live-tv',
                    'screen':<LiveView navigator={navigator} />
                },{
                    'label':'我的',
                    'flag':'Me',
                    'icon':'person',
                    'screen':<MeView navigator={navigator} />
                }
            ]
        }
        this.state = {
             selectedTab:this.TabRoutes.routes[this.TabRoutes.initialRoute].flag
        };
    }
    
    tabhandle = (selectedTab)=>{
        this.setState({selectedTab})
    }
    render(){
        const {selectedTab} = this.state;
        const tabBarHeight = 48;
        return (
            <TabNavigator 
                tabBarShadowStyle={{height:0}}
                tabBarStyle={{ height: tabBarHeight,backgroundColor:'#fff' }}
                sceneStyle={{ paddingBottom: tabBarHeight,backgroundColor:'#f7f7f7' }}
            >
                {
                    this.TabRoutes.routes.map((el,i)=>
                        <TabNavigator.Item
                            key={i}
                            tabStyle = {{paddingBottom:0}}
                            onPress={()=>{this.tabhandle(el.flag)}}
                            selected={selectedTab === el.flag}
                            renderIcon={() => <TabItem height={tabBarHeight} icon={el.icon} active={selectedTab === el.flag} label={el.label} />}
                        >
                            {el.screen}
                        </TabNavigator.Item>
                    )
                }
            </TabNavigator>
        )
    }
}