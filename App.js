import React, {useState, useEffect} from "react";
import { View, StatusBar, ActivityIndicator } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";;
import { NFLStatusContextProvider } from "./src/context/NFLStatusContext";
import {AllPlayersContextProvider} from './src/context/AllPlayersContext'
import { TrackPlayerContextProvider } from "./src/context/TrackPlayerContext";
import {  DARK_BLACK } from "./src/components/Variables";
import { AuthContextProvider } from "./src/context/AuthContext";
import DrawerScreens from "./src/screens/DrawerScreens";
import { colors } from './src/utils/colors.js';
import TrackPlayer from 'react-native-track-player'

export default function App() {
  changeNavigationBarColor(DARK_BLACK);
  const [playerReady, setPlayerReady] = useState(false);

  const setPlayer = async() => {
    try {
      await TrackPlayer.setupPlayer();
      setPlayerReady(true);
    } catch(e) {
      console.log('Error to initialize player')
    }
    
  }

  useEffect(() => {
    setPlayer();
  },[])

  if(!playerReady) {
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
    <AuthContextProvider>
      <AllPlayersContextProvider>
      <NFLStatusContextProvider>
      <TrackPlayerContextProvider>
      <View style={{flex:1}}>
        <StatusBar
          animated={true}
          backgroundColor="#0B0D0F"
          barStyle="light-content"
         />
        <DrawerScreens />
      </View>
      </TrackPlayerContextProvider>
      </NFLStatusContextProvider>
      </AllPlayersContextProvider>
      </AuthContextProvider>
    );
}


