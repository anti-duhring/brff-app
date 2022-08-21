import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../utils/colors';
import TrendingPlayers from '../../Pages/TrendingPlayers';
import PodcastScreens from '../PodcastScreens';
import AboutUs from '../../Pages/AboutUs';
import SignIn from '../../Pages/SignIn';
import CustomDrawer from '../../components/CustomDrawer';
import DefaultDrawer from '../../components/DefaultDrawer';
import LeagueScreens from '../LeagueScreens';
import RostershipScreens from '../RostershipScreens'
import PlayerStats from '../../Pages/PlayerStats';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import TrendingPlayersScreens from '../TrendPlayersScreens';

const Drawer = createDrawerNavigator();
const WIDTH = Dimensions.get('window').width;

const DrawerScreens = () => {
    const {loginState} = useContext(AuthContext);
  return (
    <NavigationContainer>

    <Drawer.Navigator 
      useLegacyImplementation
      screenOptions={{
        drawerActiveBackgroundColor:colors.LIGHT_BLACK,//'#15191C',
        drawerActiveTintColor:colors.WHITE,
        drawerInactiveTintColor:colors.DARKER_GRAY,
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
      
      <Drawer.Screen name="Leagues"  component={LeagueScreens} options={{
        title:'Ligas',
        headerShown: false,
        drawerIcon: ({color}) => (
          <MaterialCommunityIcons name="format-list-text" size={22} color={color} />
        )}} />
      <Drawer.Screen name="TrendingPlayers" options={{
        headerShown: false,
        swipeEnabled: false,
        drawerLabel:'Jogadores' ,
        drawerIcon: ({color}) => (
          <MaterialCommunityIcons name="football-helmet"  size={22} color={color} />
      )}} component={TrendingPlayersScreens}/>
      <Drawer.Screen name="Rostership" options={{
        headerShown: false,
        drawerLabel:'Rostership' ,
        drawerIcon: ({color}) => (
          <FontAwesome5 name="football-ball" size={17} color={color} />
      )}} component={RostershipScreens}/>
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
  )
}

export default DrawerScreens

const styles = StyleSheet.create({
  barButtons: {
    backgroundColor:colors.HEADER_BUTTON_BG,
    borderRadius: 24,
    width:35,
    height:35,
    justifyContent:'center',
    alignItems:'center'
  }
})