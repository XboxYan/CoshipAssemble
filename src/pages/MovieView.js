import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	View,
} from 'react-native';

import fetchData from '../util/Fetch';

import Banner from '../compoents/Banner';
import Loading from '../compoents/Loading';
import AppTop from '../compoents/AppTop';
import ScrollViewPager from '../compoents/ScrollViewPager';
import ContentView from './Movie/ContentView';

export default class extends PureComponent {
	state = {
		isRender:false,
		tablabel:[]
	}
	componentDidMount() {
		fetchData('GetRootContents',{},(data)=>{
			if(data.totalResults>0){
				this.setState({
					tablabel:data.childFolder,
					isRender:true
				})
			}	
		})
	}
	render() {
		const { navigator } = this.props;
		const { tablabel,isRender } = this.state;
		return (
			<View style={styles.content}>
				<AppTop navigator={navigator} />
				{
					isRender?
					<ScrollViewPager
						bgColor='#fff'
						tabbarHeight={32}
						tabbarStyle={{ color: '#474747', fontSize: 16 }}
						tabbarActiveStyle={{ color: $.COLORS.mainColor }}
						tablineStyle={{ backgroundColor: $.COLORS.mainColor, height: 2 }}
						tablineHidden={false}
						navigator={navigator}>
						{
							tablabel.map((el,i)=>(
								<ContentView key={i} navigator={navigator} assetId={el.assetId} tablabel={el.displayName} />
							))
						}
					</ScrollViewPager>
					:
					<Loading />
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
})
