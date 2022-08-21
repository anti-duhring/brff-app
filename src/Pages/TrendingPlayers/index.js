import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, TextInput, Dimensions, ActivityIndicator } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { DARK_BLACK, LIGHT_GRAY, DARK_GRAY, WHITE, LIGHT_BLACK, BORDER_RADIUS, LIGHT_GREEN } from '../../components/Variables'
import { AllPlayersContext } from '../../context/AllPlayersContext';
import ProgressiveImage from '../../components/ProgressiveImage';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import SearchPlayers from '../../components/SearchPlayers';

const WIDTH = Dimensions.get('window').width;

const TrendingPlayers = ({navigation}) => {
  const [trendingAdd, setTrendingAdd] = useState(null)
  const [trendingDrop, setTrendingDrop] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [searchPlayers, setSearchPlayers] = useState(null)
  const [isSearchLoading, setIsSearchLoading] = useState(false)

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

  const getRandomPlayers = () => {
    const allPlayerslength = Object.entries(allPlayers).length;
    let players = [
      allPlayers[Math.floor(Math.random() * allPlayerslength)],
      allPlayers[Math.floor(Math.random() * allPlayerslength)],
      allPlayers[Math.floor(Math.random() * allPlayerslength)],
      allPlayers[Math.floor(Math.random() * allPlayerslength)],
      allPlayers[Math.floor(Math.random() * allPlayerslength)],
      allPlayers[Math.floor(Math.random() * allPlayerslength)]
    ];

    setSearchPlayers(players)
  }

  useEffect(() => {
    getTrendingPlayers('add');
    getTrendingPlayers('drop')
    getRandomPlayers();

  }, [])

  const handleSearchSubmit = (event) => {
    setIsSearchLoading(true);
    if(event.text=='' || !event.text) {
      setIsSearchLoading(false)
      return
    }

    let count = 0;
    let players = [];


    Object.entries(allPlayers).map((player, index) => {
      if(count > 5) return
      if(!player[1]) return
      if(!player[1].search_full_name) return

      if(player[1].search_full_name.indexOf(event.text.toLowerCase().replace(/ /g,'')) != -1) {

        players.push(player[1])
        count++
      }
    })
    console.log(players.length);

    setSearchPlayers(players)
    setIsSearchLoading(false)

  }

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
      <TouchableOpacity style={{flex:2,flexDirection:'row',alignItems:'center'}} onPress={() => navigation.navigate('PlayerStats', {
        playerObject: allPlayers[id],
        goTo: 'TrendingPlayers'
      })}>
        <ProgressiveImage style={styles.imagePlayer} uri={avatar} resizeMode='cover'/>
        <View style={styles.playerNameContainer}>
          <Text style={styles.playerName}>{allPlayers[id].full_name}</Text>
          <Text style={styles.playerPosition}>{allPlayers[id].position} - {(allPlayers[id].team) ? allPlayers[id].team : 'Free Agent'}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.playerCountContainer}>
        {(type=='add') ? <Feather name="trending-up" size={20} color={LIGHT_GREEN} /> : <Feather name="trending-down" size={20} color='#FF0E00' />}
        <Text style={(type=='add') ? styles.playerCountAdd : styles.playerCountDrop}>{player.count}</Text>
      </View>
    </View>
  )
  

  return ( 
    <View style={styles.container}> 
      <StatusBar
        animated={true}
        backgroundColor={DARK_BLACK}
        barStyle="light-content"
      />

      <ScrollView>
      <View style={styles.header}>
        <View style={styles.navigationButtonContainer}>
          <TouchableOpacity style={styles.toggleButton} onPress={() => navigation.toggleDrawer()}>
            <Entypo name="menu" size={24} color="#C6C6C6" />
          </TouchableOpacity>
        </View>
        <View style={{alignItems:'center',flex:1, padding:10}}>
        <View style={{ padding:5, borderRadius: 5, backgroundColor: '#15191C', width:200, flexDirection:'row', alignItems:'center'}}>
            {isSearchLoading ? 
              <ActivityIndicator size={17} style={{paddingLeft:5,paddingRight:10}} color="#C1C1C1" /> :
              <FontAwesome name="search" style={{paddingLeft:5,paddingRight:10}} size={17} color="#C1C1C1" />
            }
            <TextInput
                value={searchText}
                onChangeText={text => {setSearchText(text)}}
                style={{width:150, color:'#FCFCFC'}}
                placeholder='Pesquisar...'
                placeholderTextColor={'#C1C1C1'}
                onSubmitEditing={({nativeEvent}) => {handleSearchSubmit(nativeEvent);}}
            />
        </View>
      </View>
      </View>
      <View style={{flex:1}}>
        <SearchPlayers navigation={navigation} searchPlayers={searchPlayers} />
      </View>
      <ScrollView contentContainerStyle={{marginTop:20}} horizontal={true} pagingEnabled={true}         decelerationRate={0} snapToInterval={WIDTH - 60} snapToAlignment={"center"} contentInset={{
          top: 0,
          left: 30,
          bottom: 0,
          right: 30,
        }}>
        <View style={styles.scrollHorizontalView1}>
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
        <View style={styles.scrollHorizontalView2}>
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
    fontSize:18,
    color:WHITE,
    fontWeight:'bold'
  },
  scrollHorizontalView1: {
    width: WIDTH - 60,
    backgroundColor: LIGHT_BLACK,
    padding: 10,
    marginRight: 10,
    borderRadius: BORDER_RADIUS
  },
  scrollHorizontalView2: {
    width: WIDTH - 60,
    backgroundColor: LIGHT_BLACK,
    padding: 10,
    borderRadius: BORDER_RADIUS
  },
  boxContainer: {
    //backgroundColor: LIGHT_BLACK,
    padding: 10,
    borderRadius: BORDER_RADIUS,
    //marginTop:20,
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
    width: 50,
    height: 50,
    borderRadius:50,
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
  },
  header: {
    flexDirection:'row',
    
  }
})