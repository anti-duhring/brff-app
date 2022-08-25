import { View, TouchableOpacity, Text } from "react-native";
import { useContext } from "react";
import { UserTransaction, UserTransactionNull } from "../../../utils/leagueInformations";
import { AllPlayersContext } from "../../../context/AllPlayersContext";
import ProgressiveImage from "../../ProgressiveImage";
import { DARKER_GRAY, DARK_GRAY, LIGHT_GREEN, WHITE } from "../../Variables";
import { FontAwesome } from '@expo/vector-icons';

const TransactionWaiver = (props) => {
    const {allPlayers} = useContext(AllPlayersContext)
    const leagueRosters = props.leagueRosters;
    const leagueUsers = props.leagueUsers;

    const tran = props.transaction;
    const drops = tran.drops;
    const adds = tran.adds;
    const user = (tran?.roster_ids[0]) ? new UserTransaction(tran.roster_ids[0], leagueRosters, leagueUsers) : new UserTransactionNull();

    return (
        <View style={{backgroundColor:LIGHT_BLACK,borderRadius:12,margin:10,marginBottom:20,elevation:10,padding: 10}}>
            <View style={{flex:1}}>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => 
                    props.navigation.navigate('PlayerProfile',{
                    playerObject: user.user_data,
                    leagueID: props.league.league_id,
                    roster: props.league.roster_positions
                })}>
                    <ProgressiveImage style={{width:50,height:50,borderRadius:50}} uri={`https://sleepercdn.com/avatars/${user.user_data.avatar}`} resizeMode='cover'/>
                    <Text style={{color:DARK_GRAY,marginLeft:10,flexWrap:'wrap',flexShrink:1}}><Text style={{color:WHITE,}}>{user.user_data.display_name}</Text> {tran.metadata.notes}</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex:1,flexDirection:'row',padding:10}}>
                <View style={{flex:1,justifyContent:'center',marginLeft:10}}>
                {   drops && 
                    Object.entries(drops).map((item, index) => {
                        if(item[1] != user.roster.roster_id) return
                        
                        return (
                            <TouchableOpacity key={index} 
                            onPress={() => 
                                props.navigation.navigate('PlayerStats', {playerObject: allPlayers[item[0]]})} 
                            style={{flexDirection:'row'}}>
                                <ProgressiveImage style={{width:50,height:50,borderRadius:50,backgroundColor:DARK_BLACK,borderWidth:1,borderColor:'red'}} uri={`https://sleepercdn.com/content/nfl/players/${allPlayers[item[0]].player_id}.jpg`} resizeMode='cover'/>
                                <FontAwesome name="minus-circle" size={17} color='red' style={{marginLeft:-10}} />
                            </TouchableOpacity>
                        )
                    })
                }
                </View>
                <View style={{flex:1,justifyContent:'center'}}>
                {   adds && 
                    Object.entries(adds).map((item, index) => {
                        if(item[1] != user.roster.roster_id) return
                        
                        return (
                            <TouchableOpacity key={index} 
                            onPress={() => 
                                props.navigation.navigate('PlayerStats', {playerObject: allPlayers[item[0]]})} 
                            style={{flexDirection:'row'}}>
                                <ProgressiveImage style={{width:50,height:50,borderRadius:50,backgroundColor:DARK_BLACK,borderWidth:1,borderColor:LIGHT_GREEN}} uri={`https://sleepercdn.com/content/nfl/players/${allPlayers[item[0]].player_id}.jpg`} resizeMode='cover'/>
                                <FontAwesome name="plus-circle" size={17} color={LIGHT_GREEN} style={{marginLeft:-10}} />
                            </TouchableOpacity>
                        )
                    })
                }
                </View>
            </View>
        </View>
    )
}

export default TransactionWaiver;