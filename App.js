import { React, useEffect, useMemo, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, ActivityIndicator, Vibration, StatusBar, Dimensions } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import StackScreens from "./src/screens/StackScreens";
import SignIn from './src/Pages/SignIn';
import PodcastScreens from './src/screens/PodcastScreens'
import TrendingPlayers from "./src/Pages/TrendingPlayers";
import CustomDrawer from "./src/components/CustomDrawer";
import { AuthContext } from "./src/components/Context";
import { UserDataContext } from "./src/components/UserDataContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultDrawer from "./src/components/DefaultDrawer";
import { NFLStatusContextProvider } from "./src/components/NFLStatusContext";
import { AllPlayersContextProvider } from "./src/components/AllPlayersContext";
import { PlayerContextProvider } from "./src/components/PlayerContext";
import TrackPlayer, { Capability } from "react-native-track-player";
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WHITE, DARK_GREEN, DARKER_GRAY, DARK_BLACK, LIGHT_BLACK } from "./src/components/Variables";
import AboutUs from "./src/Pages/AboutUs";
import Rostership from "./src/Pages/Rostership";
import * as rssParser from 'react-native-rss-parser'

const Drawer = createDrawerNavigator();
const WIDTH = Dimensions.get('window').width;

export default function App() {
  changeNavigationBarColor(DARK_BLACK);
  //const [isLoading, setIsLoading] = useState(true)
  //const [userToken, setUserToken] = useState(null)

  const setupPlayer = async() => {
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          stopWithApp:true,
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SeekTo,
                Capability.SkipToNext,
                Capability.SkipToPrevious
            ],
            compactCapabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SeekTo,
              Capability.SkipToNext,
              Capability.SkipToPrevious
            ],
            color: 'rgba(0, 206, 78,  1)'
        })
        console.log('Track Player loaded!')
    }
    catch(e) {
        console.log('Erro:',e)
    } 
    
}

const getPodcasts = async() => {
  const RSS_URL = `https://anchor.fm/s/dea812c/podcast/rss`;
  try {
      const response = await fetch(RSS_URL)
      const responseData = await response.text()
      const data = await rssParser.parse(responseData)
      setPlaylistPodcast(data.items)
  } catch(e) {
      console.log('Erro:',e)
  } 
}

const setPlaylistPodcast = async(episodesData) => {
  let playlist = []
  episodesData.map((episode, index) => { 
      playlist.push({
          url: 'https://'+episode.enclosures[0].url.split('https%3A%2F%2F')[1].replace(/%2F/g,'/'),
          title: episode.title,
          artist: episode.authors[0].name,
          artwork: episode.itunes.image,
          duration: episode.itunes.duration, //(Number(episode.enclosures[0].length) / 1000).toFixed(0),
          description: episode.description,
          date: episode.published
      })
  })

  await TrackPlayer.add(playlist);
  console.log(playlist.length,'episodes tracked')
}

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  } 

  const loginReducer = (prevState, action) => {
    switch(action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userName: action.id,
          userData: action.userData,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userData: action.userData,
          userToken: action.token,
          isLoading: false,
        }; 
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userData: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userData: action.userData,
          userToken: action.token,
          isLoading: false,
        };
    }
  }

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState)

  const authContext = useMemo(() => ({
    signIn: async(userName) => {
      //setIsLoading(false);
      //setUserToken('fgkj')
      let userToken = null;

      try {
        const response = await fetch(`https://api.sleeper.app/v1/user/${userName}`);
      const data = await response.json();
      userToken = data.user_id;

      try{
        await AsyncStorage.setItem('userToken', userToken)
        await AsyncStorage.setItem('userData',JSON.stringify(data))
        dispatch({
          type: 'LOGIN', 
          id: userName, 
          token: userToken, 
          userData: data
        })
      } catch(e){
        console.log(e)
      }
    } catch(e) {
      Vibration.vibrate()
      alert('O nome de usuário não existe')
    }



    },
    signOut: async() => {
      try{
        await AsyncStorage.removeItem('userToken')
        await AsyncStorage.removeItem('userData')
      } catch(e){
        console.log(e)
      }
      dispatch({type:'LOGOUT'})
    },
    signUp: () => {
      setIsLoading(false);
      setUserToken('fgkj')
    },
  }), [])

  const getToken = async() => {
    let userToken = null;
    let data = null;
    try{
      userToken = await AsyncStorage.getItem('userToken')
      data = await AsyncStorage.getItem('userData')
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken, userData: JSON.parse(data)})
    } catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    setupPlayer();
    getToken();
    getPodcasts();
  },[])

  if(loginState.isLoading){
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
    <AuthContext.Provider  value={authContext}>
      <AllPlayersContextProvider>
      <NFLStatusContextProvider>
      <PlayerContextProvider>
      <UserDataContext.Provider value={loginState}>
      <View style={{flex:1}}>
        <StatusBar
          animated={true}
          backgroundColor="#0B0D0F"
          barStyle="light-content"
         />
      <NavigationContainer>

        <Drawer.Navigator 
          useLegacyImplementation
          screenOptions={{
            drawerActiveBackgroundColor:LIGHT_BLACK,//'#15191C',
            drawerActiveTintColor:WHITE,
            drawerInactiveTintColor:DARKER_GRAY,
            drawerType: 'front',
            drawerLabelStyle: {marginLeft:-25, fontFamily: 'Roboto-Medium', fontSize:15},
            drawerStyle: {width:(WIDTH / 3) * 2,display: (loginState.userToken) ? 'flex' : 'none'}
          }}
          
          drawerContent={(props) => { 
            if(loginState.userToken!=null){
              return <CustomDrawer isLogged={true} dataUser={loginState} {...props} />
            } else{
              return <DefaultDrawer {...props} />
            }
          }}>

        {loginState.userToken != null ? (
          <>
          
          <Drawer.Screen name="Leagues"  component={StackScreens} options={{
            title:'Ligas',
            headerShown: false,
            drawerIcon: ({color}) => (
              <FontAwesome5 name="football-ball" size={17} color={color} />
            )}} />
          <Drawer.Screen name="TrendingPlayers" options={{
            headerShown: false,
            swipeEnabled: false,
            drawerLabel:'Jogadores' ,
            drawerIcon: ({color}) => (
              <MaterialCommunityIcons name="football-helmet"  size={22} color={color} />
          )}} component={TrendingPlayers}/>
          <Drawer.Screen name="Rostership" options={{
            headerShown: false,
            drawerLabel:'Rostership' ,
            drawerIcon: ({color}) => (
              <MaterialCommunityIcons name="football-helmet"  size={22} color={color} />
          )}} component={Rostership}/>
          <Drawer.Screen name="Podcast" options={({navigation}) => ({
            headerShown: false,
            swipeEnabled: true,
            drawerIcon: ({color}) => (
              <FontAwesome5 name="podcast" size={17} color={color} />
            )})} component={PodcastScreens}/>
          <Drawer.Screen name="Sobre" options={{
            headerShown: false,
            drawerLabel:'Sobre nós' ,
            drawerIcon: ({color}) => (
              <FontAwesome5 name="hands-helping" size={15} color={color} />
            )}} component={AboutUs}/>
          </>
        ) : (
          <Drawer.Screen name="Login" options={{headerShown: false}} component={SignIn}/>
        )}
        
          
        </Drawer.Navigator>
      </NavigationContainer>
      </View>
      </UserDataContext.Provider>
      </PlayerContextProvider>
      </NFLStatusContextProvider>
      </AllPlayersContextProvider>
    </AuthContext.Provider>
    );
}


