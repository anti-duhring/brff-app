import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { View, StatusBar, Text, Image, Animated, StyleSheet, Dimensions } from "react-native";
import {useRef} from 'react'
import { DARK_GREEN } from '../Variables';
import ProgressiveImage from '../ProgressiveImage'

const PlayerStatsHeader = ({children, player}) => {
    const typePlayer = (isNaN(new Number(player.player_id))) ? 'TEAM' : 'PLAYER';
    const opacity = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
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

    const getColorTeam = (team) => {
        let color;
        switch(team) {
            case 'LAC':
                color = 'rgb(0, 34, 68)'
                break;
            case 'KC':
                color = 'rgb(227, 24, 55)'
                break;
            case 'LV':
                color = 'rgb(165, 172, 175)'
                break;
            case 'DEN':
                color = 'rgb(251, 79, 20)'
                break;     
            case 'NE':
                color = 'rgb(0, 34, 68)'
                break;
            case 'NYJ':
                color = 'rgb(32, 55, 49)'
                break;
            case 'MIA':
                color = 'rgb(0, 142, 151)'
                break;
            case 'BUF':
                color = 'rgb(0, 51, 141)'
                break;
            case 'BAL':
                color = 'rgb(36, 23, 115)'
                break;
            case 'CLE':
                color = 'rgb(49, 29, 0)'
                break;
            case 'PIT':
                color = 'rgb(255, 182, 18)'
                break;
            case 'CIN':
                color = 'rgb(251, 79, 20)'
                break;
            case 'TEN':
                color = 'rgb(0, 34, 68)'
                break;
            case 'JAX':
                color = 'rgb(0, 103, 120)'
                break;
            case 'IND':
                color = 'rgb(0, 44, 95)'
                break;
            case 'HOU':
                color = 'rgb(3, 32, 47)'
                break;
            case 'TB':
                color = 'rgb(213, 10, 10)'
                break;
            case 'CAR':
                color = 'rgb(0, 133, 202)'
                break;
            case 'ATL':
                color = 'rgb(167, 25, 48)'
                break;
            case 'NO':
                color = 'rgb(177, 177, 177)'
                break;
            case 'LAR':
                color = 'rgb(0, 34, 68)'
                break;
            case 'SEA':
                color = 'rgb(0, 34, 68)'
                break;
            case 'SF':
                color = 'rgb(170, 0, 0)'
                break;
            case 'ARI':
                color = 'rgb(151, 35, 63)'
                break;
            case 'GB':
                color = 'rgb(32, 55, 49)'
                break;
            case 'DET':
                color = 'rgb(0, 118, 182)'
                break;
            case 'CHI':
                color = 'rgb(11, 22, 42)'
                break;
            case 'MIN':
                color = 'rgb(79, 38, 131)'
                break;
            case 'NYG':
                color = 'rgb(11, 34, 101)'
                break;
            case 'DAL':
                color = 'rgb(0, 34, 68)'
                break;
            case 'PHI':
                color = 'rgb(0, 76, 84)'
                break; 
            case 'WAS':
                color = 'rgb(90, 20, 20)'
                break;
            default:
                color = DARK_GREEN;
        }
        return color
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