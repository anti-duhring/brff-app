import { useRef, useState, useEffect } from "react";
import { Text, View, Image, Animated, Pressable, StyleSheet } from "react-native";
import TabTopLeague from '../../components/TabTopLeague'
import { scaleAnimation } from "../../animations/scale";
//import { useFocusEffect } from "@react-navigation/native";
import { HeaderLeagueContextProvider } from "../../components/HeaderLeagueContext";
import Placeholder from "../../components/LeagueList/Placeholder";
import { getDraftSettings, getLeaguePlayers, getLeagueRosters } from "../../utils/getSleeperData";
import { DARK_BLACK } from "../../components/Variables";

const Players = ({navigation, route}) => {
    const leagueId = route.params?.leagueObject.league_id;
    const leagueObject = route.params?.leagueObject;
    const [leagueDraftSettings, setLeagueDraftSettings] = useState(null)
    const [leagueRosters, setLeagueRosters] = useState(null);
    const [players, setPlayers] = useState([])
    const [DATA, setDATA] = useState([])
    const animateX = useRef(new Animated.Value(1)).current;
    const [itemAnimate, setItemAnimate] = useState(null);


  useEffect(() => {
    if(players && leagueRosters && leagueDraftSettings) return
      
    (async() => {
      const playersData = await getLeaguePlayers(leagueId);
      setPlayers(playersData);
      setDATA(playersData.map((player, index) => {
        return {
        key: player.user_id,
        avatar: player.avatar,
        name: player.display_name,
        teamname: player.metadata.team_name,
        playerObject: player
        }
    }));
    })();
    (async() => {
      const draftSettingsData = await getDraftSettings(leagueId);
      setLeagueDraftSettings(draftSettingsData);
    })();
    (async() => {
      const rostersData = await getLeagueRosters(leagueId);
      setLeagueRosters(rostersData);
    })();
  },[])

  const LoadingPlaceholders = () => {
    return (
      <View style={{flex:1,padding:10,}}>
        {
          new Array(7).fill(0).map((_,index) => <Placeholder key={index} />)
        }
      </View>
    )
  }

const PlayerItem = ({item}) => {
  return (
    <Animated.View
      style={[styles.playerContainer,{transform:[{scale: (itemAnimate == item.key) ? animateX : 1}]}]}
    >
      <Pressable 
        onPressIn={() => setItemAnimate(item.key)} 
        onPress={() =>{ 
          scaleAnimation(animateX,() => {
            navigation.navigate('PlayerProfile',{
              playerObject: item.playerObject,
              leagueID: leagueId,
              roster: leagueObject.roster_positions
          })})}
        }
      >
        <View style={{flexDirection:'row'}}>
          <Image 
            source={{uri: `https://sleepercdn.com/avatars/${item.avatar}`}} 
            style={styles.avatar}
          />
          <View style={{justifyContent:'center'}}>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.name}>{item.name}</Text> 
              {item.playerObject.is_owner &&
              <Text style={styles.admTitle}>Comissário</Text>}
            </View>
            <Text style={{fontSize:12,color:'#656668',}}>{(item.teamname!=null) ? item.teamname : `${item.name}'s team`}</Text> 
          </View>
        </View>
      </Pressable>
    </Animated.View>
  )
}

    return ( 
      <View style={{flex:1,}}>
        <HeaderLeagueContextProvider leagueObject={leagueObject}>
        <TabTopLeague 
          activeButton={route.params?.active} 
          isAble={(leagueDraftSettings && players.length && leagueRosters) ? true : false} 
          leagueRosters={leagueRosters} 
          leagueUsers={players} 
          leagueDraftSettings={leagueDraftSettings} leagueObject={leagueObject} 
          opacity={(leagueDraftSettings && players && leagueRosters) ? 1 : 0.5}  
          loading={leagueDraftSettings && players && leagueRosters}
        />
        <View style={styles.body}>
          {!DATA.length ?
            <LoadingPlaceholders /> :
            <View style={{padding:10,marginBottom:10}}>
              { DATA.map((item, index) => <PlayerItem item={item} key={index} />)
              }
            </View>
          }
          </View>
        </HeaderLeagueContextProvider>
      </View> 
    );
}
 
export default Players;

const styles = StyleSheet.create({
  playerContainer: {
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
    borderColor: /*(itemAnimate == item.key) ? 'rgba(0, 128, 55, 1)' :*/ 'rgba(255,255,255,0)',
    backgroundColor: '#15191C',
  },
  avatar: {
    width:70,
    height:70,
    borderRadius:12,
    marginRight:10
  },
  name: {
    fontSize:15,
    fontWeight:'700',
    color:'#C6C6C6'
  },
  admTitle: {
    fontSize:15,
    color:'#008037',
    marginLeft:5,
    fontStyle:'italic'
},body: {
  backgroundColor:DARK_BLACK,
  paddingTop:40
}
})
