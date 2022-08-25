import { View, TouchableOpacity, Text } from "react-native";
import { useContext } from "react";
import { UserTransaction, UserTransactionNull } from "../../../utils/leagueInformations";
import { AllPlayersContext } from "../../../context/AllPlayersContext";
import ProgressiveImage from "../../ProgressiveImage";
import { DARKER_GRAY, DARK_GRAY, LIGHT_GREEN, WHITE } from "../../Variables";
import ViewLightDark from "../../ViewLightDark";
import { FontAwesome } from '@expo/vector-icons';

const TransactionTrade = (props) => {
    const {allPlayers} = useContext(AllPlayersContext)
    const leagueRosters = props.leagueRosters;
    const leagueUsers = props.leagueUsers;
    const tran = props.transaction;
    const user1 = (tran?.roster_ids[0]) ? new UserTransaction(tran.roster_ids[0], leagueRosters, leagueUsers) : new UserTransactionNull();
    const user2 = (tran?.roster_ids[1]) ? new UserTransaction(tran.roster_ids[1], leagueRosters, leagueUsers) : new UserTransactionNull();

    const TradeInfo = ({userRoster, userData}) => {
        const adds = tran.adds;
        const picks = tran.draft_picks;
        const waiver = tran.waiver_budget;
        return (
        <View style={{flex:2,alignItems:'center'}}>
            <TouchableOpacity onPress={() => 
                props.navigation.navigate('PlayerProfile',{
                playerObject: userData,
                leagueID: props.league.league_id,
                roster: props.league.roster_positions
            })}>
                <ProgressiveImage style={{width:50,height:50,borderRadius:50}} uri={`https://sleepercdn.com/avatars/${userData?.avatar}`} resizeMode='cover'/>
            </TouchableOpacity>
            <Text style={{color:DARK_GRAY}}>recebe:</Text>
            <View style={{width:'100%',alignItems:'center'}}>
                { adds &&
                    Object.entries(adds).map((item, index) => {
                        if(item[1]!=userRoster?.roster_id) return

                        return (
                            <TouchableOpacity 
                                key={index}
                                style={{marginTop:5}}
                                onPress={() => 
                                    props.navigation.navigate('PlayerStats', {playerObject: allPlayers[item[0]]})
                            }
                            >
                            <Text style={{color:WHITE,textAlign:'center'}}>{`${allPlayers[item[0]].first_name} ${allPlayers[item[0]].last_name}`}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
                {
                    picks &&
                    picks.map((pick, index) => {
                        if(pick.owner_id!=userRoster?.roster_id) return

                        return (
                            <Text key={index} style={{marginTop:5}}>
                                <Text style={{color:WHITE,}}>Pick round </Text>
                                <Text style={{color:LIGHT_GREEN,}}>{pick.round} </Text>
                                <Text style={{color:WHITE,}}>de </Text>
                                <Text style={{color:LIGHT_GREEN,}}>{pick.season}</Text>
                            </Text>
                        )
                    })
                }
                                    {
                    waiver &&
                    waiver.map((item, index) => {
                        if(item.receiver!=userRoster?.roster_id) return

                        return (
                            <Text key={index} style={{color:WHITE,marginTop:5}}>{`${item.amount}$ waiver cash`}</Text>
                        )
                    })
                }
            </View>
        </View>
    )}

    return (
        <ViewLightDark title={`Status: ${tran.status}`} titleSize={15} titleAlign='center' style={{marginTop:10,flexDirection:'row'}}>
            <TradeInfo userRoster={user1.roster} userData={user1.user_data} />
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <FontAwesome name="exchange" size={24} color={LIGHT_GREEN} />
            </View>
            <TradeInfo userRoster={user2.roster} userData={user2.user_data} />
        </ViewLightDark>
    )
}

export default TransactionTrade;