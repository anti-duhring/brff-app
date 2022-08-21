import { useState, createContext, useEffect } from "react"
import { View, Text, ActivityIndicator, StatusBar } from 'react-native'
import { colors } from "../utils/colors"
import { API_URL_BASE } from "../utils/constants"

export const AllPlayersContext = createContext()

export const AllPlayersContextProvider = ({children}) => {
    const [allPlayers, setAllPlayers] = useState(null)

    const getAllPlayers = () => {
        console.log('Getting players...')
        const URL = `${API_URL_BASE}/players/nfl`;
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
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.DARK_BLACK}}>
            <StatusBar
              animated={true}
              backgroundColor={colors.DARK_BLACK}
              barStyle="light-content"
            />
            <ActivityIndicator size="large" color={colors.LIGHT_GREEN} />
          </View>
        )
      }


    return ( 
        <AllPlayersContext.Provider value={{allPlayers}}>
        {children}
        </AllPlayersContext.Provider>
     );
}
 