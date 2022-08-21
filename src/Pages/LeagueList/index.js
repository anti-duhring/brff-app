import { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, Pressable, ActivityIndicator, ScrollView, FlatList, Animated, StatusBar } from 'react-native';
import { NFLStatusContext } from '../../context/NFLStatusContext';
import { AuthContext } from '../../context/AuthContext';
import { scaleAnimation } from '../../animations/scale'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { DARK_BLACK, LIGHT_GREEN } from '../../components/Variables';
import {colors} from '../../utils/colors'
import { getLeaguesFromUser } from '../../utils/getSleeperData';
import Placeholder from '../../components/LeagueList/Placeholder';

const Leagues = ({navigation}) => {
    const { season, week } = useContext(NFLStatusContext)
    const { loginState } = useContext(AuthContext);
    const userID = loginState.userData.user_id;
    const [leagues, setLeagues] = useState([]) 
    const [isLoading, setIsLoading] = useState(true)
    const animateX = useRef(new Animated.Value(1)).current;
    const ITEM_SIZE = 70 + 10 * 3;
    const [itemAnimate, setItemAnimate] = useState(null);


useEffect(() => {
  (async() => {
    if(!userID || !season) return

    const leaguesData = await getLeaguesFromUser(userID, season)
    if(leaguesData.length) {
      setLeagues(leaguesData)
      setIsLoading(false)
    }
  })();
},[userID, season])


  const LeagueItem = ({item, index}) => {
    const avatar = (item.avatar) ? {uri: `https://sleepercdn.com/avatars/${item.avatar}`} : require('../../../assets/Images/cropped-logo_2.png');

    return (
      <Animated.View
        style={[styles.leagueContainer,{transform:[{scale: (itemAnimate == item.league_id) ? animateX : 1}]
        }]}
      >
      <Pressable 
        onPressIn={() => setItemAnimate(item.league_id)} onPress={() =>{ 
        scaleAnimation(animateX,() => {
          navigation.navigate('Players',{
            leagueObject: item,
            leagueName: item.name
          })
        })}}
      >
          <View style={{flexDirection:'row'}}>
          <Image 
            source={avatar} 
            style={styles.leagueAvatar}
            resizeMode='contain'
          />
          
        
        <View style={{justifyContent:'center'}}>
          <Text style={styles.leagueTitle}>{item.name}</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.dotShadow}>● </Text>
            <Text style={{
                fontSize:12,color:LIGHT_GREEN,
                }}>{item.status.replace('_',' ').toUpperCase()}
            </Text>
            </View>
        </View>
        </View>
        </Pressable>
      </Animated.View>
    )
    
  }

  const LoadingPlaceholders = () => {
    return (
      <View style={{flex:1,padding:10,}}>
        <View style={{padding:10,paddingTop:0,paddingLeft:0}}>
          <Text style={{fontSize:24,color:'#FCFCFC', fontWeight:'bold'}}>Minhas Ligas</Text>
        </View>
        {
          new Array(7).fill(0).map((_,index) => <Placeholder key={index} />)
        }
      </View>
    )
  }

    return ( 
        <View style={{flex:1,backgroundColor:'#0B0D0F',paddingTop:50}}>
     <StatusBar
        animated={true}
        backgroundColor={DARK_BLACK}
        barStyle="light-content"
      />
          {isLoading  ? 
      <LoadingPlaceholders />
      :
      <Animated.FlatList
            data={leagues}
            keyExtractor={item => item.league_id}
            contentContainerStyle={{
              padding:10,
            }}
            ListHeaderComponent={() => (
            <View style={{padding:10,paddingTop:0,paddingLeft:0}}>
              <Text style={{fontSize:24,color:'#FCFCFC', fontWeight:'bold'}}>Minhas Ligas</Text>
            </View>
            )}
            renderItem={LeagueItem}
          /> }   
        </View>
     );
}
 
export default Leagues;

const styles = StyleSheet.create({
  leagueContainer: {
    borderRadius:12,
    marginBottom:10,
    padding:10,
    shadowColor:'#000',
    shadowOffset: {
      width: 0,
      height:10
    },
    shadowOpacity:1,
    shadowRadius:20,
    elevation:10,
    borderWidth:1,
    borderColor:  'rgba(255,255,255,0)',
    backgroundColor: colors.LIGHT_BLACK,
  },
  leagueAvatar: {
    width:70,
    height:70,
    borderRadius:12,
    marginRight:10,
    backgroundColor: colors.DARK_BLACK
  },
  leagueTitle: {
    fontSize:15,
    fontWeight:'700',
    color:'#C6C6C6',
    width:250
  },
  dotShadow: {
    fontSize:12,
    color:LIGHT_GREEN,
    fontWeight:'bold',
    textShadowColor: LIGHT_GREEN,
    textShadowOffset: {
      width: 0, 
      height: 0
    },
    textShadowRadius: 5
  }
})