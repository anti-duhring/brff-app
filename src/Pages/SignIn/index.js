import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Keyboard, TouchableOpacity, TextInput, Image, Linking } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {BORDER_RADIUS, DARK_BLACK, DARK_GRAY, LIGHT_BLACK, LIGHT_GRAY, LIGHT_GREEN, WHITE} from '../../components/Variables'

const SignIn = () => {
  const [username, setUsername] = useState('')
  const { authContext } = useContext(AuthContext)

  const loginHandle = (name) => {
    
    authContext.signIn(name)
  }

    return ( 
    <Pressable onPress={Keyboard.dismiss}  style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleImageContainer}>
          <Image style={styles.titleImage} source={require('../../../assets/Images/cropped-logo_2.png')} />
        </View>
      </View>
      <View style={styles.login}> 
        <TextInput style={styles.loginInput} placeholderTextColor={DARK_GRAY} placeholder="Nome de usuário do sleeper" value={username}  onChangeText={setUsername} />      
        <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.buttonLogin} onPress={() => loginHandle(username)}>
           <Text style={styles.loginText}>Login</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.buttonRegister} onPress={() => Linking.openURL('https://sleeper.app')}>
           <Text style={styles.text}>Não tem conta? Cadastrar</Text>
         </TouchableOpacity>
        </View>
     </View>
    </Pressable>
    );
}
 
export default SignIn;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      color:'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    login:{
      backgroundColor: LIGHT_BLACK,
      padding:10,
      width:'90%',
      borderRadius:BORDER_RADIUS,
    },
    buttonContainer: {
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      marginTop:40,
    },
    buttonLogin: {
      textAlign:'center',
      backgroundColor:LIGHT_GREEN,
      paddingTop:15,
      paddingBottom:15,
      borderRadius:5,
      width:'100%',
      elevation:10,
    },
    buttonRegister: {
      marginVertical:20,
    },
    text: {
      textAlign:'center',
      color:'white'
    },
    loginText: {
      color:WHITE,
      textAlign:'center',
      fontSize:15
    },
    titleContainer:{
      marginBottom:50,
      flexDirection:'row',
      justifyContent:'space-between',
    },
    titleText:{

    },
    titleText1:{
      color:'#008037',
      fontWeight:'bold',
      fontSize:20,
      textShadowColor: '#343434',
      textShadowOffset: {width: 2, height: 3},
      textShadowRadius: 1
    },
    titleText2:{
      color:'#ffde59',
      fontWeight:'bold',
      fontSize:20,
      textShadowColor: '#343434',
      textShadowOffset: {width: 2, height: 3},
      textShadowRadius: 1
    },
    titleText3:{
      color:'white',
      fontWeight:'bold',
      fontSize:20,
      textShadowColor: '#575757',
      textShadowOffset: {width: 2, height: 3},
      textShadowRadius: 1
    },
    titleImageContainer:{},
    titleImage:{
      width:160,
      height:160,
    },
    loginInput: {
      padding:10, 
      margin:10, 
      color:WHITE,
      backgroundColor:'rgba(0,0,0,0.2)',
      borderRadius:5
    }
  });