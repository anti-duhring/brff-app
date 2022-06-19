import { TouchableOpacity, StyleSheet, Share, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Episode from '../../Pages/Episode';
import EpisodeList from '../../Pages/EpisodeList';

import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
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

const PodcastScreens = ({navigation,route, initialRoute}) => {

  const onShare = async(episodeTitle, episodeLink) => {
    try {
      const result = await Share.share({
        message: 
        `Estou ouvindo o episódio "${episodeTitle}" do Podcast do BrFF.
Ouça você também! ${episodeLink}`
      })
            if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      }
    } catch (e) {
      alert(e)
    }
  }

    return ( 
        <Stack.Navigator initialRouteName='EpisodeList' screenOptions={{
            animation:'slide_from_bottom',
            presentation:'card'
          }}>

            <Stack.Screen  name="EpisodeList"  options={{ 
              headerTransparent: true,
              title:'',
              headerLeft: () => (
                <Pressable style={styles.toggleButton} onPress={() => navigation.toggleDrawer()}>
                  <Entypo name="menu" size={24} color="#C6C6C6" />
                </Pressable>
               )}
              } component={EpisodeList} />

          <Stack.Screen name="Episode" options={({route}) => ({ 
            title: '',
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.barButtons,{marginLeft:10}]} onPress={() => navigation.navigate('EpisodeList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity style={{marginRight:10,}} onPress={() => {
                onShare(route.params?.episodeName, route.params?.episodeObject.links[0].url)
              }}>
                <Entypo name="share" size={24} color="white" />
              </TouchableOpacity>
            )
          })} component={Episode} />
            
        </Stack.Navigator>
     );
}
 
export default PodcastScreens;

const styles = StyleSheet.create({
    goBackButton:{
      marginRight:10,
    },
    toggleButton: {
      marginLeft: 10,
    }
  })