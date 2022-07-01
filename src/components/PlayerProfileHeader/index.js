import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { View, StatusBar, Text, Image, Animated, StyleSheet } from "react-native";
import {useRef} from 'react'
import { DARK_GREEN } from '../Variables';

const PlayerProfileHeader = ({children, playerObject}) => {
    let avatar = `https://sleepercdn.com/avatars/${playerObject.avatar}`;
    const opacity = useRef(new Animated.Value(0)).current;
    const firstRender = useRef(true);

    const fadeIn = () => {
        if(firstRender.current) {
            firstRender.current = false;
            return
        }
        Animated.timing(opacity,{
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const fadeOut = () => {
        Animated.timing(opacity,{
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    if(playerObject.avatar==null) avatar = `https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png`



    return(
        <View style={{flex:1}}>
        <HeaderImageScrollView
            useNativeDriver={true}
            maxHeight={200}
            minHeight={55}
            minOverlayOpacity={0}
            headerImage={require('../../../assets/Images/leagueHeader2.png')}
            renderFixedForeground={() => (
                <Animated.View style={[styles.navtitleView,{opacity}]}>
                    <Text style={styles.navTitle}>{playerObject.display_name}</Text>
                </Animated.View>
            )}
            renderForeground={() => (
                <View style={{flex:1,justifyContent:'flex-end',alignItems:'center',marginBottom:20}}>
                    <Image source={{uri: avatar}} style={{width:100, height:100, borderRadius:100,}} />
                    <Text style={{color:'white',fontSize:24, fontWeight:'bold',marginTop:10}}>{playerObject.display_name}</Text>
                </View>
            )}
        >
            <View style={{flex:1,backgroundColor:'#0B0D0F',minHeight:600}}>
                <TriggeringView onDisplay={() => fadeOut()} onBeginHidden={() => {fadeIn()}}>
                    {children}
                </TriggeringView>
            </View>
        </HeaderImageScrollView>
        </View>
    )
}

 
export default PlayerProfileHeader;

const styles = StyleSheet.create({
    navtitleView: {
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        opacity: 0,
    },
    navTitle: {
        color: 'white',
        fontSize: 18,
    }
});