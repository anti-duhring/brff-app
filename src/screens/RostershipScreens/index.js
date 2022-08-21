import { TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import LeagueList from '../../Pages/LeagueList';
import Informations from '../../Pages/Informations';
import MyTeam from '../../Pages/MyTeam';
import Players from '../../Pages/Players'
import PlayerProfile from '../../Pages/PlayerProfile';
import Matchups from '../../Pages/Matchups';
import PlayoffBracket from '../../Pages/PlayoffBracket';
import Rostership from '../../Pages/Rostership'
import AdvancedStats from '../../Pages/AdvancedStats'

import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native-reanimated'; 
import { HEADER_BUTTON_BG } from '../../components/Variables';
import PlayerStats from '../../Pages/PlayerStats';

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

const RostershipScreens = ({route}) => {


    return ( 
        <Stack.Navigator screenOptions={{
            animation:'slide_from_bottom',
            presentation:'card',
          }}>
  


          <Stack.Screen 
            name="RostershipList"  
            component={Rostership} 
            options={({navigation,route}) => ({
              headerShown: false
              })}
          />

            <Stack.Screen 
              name="AdvancedStats" 
              options={({navigation,route}) => ({
                title: '',//route.params?.leagueName,
                headerTransparent: true,
                headerLeft: () => (
                  <TouchableOpacity style={[styles.barButtons,{marginLeft:10}]} onPress={() => navigation.navigate('Rostership')}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                  </TouchableOpacity>
                ),
                presentation:'modal'
                })} 
                component={AdvancedStats} 
              />
            
        </Stack.Navigator>
     );
}
 
export default RostershipScreens;

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