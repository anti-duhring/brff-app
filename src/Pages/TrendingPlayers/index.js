import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { DARK_BLACK, LIGHT_GRAY, DARK_GRAY, WHITE, LIGHT_BLACK, BORDER_RADIUS, LIGHT_GREEN } from '../../components/Variables'
import { AllPlayersContext } from '../../components/AllPlayersContext'
import ProgressiveImage from '../../components/ProgressiveImage';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const TrendingPlayers = ({navigation}) => {
  const [trendingAdd, setTrendingAdd] = useState(null)
  const [trendingDrop, setTrendingDrop] = useState(null)
  const { allPlayers } = useContext(AllPlayersContext)

  const [errorMessage, setErrorMessage] = useState(null)
  const controller = new AbortController();
  const signal = controller.signal;

  const getTrendingPlayers = async(_type) => {
    const URL = `https://api.sleeper.app/v1/players/nfl/trending/${_type}?lookback_hours=24&limit=25`;
    fetch(URL,{signal})
    .then(response => response.json())
    .then(data => {
      if(_type == 'add') {
        setTrendingAdd(data);
      } else if(_type == 'drop') {
        setTrendingDrop(data)
      } else {
        console.log('Type error: Must be "add" or "drop"')
      }
    }).catch(e => {
      console.log('Erro:',e)
      controller.abort()
      setErrorMessage(e)
    })
  }

  useEffect(() => {
    getTrendingPlayers('add');
    getTrendingPlayers('drop')

  }, [])

  const PlayerPlaceholder = () => (
    <View style={styles.playerContainer}>
      <Image source={require('../../../assets/Images/player_default.png')} style={styles.imagePlayer} resizeMode='contain' />
      <View style={styles.playerNameContainer}>
        <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
          <View style={{ width: 100, height: 15, borderRadius: 4 }} />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
          <View style={{ width: 50, height: 15, borderRadius: 4, marginTop:5 }} />
        </SkeletonPlaceholder>
      </View>
      <View style={styles.playerCountContainer}>
        <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
          <View style={{ width: 50, height: 20, borderRadius: 4 }} />
        </SkeletonPlaceholder>
      </View>
    </View>
  )

  const Player = ({id, avatar, player, type}) => (
    <View style={styles.playerContainer}>
      <ProgressiveImage style={styles.imagePlayer} uri={avatar} resizeMode='contain'/>
      <View style={styles.playerNameContainer}>
        <Text style={styles.playerName}>{allPlayers[id].full_name}</Text>
        <Text style={styles.playerPosition}>{allPlayers[id].position} - {(allPlayers[id].team) ? allPlayers[id].team : 'Free Agent'}</Text>
      </View>
      <View style={styles.playerCountContainer}>
        {(type=='add') ? <Feather name="trending-up" size={20} color={LIGHT_GREEN} /> : <Feather name="trending-down" size={20} color='#FF0E00' />}
        <Text style={(type=='add') ? styles.playerCountAdd : styles.playerCountDrop}>{player.count}</Text>
      </View>
    </View>
  )
  

  return ( 
    <View style={styles.container}> 
      <ScrollView>
      <View style={styles.navigationButtonContainer}>
        <TouchableOpacity style={styles.toggleButton} onPress={() => navigation.toggleDrawer()}>
          <Entypo name="menu" size={24} color="#C6C6C6" />
        </TouchableOpacity>
      </View>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Trending up</Text>
        <View style={styles.playersList}>
        {(trendingAdd) ? trendingAdd.map(player => {
          const id = player.player_id;
          const avatar = `https://sleepercdn.com/content/nfl/players/thumb/${id}.jpg`;

          return (
            <Player key={id} id={id} avatar={avatar} player={player} type='add' />
          )
        }) :
        new Array(25).fill(0).map((player, index) => {
          return (
            <PlayerPlaceholder key={index} />
          )
        })}
        </View>
      </View>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Trending down</Text>
        <View style={styles.playersList}>
        {(trendingDrop) ? trendingDrop.map(player => {
          const id = player.player_id;
          const avatar = `https://sleepercdn.com/content/nfl/players/thumb/${id}.jpg`;

          return (
            <Player key={id} id={id} avatar={avatar} player={player} type='drop' />
          )
        }) :
        new Array(25).fill(0).map((player, index) => {
          return (
            <PlayerPlaceholder key={index} />
          )
        })}
        </View>
      </View>
      </ScrollView>
    </View>
   );
}
 
export default TrendingPlayers;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: DARK_BLACK,
    padding:10,
    
  },
  title: {
    fontSize:24,
    color:WHITE,
    fontWeight:'bold'
  },
  boxContainer: {
    backgroundColor: LIGHT_BLACK,
    padding: 10,
    paddingTop:15,
    borderRadius: BORDER_RADIUS,
    marginTop:20,
  },
  playerPosition: {
    color: DARK_GRAY,
    fontSize: 13,
  },
  playerName: {
    color: WHITE,
    fontSize: 15,
  },
  imagePlayer: {
    width: 40,
    height: 40,
    borderRadius:20,
    backgroundColor: DARK_BLACK
  },
  playerContainer: {
    flexDirection:'row',
    alignItems:'center',
    marginTop: 20,
  },
  playerNameContainer: {
    flex: 1,
    marginLeft:10,
  },
  playersList: {
    marginTop: 0,
  },
  playerCountAdd: {
    //flex: 1,
    //textAlign:'right',
    color:LIGHT_GREEN,
    fontSize: 15,
    marginLeft:10,
  },
  playerCountDrop: {
    //flex: 1,
    //textAlign:'right',
    color:'#FF0E00',
    fontSize: 15,
    marginLeft:10,
  },
  playerCountContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  navigationButtonContainer: {
    marginTop:10,
  }
})