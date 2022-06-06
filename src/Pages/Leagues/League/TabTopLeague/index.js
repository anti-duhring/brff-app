import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {useNavigation} from '@react-navigation/native'
import { NFLStatusContext } from '../../../../components/NFLStatusContext'
import { useContext, useEffect } from "react";
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

const COLOR = 'rgba(0, 206, 78,  1)'//'#008037'
const GREEN2 = '#15191C' //'rgba(0, 206, 78,  .1)'
const COLORTEXT = '#0B0D0F';

const TabTopLeague = ({activeButton, isAble, leagueDraftSettings}) => {
    const navigation = useNavigation();
    const { week } = useContext(NFLStatusContext)

    useEffect(() => {
        console.log(activeButton)
    },[])


    return(
        <View style={{flexDirection:'row',padding:10,justifyContent:'center',alignContent:'center'}}>
            <View style={(activeButton=='Players'||!activeButton) ? styles.activeTab : styles.inactiveTab}>
                <TouchableOpacity style={styles.buttonContent} onPress={() => {
                    if(!isAble) return
                    navigation.navigate('Players',{
                        active: 'Players',
                         leagueDraftSettings: leagueDraftSettings
                    })
                }}>
                    {(activeButton=='Players'||!activeButton) ? 
                    <>
                        <AntDesign name="team" size={20} color={COLORTEXT} />
                        <Text style={styles.textActiveTab}>TIMES</Text>
                    </> : 
                    <AntDesign name="team" size={20} color={COLOR} />}
                </TouchableOpacity>
            </View>
            <View style={(activeButton=='Matchups') ? styles.activeTab : styles.inactiveTab}>
                <TouchableOpacity style={styles.buttonContent} onPress={() => {
                    if(!isAble) return

                    navigation.navigate('Matchups',{ 
                        active: 'Matchups', 
                        week: week,
                        leagueDraftSettings: leagueDraftSettings
                    })
                }}>
                    {(activeButton=='Matchups') ? 
                    <>
                        <Ionicons name="american-football-outline" size={20} color={COLORTEXT} />
                        <Text style={styles.textActiveTab}>MATCHUPS</Text>
                    </> : 
                    <Ionicons name="american-football-outline" size={20} color={COLOR} />}
                </TouchableOpacity>
            </View>
            <View style={(activeButton=='Informations') ? styles.activeTab : styles.inactiveTab}>
                <TouchableOpacity style={styles.buttonContent} onPress={() => {
                    if(!isAble) return

                    navigation.navigate('Informations',{ 
                        active: 'Informations',
                        leagueDraftSettings: leagueDraftSettings
                    })
                }}>
                    {(activeButton=='Informations') ? 
                    <>
                        <MaterialCommunityIcons name="information-outline" size={20} color={COLORTEXT} />
                        <Text style={styles.textActiveTab}>INFORMAÇÕES</Text>
                    </> : 
                    <MaterialCommunityIcons name="information-outline" size={20} color={COLOR} />}

                </TouchableOpacity>
            </View>
            <View style={(activeButton=='Team') ? styles.activeTab : styles.inactiveTab}>
                <TouchableOpacity style={styles.buttonContent} onPress={() => {
                    if(!isAble) return
                    navigation.navigate('Team',{ 
                        active: 'Team',
                        leagueDraftSettings: leagueDraftSettings
                    })
                }}>
                {(activeButton=='Team') ? 
                    <>
                        <MaterialCommunityIcons name="football-helmet" size={20} color={COLORTEXT} />
                        <Text style={styles.textActiveTab}>MEU TIME</Text>
                    </> : 
                    <MaterialCommunityIcons name="football-helmet" size={20} color={COLOR} />}
                </TouchableOpacity>
            </View>
        </View>
    )
    

    return ( 
        <View style={styles.tabContainer}>
            <View style={playersStyle}>
                <TouchableOpacity onPress={() => {
                    if(!isAble) return
                    navigation.navigate('Players',{
                         active: 'Players',
                         leagueDraftSettings: leagueDraftSettings
                    })
                }}>
                    <Text style={(active=='Players'||active==null) ? styles.activeText : styles.textItem}>Times</Text>
                </TouchableOpacity>
            </View>
            <View style={matchupsStyle}>
                <TouchableOpacity onPress={() => {
                    if(!isAble) return

                    navigation.navigate('Matchups',{ 
                        active: 'Matchups', 
                        week: week,
                        leagueDraftSettings: leagueDraftSettings
                    })
                }}>
                    <Text style={(active=='Matchups') ? styles.activeText : styles.textItem}>Matchups</Text>
                </TouchableOpacity>
            </View>
            <View style={informationsStyle}>
                <TouchableOpacity onPress={() => {
                    if(!isAble) return

                    navigation.navigate('Informations',{ 
                        active: 'Informations',
                        leagueDraftSettings: leagueDraftSettings
                    })
                }}>
                    <Text style={(active=='Informations') ? styles.activeText : styles.textItem}>Informações</Text>
                </TouchableOpacity>
            </View>
            <View style={teamStyle}>
                <TouchableOpacity onPress={() => {
                    if(!isAble) return
                    navigation.navigate('Team',{ 
                        active: 'Team',
                        leagueDraftSettings: leagueDraftSettings
                    })
                }}>
                    <Text style={(active=='Team') ? styles.activeText : styles.textItem}>Meu time</Text>
                </TouchableOpacity>
            </View>

        </View>
     );
}
 
export default TabTopLeague;

const styles = StyleSheet.create({
    tabContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:0,
        paddingBottom:0,
        paddingTop:10,
        backgroundColor:'transparent',
    },
    tabItem:{
        flex:1,
        justifyContent:'center',
        height:30,
        width:'100%',
        textAlign:'center',
        alignItems:'center',
        paddingBottom:10,
    },
    active:{
        borderBottomWidth:2,
        borderColor:'#008037',
    },
    textItem:{
        color:'#656668'
    },
    activeText: {
        color: '#008037',
        fontWeight:'bold'
    },
    activeTab: {
        flexDirection:'row',
        backgroundColor:COLOR,
        flex:3,
        marginHorizontal:5,
        padding:5,
        justifyContent:'center',
        alignContent:'center',
        borderRadius:5,
    },
    inactiveTab: {
        flexDirection:'row',
        backgroundColor:GREEN2,
        flex:1,
        marginHorizontal:5,
        padding:5,
        justifyContent:'center',
        alignContent:'center',
        borderRadius:5
    },
    textActiveTab: {
        marginLeft:5,
        color:COLORTEXT,
        fontWeight:'600'
    },
    buttonContent: {
        flexDirection:'row'
    }
})