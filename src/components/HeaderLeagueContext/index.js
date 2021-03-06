import { createContext, useRef, useState, useEffect } from "react"
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { View, StatusBar, Text, Image, Animated, StyleSheet } from "react-native";
import { DARK_BLACK, DARK_GREEN } from "../Variables";

export const HeaderLeagueContext = createContext();

export const HeaderLeagueContextProvider = ({children, leagueObject}) => {

    const hasAvatar = (leagueObject.avatar) ? true : false;
    let avatar = (leagueObject.avatar) ? {uri: `https://sleepercdn.com/avatars/${leagueObject.avatar}`} : require('../../../assets/Images/cropped-logo_2.png');
    const opacity = useRef(new Animated.Value(0));
    const firstRender = useRef(true);

    const fadeIn = () => {
        if(firstRender.current) {
            firstRender.current = false;
            return
        }
        Animated.timing(opacity.current,{
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const fadeOut = () => {
        Animated.timing(opacity.current,{
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    return(
        <HeaderLeagueContext.Provider value={{avatar}}>
        <StatusBar
          animated={true}
          backgroundColor={DARK_GREEN}
          barStyle="light-content"
         />
        <HeaderImageScrollView
            useNativeDriver={true}
            maxHeight={260}
            minHeight={55}
            minOverlayOpacity={0}
            headerImage={require('../../../assets/Images/leagueHeader2.png')}
            scrollViewBackgroundColor='#0B0D0F'
            renderFixedForeground={() => (
                <Animated.View style={[styles.navtitleView,{opacity: opacity.current}]}>
                    <Text style={styles.navTitle}>{leagueObject.name}</Text>
                </Animated.View>
            )}
            renderForeground={() => (
                <View style={{flex:1,justifyContent:'flex-end',alignItems:'center',paddingBottom:30,marginHorizontal:5}}>
                    <Image source={avatar} style={{width:100, height:100, borderRadius:(hasAvatar) ? 100 : 0,}} />
                    <Text style={{color:'white',fontSize:24, fontWeight:'bold',marginTop:10}}>{leagueObject.name}</Text>
                    <View style={{paddingVertical:7,paddingHorizontal:10,marginTop:10,borderWidth:1,borderColor:'rgba(255,255,255,0.7)', borderRadius:5,}}>
                        <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>{leagueObject.status.replace('_',' ').toUpperCase()}
                        </Text>
                    </View>
                </View>
            )}
        >
            <View style={{flex:1,backgroundColor:'#0B0D0F',minHeight:600}}>
                <TriggeringView onDisplay={() => {fadeOut()}} onBeginHidden={() => {fadeIn()}}>
                    {children}
                </TriggeringView>
            </View>
        </HeaderImageScrollView>
        </HeaderLeagueContext.Provider>
    )
}

const styles = StyleSheet.create({
    navtitleView: {
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        //paddingTop: 15,
        //opacity: 0,
        paddingLeft:40,
    },
    navTitle: {
        color: 'white',
        fontSize: 18,
    }
})