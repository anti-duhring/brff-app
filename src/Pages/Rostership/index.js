import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../../components/UserDataContext'
import {NFLStatusContext} from '../../components/NFLStatusContext'
import {API_URL_BASE} from '../../utils/constants'
import { getRosterFromLeague } from '../../functions/GetRoster'
import {AllPlayersContext} from '../../components/AllPlayersContext'
import {colors} from '../../utils/colors'
import ProgressiveImage from '../../components/ProgressiveImage'
 
const Rostership = () => {
  const { userData } = useContext(UserDataContext)
  const { season } = useContext(NFLStatusContext)
  const {allPlayers} = useContext(AllPlayersContext)

  const [rosters,setRosters] = useState(null)
  const playersInAllRosters = rosters? [].concat(...rosters.map(i => i.players)).filter(i => i)  : []
  const playersSortedByAppearance = playersInAllRosters.length ? playersInAllRosters.filter((i, idx) => playersInAllRosters.indexOf(i) == idx).map(i => {
    return {
      id: i, 
      amount: playersInAllRosters.filter(p => p == i).length
    }
  }) : []
  if(playersSortedByAppearance.length) playersSortedByAppearance.sort((a, b) => b.amount - a.amount)
  

  useEffect(() => {
    //if(rosters) return
    const URL = `${API_URL_BASE}/user/${userData.user_id}/leagues/nfl/${season}`

    const abortController = new AbortController();

    // Get all leagues from user
    fetch(URL, {
      signal: abortController.signal
    })
    .then(response => response.json())
    .then((data) => {
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

  const Player = ({item}) => {
    if(allPlayers[item.id].fantasy_positions.indexOf('DEF')!=-1) {
      console.log(item.id)
    }
    return (
      <View style={styles.playerContainer}>
        <ProgressiveImage 
          style={styles.imagePlayer} 
          uri={`https://sleepercdn.com/content/nfl/players/thumb/${item.id}.jpg`} 
          resizeMode='cover'
        />
        <View>
          <Text style={styles.text}>
            {allPlayers[item.id].first_name} {allPlayers[item.id].last_name} - {item.amount} %{Math.floor(item.amount / rosters.length * 100)}
          </Text>
        </View>
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
        {rosters &&
          <FlatList
            data={playersSortedByAppearance}
            keyExtractor={item => item.id}
            renderItem={Player}
            initialNumToRender={10}
          />
        }
    </View>
  )
}

export default Rostership

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.DARK_BLACK
  },
  text: {
    color: 'white'
  },
  playerContainer: {
    backgroundColor: colors.LIGHT_BLACK,
    margin: 10,
    marginBottom: 0,
    borderRadius: 12,
    padding: 10,
    flexDirection:'row',
    alignItems:'center'
  },
  imagePlayer: {
    width: 50,
    height: 50,
    borderRadius:50,
    backgroundColor: colors.DARK_BLACK
  }
})