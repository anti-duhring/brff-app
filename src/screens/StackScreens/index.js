import { TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import LeagueList from '../../Pages/LeagueList';
import Informations from '../../Pages/Informations';
import MyTeam from '../../Pages/MyTeam';
import Players from '../../Pages/Players'
import PlayerProfile from '../../Pages/PlayerProfile';
import Matchups from '../../Pages/Matchups';
import PlayoffBracket from '../../Pages/PlayoffBracket';

import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native-reanimated'; 
import { HEADER_BUTTON_BG } from '../../components/Variables';

const Stack = createStackNavigator()

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootCampling: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  }
}

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 200,
    easing: Easing.linearm
  }
}

const StackScreens = ({navigation,route}) => {


    return ( 
        <Stack.Navigator initialRouteName='LeagueList' screenOptions={{
            animation:'slide_from_bottom',
            presentation:'card',
          }}>
  
            <Stack.Screen name="LeagueList"  options={{ 
            title:'',
            headerTitleStyle:{color:'#FCFCFC'},
            headerTransparent: true,
            headerLeft: () => (
             <Pressable style={styles.toggleButton} onPress={() => navigation.toggleDrawer()}>
               <Entypo name="menu" size={24} color="#C6C6C6" />
             </Pressable>
            ) }} component={LeagueList} />
  

            <Stack.Screen name="PlayerProfile" options={{
            title:null,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10}]} onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            )}} component={PlayerProfile} />

          <Stack.Screen name="Players" options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10}]} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            }} component={Players} />

          <Stack.Screen name="Informations" options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            }} component={Informations} />

          <Stack.Screen name="Matchups"  options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
          }} component={Matchups} />

          <Stack.Screen name="Team"  options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            }} component={MyTeam} />

            <Stack.Screen name="PlayoffBracket"  options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            }} component={PlayoffBracket} />
            
        </Stack.Navigator>
     );
}
 
export default StackScreens;

const styles = StyleSheet.create({
    goBackButton:{
      marginRight:10,
    },
    toggleButton: {
      marginLeft: 10,
    },
    barButtons: {
      backgroundColor:HEADER_BUTTON_BG,
      borderRadius: 24,
      width:35,
      height:35,
      justifyContent:'center',
      alignItems:'center'
    }
  })