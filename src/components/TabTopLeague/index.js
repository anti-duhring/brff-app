import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {useNavigation} from '@react-navigation/native'
import { NFLStatusContext } from '../NFLStatusContext'
import { useContext, useEffect } from "react";
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { LIGHT_GREEN, DARK_BLACK, LIGHT_BLACK } from '../Variables';

const COLOR = LIGHT_GREEN
const GREEN2 = LIGHT_BLACK //'rgba(0, 206, 78,  .1)'
const COLORTEXT = DARK_BLACK;

const TabTopLeague = ({activeButton, isAble, leagueDraftSettings, leagueObject, leagueUsers}) => {
    const navigation = useNavigation();
    const { week } = useContext(NFLStatusContext)


    return(
        <View style={{flexDirection:'row',padding:10,justifyContent:'center',alignContent:'center'}}>
            <View style={(activeButton=='Players'||!activeButton) ? styles.activeTab : styles.inactiveTab}>
                <TouchableOpacity style={styles.buttonContent} onPress={() => {
                    if(!isAble) return
                    navigation.navigate('Players',{
                        active: 'Players',
                        leagueObject: leagueObject,
                        leagueDraftSettings: leagueDraftSettings,
                        leagueUsers: leagueUsers
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
                        leagueObject: leagueObject,
                        leagueDraftSettings: leagueDraftSettings,
                        leagueUsers: leagueUsers
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
            <View style={(activeButton=='PlayoffBracket') ? styles.activeTab : styles.inactiveTab}>
                <TouchableOpacity style={styles.buttonContent} onPress={() => {
                    if(!isAble) return

                    navigation.navigate('PlayoffBracket',{ 
                        active: 'PlayoffBracket',
                        leagueObject: leagueObject,
                        leagueDraftSettings: leagueDraftSettings,
                        leagueUsers: leagueUsers
                    })
                }}>
                    {(activeButton=='PlayoffBracket') ? 
                    <>
                        <Ionicons name="trophy-outline" size={20} color={COLORTEXT} />
                        <Text style={styles.textActiveTab}>PLAYOFFS</Text>
                    </> : 
                    <Ionicons name="trophy-outline" size={20} color={COLOR} />}

                </TouchableOpacity>
            </View>
            <View style={(activeButton=='Informations') ? styles.activeTab : styles.inactiveTab}>
                <TouchableOpacity style={styles.buttonContent} onPress={() => {
                    if(!isAble) return

                    navigation.navigate('Informations',{ 
                        active: 'Informations',
                        leagueObject: leagueObject,
                        leagueDraftSettings: leagueDraftSettings,
                        leagueUsers: leagueUsers
                    })
                }}>
                    {(activeButton=='Informations') ? 
                    <>
                        <MaterialCommunityIcons name="information-outline" size={20} color={COLORTEXT} />
                        <Text style={styles.textActiveTab}>INFOS</Text>
                    </> : 
                    <MaterialCommunityIcons name="information-outline" size={20} color={COLOR} />}

                </TouchableOpacity>
            </View>
            <View style={(activeButton=='Team') ? styles.activeTab : styles.inactiveTab}>
                <TouchableOpacity style={styles.buttonContent} onPress={() => {
                    if(!isAble) return
                    navigation.navigate('Team',{ 
                        active: 'Team',
                        leagueObject: leagueObject,
                        leagueDraftSettings: leagueDraftSettings,
                        leagueUsers: leagueUsers
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
    
}
 
export default TabTopLeague;

const styles = StyleSheet.create({
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