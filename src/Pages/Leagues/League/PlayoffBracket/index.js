import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import TabTopLeague from "../TabTopLeague";
import { HeaderLeagueContextProvider } from "../../../../components/HeaderLeagueContext";
import ViewLightDark from "../../../../components/ViewLightDark";
import { Entypo } from '@expo/vector-icons';
import { DARK_BLACK, DARK_GRAY, DARK_GREEN, LIGHT_BLACK, LIGHT_GRAY, LIGHT_GREEN, WHITE } from "../../../../components/Variables";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const PlayoffBracket = ({route}) => {
    const leagueId = route.params?.leagueObject.league_id;
    const leagueObject = route.params?.leagueObject;
    const leagueDraftSettings = route.params?.leagueDraftSettings;

    const [playoffData, setPlayoffData] = useState(null);
    const [leagueRostersData, setLeagueRostersData] = useState(null);
    const [leagueUsersData, setLeagueUsersData] = useState(null)
    const [round, setRound] = useState(1);
    class PlayerNull {
        constructor(name) {
            this.rosterID = 0;
            this.userData = {};
            this.userData.display_name = name;
            this.userData.avatar = null;
            this.rosterData = {};
            this.rosterData.settings = {};
            this.rosterData.settings.wins = 0;
            this.rosterData.settings.ties = 0;
            this.rosterData.settings.losses = 0;
            this.rosterData.settings.fpts = 0;
        }
    }
    class Player {
        constructor(rosterID) {
            this.rosterID = rosterID;
            this.rosterData = getPlayerRoster(rosterID);
            this.userData = getPlayerInfo(this.rosterData.owner_id);
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
        <ViewLightDark style={styles.roundSelect} containerStyle={styles.roundSelectContainer}>
                <TouchableOpacity 
                    disabled={(round==1) ? true : false}
                    onPress={() => setRound(round - 1)} 
                    style={{flex:1,opacity:(round==1) ? 0.2 : 1}}
                >
                    <Entypo name="chevron-left" style={{textAlign:'center'}} size={24} color={LIGHT_GRAY} />
                </TouchableOpacity>
                
                <Text style={{color:LIGHT_GRAY,flex:3,textAlign:'center'}}>Round {round}</Text>
                <TouchableOpacity 
                    disabled={(playoffData && playoffData[playoffData.length - 1].r == round) ? true : false}
                    onPress={() => setRound(round + 1)} 
                    style={{flex:1,opacity:(playoffData && playoffData[playoffData.length - 1].r == round) ? 0.2 : 1}}
                >
                    <Entypo name="chevron-right" style={{textAlign:'center'}} size={24} color={LIGHT_GRAY} />
                </TouchableOpacity>
        </ViewLightDark>
        
    )

    const PlayerAvatar = ({player}) => (
        <Image source={(player.userData.avatar) ? {uri: `https://sleepercdn.com/avatars/${player.userData.avatar}`} : require('../../../../../assets/Images/player_default.png')} style={styles.playerAvatar} />
    );

    const PlayerFantasyPoints = ({player, position}) => (
        <Text style={[{fontSize:22,color:WHITE},(position=='left') ? {marginLeft:15} : {marginRight: 15}]}>
            {player.rosterData.settings.fpts.toFixed(1)}
        </Text>
    );

    const PlayerMatchup = ({player, position, winner}) => {
        return (
            <View style={{flex:1}}>
                <View style={[styles.playerMatchupContainer,{justifyContent: (position=='left') ? 'flex-start' : 'flex-end'}]}>
                    {
                        (position=='left') ?
                        <>
                            <PlayerAvatar player={player} />
                            <PlayerFantasyPoints player={player} position={position} />
                        </> :
                        <>
                            <PlayerFantasyPoints player={player} position={position} />
                            <PlayerAvatar player={player} />
                        </>
                    }

                    </View>
                    <View style={{flex:1,alignItems:(position=='left') ? 'flex-start' : 'flex-end'}}>
                        <Text style={{color:WHITE, textAlign: (position=='left') ? 'left' : 'right'}}>    
                            { player.userData.display_name }
                        </Text>
                        <Text style={{color:DARK_GRAY}}>{player.rosterData.settings.wins}-{player.rosterData.settings.losses}{(player.rosterData.settings.ties!=0) ? '-'+player.rosterData.settings.ties : null}</Text>
                    </View>
                </View>
        )
    }

    const Matchup = (props) => {
        return (
            <ViewLightDark style={{flexDirection:'row'}} title={`Matchup ${props.matchup.m}`} titleAlign='center'>
                    <PlayerMatchup player={props.player1} position='left' winner={(props.matchup.w == props.player1.rosterID) ? true : false} />
                    <View style={styles.matchupVsContainer}>
                        <MaterialCommunityIcons name="sword-cross" size={35} color={LIGHT_GREEN} />
                    </View>
                    <PlayerMatchup player={props.player2} position='right' winner={(props.matchup.w == props.player2.rosterID) ? true : false} />
            </ViewLightDark>
        )
    }

    const PlayerPlaceholder = (props) => {
        return (
            <View style={{flex:1}}>
                <View style={[styles.playerMatchupContainer,{justifyContent: (props.position=='left') ? 'flex-start' : 'flex-end'}]}>
                    {
                        (props.position=='left') ?
                        <>
                             <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                                <View style={styles.playerAvatar} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                                <View style={{width:60, height:25,marginLeft:15,borderRadius: 4}} />
                            </SkeletonPlaceholder>                       
                        </> :
                        <>
                            <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                                <View style={{width:60, height:25,marginRight:15,borderRadius: 4}} />
                            </SkeletonPlaceholder> 
                            <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                                <View style={styles.playerAvatar} />
                            </SkeletonPlaceholder>
                        </>
                    }

                    </View>
                    <View style={{flex:1,alignItems:(props.position=='left') ? 'flex-start' : 'flex-end'}}>
                        <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                            <View style={{width:100, height:20,marginBottom:10,borderRadius: 4}} />
                            <View style={{width:60, height:20,borderRadius: 4,alignSelf:(props.position=='left') ? 'flex-start' : 'flex-end'}} />
                        </SkeletonPlaceholder>
                    </View>
            </View>
        )
    }

    const MatchupPlaceholder = (props) => {
        return (
            <ViewLightDark>
                <View style={{alignItems:'center'}}>
                    <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                        <View style={{width:120, height:25,marginBottom:10,borderRadius: 4}} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{flexDirection:'row'}}>
                <PlayerPlaceholder position='left' />
                <View style={styles.matchupVsContainer}>
                    <MaterialCommunityIcons name="sword-cross" size={35} color={LIGHT_GREEN} />
                </View>
                <PlayerPlaceholder position='right' />
                </View>
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
                <TabTopLeague activeButton={route.params?.active} isAble={true} leagueDraftSettings={leagueDraftSettings}   />

                <RoundSelect />

                <View>
                    {(leagueRostersData && leagueUsersData && playoffData) ?
                    
                    
                    playoffData.map((matchup, index) => {
                        if(matchup.r != round) return

                        let player1;
                        let player2;

                        if(matchup.t1) {
                            player1 = new Player(matchup.t1);
                        } else if(!matchup.t1 && matchup.t1_from) {
                            player1 = new PlayerNull((matchup.t1_from.w) ? `Vencedor do matchup ${matchup.t1_from.w}` : `Perdedor do matchup ${matchup.t1_from.l}`)

                        } else {
                            player1 = new PlayerNull('Vaga em aberto');
                        }

                        if(matchup.t2) {
                            player2 = new Player(matchup.t2);
                        } else if(!matchup.t2 && matchup.t2_from) {
                            player2 = new PlayerNull((matchup.t2_from.w) ? `Vencedor do matchup ${matchup.t2_from.w}` : `Perdedor do matchup ${matchup.t2_from.l}`)
                        } else {
                            player2 = new PlayerNull('Vaga em aberto');
                        }
                        
                            return (
                                <Matchup matchup={matchup} player1={player1} player2={player2} key={index} />
                            )
                        
                    }) : 
                    <>
                        <MatchupPlaceholder />
                        <MatchupPlaceholder />
                    </>}
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
    },
    playerAvatar: {
        width:50,
        height:50,
        borderRadius:50,
        resizeMode: 'cover',
        backgroundColor:DARK_BLACK
    },
    roundSelect: {
        flexDirection:'row',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    roundSelectContainer: {
        marginTop:20,
        width:150,
        height:40,
    }
})