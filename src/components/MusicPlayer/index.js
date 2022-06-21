import { useEffect, useState, useContext } from "react";
import { View, Text, Pressable, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { PlayerContext } from "../PlayerContext";
import { HEADER_BUTTON_BG } from "../Variables";

const WIDTH = Dimensions.get('window').width;

const MusicPlayer = ({track, trackIndex, isThePlayerInEpisodePage}) => { 
    const [currentTrack, setCurrentTrack] = useState(null)
    const { 
        playbackState,
        position,
        duration,
        togglePlayback
    } = useContext(PlayerContext)

    const getCurrentTrack = async() => {
        const index = await TrackPlayer.getCurrentTrack()
        setCurrentTrack(index)
    }

    useEffect(() => {
        getCurrentTrack()
    },[])
    if(isThePlayerInEpisodePage) {
        return (
            <View>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <View style={{marginRight:30,}}>
                    <View style={styles.prevNextButton}>
                        <Pressable onPress={() => {alert('Prev!!')}}>
                        <MaterialIcons name="skip-previous" size={24} color="white" />
                        </Pressable>
                    </View>
                </View>
                <View>
                    <View style={styles.playerButton}>
                        <Pressable onPress={() => {togglePlayback(playbackState, track, trackIndex); setCurrentTrack(trackIndex)}}>
                            {playbackState == State.Buffering || playbackState == State.Connecting ? <ActivityIndicator size={24} color="white" /> : <FontAwesome name={playbackState == State.Playing &&  currentTrack == trackIndex ?  "pause" : "play" } size={24} color="white"  />}
                        </Pressable>
                    </View>
                </View>
                <View style={{marginLeft:30,}}>
                    <View style={styles.prevNextButton}>
                        <Pressable onPress={() => {alert('Prev!!')}}>
                        <MaterialIcons name="skip-next" size={24} color="white" />
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={{ justifyContent:'center', alignItems:'center',marginHorizontal:20,}}>
                <MultiSlider 
                    trackStyle={{backgroundColor:'rgba(0,0,0,0.1)'}}
                    markerStyle={{backgroundColor:'white'}}
                    containerStyle={{height:20}}
                    selectedStyle={{backgroundColor:'white'}}
                    values={currentTrack == trackIndex ? [position] : [0]}
                    min={0}
                    sliderLength={WIDTH - 40}
                    max={duration > 0 && currentTrack == trackIndex && isNaN(duration) == false ? duration : 100}
                    onValuesChangeFinish={async(values) => {
                        await TrackPlayer.seekTo(values[0])
                    }}
                />
                <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                    <Text style={{color:'white'}} >
                        {
                            currentTrack == trackIndex ?
                            new Date(position * 1000).toISOString().substring(12, 19) :
                            '0:00:00'
                        }
                    </Text>
                    <Text style={{color:'white'}} >
                        {
                            currentTrack == trackIndex ?
                            new Date((duration - position) * 1000).toISOString().substring(12, 19) : 
                            '0:00:00'
                        }
                    </Text>
                </View>
            </View>
            </View>
        )
    }
    return ( 
        <View>
                <View style={{flexDirection:'row'}}>
                    <View style={{ paddingRight: 5,flex:1, justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity onPress={() => {togglePlayback(playbackState, track, trackIndex); setCurrentTrack(trackIndex)}}>
                            {playbackState == State.Buffering || playbackState == State.Connecting ? <ActivityIndicator size={24} color="white" /> : <FontAwesome name={playbackState == State.Playing &&  currentTrack == trackIndex ?  "pause" : "play" } size={24} color="white" />}
                        </TouchableOpacity>
                    </View>
                    <View style={{padding:5, flex:7, justifyContent:'center', alignContent:'flex-start'}}>
                        <View>
                            <MultiSlider 
                                trackStyle={{backgroundColor:'rgba(0,0,0,0.1)'}}
                                markerStyle={{backgroundColor:'white'}}
                                containerStyle={{height:20}}
                                selectedStyle={{backgroundColor:'white'}}
                                values={currentTrack == trackIndex ? [position] : [0]}
                                min={0}
                                sliderLength={280}
                                max={duration > 0 && currentTrack == trackIndex && isNaN(duration) == false ? duration : 100}
                                onValuesChangeFinish={async(values) => {
                                    await TrackPlayer.seekTo(values[0])
                                }}
                            />
                        </View>
                        <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                            <Text style={{color:'white'}} >{
                                currentTrack == trackIndex ?
                                new Date(position * 1000).toISOString().substring(12, 19) :
                                '0:00:00'
                            }</Text>
                            <Text style={{color:'white'}} >{
                                currentTrack == trackIndex ?
                                new Date((duration - position) * 1000).toISOString().substring(12, 19) : 
                                '0:00:00'
                            }</Text>
                        </View>
                    </View>
                </View>
        </View>
     );
}
 
export default MusicPlayer;

const styles = StyleSheet.create({
    playerButton: {
        backgroundColor:HEADER_BUTTON_BG,
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:50,
    },
})