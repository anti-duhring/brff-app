import { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { AuthContext } from '../../components/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDataContext } from "../UserDataContext";

const CustomDrawer = (props) => {
    const { signOut } = useContext(AuthContext)
    const { userData } = useContext(UserDataContext)
    const username = userData.username;
    const displayName = userData.display_name;
    const userAvatar = userData.avatar;


    /*const getUserInfo = async() => {
        setUsername(props.dataUser.userName)
        setDisplayName(props.dataUser.userDisplayName)
        setUserAvatar(props.dataUser.avatar)
        /*let userID = null;
        try {
            userID = await AsyncStorage.getItem('userToken')

            fetch(`https://api.sleeper.app/v1/user/${userID}`)
            .then(response => response.json())
            .then((data) => {
                setUsername(data.username)
                setDisplayName(data.display_name)
                setUserAvatar(data.avatar)
            })
        } catch(e){
            console.log(e)
        }
    }*/

    /*useEffect(() => {
        getUserInfo();
        console.log(userData)
    })*/

    return (
    <View style={{flex:1}}>
        <ImageBackground /*blurRadius={2}*/ imageStyle={{resizeMode:'cover'}} style={styles.userContainer} source={require('../../../assets/Images/leagueHeader2.png')}>
            <View style={styles.drawerUser}>
                <View style={styles.drawerImage}>
                    {<Image
                        style={styles.drawerImageAvatar}
                        source={{uri: `http://sleepercdn.com/avatars/${userAvatar}`}}/>}
                </View>
                <View style={styles.drawerName}>
                    <Text style={styles.drawerNameText}>{displayName}</Text>
                    <Text style={styles.drawerUsernameText}>@{username}</Text>
                </View>
            </View>
        </ImageBackground>
        <DrawerContentScrollView style={styles.drawerContainer} {...props}>  
            <DrawerItemList {...props} />
            <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.buttonLogout} onPress={() => signOut()}>
                    <Text style={styles.text}>Sair</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    </View>
    );
}
 
export default CustomDrawer;

const styles = StyleSheet.create({
    drawerContainer: {
        backgroundColor: '#0B0D0F',
    },
    userContainer: {
        height:150,
        alignItems:'center',
        justifyContent:'center'
    },
    drawerImage: {
        alignContent:'center',
        alignItems:'center'
    },
    drawerImageAvatar:{
        width:80,
        height:80,
        borderRadius:40,
    },
    drawerName: {
        alignContent:'center',
        alignItems:'center'
    },
    drawerNameText:{
        fontWeight:'bold',
        color:'#FCFCFC',
        fontSize:15,
    },
    drawerUsernameText: {
        color: 'rgba(0,0,0,0.6)',
        fontSize:13,
    },  
    logoutContainer:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:20,
    },
    buttonLogout: {
        textAlign:'center',
        backgroundColor:'red',
        color:'white',
        paddingTop:10,
        paddingBottom:10,
        borderRadius:5,
        width:'50%',
      },
      text: {
        textAlign:'center',
        color:'#C6C6C6'
      }
})