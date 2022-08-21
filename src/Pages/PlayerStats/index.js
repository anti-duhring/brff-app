import { useState, useEffect, useContext, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Image, ToastAndroid } from "react-native";
import PlayerStatsHeader from "../../components/PlayerStatsHeader";
import { DARK_GRAY, DARK_GREEN, LIGHT_BLACK, LIGHT_GRAY, LIGHT_GREEN, WHITE } from "../../components/Variables";
import ViewLightDark from "../../components/ViewLightDark";
import { NFLStatusContext } from "../../context/NFLStatusContext";
import Tooltip from "react-native-walkthrough-tooltip";
import SelectDropdown from "react-native-select-dropdown";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const PlayerStats = ({route}) => {
    const {season} = useContext(NFLStatusContext);
    const [seasonToShowStats, setSeasonToShowStats] = useState(season)

    const player = route.params?.playerObject;
    const typePlayer = (isNaN(new Number(player.player_id))) ? 'TEAM' : 'PLAYER';
    const [playerSeasonStats, setPlayerSeasonStats] = useState(null);

    const [rowStatsColored, setRowStatsColored] = useState(null);
    const [showTip, setTip] = useState(null)
    const [showLegendTip, setShowLegendTip] = useState(false);

    const statsToShow = {
        "RB" : ['rush_yd', 'rush_ypa', 'rush_att','rush_yac', 'rush_td', 'rush_rz_att', 'rec_yd', 'rec','rec_td', 'rec_ypt',  'rec_tgt','fum','fum_lost', 'off_snp'],
        "QB": ['pass_yd','pass_td','pass_att','cmp_pct','pass_int','pass_rtg', 'pass_rz_att','rush_yd','rush_td','rush_att','pass_sack','pass_sack_yds','fum','fum_lost','off_snp'],
        "WR": ['rec','rec_yd', 'rec_tgt','rec_ypt','rec_td','fum','fum_lost','rush_yd', 'rush_ypa', 'rush_att', 'rush_td','off_snp'],
        "TE": ['rec','rec_yd', 'rec_tgt','rec_ypt','rec_td','fum','fum_lost','rush_yd', 'rush_ypa', 'rush_att', 'rush_td','off_snp'],
        "DL": ['idp_tkl','idp_sack','idp_ff','idp_fum_rec','idp_int', 'idp_def_td','idp_qb_hit', 'idp_tkl_ast', 'idp_tkl_loss', 'def_snp'],
        "DE": ['idp_tkl','idp_sack','idp_ff','idp_fum_rec','idp_int', 'idp_def_td','idp_qb_hit', 'idp_tkl_ast', 'idp_tkl_loss', 'def_snp'],
        "LB": ['idp_tkl','idp_sack','idp_ff','idp_fum_rec','idp_int', 'idp_def_td','idp_qb_hit', 'idp_tkl_ast', 'idp_tkl_loss', 'def_snp'],
        "DB": ['idp_tkl', 'idp_sack','idp_ff','idp_fum_rec','idp_int','idp_def_td','def_snp'],
        "K": ['xpa', 'xpm','fga','fgm','fgm_20_29','fgm_yds_over_30','fgm_40_49','fgm_50p'],
        "DEF": ['pts_allow', 'sack', 'ff', 'fum_rec', 'int','def_td', 'yds_allow','tkl_loss']
    }

    useEffect(() => {
        getPlayerStats(player.player_id, 'regular', season);
        //console.log(player.player_id, player.fantasy_positions[0])
    }, [])

    const statsToShowName = (position) => {
        return statsToShow[position].map(stat => { 
            return stat.replace(/\btkl_loss\b/g,'Tackle pra perda de jardas')
            .replace(/\byds_allow\b/g,'Jardas cedidas')
            .replace(/\bdef_td\b/g,'Touchdowns')
            .replace(/\bint\b/g,'Interceptações')
            .replace(/\bfum_rec\b/g,'Fumbles recuperados')
            .replace(/\bff\b/g,'Fumbles forçados')
            .replace(/\bsack\b/g,'Sacks')
            .replace(/\bpts_allow\b/g,'Pontos cedidos')
            .replace(/\bfgm_50p\b/g,'Field Goal de 50 ou mais jardas')
            .replace(/\bfgm_40_49\b/g,'Field Goal de 40 até 49 jardas')
            .replace(/\bfgm_yds_over_30\b/g,'Field Goal de 30 até 39 jardas')
            .replace(/\bfgm_20_29\b/g,'Field Goal de 20 até 29 jardas')
            .replace(/\bfgn\b/g,'Field Goals acertados')
            .replace(/\bfga\b/g,'Field Goals tentados')
            .replace(/\bxpa\b/g,'Extra points acertados')
            .replace(/\bxpa\b/g,'Extra points tentados')
            .replace(/\bpass_rtg\b/g,'Rating no jogo')
            .replace(/\bpass_sack_yds\b/g,'Jardas perdidas nos sacks sofridos')
            .replace(/\bpass_sack\b/g,'Sacks sofridos')
            .replace(/\bfum_lost\b/g,'Fumble sofrido e não recuperado pelo ataque')
            .replace(/\bfum\b/g,'Fumble sofrido')
            .replace(/\bidp_pass_def\b/g,'Passes defendidos').replace(/\bdef_snp\b/g,'Snaps')
            .replace(/\bidp_def_td\b/g,'Touchdowns')
            .replace(/\bidp_fum_rec\b/g,'Fumble recuperado')
            .replace(/\bidp_ff\b/g,'Fumble forçado')
            .replace(/\btm_def_snp\b/g,'Snaps')
            .replace(/\bidp_tkl_loss\b/g,'Tackles pra perda de jardas')
            .replace(/\bidp_tkl_ast\b/g,'Assistência em tackles (jogador fez o tackle junto com outro defensor)')
            .replace(/\bidp_tkl\b/g,'Tackles totais')
            .replace(/\bidp_qb_hit\b/g,'QB Hits')
            .replace(/\bsack_yd\b/g,'Jardas que o ataque perdeu devido aos sacks do jogador')
            .replace(/\bidp_sack\b/g,'Sacks totais')
            .replace(/\boff_snp\b/g,'Snaps')
            .replace(/\bpass_yd\b/g,'Jardas passadas').replace(/\bpass_td\b/g,'TDs passados')
            .replace(/\bpass_att\b/g,'Passes tentados').replace(/\bcmp_pct\b/g,'Porcentagem (%) de passes completos')
            .replace(/\bpass_int\b/g,'Interceptações')
            .replace(/\bpass_rz_att\b/g,'Tentativas de passe na RZ')
            .replace(/\brush_yd\b/g,'Jardas corridas')
            .replace(/\brush_ypa\b/g,'Jardas corridas por tentativa')
            .replace(/\brush_att\b/g,'Total de corridas tentadas')
            .replace(/\brush_yac\b/g,'Jardas corridas após contato')
            .replace(/\brush_td\b/g,'TDs corridos')
            .replace(/\brush_rz_att\b/g,'Corridas na RedZone')
            .replace(/\brush_td_lng\b/g,'TD mais longo')
            .replace(/\brush_lng\b/g,'Corrida mais longa (em jardas)')
            .replace(/\brec_yd\b/g,'Jardas recebidas')
            .replace(/\brec_lng\b/g,'Recepção mais longa (em jardas)')
            .replace(/\brec\b/g,'Recepções')
            .replace(/\brec_ypt\b/g,'Jardas recebidas por alvo')
            .replace(/\brec_td\b/g,'TDs recebidos')
            .replace(/\brec_tgt\b/g,'Alvos de passe');
        });
    }

    const getColorTeam = (team) => {
        let color;
        switch(team) {
            case 'LAC':
                color = 'rgb(0, 34, 68)'
                break;
            case 'KC':
                color = 'rgb(227, 24, 55)'
                break;
            case 'LV':
                color = 'rgb(165, 172, 175)'
                break;
            case 'DEN':
                color = 'rgb(251, 79, 20)'
                break;     
            case 'NE':
                color = 'rgb(0, 34, 68)'
                break;
            case 'NYJ':
                color = 'rgb(32, 55, 49)'
                break;
            case 'MIA':
                color = 'rgb(0, 142, 151)'
                break;
            case 'BUF':
                color = 'rgb(0, 51, 141)'
                break;
            case 'BAL':
                color = 'rgb(36, 23, 115)'
                break;
            case 'CLE':
                color = 'rgb(49, 29, 0)'
                break;
            case 'PIT':
                color = 'rgb(255, 182, 18)'
                break;
            case 'CIN':
                color = 'rgb(251, 79, 20)'
                break;
            case 'TEN':
                color = 'rgb(0, 34, 68)'
                break;
            case 'JAX':
                color = 'rgb(0, 103, 120)'
                break;
            case 'IND':
                color = 'rgb(0, 44, 95)'
                break;
            case 'HOU':
                color = 'rgb(3, 32, 47)'
                break;
            case 'TB':
                color = 'rgb(213, 10, 10)'
                break;
            case 'CAR':
                color = 'rgb(0, 133, 202)'
                break;
            case 'ATL':
                color = 'rgb(167, 25, 48)'
                break;
            case 'NO':
                color = 'rgb(177, 177, 177)'
                break;
            case 'LAR':
                color = 'rgb(0, 34, 68)'
                break;
            case 'SEA':
                color = 'rgb(0, 34, 68)'
                break;
            case 'SF':
                color = 'rgb(170, 0, 0)'
                break;
            case 'ARI':
                color = 'rgb(151, 35, 63)'
                break;
            case 'GB':
                color = 'rgb(32, 55, 49)'
                break;
            case 'DET':
                color = 'rgb(0, 118, 182)'
                break;
            case 'CHI':
                color = 'rgb(11, 22, 42)'
                break;
            case 'MIN':
                color = 'rgb(79, 38, 131)'
                break;
            case 'NYG':
                color = 'rgb(11, 34, 101)'
                break;
            case 'DAL':
                color = 'rgb(0, 34, 68)'
                break;
            case 'PHI':
                color = 'rgb(0, 76, 84)'
                break; 
            case 'WAS':
                color = 'rgb(90, 20, 20)'
                break;
            default:
                color = DARK_GREEN;
        }
        return color
    }

    const showToast = (_message) => {
        ToastAndroid.show(_message, ToastAndroid.LONG, ToastAndroid.CENTER);
    }

    const getPlayerStats = async(_player_id, _type, _year) => {
        const URL = `https://api.sleeper.com/stats/nfl/player/${_player_id}?season_type=${_type}&season=${_year}&grouping=week`;
        //console.log(URL);

        fetch(URL)
        .then(response => response.json())
        .then((data) => {
            setPlayerSeasonStats(data)
        }).catch(e => {
            console.log('Error:',e)
        })
    }

    const TooltipMessage = ({children, message,position, hasBackground, index}) => (
        <Tooltip
            isVisible={(showTip==index) ? true : false}
            content={
                   <View>
                     <Text style={{color:WHITE}}> {message} </Text>
                   </View>
            }

            onClose={() =>setTip(null)}
            placement={position}
            backgroundColor={(hasBackground) ? 'rgba(0,0,0,0.5)' :'rgba(0,0,0,0)'}
            useReactNativeModal={true}
            contentStyle={{backgroundColor:getColorTeam(player.team)}}
        >
            {children}
        </Tooltip>
    )

    const StatsRowTitle = (props) => (
        <Pressable onPress={() => showToast(props.message) /*setTip(props.index)*/}>
            
                <Text style={[styles.columnTitle,{color:(showTip==props.index) ? WHITE: DARK_GRAY}]}>{props.name}</Text>
        </Pressable>
    )

    const InfoContainer = (props) => {
        return (
            <View style={{flexDirection:'row',marginTop:10}}>
                <Text style={styles.titleInfo}>{props.title}</Text>
                <Text style={styles.valueInfo}>{props.value}</Text>
        </View>
        )
    }

    const Informations = () => (
        <>
        <InfoContainer title='Posição' value={player.fantasy_positions} />
        <InfoContainer title='Time' value={(player.team) ? player.team : 'Free Agent'} />
        <InfoContainer title='Idade' value={player.age} />
        <InfoContainer title='Altura' value={`${player.height[0]}'${player.height[1]}"`} />
        <InfoContainer title='Peso' value={`${player.weight} lbs`} />
        <InfoContainer title='Status' value={player.status} />
        <InfoContainer title='Posição no depth chart' value={player.depth_chart_order} />
        <InfoContainer title='Temporadas na NFL' value={player.years_exp} />
        <InfoContainer title='College' value={player.college} />
        </>
    )

    const MenuYearsStats = () => {
        let arr = new Array((typePlayer == 'TEAM') ? 11 : player.years_exp + 1).fill(0).map((item, index) => {
            return season - index
        });

        return (
            <View style={{flexDirection:'row',padding:10, flex:1}}>
            <SelectDropdown
                data={arr}
                defaultValue={seasonToShowStats}
                onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setSeasonToShowStats(selectedItem);
                    getPlayerStats(player.player_id, 'regular', selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
                renderDropdownIcon={isOpened => {
                    return <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} color={LIGHT_GRAY} size={18} />;
                  }}
                buttonStyle={{backgroundColor:LIGHT_BLACK,width:100,borderRadius:5,height:40}}
                buttonTextStyle={{color:LIGHT_GRAY,fontSize:15}}
                dropdownStyle={{backgroundColor:LIGHT_BLACK,borderRadius:5}}
                rowTextStyle={{color:LIGHT_GRAY,}}
                rowStyle={{borderBottomColor:'transparent'}}
            />
            </View>
        )
    }

    const TableStatsContainer = ({children, index}) => (
        <Pressable onPress={() => setRowStatsColored((rowStatsColored==index) ? null : index)}>
            <View style={[styles.tableStats,{backgroundColor:(rowStatsColored==index) ? getColorTeam(player.team) : (index % 2 == 0) ? 'rgba(38, 45, 51, 0.3)' : 'transparent'}]} >
                {children}
            </View>
        </Pressable>
    )

    const TableStats = ({item, index}) => (
        <TableStatsContainer index={index}>
                <Text style={styles.columnValue}>{item[0]}</Text>
                {(item[1]) ? <View style={{flex:1,width:80,alignItems:'center'}}><Image source={{uri: `https://sleepercdn.com/images/team_logos/nfl/${item[1].opponent.toLowerCase()}.png`}} style={{width:25, height:25}} resizeMode='contain' /></View> :     <Text style={styles.columnValue}>-</Text>}
                { 
                    statsToShow[player.fantasy_positions[0]]?.map((stat, i) => {

                        if(!item[1]) {
                            return (
                                <Text key={i} style={styles.columnValue}>-</Text>
                            )
                        }
                        else if(!item[1].stats[stat]) {
                            return (
                                <Text key={i} style={styles.columnValue}>-</Text>
                            )
                        } else {
                            return (
                                <Text key={i} style={styles.columnValue}>{item[1].stats[stat]}</Text>
                            )
                        }
                    })
                }
            </TableStatsContainer>
    )

    const TableStatsTotal = ({index, item}) => {
        let totalValues = new Array(statsToShow[player.fantasy_positions[0]].length).fill(0);
        let playedGames = 0;

       item.map((itemWeek, index) => {
            if(!itemWeek[1]) return
            if(itemWeek[1].stats) playedGames++

            statsToShow[player.fantasy_positions[0]]?.map((stat, i) => {
                if(itemWeek[1].stats[stat]) {
                    totalValues[i] += itemWeek[1].stats[stat];
                }
            });
        });

        return (
            <TableStatsContainer index={index}>
                <Text style={styles.columnValue}>Total</Text>
                <Text style={styles.columnValue}>-</Text>
                {

                    totalValues.map((stat, i) => {
                       return(
                        <Text key={i} style={styles.columnValue}>{(
                            statsToShow[player.fantasy_positions[0]][i].indexOf('rtg')!=-1 || 
                            statsToShow[player.fantasy_positions[0]][i].indexOf('pct')!=-1 || 
                            statsToShow[player.fantasy_positions[0]][i].indexOf('ypa')!=-1 || 
                            statsToShow[player.fantasy_positions[0]][i].indexOf('ypc')!=-1 || 
                            statsToShow[player.fantasy_positions[0]][i].indexOf('ypt')!=-1) ? ((stat!=0) ?stat / playedGames : 0).toFixed(1) : (stat - Math.floor(stat) != 0) ? stat.toFixed(1) : stat}</Text>
                       ) 
                    })
                }
            </TableStatsContainer>
        )
    }
        
    const TableStatsPlaceholder = ({index, isLast}) => (
        <TableStatsContainer index={index}>
            <Text style={styles.columnValue}>{(isLast) ? 'Total' :index + 1}</Text>
            <Text style={styles.columnValue}>-</Text>
            {
                new Array(statsToShow[player.fantasy_positions[0]].length).fill(0).map((stat, i) => {
                    return (
                    <Text key={i} style={styles.columnValue}>-</Text>
                    )
                })
            }
        </TableStatsContainer>
    )

    const LegendTipButton = () => (
        <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',marginRight:20}}>
          
                <TouchableOpacity onPress={() => { showToast('Clique no nome de uma das estatísticas para mostrar o seu significado'); /*setShowLegendTip((showLegendTip) ? false : true); */}}>
                    <AntDesign name="questioncircleo" size={20} color={LIGHT_GRAY} />
                </TouchableOpacity>
            
         </View>
    )

    return ( 
        <PlayerStatsHeader player={player}>
            {(typePlayer=='PLAYER') ? <ViewLightDark title={`${player.full_name} #${player.number}`} titleSize={20}>
                <Informations />
            </ViewLightDark> : 
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{`Defesa do ${player.first_name} ${player.last_name}`}</Text>
            </View>}

            <View style={{flexDirection:'row'}}>
                <MenuYearsStats />
                <LegendTipButton />
            </View>

            <ViewLightDark>
                <ScrollView horizontal={true} contentContainerStyle={{flexDirection:'column'}}>
                    <View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:10}}>
                        <StatsRowTitle index={1} message={`Semana em que o jogo ocorreu`} name='semana' />
                        <StatsRowTitle index={2} message={`Time contra o qual o jogador performou as estatísticas`} name='opp' />
                        {
                            statsToShow[player.fantasy_positions[0]]?.map((stat, i) => {

                                return (<StatsRowTitle key={i} index={i+3} message={statsToShowName(player.fantasy_positions[0])[i]} name={stat.replace(/idp_/g,'').replace(/\bfgm_yds_over_30\b/g,'fgm_30_39')} />)
                            })
                        }
                    </View>

                {(playerSeasonStats) ? 
                    Object.entries(playerSeasonStats).map((item, index) => {

                        if(index + 1 == Object.entries(playerSeasonStats).length) {
                            return (
                                <View key={index} >
                                    <TableStats item={item} index={index} />
                                    <TableStatsTotal index={index + 1} item={Object.entries(playerSeasonStats)} />
                                </View>
                            )
                        }

                        return (
                            <TableStats key={index} item={item} index={index} />
                        )
                        
                     }) :
                     new Array(18).fill(0).map((item, index) => {
                        if(index==17) {
                            return (
                                <View key={index}>
                                    <TableStatsPlaceholder index={index} />
                                    <TableStatsPlaceholder isLast={true} index={index + 1} />
                                </View>
                            )
                        }
                        return (
                            <TableStatsPlaceholder key={index} index={index} />
                        )
                     })
                }
                </ScrollView>
            </ViewLightDark>
        </PlayerStatsHeader>
     );
}
 
export default PlayerStats;

const styles = StyleSheet.create({
    text: {
        color:WHITE
    },
    titleInfo: {
        flex:1,
        color:DARK_GRAY
    },
    valueInfo: {
        flex:1,
        color:WHITE,
        textAlign:'right'
    },
    columnTitle: {
        flex:1,
        color:DARK_GRAY,
        width:80,
        marginRight:10,
        textAlign:'center'
    },
    columnValue: {
        flex:1,
        color:WHITE,
        width:70,
        marginRight:10,
        textAlign:'center'
    },
    tableStats: {
        flexDirection:'row',
        height:30,
        justifyContent:'center',
        borderRadius:5,
        alignItems:'center',
    },
    title: {
        fontWeight:'bold',
        color:WHITE,
        flex:1,
        fontSize: 20
    }, 
    titleContainer: {
        margin:10,
        padding:10,
    }
})