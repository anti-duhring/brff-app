import React from "react";
import { View, StatusBar } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";;
import { NFLStatusContextProvider } from "./src/context/NFLStatusContext";
import {AllPlayersContextProvider} from './src/context/AllPlayersContext'
import { TrackPlayerContextProvider } from "./src/context/TrackPlayerContext";
import {  DARK_BLACK } from "./src/components/Variables";
import { AuthContextProvider } from "./src/context/AuthContext";
import DrawerScreens from "./src/screens/DrawerScreens";


export default function App() {
  changeNavigationBarColor(DARK_BLACK);

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


