import { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, Pressable, ActivityIndicator, Dimensions } from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesome5 } from '@expo/vector-icons';
import { WHITE, DARK_GREEN, DARKER_GRAY, DARK_BLACK, LIGHT_BLACK, LIGHT_GRAY } from "../Variables";
import TrackPlayer, { State, usePlaybackState, useProgress } from "react-native-track-player";
import { FontAwesome } from '@expo/vector-icons';
import TextTicker from 'react-native-text-ticker';
import MultiSlider from "@ptomasroos/react-native-multi-slider";

const WIDTH = Dimensions.get('window').width;

const CustomDrawer = (props) => {
    const { signOut, loginState } = useContext(AuthContext)
    const userData  = loginState.userData
    const username = userData.username;
    const displayName = userData.display_name;
    const userAvatar = userData.avatar;
    
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const playbackState = usePlaybackState();
    const { position, duration } = useProgress();

    const getCurrentTrack = async() => {
        let currentTrack = await TrackPlayer.getCurrentTrack();
        let currentTrackObject = await TrackPlayer.getTrack(currentTrack);

        setCurrentEpisode(currentTrackObject);
    }

    const togglePlayer = () => {
        if(playbackState == State.Playing) {
            TrackPlayer.pause();
        } else if(playbackState == State.Paused) {
            TrackPlayer.play();
        } else if(playbackState == State.Ready) {
            TrackPlayer.play();
        }
    }

    useEffect(() => {
        getCurrentTrack();
        //console.log(playbackState, State);
    },[playbackState]);

    const MiniPlayerImage = () => (
        <Pressable onPress={() => togglePlayer()}>
            <ImageBackground source={{uri:currentEpisode.artwork}} imageStyle={{resizeMode:'cover',borderBottomLeftRadius:5,borderTopLeftRadius:5}} style={{height:70,justifyContent:'center',alignItems:'center'}}>

                <View style={{width:45,height:45, borderRadius:45,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center'}}>

                {playbackState != State.Playing && playbackState != State.Paused && playbackState != State.Ready ? <ActivityIndicator size={24} color="white" /> : <FontAwesome name={playbackState == State.Playing ?  "pause" : "play" } size={24} color="white"  />}

                </View>
            </ImageBackground>
        </Pressable>
    )

    const MiniPlayerDuration = () => (
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={{ color:WHITE,fontSize:12 }}>{new Date(position * 1000).toISOString().substring(12, 19)}</Text>
            <Text style={{ color:WHITE,fontSize:12 }}>{new Date((duration - position) * 1000).toISOString().substring(12, 19)}</Text>
        </View>
    )

    const MiniPlayerSlider = () => (
        <MultiSlider 
            trackStyle={{height:2,backgroundColor:'rgba(0,0,0,1)',borderRadius:10}}
            markerStyle={{backgroundColor:'white',display:'none'}}
            containerStyle={{height:20,}}
            selectedStyle={{backgroundColor:'white'}}
            sliderLength={(WIDTH / 3) * 1.3}
            values={[position]}
            min={0}
            max={duration > 0 && isNaN(duration) == false ? duration : 100}
            />
    )

    return (
    <View style={{flex:1,backgroundColor:DARK_BLACK}}>
        <ImageBackground /*blurRadius={2}*/ imageStyle={{resizeMode:'cover'}} style={styles.userContainer} source={require('../../../assets/Images/leagueHeader2.png')}>
            <View style={styles.drawerUser}>
                <View style={styles.drawerImage}>
                    {<Image
                        style={styles.drawerImageAvatar}
                        source={{uri: `http://sleepercdn.com/avatars/${userAvatar}`}}/>}
                </View>
                <View style={styles.drawerName}>
                    <Text style={styles.drawerNameText}>{displayName}</Text>
                    <Text style={styles.drawerUsernameText}>@{username}</Text>
                </View>
            </View>
        </ImageBackground>
        <DrawerContentScrollView style={styles.drawerContainer} {...props}>  
            <DrawerItemList {...props} />
            <DrawerItem
                label="Sair"
                icon={({color}) => (
                    <FontAwesome5 name="sign-out-alt"  size={17} color={color} />
                )}
                labelStyle={{marginLeft:-25, fontFamily: 'Roboto-Medium', fontSize:15}}
                activeTintColor={WHITE}
                inactiveTintColor={DARKER_GRAY}
                activeBackgroundColor={DARK_GREEN}
                onPress={() => signOut()}
            />
        </DrawerContentScrollView>
        {currentEpisode &&         
            <View style={styles.miniPlayerContainer}>
                <View style={{flex:1}}>
                    <MiniPlayerImage />
                </View>
                <View style={styles.miniPlayerSliderContainer}>
                    <Pressable onPress={async() =>                       
                    props.navigation.navigate('Podcast',{
                        screen: 'Episode',
                        params: {
                            episodeObject: currentEpisode,
                            episodeName: currentEpisode.title,
                            episodeID: await TrackPlayer.getCurrentTrack(),
                        }
                    })}>
                    <TextTicker
                        style={{ color:WHITE }}
                        duration={150 * currentEpisode.title.replace(/[0-9]x[0-9][0-9] /g,'').replace('- ','').length}
                        loop
                        bounce 
                    >
                    {currentEpisode.title.replace(/[0-9]x[0-9][0-9] /g,'').replace('- ','')}
                    </TextTicker>
                    <MiniPlayerSlider />
                    <MiniPlayerDuration />
                    </Pressable>
                </View>
            </View>}
    </View>
    );
}
 
export default CustomDrawer;

const styles = StyleSheet.create({
    drawerContainer: {
        backgroundColor: '#0B0D0F',
    },
    userContainer: {
        height:150,
        alignItems:'center',
        justifyContent:'center'
    },
    drawerImage: {
        alignContent:'center',
        alignItems:'center'
    },
    drawerImageAvatar:{
        width:80,
        height:80,
        borderRadius:40,
    },
    drawerName: {
        alignContent:'center',
        alignItems:'center'
    },
    drawerNameText:{
        fontWeight:'bold',
        color:'#FCFCFC',
        fontSize:15,
    },
    drawerUsernameText: {
        color: 'rgba(0,0,0,0.6)',
        fontSize:13,
    },  
    logoutContainer:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:20,
    },
    buttonLogout: {
        textAlign:'center',
        backgroundColor:'red',
        color:'white',
        paddingTop:10,
        paddingBottom:10,
        borderRadius:5,
        width:'50%',
      },
      text: {
        textAlign:'center',
        color:'#C6C6C6'
      },
      miniPlayerContainer: {
        backgroundColor:DARK_BLACK,
        flexDirection:'row',
        marginHorizontal:10,
        marginBottom:40
      },
      miniPlayerSliderContainer: {
        flex:3,
        backgroundColor:LIGHT_BLACK,
        height:70,
        borderBottomRightRadius:5,
        borderTopRightRadius:5,
        paddingHorizontal:10,
        paddingVertical:5
      }
})