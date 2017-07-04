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

storage.sync = {
	GetRootContents(params){
		let { id, resolve, reject } = params;
		fetchData('GetRootContents',{},(data)=>{
			if(data && data.totalResults>0){
				storage.save({
					key: 'GetRootContents',
					data: data.childFolder,
					expires: 1000
				});
				// 成功则调用resolve
          		resolve && resolve(data.childFolder);
			}else{
				reject && reject(new Error('data parse error'));
			}
		})
	}
}

export default class extends PureComponent {
	state = {
		isRender:false,
		tablabel:[]
	}
	componentDidMount() {
		storage.load({
			key:'GetRootContents',
			autoSync: true,
			syncInBackground: false,
		}).then(data => {
			this.setState({
				tablabel:data,
				isRender:true
			})
		}).catch(err => {
			console.warn(err);
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
		backgroundColor:'#f1f1f1'
	},
})
