import { createContext, useEffect, useState} from "react"
import TrackPlayer, { State, usePlaybackState, useProgress, Capability } from "react-native-track-player";
import * as rssParser from 'react-native-rss-parser'
import { getWhereEpisodeStopped, setupPlayer, setWhereEpisodeStopped } from "../utils/trackPlayer";

export const TrackPlayerContext = createContext()

export const TrackPlayerContextProvider = ({children}) => {
    const playbackState = usePlaybackState();
    const { position, duration } = useProgress();
    const [episodeList, setEpisodeList] = useState(null);

    const togglePlayback = async(trackIndex) => {
        let currentTrack = await TrackPlayer.getCurrentTrack();
        let currentTrackObj = await TrackPlayer.getTrack(trackIndex);
        const trackURL = currentTrackObj.url;
        //console.log(currentTrackObj.url);

        if(currentTrack!=trackIndex){
            const trackPrevPlay = await getWhereEpisodeStopped(trackURL);

            await TrackPlayer.skip(trackIndex)
            await TrackPlayer.play();
            if(trackPrevPlay) TrackPlayer.seekTo(trackPrevPlay)

            return
        }

        if(currentTrack != null) {
            if(playbackState == State.Paused || playbackState == State.Ready) {
                const trackPrevPlay = await getWhereEpisodeStopped(trackURL);

                await TrackPlayer.play();

                if(trackPrevPlay) TrackPlayer.seekTo(trackPrevPlay)

            } else {
                await setWhereEpisodeStopped(trackURL, position);
                await TrackPlayer.pause();
            }
            return 
        } 
    }

    
    const getPodcasts = async() => {
      const RSS_URL = `https://anchor.fm/s/dea812c/podcast/rss`;
      try {
          const response = await fetch(RSS_URL)
          const responseData = await response.text()
          const data = await rssParser.parse(responseData)
          setPlaylistPodcast(data.items)
      } catch(e) {
          console.log('Erro:',e)
      } 
    }
    
    const setPlaylistPodcast = async(episodesData) => {
      let playlist = []
      episodesData.map((episode, index) => { 
          playlist.push({
              url: 'https://'+episode.enclosures[0].url.split('https%3A%2F%2F')[1].replace(/%2F/g,'/'),
              title: episode.title,
              artist: episode.authors[0].name,
              artwork: episode.itunes.image,
              duration: episode.itunes.duration, //(Number(episode.enclosures[0].length) / 1000).toFixed(0),
              description: episode.description,
              date: episode.published
          })
      })
      setEpisodeList(playlist);
      await TrackPlayer.add(playlist);
      console.log(playlist.length,'episodes tracked')
    }
    
      useEffect(() => {
        setupPlayer();
        getPodcasts();
      },[])


    return ( 
        <TrackPlayerContext.Provider value={{
            playbackState,
            position,
            duration,
            togglePlayback,
            episodeList
        }}>
            {children}
        </TrackPlayerContext.Provider> 
    );
}
