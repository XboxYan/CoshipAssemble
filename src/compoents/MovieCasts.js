import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';

const CastItem = (props) => (
    <TouchableOpacity style={styles.cast} activeOpacity={.8}>
        <View style={styles.head}>
            <Image style={styles.headImage} source={require('../../img/img01.png')} />
        </View>
        <Text numberOfLines={1} style={styles.castname}>詹妮弗·劳</Text>
    </TouchableOpacity>
)

export default class extends React.PureComponent {
    render(){
        const {data} = this.props;
        return(
            <View style={styles.conwrap}>
                <Text style={styles.title}>明星</Text>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {
                        data.map((el,i)=>(
                            <CastItem key={i} />
                        ))
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    conwrap: {
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec'
    },
    conHorizon: {
        flexDirection:'row',
        alignItems: 'center',
    },
    title:{
        paddingHorizontal: 10,
        fontSize:16,
        color:'#333',
        paddingBottom: 10,
    },
    cast:{
        width:80,
        paddingTop: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    head:{
        width:56,
        height:56,
        borderRadius:28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#f1f1f1',
        overflow:'hidden'
    },
    headImage:{
        width:56,
        height:56,
        resizeMode:'cover',
        borderRadius:28,
    },
    castname:{
        fontSize:14,
        color:'#333',
        paddingTop:12
    }
})