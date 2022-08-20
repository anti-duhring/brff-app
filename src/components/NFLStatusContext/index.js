import { useState, createContext, useRef, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NFLStatusContext = createContext()

export const NFLStatusContextProvider = ({children}) => {
    const [season, setSeason] = useState(null)
    const [week, setWeek]  = useState(null)
    const [userID, setUserID] = useState(null)
    const [username, setUsername] = useState(null)
    const [displayName, setDisplayName] = useState(null)
    const [userAvatar, setUserAvatar] = useState(null)
    const [NFLStatus, setNFLStatus] = useState(null);

    const getUserID = async() => {
        let userToken = null;
        try{
            userToken = await AsyncStorage.getItem('userToken')
            setUserID(userToken)
          } catch(e){
            console.log(e)
          }
    }

    const setUserToken = (ID) => {
        setUserID(ID)
    }

    const getNFLSeasonInfo = async() => {
        fetch(`https://api.sleeper.app/v1/state/nfl`)
        .then(response => response.json())
        .then((data) => {
            setSeason(data.league_season)
            setWeek(data.week)
            setNFLStatus(data)
        }).catch((e) => {
            console.log('Erro:',e)
        })
    }

    const getUserInfo = async() => {
        if(!userID) return
        fetch(`https://api.sleeper.app/v1/user/${userID}`)
        .then(response => response.json())
        .then((data) => {
            setUsername(data.username)
            setDisplayName(data.display_name)
            setUserAvatar(data.avatar)
        })
    }

    useEffect(() => {
        //getUserID()
        getNFLSeasonInfo()
    },[])

    useEffect(() => {
        getUserInfo()
    },[userID])

    return ( 
        <NFLStatusContext.Provider value={{
            userID,
             season, 
             week, 
             userAvatar, 
             username, 
             displayName, 
             setUserToken,
             NFLStatus
            }}>
        {children}
        </NFLStatusContext.Provider>
     );
}
 