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

class ViewPagerChild extends PureComponent {
  state = {
    loaded:false
  }
  componentDidMount() {
    if (this.props.lazyload) {
      this.setState({
        loaded:true
      })
    }
  }
  componentWillUpdate(nextProps,nextState){
    if(nextProps.lazyload != this.props.lazyload && !this.state.loaded){
      this.setState({
        loaded:true
      })
    }
  }
  render(){
    let {loaded} = this.state;
    if (!loaded) {
      return <View style={[styles.content,__IOS__&&{width:WIDTH}]}><ActivityIndicator /></View>
    }
    return(
      <View style={[styles.content,__IOS__&&{width:WIDTH}]} >{this.props.child}</View>
    )
  }
}

export default class ViewPager extends PureComponent {
  PropTypes = {

  }
  constructor (props) {
    super(props)
    this.state = {
      pageIndex:props.initialPage
    }
  }

  componentWillUpdate(nextProps,nextState){

  }

  setPage = (pageIndex=0)=>{
    if(__IOS__){
      this.viewpager.scrollTo({x: pageIndex*WIDTH, y: 0, animated: true})
    }else{
      this.viewpager.setPage(pageIndex);
    }
    this.setState({pageIndex});
  }

  scrollEnd = (e)=>{
    const {onPageSelected} = this.props;
    const nativeEvent = e.nativeEvent;
    let pageIndex = this.state.pageIndex;
    if(__IOS__){
      let index = nativeEvent.contentOffset.x/WIDTH;
      if(pageIndex!=index){
        pageIndex = index;
        onPageSelected(pageIndex);
      }
    }else{
      pageIndex = nativeEvent.position;
      onPageSelected(pageIndex);
    }
    this.setState({pageIndex});
  }

  componentDidMount(){
    if(__IOS__){
      const {initialPage} = this.props;
      this.setPage(initialPage)
    }
  }

  render () {
    const {initialPage} = this.props;
    let {pageIndex} = this.state;
    return (
      <View style={[styles.content]}>
        {
          __IOS__?
          <ScrollView 
            ref={(viewpager)=>this.viewpager = viewpager}
            style={styles.content}
            bounces={false}
            onMomentumScrollEnd={this.scrollEnd}
            showsHorizontalScrollIndicator={false} 
            horizontal={true}
            pagingEnabled={true}
          >
            {
              React.Children.map(this.props.children,function(child,index){
                return <ViewPagerChild child={child} lazyload={pageIndex===index} />
              })
            }
          </ScrollView>
          :
          <ViewPagerAndroid 
            ref={(viewpager)=>this.viewpager = viewpager}
            style={styles.content}
            initialPage={initialPage}
            onPageSelected={this.scrollEnd}
          >
            {
              React.Children.map(this.props.children,function(child,index){
                return <ViewPagerChild child={child} lazyload={pageIndex===index}/>
              })
            }
          </ViewPagerAndroid>
        }
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex:1,
  },
  center:{
    alignItems:'center',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
})