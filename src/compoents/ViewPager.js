import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PropTypes,
  ViewPagerAndroid,
  ActivityIndicator,
  Dimensions,
  ScrollView
} from 'react-native';

const {width} = Dimensions.get('window');

export default class ViewPager extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  scrollEnd = ()=>{
    
  }

  render () {
    const {onPageSelected,initialPage,height} = this.props;
    return (
      <View style={[styles.content]}>
        {
          true?
          <ScrollView 
            style={styles.content}
            bounces={false}
            onMomentumScrollEnd={this.scrollEnd}
            showsHorizontalScrollIndicator={false} 
            horizontal={true}
            pagingEnabled={true}
          >
            {
              React.Children.map(this.props.children,function(child){
                return <View style={[styles.content,{width:width}]}>{child}</View>
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
                return <View style={styles.content}>{child}</View>
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