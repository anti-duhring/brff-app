import AsyncStorage from '@react-native-async-storage/async-storage';

export const setWhereEpisodeStopped = async(trackURL, seconds) => {
    try {
        await AsyncStorage.setItem(trackURL, seconds.toString())
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