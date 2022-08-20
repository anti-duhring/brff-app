import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { View, StatusBar, Text, Image, Animated, StyleSheet, Dimensions } from "react-native";
import {useRef} from 'react'
import { DARK_GREEN } from '../Variables';
import ProgressiveImage from '../ProgressiveImage'
import { getColorTeam } from '../../utils/colors';

const PlayerStatsHeader = ({children, player}) => {
    const typePlayer = (isNaN(new Number(player.player_id))) ? 'TEAM' : 'PLAYER';
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

    return(
        <View style={{flex:1}}>
        <StatusBar
          animated={true}
          backgroundColor={getColorTeam(player.team)}
          barStyle="light-content"
         />
        <HeaderImageScrollView
            useNativeDriver={true}
            maxHeight={200}
            minHeight={55}
            minOverlayOpacity={0}
            renderHeader={() => <View style={{backgroundColor:getColorTeam(player.team)}}>
                <Image source={{uri: `https://sleepercdn.com/images/team_logos/nfl/${(player.team) ? player.team.toLowerCase() : null}.png`}} style={{ height: 200, width: Dimensions.get('window').width,opacity:0.3}} resizeMode='contain' /></View> }
            renderFixedForeground={() => (
                <Animated.View style={[styles.navtitleView,{opacity}]}>
                    <Text style={styles.navTitle}>{`${player.first_name} ${player.last_name}`}</Text>
                </Animated.View>
            )}
            renderForeground={() => (
                <View style={{flex:1,justifyContent:'flex-end',alignItems:'center',}}>
                    <ProgressiveImage uri={(typePlayer == 'TEAM') ? `https://sleepercdn.com/images/team_logos/nfl/${player.team.toLowerCase()}.png` : `https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`} style={{width:300, height:200}} defaultSource={require('../../../assets/Images/167.jpg')} tintColor={true} resizeMode={(typePlayer=='TEAM') ? 'contain' : 'cover'}/>
                </View>
            )}
        >
            <View style={{flex:1,backgroundColor:'#0B0D0F',minHeight:800}}>
                <TriggeringView onDisplay={() => fadeOut()} onBeginHidden={() => {fadeIn()}}>
                    {children}
                </TriggeringView>
            </View>
        </HeaderImageScrollView>
        </View>
    )
}

 
export default PlayerStatsHeader;

const styles = StyleSheet.create({
    navtitleView: {
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
    },
    navTitle: {
        color: 'white',
        fontSize: 18,
    }
});