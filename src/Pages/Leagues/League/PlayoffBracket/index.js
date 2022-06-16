import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import TabTopLeague from "../TabTopLeague";
import { HeaderLeagueContextProvider } from "../../../../components/HeaderLeagueContext";
import ViewLightDark from "../../../../components/ViewLightDark";
import { Entypo } from '@expo/vector-icons';
import { DARK_BLACK, DARK_GRAY, DARK_GREEN, LIGHT_BLACK, LIGHT_GRAY, LIGHT_GREEN, WHITE } from "../../../../components/Variables";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PlayoffBracket = ({route}) => {
    const leagueId = route.params?.leagueObject.league_id;
    const leagueObject = route.params?.leagueObject;
    const leagueDraftSettings = route.params?.leagueDraftSettings;

    const [playoffData, setPlayoffData] = useState(null);
    const [leagueRostersData, setLeagueRostersData] = useState(null);
    const [leagueUsersData, setLeagueUsersData] = useState(null)
    const [round, setRound] = useState(1)
    const playerNull = {
        rosterID: 0,
        userData: {
            display_name: '{result} do matchup {matchup}',
            avatar: null
        },
        rosterData: {
            settings: {
                wins: 0,
                ties: 0,
                losses: 0,
                fpts: 0
            }
        }
    }

    const getPlayerRoster = (rosterID) => {
        let playerRoster = null;
        leagueRostersData.map(roster => {
            if(roster.roster_id == rosterID) {
                playerRoster =  roster
            }
        });

        return playerRoster
    }

    const getPlayerInfo = (owner_id) => {
        let playerInfo = null;
        leagueUsersData.map(user => {
            if(user.user_id == owner_id) {
                playerInfo = user
            } 
        })

        return playerInfo
    }

    const getPlayoffBracket = async() => {
        const URL = `https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`;

        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setPlayoffData(data)
        })
    }

    const getLeagueRostersData = async() => {
        const URL = `https://api.sleeper.app/v1/league/${leagueId}/rosters`;
        
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setLeagueRostersData(data);
        })
    }

    const getLeagueUsersData = async() => {
        const URL = `https://api.sleeper.app/v1/league/${leagueId}/users`;
        
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setLeagueUsersData(data);
        })
    }

    const RoundSelect = () => (
        <ViewLightDark style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}} containerStyle={{marginTop:20,width:150,height:40,}}>
                <TouchableOpacity 
                    disabled={(round==1) ? true : false}
                    onPress={() => setRound(round - 1)} 
                    style={{flex:1,opacity:(round==1) ? 0.2 : 1}}
                >
                    <Entypo name="chevron-left" style={{textAlign:'center'}} size={24} color={LIGHT_GRAY} />
                </TouchableOpacity>
                
                <Text style={{color:LIGHT_GRAY,flex:3,textAlign:'center'}}>Round {round}</Text>
                <TouchableOpacity 
                    onPress={() => setRound(round + 1)} 
                    style={{flex:1}}
                >
                    <Entypo name="chevron-right" style={{textAlign:'center'}} size={24} color={LIGHT_GRAY} />
                </TouchableOpacity>
        </ViewLightDark>
        
    )

    const PlayerMatchup = ({player, position, from}) => {

        const Avatar = () => (
            <Image source={(player.userData.avatar) ? {uri: `https://sleepercdn.com/avatars/${player.userData.avatar}`} : require('../../../../../assets/Images/player_default.png')} style={{width:50,height:50,borderRadius:50,resizeMode: 'cover',backgroundColor:DARK_BLACK}} />
        );
        const FantasyPoints = () => (
            <Text style={[{fontSize:22,color:WHITE},(position=='left') ? {marginLeft:15} : {marginRight: 15}]}>
                {player.rosterData.settings.fpts.toFixed(1)}
            </Text>
        );

        return (
            <View style={{flex:1}}>
                <View style={[styles.playerMatchupContainer,{justifyContent: (position=='left') ? 'flex-start' : 'flex-end'}]}>
                    {
                        (position=='left') ?
                        <>
                            <Avatar />
                            <FantasyPoints />
                        </> :
                        <>
                            <FantasyPoints />
                            <Avatar />
                        </>
                    }

                    </View>
                    <View style={{flex:1,alignItems:(position=='left') ? 'flex-start' : 'flex-end'}}>
                        <Text style={{color:WHITE, textAlign: (position=='left') ? 'left' : 'right'}}>    
                            {(!from) ? player.userData.display_name : (from.w) ? player.userData.display_name.replace(/{matchup}/g,from.w).replace(/{result}/g,'Vencedor') : player.userData.display_name.replace(/{matchup}/g,from.l).replace(/{result}/g,'Perdedor')}
                        </Text>
                        <Text style={{color:DARK_GRAY}}>{player.rosterData.settings.wins}-{player.rosterData.settings.losses}{(player.rosterData.settings.ties!=0) ? '-'+player.rosterData.settings.ties : null}</Text>
                    </View>
                </View>
        )
    }

    const Matchup = (props) => {
        return (
            <ViewLightDark style={{flexDirection:'row'}} title={`Matchup ${props.matchup.m}`} titleAlign='center'>
                    <PlayerMatchup player={props.player1} position='left' from={props.matchup.t1_from} />
                    <View style={styles.matchupVsContainer}>
                        <MaterialCommunityIcons name="sword-cross" size={35} color={LIGHT_GREEN} />
                    </View>
                    <PlayerMatchup player={props.player2} position='right' from={props.matchup.t2_from} />
            </ViewLightDark>
        )
    }

    useEffect(() => {
        getLeagueRostersData();
        getLeagueUsersData();
        getPlayoffBracket();
    },[])

    return ( 
        <View style={{flex:1,backgroundColor:'#0B0D0F',}}>
            <HeaderLeagueContextProvider leagueObject={leagueObject}>
                <TabTopLeague activeButton={route.params?.active} isAble={leagueDraftSettings ? true : false} leagueDraftSettings={leagueDraftSettings}   />

                <RoundSelect />

                <View>
                    {leagueRostersData && leagueUsersData && playoffData?.map((matchup, index) => {
                        if(matchup.r != round) return

                        let player1;
                        let player2;

                        if(matchup.t1) {
                            player1 = {rosterID: matchup.t1}
                            player1.rosterData = getPlayerRoster(player1.rosterID);
                            player1.userData = getPlayerInfo(player1.rosterData.owner_id);
                        } else {
                            player1 = playerNull;
                        }

                        if(matchup.t2) {
                            player2 = {rosterID: matchup.t2}
                            player2.rosterData = getPlayerRoster(player2.rosterID);
                            player2.userData = getPlayerInfo(player2.rosterData.owner_id);
                        } else {
                            player2 = playerNull;
                        }
                        
                            return (
                                <Matchup matchup={matchup} player1={player1} player2={player2} key={index} />
                            )
                        
                    })}
                </View>
            </HeaderLeagueContextProvider>
        </View>
     );
}
 
export default PlayoffBracket;

const styles = StyleSheet.create({
    playerMatchupContainer: {
        flexDirection:'row',
        flex:1,
        alignItems:'center',
        marginBottom:10,
    },
    matchupVsContainer: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    matchupVsText: {
        color:LIGHT_GREEN,
    }
})