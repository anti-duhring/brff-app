import TrackPlayer, { Capability } from "react-native-track-player";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setWhereEpisodeStopped = async(trackURL, seconds) => {
    try {
        await AsyncStorage.setItem(trackURL, seconds.toString())

        const value = await AsyncStorage.getItem('episodesPlayed');
        if(value) {
            let trackObj = JSON.parse(value);
            trackObj[trackURL] = seconds;

            await AsyncStorage.setItem('episodesPlayed', JSON.stringify(trackObj))
        } else {
            let trackObj = {};
            trackObj[trackURL] = seconds;

            await AsyncStorage.setItem('episodesPlayed', JSON.stringify(trackObj))
        }
      } catch (e) {
        console.log('Error', e)
      }
}

export const getWhereEpisodeStopped = async(trackURL) => {
    try {
        const value = await AsyncStorage.getItem(trackURL)
        if(value) {
        // value previously stored
            return Number(value);
        } else {
            return null
        }
    } catch(e) {
        console.log('error:', e)
        return null
    }
}

export const getAllEpisodesProgress = async() => {
    try {
        const value = await AsyncStorage.getItem('episodesPlayed')
        if(value) {
        // value previously stored
            return JSON.parse(value);
        } else {
            return null
        }
    } catch(e) {
        console.log('error:', e)
        return null
    }
}

export const setupPlayer = async() => {
    try {
        //await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          stopWithApp:true,
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SeekTo,
                Capability.SkipToNext,
                Capability.SkipToPrevious
            ],
            compactCapabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SeekTo,
              Capability.SkipToNext,
              Capability.SkipToPrevious
            ],
            color: '#00ce4e',
            icon: require('../../assets/Images/american-football.png')
        })
        
    }
    catch(e) {
        console.log('Erro:',e)
    } 
    
}