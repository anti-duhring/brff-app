import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../../components/UserDataContext'
import {NFLStatusContext} from '../../components/NFLStatusContext'
import {API_URL_BASE} from '../../utils/constants'
import { getRosterFromLeague } from '../../functions/GetRoster'
import {AllPlayersContext} from '../../components/AllPlayersContext'
import {colors} from '../../utils/colors'
import PlayerItem from '../../components/Rostership/PlayerItem'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { Entypo } from '@expo/vector-icons';
import {FlashList} from '@shopify/flash-list'
 
const Rostership = ({navigation}) => {
  const { userData } = useContext(UserDataContext)
  const { season } = useContext(NFLStatusContext)
  const {allPlayers} = useContext(AllPlayersContext)

  const [rosters,setRosters] = useState(null)
  const [leagues, setLeagues] = useState(null)
  const playersInAllRosters = rosters? [].concat(...rosters.map(i => i.players)).filter(i => i)  : []
  const playersSortedByAppearance = playersInAllRosters.length ? playersInAllRosters.filter((i, idx) => playersInAllRosters.indexOf(i) == idx).map(i => {
    return {
      id: i, 
      amount: playersInAllRosters.filter(p => p == i).length
    }
  }) : []
  if(playersSortedByAppearance.length) playersSortedByAppearance.sort((a, b) => b.amount - a.amount)
  

  useEffect(() => {
    if(rosters) return
    const URL = `${API_URL_BASE}/user/${userData.user_id}/leagues/nfl/${season}`

    const abortController = new AbortController();

    // Get all leagues from user
    fetch(URL, {
      signal: abortController.signal
    })
    .then(response => response.json())
    .then((data) => {
      setLeagues(data)
      Promise.all(
        data.map((league) => {
          return getRosterFromLeague(league.league_id, userData.user_id)
        })
      ).then(rostersData => {
        setRosters(rostersData.filter(i => i))
      }).catch(err => {
        console.log('Error:',err);
      })

    }).catch(err => {
      console.log('Error:',err);
      abortController.abort();
    })

    // Clean up
    return () => abortController.abort();
  
  },[])

  const PlayerPlaceholder = () => {
    return (
      <View style={styles.placeholderContainer}>
        <SkeletonPlaceholder backgroundColor={colors.LIGHT_BLACK} highlightColor={colors.HIGHTLIGHT_BLACK}>
          <View style={styles.playerPlaceholder}></View>
        </SkeletonPlaceholder>
      </View>
    )
  }

  const Header = () => {
    return (
    <View style={styles.titleContainer}>
      <TouchableOpacity style={styles.toggleButton} onPress={() => navigation.toggleDrawer()}>
        <Entypo name="menu" size={24} color="#C6C6C6" />
      </TouchableOpacity>
      <Text style={styles.title}>Rostership</Text>
    </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={colors.DARK_BLACK}
        barStyle="light-content"
      />

        {rosters? 
          <FlashList
            data={playersSortedByAppearance}
            keyExtractor={item => item.id}
            estimatedItemSize={70}
            renderItem={({item, index}) => {
              //if(index > 10) return
              return (
                <PlayerItem 
                  player={allPlayers[item.id]} 
                  item={item} 
                  rosters={rosters} 
                  leagues={leagues.filter(league => rosters.filter(i => i.players && i.players.indexOf(item.id)!=-1).map(i => i.league_id).indexOf(league.league_id)!=-1)} 
                  allLeagues={leagues}
                  navigation={navigation}
                />
              )
            }}
            //initialNumToRender={5}
            ListHeaderComponent={() => <Header/>}
          /> :
          <>
          <Header/>
          {new Array(10).fill(0).map((i, index) => <PlayerPlaceholder key={index} />)}
          </>
        }
    </View>
  )
}

export default Rostership

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.DARK_BLACK,
  },
  text: {
    color: 'white'
  },
  playerPlaceholder: {
    marginBottom: 0,
    borderRadius: 12,
    width: '100%',
    height: 70
  },
  placeholderContainer: {
    margin: 10,
    marginBottom: 0,
  },
  title: {
    color:'white',
    fontSize: 24,
    fontWeight:'bold',
    marginTop: 20,
  },
  titleContainer: {
    marginLeft: 10,
    paddingTop: 20,
  }
})