import { createContext, useRef, useState, useEffect } from "react"
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { View, StatusBar, Text, Image, Animated, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { DARK_BLACK, DARK_GREEN, LIGHT_GREEN } from "../Variables";
import {useFonts} from 'expo-font'

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
            //headerImage={require('../../../assets/Images/leagueHeader2.png')}
            renderHeader={() => <Image source={require('../../../assets/Images/leagueHeader2.png')} style={{ height: 310, width: Dimensions.get('window').width }} blurRadius={0} />}
            headerContainerStyle={styles.headerContainer}
            scrollViewBackgroundColor={'transparent'}
            renderFixedForeground={() => (
                <Animated.View style={[styles.navtitleView,{opacity: opacity.current}]}>
                    <Text style={styles.navTitle}>{leagueObject.name}</Text>
                </Animated.View>
            )}
            renderForeground={() => (
                <View style={styles.foreground}>
                    <Image source={avatar} style={{width:100, height:100, borderRadius:(hasAvatar) ? 100 : 0,marginTop:25}} />
                    <Text style={styles.leagueName}>{leagueObject.name}</Text>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusFont}>{leagueObject.status.replace('_',' ').toUpperCase()}
                        </Text>
                     </View>
                </View>
            )}
        >
            <View style={{flex:1,minHeight:600}}>
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
    },
    foreground:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        //paddingBottom:30,
        marginHorizontal:5,
        
    },
    headerContainer: {
        height: 310
    },
    statusContainer: {
        paddingVertical:7,
        paddingHorizontal:10
        ,marginTop:10,
        borderWidth:1,
        borderColor: 'rgba(0,0,0,0.5)', //'rgba(255,255,255,0.7)', 
        borderRadius:5,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    statusFont: {
        color:'white',
        fontWeight:'bold',
        fontSize:10,
        //fontFamily:'BebasNeue-Regular'
    },
    leagueName: {
        color:'white',
        fontSize:28, 
        //fontWeight:'bold',
        marginTop:10,
        fontFamily: 'sans-serif-condensed',

    }
})