import React, { PureComponent,PropTypes  } from 'react';
import {
  StyleSheet,
  View,
  ViewPagerAndroid,
  ScrollView
} from 'react-native';

import Loading from '../compoents/Loading';

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
    return loaded?this.props.child:<Loading />
  }
}

export default class ViewPager extends PureComponent {
  //验证PropTypes
  static PropTypes = {
    initialPage:PropTypes.number,
    onPageSelected:PropTypes.func
  }
  //默认props
  static defaultProps = {
    initialPage:0,
    onPageSelected:()=>{}
  }
  constructor (props) {
    super(props)
    this.state = {
      pageIndex:props.initialPage
    }
  }

  componentWillUpdate(nextProps,nextState){

  }

  setPage = (pageIndex)=>{
    if(__IOS__){
      this.viewpager.scrollTo({x: pageIndex*$.WIDTH, y: 0, animated: true})
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
      let index = nativeEvent.contentOffset.x/$.WIDTH;
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
      this.setPage(initialPage);
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
              React.Children.map(this.props.children,(child,index)=>
                <View style={[styles.content,{width:$.WIDTH}]}><ViewPagerChild child={child} lazyload={pageIndex===index}/></View>
              )
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
              React.Children.map(this.props.children,(child,index)=>
                <View style={styles.content}><ViewPagerChild child={child} lazyload={pageIndex===index}/></View>
              )
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
})