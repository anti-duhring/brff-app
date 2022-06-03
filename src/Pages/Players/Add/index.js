import { Text, ScrollView, View, ActivityIndicator, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import TabTopTrendingPlayers from "../TabTopTrendingPlayers";
import { FontAwesome } from '@expo/vector-icons';

const Add = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState('Carregando jogadores, aguarde...')
    const [trendingPlayers, setTrendingPlayers] = useState([])
    const [dataPlayers, setDataPlayers] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    let playersLength = 0;

    const getPlayer = async(playerId, index) => {
      try{
        const response = await fetch(`https://teste-draft.netlify.app/.netlify/functions/getplayersdata?name=${playerId}`);
        const data = await response.json();
        setDataPlayers(dataPlayers => [...dataPlayers, data])
      }
      catch (e) {
        console.log('Erro: ',e)
        setErrorMessage('Erro: '+e)
      } finally {
        if(index==playersLength){
            setIsLoading(false)
        }
    }
    }
    const getInfos = async() => {
      setDataPlayers([])
      setErrorMessage(null)

        try{
          const response = await fetch(`https://api.sleeper.app/v1/players/nfl/trending/add?lookback_hours=12&limit=25`);
          const data = await response.json();
          setTrendingPlayers(data)
          playersLength = data.length - 1;
          await data.map((player, index) => {
            getPlayer(player.player_id, index)
          })
        }
        catch (e) {
          console.log('Erro: ',e)
          setErrorMessage('Erro: '+e)
        }
  
    }
useEffect(() => {
    getInfos();
},[])

if(isLoading){
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text>{loadingMessage}</Text>
        <ActivityIndicator size="large" color="#008037" />
      </View>
    )
  }

    return ( 
        <View>
          <TabTopTrendingPlayers activeButton={'Add'} />
            
              <ScrollView contentContainerStyle={{paddingBottom:50}}>
                <View style={styles.playerContent}>
                  {errorMessage && <Text>{errorMessage}</Text>}
                  {!errorMessage && dataPlayers.map((player) => {
                    return (
                      <View key={player.player_id} style={styles.playerItem}>
                        <View style={styles.playerIcon}>
                        <FontAwesome name="arrow-up" size={15} color="green" />
                        </View>
                        <View style={styles.playerInfo}>
                        <Text style={styles.playerName}>{player.full_name} - </Text>
                        <Text>{player.team} [{player.position}]</Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
              </ScrollView>
            
        </View> 
    );
}
 
export default Add;

const styles = StyleSheet.create({
  playerContent:{
    padding:10,
  },
  playerItem:{
    flexDirection:'row',
    marginBottom:5,
  },
  playerSignal:{
    color:'green',
    paddingRight:10,
  },
  playerName:{
    fontWeight:'bold',
  },
  playerInfo: {
    flexDirection:'row'
  },
  playerIcon:{
    justifyContent:'center',
    paddingRight:5
  }
})