import { TouchableOpacity, StyleSheet } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Informations from './Informations'
import Geral from './Geral'
import Players from './Players'
import PlayerProfile from "./Players/PlayerProfile";
import Matchups from "./Matchups";
import PlayoffBracket from "./PlayoffBracket";

const Stack = createStackNavigator();

const League = ({navigation, route}) => {

    return ( 
        <Stack.Navigator initialRouteName="Players" screenOptions={{animationTypeForReplace:'pop'}}>
          <Stack.Screen name="PlayerProfile" initialParams={{playerObject:route.params?.playerObject}} options={{
            title:null,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10, marginTop:-30}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            )}} component={PlayerProfile} />

          <Stack.Screen name="Players" initialParams={{leagueObject:route.params?.leagueObject}} options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10, marginTop:-30}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            }} component={Players} />

          <Stack.Screen name="Informations" initialParams={{leagueObject:route.params?.leagueObject}} options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10, marginTop:-30}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            }} component={Informations} />

          <Stack.Screen name="Matchups" initialParams={{leagueObject:route.params?.leagueObject}} options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10, marginTop:-30}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
          }} component={Matchups} />

          <Stack.Screen name="Team" initialParams={{leagueObject:route.params?.leagueObject}} options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10, marginTop:-30}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            }} component={Geral} />

            <Stack.Screen name="PlayoffBracket" initialParams={{leagueObject:route.params?.leagueObject}} options={{
            title: '',//route.params?.leagueName,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10, marginTop:-30}]} onPress={() => navigation.navigate('LeagueList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            }} component={PlayoffBracket} />

        </Stack.Navigator>
    )
}
 
export default League;

const styles = StyleSheet.create({
    goBackButton:{
      marginRight:10,
    }
  })