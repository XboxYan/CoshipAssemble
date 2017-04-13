import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PropTypes,
  ViewPagerAndroid,
  ActivityIndicator,
  ScrollView
} from 'react-native';

export default class ViewPager extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render () {
    const {onPageSelected,initialPage,height} = this.props;
    return (
      <View style={[styles.content]}>
        {
          __IOS__?
          <ScrollView 
            style={styles.content}
            showsHorizontalScrollIndicator={false} 
            horizontal={true}
            pagingEnabled={true}
          >
            {
              React.Children.map(this.props.children,function(child){
                return <View style={[styles.content,{width:360}]}>{child}</View>
              })
            }
          </ScrollView>
          :
          <ViewPagerAndroid 
            style={styles.content}
            initialPage={initialPage}
            onPageSelected={onPageSelected}
          >
            {
              React.Children.map(this.props.children,function(child){
                return <View style={[styles.content,{width:360}]}>{child}</View>
              })
            }
          </ViewPagerAndroid>
        }
      </View>
      
    )
  }
}

ViewPager.PropTypes = {

}
const styles = StyleSheet.create({
  content: {
    flex:1
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
})