import { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, Pressable, ActivityIndicator } from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { AuthContext } from '../../components/Context';
import { UserDataContext } from "../UserDataContext";
import { FontAwesome5 } from '@expo/vector-icons';
import { WHITE, DARK_GREEN, DARKER_GRAY, DARK_BLACK, LIGHT_BLACK, LIGHT_GRAY } from "../Variables";
import TrackPlayer, { State, usePlaybackState } from "react-native-track-player";
import { FontAwesome } from '@expo/vector-icons';
import TextTicker from 'react-native-text-ticker'

const CustomDrawer = (props) => {
    const { signOut } = useContext(AuthContext)
    const { userData } = useContext(UserDataContext)
    const username = userData.username;
    const displayName = userData.display_name;
    const userAvatar = userData.avatar;
    
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const playbackState = usePlaybackState();

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

    const MiniPlayer = () => (
        <View style={{backgroundColor:DARK_BLACK,flexDirection:'row',marginHorizontal:10}}>
            <View style={{flex:1}}>
            <Pressable onPress={async() =>                       
                props.navigation.navigate('Podcast',{
                    screen: 'Episode',
                    params: {
                        episodeObject: currentEpisode,
                        episodeName: currentEpisode.title,
                        episodeID: await TrackPlayer.getCurrentTrack(),
                    }
                })}>
                <ImageBackground source={{uri:currentEpisode.artwork}} imageStyle={{resizeMode:'cover',borderBottomLeftRadius:5,borderTopLeftRadius:5}} style={{height:70,justifyContent:'center',alignItems:'center'}}>

                    <Pressable style={{width:50,height:50, borderRadius:50,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center'}} onPress={() => {togglePlayer();}}>

                    {playbackState == State.Buffering || playbackState == State.Connecting ? <ActivityIndicator size={24} color="white" /> : <FontAwesome name={playbackState == State.Playing ?  "pause" : "play" } size={24} color="white"  />}

                    </Pressable>
                </ImageBackground>
            </Pressable>
            </View>
            <View style={{flex:3,backgroundColor:LIGHT_BLACK,height:70,borderBottomRightRadius:5,borderTopRightRadius:5,paddingHorizontal:10,paddingVertical:5}}>
                <TextTicker
                    style={{ color:WHITE }}
                    duration={150 * currentEpisode.title.replace(/[0-9]x[0-9][0-9] /g,'').replace('- ','').length}
                    loop
                    bounce
                    scrollSpeed={100}
                >
                {currentEpisode.title.replace(/[0-9]x[0-9][0-9] /g,'').replace('- ','')}
                </TextTicker>
            </View>
        </View>
    )

    return (
    <View style={{flex:1}}>
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
            {currentEpisode && <MiniPlayer />}
        </DrawerContentScrollView>
        
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
      }
})