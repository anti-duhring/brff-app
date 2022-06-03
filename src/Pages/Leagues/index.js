import { Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import League from './League'
import LeagueList from './LeagueList'
import { Entypo } from '@expo/vector-icons';
import { Easing } from 'react-native-reanimated'; 

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

const Leagues = ({navigation, route}) => {
    return ( 
        <Stack.Navigator initialRouteName="LeagueList" screenOptions={{
          animation:'slide_from_bottom',
          presentation:'card'
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

          <Stack.Screen name="League" options={{headerShown:false}} component={League} />
          
        </Stack.Navigator>

     );
}
 
export default Leagues;

const styles = StyleSheet.create({
  goBackButton:{
    marginRight:10,
  },
  toggleButton: {
    marginLeft: 10,
  }
})