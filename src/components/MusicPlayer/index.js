import { useEffect, useState, useContext } from "react";
import { View, Text, Pressable, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import TrackPlayer, { State } from "react-native-track-player";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { PlayerContext } from "../PlayerContext";
import { HEADER_BUTTON_BG } from "../Variables";

const WIDTH = Dimensions.get('window').width;

const MusicPlayer = ({track, trackIndex, navigation}) => { 
    const [currentTrack, setCurrentTrack] = useState(null)
    const [prevEpisode, setPrevEpisode] = useState(null);
    const [nextEpisode, setNextEpisode] = useState(null);
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

    const getPrevAndNextEpisode = async() => {
        const prevTrack = await TrackPlayer.getTrack((trackIndex > 0) ? trackIndex - 1 : 0);
        const nextTrack = await TrackPlayer.getTrack(trackIndex + 1);

        setPrevEpisode(prevTrack);
        setNextEpisode(nextTrack);
    }

    useEffect(() => {
        getCurrentTrack();
        getPrevAndNextEpisode();
    },[trackIndex])

    const NextAndPrevButton = ({action}) => {
        const conditional = (action=='prev') ? !prevEpisode || trackIndex<=0 : !nextEpisode;
        const params = (action=='prev') ? {
            episodeObject: prevEpisode,
            episodeName: prevEpisode.title,
            episodeID: trackIndex - 1,
        } : {
            episodeObject: nextEpisode,
            episodeName: nextEpisode.title,
            episodeID: trackIndex + 1,
        }

        return (
            <Pressable onPress={() => { 
                if(conditional) return

                navigation.navigate('Episode', params)
            }}>
            <MaterialIcons name={(action=='prev') ? `skip-previous` : `skip-next`} size={30} color="white" />
            </Pressable>
        )
    }

    const PlayPauseButton = () => {
        return (
            <Pressable onPress={() => {togglePlayback(playbackState, track, trackIndex); setCurrentTrack(trackIndex)}}>

            {playbackState == State.Buffering || playbackState == State.Connecting ? <ActivityIndicator size={30} color="white" /> : <FontAwesome name={playbackState == State.Playing &&  currentTrack == trackIndex ?  "pause" : "play" } size={30} color="white"  />}

            </Pressable>
        )
    }

    return (
        <View>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <View style={{marginRight:30,}}>
                <View style={[styles.prevNextButton,{opacity:(!prevEpisode || trackIndex<=0)? 0.3 : 1}]}>
                    {prevEpisode && <NextAndPrevButton action='prev' />}
                </View>
            </View>
            <View>
                <View style={styles.playerButton}>
                    <PlayPauseButton />
                </View>
            </View>
            <View style={{marginLeft:30,}}>
                <View style={[styles.prevNextButton,{opacity:(!nextEpisode)? 0.3 : 1}]}>
                    {nextEpisode && <NextAndPrevButton action='next' />}
                </View>
            </View>
        </View>
        <View style={{ justifyContent:'center', alignItems:'center',marginHorizontal:20,}}>
            <MultiSlider 
                trackStyle={{height:2,backgroundColor:'rgba(0,0,0,0.3)',borderRadius:10}}
                markerStyle={{backgroundColor:'white'}}
                containerStyle={{height:20}}
                selectedStyle={{backgroundColor:'white'}}
                values={currentTrack == trackIndex ? [position] : [0]}
                min={0}
                sliderLength={WIDTH - 60}
                max={duration > 0 && currentTrack == trackIndex && isNaN(duration) == false ? duration : 100}
                onValuesChangeFinish={async(values) => {
                    await TrackPlayer.seekTo(values[0])
                }}
            />
            <View style={{flexDirection:'row', width:'95%', justifyContent:'space-between'}}>
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
 
export default MusicPlayer;

const styles = StyleSheet.create({
    playerButton: {
        backgroundColor:HEADER_BUTTON_BG,
        width:60,
        height:60,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:60,
    },
})