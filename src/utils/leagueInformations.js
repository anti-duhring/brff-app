export class UserTransaction {
    constructor(roster_id, leagueRosters, leagueUsers) {
        //console.log(leagueRosters.length);

        this.roster = leagueRosters.filter(roster => {
            return roster.roster_id == roster_id
        })[0];
        this.user_data = leagueUsers.filter(user => {
            return user.user_id == this.roster.owner_id
        })[0];
        
    }
} 

export class UserTransactionNull {
    constructor() {
        this.roster = null;
        this.user_data = null;
    }
}

export const replaceObjectKey = (keyArray) => {
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

export const objectToArray = (obj) => {
    return Object.keys(obj).map((key) => {return [key, obj[key]]})
}