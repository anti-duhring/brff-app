import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import TabTopLeague from '../../components/TabTopLeague'
import { useState, useEffect, useContext } from "react";
import { NFLStatusContext } from "../../components/NFLStatusContext";
import { HeaderLeagueContextProvider } from "../../components/HeaderLeagueContext";
import ViewLightDark from '../../components/ViewLightDark'
import { DARK_BLACK, LIGHT_BLACK, LIGHT_GREEN } from "../../components/Variables";

const Informations = ({navigation, route}) => {
    const league = route.params?.leagueObject;
    const leagueDraftSettings = route.params?.leagueDraftSettings
    const scoringLeague = league.scoring_settings;
    const leagueUsers = route.params?.leagueUsers;
    const leagueID = league.league_id;
    const [scoringSettings, setScoringSettings] = useState([])

    const [generalInformations, setGeneralInformations] = useState([])
    const [activeTab, setActiveTab] = useState('informations');

    const {season, week} = useContext(NFLStatusContext)
    const [errorMessage, setErrorMessage] = useState(null)

    const objectToArray = (obj) => {
        return Object.keys(obj).map((key) => {return [key, obj[key]]})
    }

    const replaceObjectKey = (keyArray) => {
        //console.log(keyArray.join('|'))
        let str = keyArray[0];
        str = str.replace(/\bpass_2pt\b/g,'{ATK}$3%Passe pra conversão de 2pts')
                    .replace(/\brec_2pt\b/g,'{ATK}$11%Recepção pra conversão de 2pts')
                    .replace(/\brec\b/g,'{ATK}$8%Recepção')
                    .replace(/\bpass_int\b/g,'{ATK}$4%Passe interceptado')
                    .replace(/\bfgmiss\b/g,'{ST}$6%FG perdido')
                    .replace(/\brec_yd\b/g,'{ATK}$9%Jarda recebida')
                    .replace(/\brush_yd\b/g,'{ATK}$5%Jarda corrida')
                    .replace(/\bpass_td\b/g,'{ATK}$2%TD passado')
                    .replace(/\bfum_lost\b/g,'{ATK}$12%Fumble não recuperado')
                    .replace(/\bxpmiss\b/g,'{ST}$8%Extra point perdido')
                    .replace(/\bfgm_30_39\b/g,'{ST}$3%FG de 30 até 39jds')
                    .replace(/\bfgm_20_29\b/g,'{ST}$2%FG de 20 até 29jds')
                    .replace(/\bfgm_40_49\b/g,'{ST}$4%FG de 40 até 49jds')
                    .replace(/\bblk_kick\b/g,'{DEF}$13%Chute bloqueado')
                    .replace(/\bpts_allow_7_13\b/g,'{DEF}$4%Ceder de 7 até 13 pontos')
                    .replace(/\bpts_allow_35p\b/g,'{DEF}$8%Ceder 35 pontos ou mais')
                    .replace(/\bpts_allow_14_20\b/g,'{DEF}$5%Ceder de 14 até 20 pontos')
                    .replace(/\bpts_allow_21_27\b/g,'{DEF}$7%Ceder de 21 até 27 pontos')
                    .replace(/\bpts_allow_28_34\b/g,'{DEF}$6%Ceder de 28 até 34 pontos')
                    .replace(/\bpts_allow_1_6\b/g,'{DEF}$2%Ceder de 1 até 6 pontos')
                    .replace(/\bsafe\b/g,'{DEF}$11%Safety')
                    .replace(/\bfum_rec\b/g,'{ATK}$13%Fumble recuperado')
                    .replace(/\bdef_td\b/g,'{DEF}$1%TD defensivo')
                    .replace(/\bst_td\b/g,'{ST}$9%TD de ST')
                    .replace(/\bxpm\b/g,'{ST}$7%Extra point feito')
                    .replace(/\bint\b/g,'{DEF}$10%INT')
                    .replace(/\bpts_allow_0\b/g,'{DEF}$2%Ceder 0 pontos')
                    .replace(/\bdef_st_fum_rec\b/g,'{ST}$10%Fumble recuperado  defensivo')
                    .replace(/\bdef_st_td\b/g,'{ST}$11%Fumble recuperado')
                    .replace(/\bdef_st_fum_rec\b/g,'{ST}$12%TD')
                    .replace(/\bfum_rec_td\b/g,'{ATK}$14%TD de fumble recuperado')
                    .replace(/\brush_2pt\b/g,'{ATK}$7%Corrida pra conversão de 2pts')
                    .replace(/\brec_td\b/g,'{ATK}$10%TD recebido')
                    .replace(/\bff\b/g,'{DEF}$12%Fumble forçado')
                    .replace(/\bst_fum_rec\b/g,'{ST}$13%Fumble recuperado')
                    .replace(/\bdef_st_ff\b/g,'{ST}$14%Fumble forçado defensivo')
                    .replace(/\bfgm_50p\b/g,'{ST}$5%FG de 50jds ou mais')
                    .replace(/\bfgm_0_19\b/g,'{ST}$1%FG de 0 até 19jds')
                    .replace(/\bsack\b/g,'{DEF}$9%Sack')
                    .replace(/\bpass_yd\b/g,'{ATK}$1%Jarda passada')
                    .replace(/\brush_td\b/g,'{ATK}$6%TD corrido')
                    .replace(/\bfum\b/g,'{ATK}$15%Fumble')
                    .replace(/\bst_ff\b/g,'{ST}$15%Fumble forçado')
                    .replace(/\bbonus_rec_te\b/g,'{ATK}Bônus recepção de TE')
                    .replace(/\bpass_int_td\b/g,'{DEF}TD de passe interceptado')
         return [str, keyArray[1]]
    }
    /*objectToArray(scoringLeague).forEach((setting) => {
        console.log(setting)
    })*/
    const getSettings = () => {
        let settings = [];
        for(let i=0;i<objectToArray(scoringLeague).length;i++){
        
            settings.push(replaceObjectKey(objectToArray(scoringLeague)[i]))
            if(i + 1 == objectToArray(scoringLeague).length){
                setScoringSettings(settings)
            }
        }
    }

    const getTransactions = async() => {
        const URL = `https://api.sleeper.app/v1/league/${leagueID}/transactions/${(week > 0) ? week : 1}`;
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
        });
    }

    const getGeneralInfos = async() => {
        fetch(`https://api.sleeper.app/v1/league/${leagueID}/drafts`)
            .then(response => response.json())
            .then((data) => {
                setGeneralInformations(data)
            }).catch((e) => {
                console.log('Erro:',e)
                setErrorMessage(e)
            })
    }

    const InformationContainer = (props) => {
        return (
            <View style={styles.informationContent}>
                <Text style={[styles.informationTitle,styles.informationConfig]}>{props.name} </Text>
                <Text style={[styles.informationValue,styles.informationConfig]}>{props.value}</Text>
            </View>
        )
    }

    const ScoringContainer = (props) => {
        return (
            <ViewLightDark title={props.title} titleSize={18}>
            {scoringSettings.map((key, index) => {
                if(key[0].indexOf(`{${props.type}}`) == -1) return
                const score = key[0].replace(/{ATK}/g,'').replace(/{ST}/g,'').replace(/{DEF}/g,'')
                let styleValue = styles.informationValueNegative;
                let valueSymbol = null;
                if(key[1] > -1) {
                    styleValue = styles.informationValuePositive; valueSymbol = '+';
                }

                return(
                    <View key={index} style={styles.informationContent}>
                        <Text style={styles.informationTitle}>
                            {(score.indexOf('%')!=-1) ? score.split('%')[1] : score} 
                        </Text>
                        <Text style={[styles.informationValue, styleValue]}>
                            {key[1] > 0 && valueSymbol}
                            {(key[1] < 1 && key[1] > 0) ? key[1].toFixed(2) : key[1]}
                        </Text>
                    </View>
                )
            })}
         </ViewLightDark>
        )
    }

    useEffect(() => {
        getSettings();
        getGeneralInfos();
        getTransactions();
        console.log(league.league_id)
    },[])

    const InfoTab = () => (
        <View style={{flex:1,justifyContent:'center',flexDirection:'row'}}>
            <TouchableOpacity disabled={activeTab == 'informations' ? true : false} style={{paddingVertical:5, width:120,alignItems:'center',backgroundColor:LIGHT_GREEN,borderTopLeftRadius:5,borderBottomLeftRadius:5}} onPress={() => console.log('wow')}>
                <Text style={{color: DARK_BLACK}}>Pontuação</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={activeTab == 'transactions' ? true : false} style={{paddingVertical:5, width:120,alignItems:'center',borderTopRightRadius:5,borderBottomRightRadius:5,backgroundColor:LIGHT_BLACK}} onPress={() => console.log('wow')}>
                <Text style={{color: LIGHT_GREEN}}>Transações</Text>
            </TouchableOpacity>
        </View>
    )

    const GeneralInformations = () => {
        return (
            <>
            <ViewLightDark title='Configurações da liga' titleSize={18}>
                {generalInformations.map((element, index) => {
                    if(element.season!=season) return

                    return (
                        <View key={index}>
                            <InformationContainer name='Status' value={element.status.replace(/_/g,' ')} />
                            <InformationContainer name='Temporada' value={element.season_type} />
                            <InformationContainer name='Tipo' value={element.metadata.scoring_type.replace(/_/g,' ')} />
                            <InformationContainer name='Times' value={element.settings.teams} />
                            <InformationContainer name='Draft rounds' value={element.settings.rounds} />
                            <InformationContainer name='Autopick' value={(element.settings.cpu_autopick == 1) ? 'Ligado' : 'Desligado'}
                                    />
                        </View>
                    )
                })}
            </ViewLightDark>    
            <ScoringContainer type='ATK' title='Ataque' />
            <ScoringContainer type='DEF' title='Defesa' />
            <ScoringContainer type='ST' title='Special Team' />
            </>
        )
    }

    return ( 
        <View style={{flex:1,backgroundColor:'#0B0D0F'}}>
        <HeaderLeagueContextProvider leagueObject={league}>
            <TabTopLeague isAble={true} leagueDraftSettings={leagueDraftSettings} activeButton={route.params?.active} leagueObject={league} leagueRosters={route.params?.leagueRosters} leagueUsers={leagueUsers} />
            <InfoTab />
            <GeneralInformations />
        </HeaderLeagueContextProvider> 
        </View>
    );
}
 
export default Informations;

const styles = StyleSheet.create({
    informationContainer:{
        marginBottom:20,
    },
    informationContent:{
        flexDirection:'row',
        marginTop:10,
    },
    informationTitle:{
        fontSize:15,
        color:'#656668',
        flex:3
    },
    informationValue:{
        fontSize:15,
        flex:1,
        textAlign:'right',
        color: '#C6C6C6',
    },
    title:{
        fontSize:17,
        fontWeight:'bold',
        color:'#C6C6C6',
        flex:1
    },
    informationValuePositive: {
        color: LIGHT_GREEN
    },
    informationValueNegative: {
        color:'red'
    },
    informationConfig: {
        flex:2,
    }
})