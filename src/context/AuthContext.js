import React, {createContext, useReducer, useMemo, useEffect} from "react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import { colors } from "../utils/colors";

export const AuthContext =  createContext();

export const AuthContextProvider = ({children}) => {
    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
      } 
    
      const loginReducer = (prevState, action) => {
        switch(action.type) {
          case 'RETRIEVE_TOKEN':
            return {
              ...prevState,
              userName: action.id,
              userData: action.userData,
              userToken: action.token,
              isLoading: false,
            };
          case 'LOGIN':
            return {
              ...prevState,
              userName: action.id,
              userData: action.userData,
              userToken: action.token,
              isLoading: false,
            }; 
          case 'LOGOUT':
            return {
              ...prevState,
              userName: null,
              userData: null,
              userToken: null,
              isLoading: false,
            };
          case 'REGISTER':
            return {
              ...prevState,
              userName: action.id,
              userData: action.userData,
              userToken: action.token,
              isLoading: false,
            };
        }
      }
    
      const [loginState, dispatch] = useReducer(loginReducer, initialLoginState)
    
      const authContext = useMemo(() => ({
        signIn: async(userName) => {
          //setIsLoading(false);
          //setUserToken('fgkj')
          let userToken = null;
    
          try {
            const response = await fetch(`https://api.sleeper.app/v1/user/${userName}`);
          const data = await response.json();
          userToken = data.user_id;
    
          try{
            await AsyncStorage.setItem('userToken', userToken)
            await AsyncStorage.setItem('userData',JSON.stringify(data))
            dispatch({
              type: 'LOGIN', 
              id: userName, 
              token: userToken, 
              userData: data
            })
          } catch(e){
            console.log(e)
          }
        } catch(e) {
          Vibration.vibrate()
          alert('O nome de usuário não existe')
        }
    
    
    
        },
        signOut: async() => {
          try{
            await AsyncStorage.removeItem('userToken')
            await AsyncStorage.removeItem('userData')
          } catch(e){
            console.log(e)
          }
          dispatch({type:'LOGOUT'})
        },
        signUp: () => {
          setIsLoading(false);
          setUserToken('fgkj')
        },
      }), [])
    
      const getToken = async() => {
        let userToken = null;
        let data = null;
        try{
          userToken = await AsyncStorage.getItem('userToken')
          data = await AsyncStorage.getItem('userData')
          dispatch({type: 'RETRIEVE_TOKEN', token: userToken, userData: JSON.parse(data)})
        } catch(e){
          console.log(e)
        }
      }

      useEffect(() => {
        getToken();
      },[])

      if(loginState.isLoading){
        return (
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.DARK_BLACK}}>
            <StatusBar
              animated={true}
              backgroundColor={colors.DARK_BLACK}
              barStyle="light-content"
             />
            <ActivityIndicator size="large" color={colors.LIGHT_GREEN} />
          </View>
        )
      }

    return (
        <AuthContext.Provider  value={{authContext, loginState}}>
            {children}
        </AuthContext.Provider>
    )
}