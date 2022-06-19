import { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, Pressable, ActivityIndicator, ScrollView, FlatList, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { NFLStatusContext } from '../../components/NFLStatusContext'
import { scaleAnimation } from '../../animations/scale'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const Stack = createStackNavigator()

const Leagues = ({navigation}) => {
    const { season } = useContext(NFLStatusContext)
    const { week } = useContext(NFLStatusContext)
    const [leagues, setLeagues] = useState([]) 
    const [isLoading, setIsLoading] = useState(true)
    const [DATA, setDATA] = useState([])
    const animateX = useRef(new Animated.Value(1)).current;
    const ITEM_SIZE = 70 + 10 * 3;
    const [itemAnimate, setItemAnimate] = useState(null);

    const getInfos = async() => {
        let userToken = null;
        try{
            userToken = await AsyncStorage.getItem('userToken')
            
          } catch(e){
            console.log(e)
          }

          if(userToken){
            fetch(`https://api.sleeper.app/v1/user/${userToken}/leagues/nfl/${season}`)
            .then(response => response.json())
            .then((data) => {
                setLeagues(data)
                setDATA(
                  data.map((league, index) => {
                    return {
                      key: index,
                      avatar: league.avatar,
                      name: league.name,
                      status: league.status.replace('_',' ').toUpperCase(),
                      leagueObject: league
                    }
                  })
                )

                setIsLoading(false)
            })
            .catch((error) => {
              console.log('Erro:',error)
            })

          }
    }


useEffect(() => {

      getInfos();
   
},[season])


    return ( 
        <View style={{flex:1,backgroundColor:'#0B0D0F',paddingTop:50}}>
          {isLoading ? 
      <View style={{flex:1,padding:10,}}>
            <View style={{padding:10,paddingTop:0,paddingLeft:0}}>
              <Text style={{fontSize:24,color:'#FCFCFC', fontWeight:'bold'}}>Minhas Ligas</Text>
            </View>
        <SkeletonPlaceholder>
        </SkeletonPlaceholder>
            <View style={{padding:10, marginBottom:10,backgroundColor:'transparent'}}>
              <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <View style={{ marginLeft:0,width:70,height:70,borderRadius:12 }} />
                  <View style={{ marginLeft: 20 }}>
                    <View style={{ width: 200, height: 20, borderRadius: 4 }} />
                    <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
                  </View>
    
                </View>
              </SkeletonPlaceholder>
            </View>
            <View style={{padding:10, marginBottom:10,backgroundColor:'transparent'}}>
              <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <View style={{ marginLeft:0,width:70,height:70,borderRadius:12 }} />
                  <View style={{ marginLeft: 20 }}>
                    <View style={{ width: 200, height: 20, borderRadius: 4 }} />
                    <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
                  </View>
    
                </View>
              </SkeletonPlaceholder>
            </View>
            <View style={{padding:10, marginBottom:10,backgroundColor:'transparent'}}>
              <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <View style={{ marginLeft:0,width:70,height:70,borderRadius:12 }} />
                  <View style={{ marginLeft: 20 }}>
                    <View style={{ width: 200, height: 20, borderRadius: 4 }} />
                    <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
                  </View>
    
                </View>
              </SkeletonPlaceholder>
            </View>
            <View style={{padding:10, marginBottom:10,backgroundColor:'transparent'}}>
              <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <View style={{ marginLeft:0,width:70,height:70,borderRadius:12 }} />
                  <View style={{ marginLeft: 20 }}>
                    <View style={{ width: 200, height: 20, borderRadius: 4 }} />
                    <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
                  </View>
    
                </View>
              </SkeletonPlaceholder>
            </View>
            <View style={{padding:10, marginBottom:10,backgroundColor:'transparent'}}>
              <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <View style={{ marginLeft:0,width:70,height:70,borderRadius:12 }} />
                  <View style={{ marginLeft: 20 }}>
                    <View style={{ width: 200, height: 20, borderRadius: 4 }} />
                    <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
                  </View>
    
                </View>
              </SkeletonPlaceholder>
            </View>
      </View>
      :
      <Animated.FlatList
            data={DATA}
            keyExtractor={item => item.key}
            contentContainerStyle={{
              padding:10,
            }}
            ListHeaderComponent={() => (
            <View style={{padding:10,paddingTop:0,paddingLeft:0}}>
              <Text style={{fontSize:24,color:'#FCFCFC', fontWeight:'bold'}}>Minhas Ligas</Text>
            </View>
            )}
            renderItem={({item, index}) => {
              let NEWavatar = `https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png`;
              if(item.avatar!=null) { 
                NEWavatar = `https://sleepercdn.com/avatars/${item.avatar}`
              }
              return <Animated.View
                style={{ borderRadius:12,marginBottom:10,padding:10,
                shadowColor:'#000',
                shadowOffset: {
                  width: 0,
                  height:10
                },
                shadowOpacity:1,
                shadowRadius:20,
                elevation:10,
                borderWidth:1,
                borderColor: (itemAnimate == item.key) ? 'rgba(0, 128, 55, 1)' : 'rgba(255,255,255,0)',
                backgroundColor: '#15191C',
                transform:[{scale: (itemAnimate == item.key) ? animateX : 1}]
                }}
              >
              <Pressable onPressIn={() => setItemAnimate(item.key)} onPress={() =>{ 
              scaleAnimation(animateX,() => {
                navigation.navigate('Players',{
                  leagueObject: item.leagueObject,
                  leagueName: item.name
                })
              })}}>
                  <View style={{flexDirection:'row'}}>
                  <Image 
                    source={{uri:NEWavatar}} 
                    style={{width:70,height:70,borderRadius:12,marginRight:10}}
                  />
                  
                
                <View style={{justifyContent:'center',}}>
                  <Text style={{fontSize:15,fontWeight:'700',color:'#C6C6C6',width:250}}>{item.name}</Text>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{
                      fontSize:12,color:'rgba(0, 128, 55, 1)',fontWeight:'bold',
                      textShadowColor: 'rgba(0, 128, 55, 1)',
                      textShadowOffset: {width: 0, height: 0},
                      textShadowRadius: 10
                      }}>● </Text>
                      <Text style={{
                        fontSize:12,color:'rgba(0, 128, 55, 1)',
                        }}>{item.status}</Text>
                    </View>
                </View>
                </View>
                </Pressable>
              </Animated.View>
              
            }}
          /> }   
        </View>
     );
}
 
export default Leagues;

const styles = StyleSheet.create({
  container:{
  },
  leagueContainer:{
    flexDirection:'row',
    margin:10,
    padding:10,
    paddingTop:15,
    paddingBottom:15,
    borderRadius:5,
  },
  imageContainer:{},
  imageLeague:{
    width:50,
    height:50,
    borderRadius:100,
  },
  infoContainer:{
    marginLeft:10,
    justifyContent:'center',
  },
  leagueName:{
    fontWeight:'bold',
    fontSize:17,
    color:'white'
  },
  leagueStatus:{
    fontSize:10,
    color:'white', //'#008037',
    /*textShadowColor: 'blue',//'rgba(0, 128, 55, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5*/
  }
})