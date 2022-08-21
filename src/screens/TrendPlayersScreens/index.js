import { TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import TrendingPlayers from '../../Pages/TrendingPlayers'
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { HEADER_BUTTON_BG } from '../../components/Variables';
import PlayerStats from '../../Pages/PlayerStats';

const Stack = createStackNavigator()

const TrendingPlayersScreens = ({route}) => {


    return ( 
        <Stack.Navigator  screenOptions={{
            animation:'slide_from_bottom',
            presentation:'card',
          }}>
  
            <Stack.Screen 
                name="TrendingPlayersList"  
                options={({navigation}) => ({ 
                headerShown: false})} 
                component={TrendingPlayers} 
            />

          <Stack.Screen 
            name="PlayerStats" 
            options={({navigation,route}) => ({
              title:null,
              headerTransparent: true,
              headerLeft: () => (
                <TouchableOpacity style={[styles.barButtons,{marginLeft:10}]} onPress={() =>navigation.goBack()}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              )})} 
            component={PlayerStats} 
          />
        </Stack.Navigator>
     );
}
 
export default TrendingPlayersScreens;

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