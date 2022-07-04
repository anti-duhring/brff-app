import { createContext} from "react"
import TrackPlayer, { State, usePlaybackState, useProgress } from "react-native-track-player";

export const PlayerContext = createContext()

export const PlayerContextProvider = ({children}) => {
    const playbackState = usePlaybackState();
    const { position, duration } = useProgress();


    const togglePlayback = async(playbackState, track, trackIndex) => {
        let currentTrack = await TrackPlayer.getCurrentTrack();



        if(currentTrack!=trackIndex){
            await TrackPlayer.skip(trackIndex)
            await TrackPlayer.play();
            return
        }

        if(currentTrack != null) {
            if(playbackState == State.Paused || playbackState == State.Ready) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        } 

    }


    return ( 
        <PlayerContext.Provider value={{playbackState,position,duration,togglePlayback}}>
            {children}
        </PlayerContext.Provider> 
    );
}
 
export default PlayerContext;