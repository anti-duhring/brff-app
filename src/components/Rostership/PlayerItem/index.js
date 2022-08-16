import { useState, memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ProgressiveImage from "../../ProgressiveImage";
import { colors } from "../../../utils/colors";
import { MaterialIcons } from '@expo/vector-icons'; 

const PlayerItem = (props) => {
  const [showMore, setShowMore] = useState(false)

  const MoreInformations = () => {
    return (
      <View style={styles.moreInfoContainer}>
        <Text style={styles.text}>
          <Text>Você possui esse jogador em</Text> <Text style={styles.numberParsed}>{props.item.amount}</Text> <Text>dos seus</Text> <Text style={styles.numberParsed}>{props.rosters.length}</Text> <Text>rosters.</Text>
        </Text>
        <Text></Text>
        <Text style={styles.text}>Nas seguintes ligas:</Text>
        <View style={styles.leagues}>
          {props.leagues.map((league, index) => {
            return (
              <Text style={styles.text} key={index}>
                {league.name}
              </Text>
            )
          })}
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => props.navigation.navigate('AdvancedStats', {
            player: props.player,
            item: props.item,
            leagues: props.leagues,
            allLeagues: props.allLeagues,
            rosters: props.rosters,
          })} style={styles.footerLink}>
            <Text style={styles.textFooter}>Ver estatísticas avançadas</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setShowMore(prevShow => (prevShow? false : true))} style={styles.playerContainer}>
            <View style={styles.playerProfile}>
              <ProgressiveImage 
                style={styles.imagePlayer} 
                uri={`https://sleepercdn.com/content/nfl/players/thumb/${props.item.id}.jpg`} 
                resizeMode='cover'
              />
              <View style={styles.playerInfo}>
                <Text style={styles.text}>
                  {props.player.first_name} {props.player.last_name}
                </Text>
                <Text style={styles.position}>
                  {props.player.position} - {props.player.team}
                </Text>
              </View>
            </View>
          <View style={styles.rostership}>
            <Text style={styles.rostershipText}>
              {/*props.item.amount*/} {Math.floor(props.item.amount / props.rosters.length * 100)}%
            </Text>
            <MaterialIcons name={showMore? 'expand-less' : 'expand-more'} size={24} color={'white'} />
          </View>
        </TouchableOpacity>
        {showMore && <MoreInformations />}
      </View>
    )
}

export default memo(PlayerItem);

const styles = StyleSheet.create({
  container: {
    flexDirection:'column',
    backgroundColor: colors.LIGHT_BLACK,
    margin: 10,
    marginBottom: 0,
    borderRadius: 12,
    padding: 10,
  },
  text: {
    color: 'white'
  },
  numberParsed: {
    fontWeight:'bold',
    color: colors.LIGHT_GREEN
  },
  playerContainer: {
    
    flexDirection:'row',
    alignItems:'center'
  },
  imagePlayer: {
    width: 50,
    height: 50,
    borderRadius:50,
    backgroundColor: colors.DARK_BLACK
  },
  playerInfo: {
    marginLeft: 10
  },
  position: {
    color: colors.DARK_GRAY,
    fontSize: 13,
  },
  playerProfile: {
    flex: 1,
    flexDirection:'row',
    alignItems:'center'
  },
  rostership: {
    flex: 1,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    flexDirection:'row',
  },
  rostershipText: {
    color: colors.LIGHT_GREEN,
    fontSize: 17,
  },
  leagues: {
    marginLeft:15,
  },
  moreInfoContainer: {
    marginTop: 20,
  },
  textFooter: {
    color: colors.LIGHT_GREEN,
    //fontWeight:'bold',
    textAlign: 'center'
  },
  footerLink: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: colors.LIGHT_GREEN,
  },
  footerContainer: {
    width:'100%',
    justifyContent:'center',
    alignItems:'center', 
    marginTop:10
}
      
})