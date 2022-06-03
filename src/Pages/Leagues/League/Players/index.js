import { useRef, useState, useEffect } from "react";
import { Text, View, Image, Animated, Pressable } from "react-native";
import TabTopLeague from '../TabTopLeague'
import { scaleAnimation } from '../../../../animations/scale'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
//import { useFocusEffect } from "@react-navigation/native";
import { HeaderLeagueContextProvider } from "../../../../components/HeaderLeagueContext";

const Players = ({navigation, route}) => {
    const leagueId = route.params?.leagueObject.league_id;
    const leagueObject = route.params?.leagueObject;
    const [isLoading, setIsLoading] = useState(true)
    const [players, setPlayers] = useState([])
    const [DATA, setDATA] = useState([])
    const animateX = useRef(new Animated.Value(1)).current;
    const [itemAnimate, setItemAnimate] = useState(null);

    const getInfos = async() => {
            fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`)
            .then(response => response.json())
            .then((data) => {
                setPlayers(data)
                setDATA(
                    data.map((player, index) => {
                      return {
                        key: player.user_id,
                        avatar: player.avatar,
                        name: player.display_name,
                        teamname: player.metadata.team_name,
                        playerObject: player
                      }
                    })
                  )
                setIsLoading(false)
            })
            .catch((error) => {
              console.log('Erro:',error)
            })
          
    }
useEffect(() => {
    getInfos();
},[])

    return ( 
    <View style={{flex:1,backgroundColor:'#0B0D0F',}}>
      <HeaderLeagueContextProvider leagueObject={leagueObject}>
      <TabTopLeague activeButton={route.params?.active}   />
          {isLoading ?
          <View style={{flex:1,padding:10,}}>
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
    <View style={{padding:10,marginBottom:10}}>
      { DATA.map((item, index) => {
        const NEWavatar = item.avatar;

        return (
        <Animated.View
          key={item.key}
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
          transform:[{scale: (itemAnimate == item.key) ? animateX : 1}],
          }}
        >
        <Pressable onPressIn={() => setItemAnimate(item.key)} onPress={() =>{ 
        scaleAnimation(animateX,() => {
          navigation.navigate('PlayerProfile',{
            playerObject: item.playerObject,
            leagueID: leagueId,
            roster: leagueObject.roster_positions
          })
        })}}>
            <View style={{flexDirection:'row'}}>
            <Image 
              source={{uri: `https://sleepercdn.com/avatars/${NEWavatar}`}} 
              style={{width:70,height:70,borderRadius:12,marginRight:10}}
            />
            
          
          <View style={{justifyContent:'center'}}>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:15,fontWeight:'700',color:'#C6C6C6'}}>{item.name}</Text> 
              {item.playerObject.is_owner==true&&<Text style={{fontSize:15,color:'#008037',marginLeft:5,fontStyle:'italic'}}>Comissário</Text>}
            </View>
            <Text style={{fontSize:12,color:'#656668',}}>{(item.teamname!=null) ? item.teamname : `${item.name}'s team`}</Text> 
          </View>
          </View>
          </Pressable>
        </Animated.View>
        )
    })
      }
    </View>
    }
          </HeaderLeagueContextProvider>
        </View> 
        );
}
 
export default Players;

