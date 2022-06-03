import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {useNavigation} from '@react-navigation/native'
import { NFLStatusContext } from '../../../../components/NFLStatusContext'
import { useContext } from "react";

const TabTopLeague = ({activeButton, isAble, leagueDraftSettings}) => {
    const navigation = useNavigation();
    const { week } = useContext(NFLStatusContext)

    let playersStyle = [styles.tabItem,styles.active];
    let informationsStyle = [styles.tabItem];
    let matchupsStyle = [styles.tabItem];
    let teamStyle = [styles.tabItem];

    
        if(activeButton=='Informations'){
            playersStyle = [styles.tabItem];
            teamStyle = [styles.tabItem];
            matchupsStyle = [styles.tabItem];
            informationsStyle = [styles.tabItem, styles.active]
        } else if(activeButton=='Team') {
            playersStyle = [styles.tabItem];
            informationsStyle = [styles.tabItem];
            matchupsStyle = [styles.tabItem];
            teamStyle = [styles.tabItem, styles.active]
        } else if(activeButton=='Matchups') {
            playersStyle = [styles.tabItem];
            informationsStyle = [styles.tabItem];
            matchupsStyle = [styles.tabItem, styles.active];
            teamStyle = [styles.tabItem]
        }
    

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
                    <Text style={(activeButton=='Players'||activeButton==null) ? styles.activeText : styles.textItem}>Times</Text>
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
                    <Text style={(activeButton=='Matchups') ? styles.activeText : styles.textItem}>Matchups</Text>
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
                    <Text style={(activeButton=='Informations') ? styles.activeText : styles.textItem}>Informações</Text>
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
                    <Text style={(activeButton=='Team') ? styles.activeText : styles.textItem}>Meu time</Text>
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
    }
})