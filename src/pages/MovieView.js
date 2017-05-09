import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	View,
} from 'react-native';

import Banner from '../compoents/Banner';
import Loading from '../compoents/Loading';
import AppTop from '../compoents/AppTop';
import ScrollViewPager from '../compoents/ScrollViewPager';
import ContentView from './ContentView';

export default class extends PureComponent {
	state = {
		isRender:false,
		tablabel:[]
	}
	componentDidMount() {
		let body = `<GetRootContents 
          portalId="102" 
          account="long" 
          client="8757002164629739" 
          serviceType="MOD"
          languageCode="Zh-CN" 
          regionCode="1" 
          startAt="1" 
          profile="1.0" 
          maxItems="10" />`

		fetch(`${API.GetRootContents}?dataType=JSON`, {
			method: 'POST',
			headers: {'Content-Type': 'text/xml'},
			body: body
		})
		.then((response) => {
			if (response.ok) {
				return response.json()
			}
		})
		.then((data) => {
			if(data.totalResults>0){
				this.setState({
					tablabel:data.childFolder,
					isRender:true
				})
			}			
		})
		.catch((err) => {
			console.log(err)
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
