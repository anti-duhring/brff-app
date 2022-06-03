import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Keyboard, TouchableOpacity, TextInput, Image, Linking } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../components/Context';


const SignIn = () => {
  const [username, setUsername] = useState('')
  const { signIn } = useContext(AuthContext)

  const loginHandle = (name) => {
    
    signIn(name)
  }

    return ( 
    <Pressable onPress={Keyboard.dismiss}  style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleText}>
          <Text style={styles.titleText1}>Brasil</Text>
          <Text style={styles.titleText2}>Fantasy</Text>
          <Text style={styles.titleText3}>Football</Text>
        </View>
        <View style={styles.titleImageContainer}>
          <Image style={styles.titleImage} source={{uri: 'https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png'}} />
        </View>
      </View>
      <View style={styles.login}> 
        <TextInput style={{padding:10, margin:10}}  placeholder="Nome de usuário do sleeper" value={username}  onChangeText={setUsername} />      
        <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.buttonLogin} onPress={() => loginHandle(username)}>
           <Text style={styles.text}>Login</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.buttonLogin} onPress={() => Linking.openURL('https://sleeper.app/create')}>
           <Text style={styles.text}>Cadastrar</Text>
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
      backgroundColor:'white',
      padding:10,
      width:'90%',
      borderRadius:5,
    },
    buttonContainer: {
      flexDirection:'row',
      justifyContent:'space-between',
      
    },
    buttonLogin: {
      textAlign:'center',
      backgroundColor:'#008037',
      color:'white',
      paddingTop:15,
      paddingBottom:15,
      borderRadius:5,
      width:'48%',
    },
    text: {
      textAlign:'center',
      color:'white'
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
      width:80,
      height:80,
    }
  });