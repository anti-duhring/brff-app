import { useEffect, useState, useContext } from "react";
import { View, Text, Pressable, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import TrackPlayer, { State, useProgress } from "react-native-track-player";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { TrackPlayerContext } from "../../context/TrackPlayerContext";
import { HEADER_BUTTON_BG, LIGHT_GREEN } from "../Variables";
import { getWhereEpisodeStopped } from "../../utils/trackPlayer";

const WIDTH = Dimensions.get('window').width;

const MusicPlayer = ({track, trackIndex, navigation, reRender}) => { 
    const [currentTrack, setCurrentTrack] = useState(null)
    const [prevEpisode, setPrevEpisode] = useState(null);
    const [nextEpisode, setNextEpisode] = useState(null);
    const [trackAlreadyPlayed, setTrackAlreadyPlayed] = useState(0);
    const [thisEpisodeDuration, setThisEpisodeDuration] = useState(100);
    const { 
        playbackState,
        togglePlayback,
    } = useContext(TrackPlayerContext)
    const {position, buffered, duration} = useProgress();

    const getCurrentTrack = async() => {
        const index = await TrackPlayer.getCurrentTrack();
        setCurrentTrack(index);
    }

    const getThisEpisodeTrackPlayed = async() => {
        const thisEpisodeObj = await TrackPlayer.getTrack(trackIndex);
        const thisEpisodeDur = thisEpisodeObj.duration;
        const thisEpisodeDurInSeconds = Number(thisEpisodeDur.split(':')[0]) * 60 * 60 + Number(thisEpisodeDur.split(':')[1]) * 60 + Number(thisEpisodeDur.split(':')[2]);
        const trackURL = thisEpisodeObj.url;
        const trackPrevPlay = await getWhereEpisodeStopped(trackURL);

        setTrackAlreadyPlayed(trackPrevPlay);
        setThisEpisodeDuration(thisEpisodeDurInSeconds);
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
    },[trackIndex,reRender])

    useEffect(() => {
        getThisEpisodeTrackPlayed();
    },[trackIndex, playbackState])

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
            <Pressable onPress={() => {togglePlayback(trackIndex); setCurrentTrack(trackIndex)}}>

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
                values={currentTrack == trackIndex && playbackState == State.Playing ? [position] : [trackAlreadyPlayed]}
                min={0}
                sliderLength={WIDTH - 60}
                max={duration > 0 && currentTrack == trackIndex && isNaN(duration) == false ? duration : thisEpisodeDuration}
                onValuesChangeFinish={async(values) => {
                    await TrackPlayer.seekTo(values[0])
                }}
            />
            <View style={{flexDirection:'row', width:'95%', justifyContent:'space-between'}}>
                <Text style={{color:'white'}} >
                    {
                        currentTrack == trackIndex && playbackState == State.Playing ?
                        new Date(position * 1000).toISOString().substring(12, 19) :
                        new Date(trackAlreadyPlayed * 1000).toISOString().substring(12, 19)
                    }
                </Text>
                <Text style={{color:'white'}} >
                    {
                        currentTrack == trackIndex ?
                        new Date((duration - position) * 1000).toISOString().substring(12, 19) : 
                        new Date((thisEpisodeDuration - trackAlreadyPlayed) * 1000).toISOString().substring(12, 19)
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