import { useState, createContext, useEffect } from "react"
import { View, Text, ActivityIndicator, StatusBar } from 'react-native'

export const AllPlayersContext = createContext()

export const AllPlayersContextProvider = ({children}) => {
    const [allPlayers, setAllPlayers] = useState(null)

    const getAllPlayers = () => {
        console.log('Getting players...')
        const URL = `https://api.sleeper.app/v1/players/nfl`;
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setAllPlayers(data)
        }).catch((e) => {
            console.log('Error:', e)
        })
    }

    useEffect(() => {
        getAllPlayers()
    },[])

    if(!allPlayers){
        return (
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#0B0D0F'}}>
            <StatusBar
              animated={true}
              backgroundColor="#0B0D0F"
              barStyle="light-content"
            />
            <ActivityIndicator size="large" color="#008037" />
          </View>
        )
      }


    return ( 
        <AllPlayersContext.Provider value={{allPlayers}}>
        {children}
        </AllPlayersContext.Provider>
     );
}
 