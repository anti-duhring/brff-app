import { useContext, useEffect } from 'react';
import { Text, View, Button, Image } from 'react-native';
import { AuthContext } from '../../components/Context';
import { NFLStatusContext } from '../../components/NFLStatusContext';
import { UserDataContext } from '../../components/UserDataContext';

const Profile = ({navigation}) => {
    const { signOut } = useContext(AuthContext)
    const { userID } = useContext(NFLStatusContext)
    const { season } = useContext(NFLStatusContext)
    const { week } = useContext(NFLStatusContext)
    const { userData } = useContext(UserDataContext)
    const avatar = userData.avatar
    const name = userData.display_name

    const getAllPlayers = () => {
        console.log('Fetching...')
        const WEEK = 1;
        const SEASON_TYPE = 'regular';
        const POSITIONS = 'position[]=DEF&position[]=FLEX&position[]=K&position[]=QB&position[]=RB&position[]=TE&position[]=WR';
        const LEAGUE_TYPE = 'ppr';

        const URL = `https://api.sleeper.com/projections/nfl/2022/${WEEK}?season_type=${SEASON_TYPE}&${POSITIONS}&order_by=${LEAGUE_TYPE}`;

        fetch(URL)
        .then(response => response.json())
        .then(data => {
            data.map(player => {
                if(player.player_id==3294) {
                    console.log(player)
                }
            })
            /*Object.keys(data).map(player => {
                console.log(data[player].full_name)
            })*/
        }).catch((e) => {
            console.log('Error:', e)
        })
    }

    useEffect(() => {
        getAllPlayers();
    },[])

    return ( 
        <View>
            <Text>{name}</Text>
            <Text>{userID}</Text>
            <Text>Temporada: {season}</Text>
            <Text>Semana: {week}</Text>
            {<Image
                style={{width:100,height:100}}
                source={{uri: `http://sleepercdn.com/avatars/${avatar}`}}/>}
            <Button title='Logout' color="red" onPress={(e) => signOut()} />
        </View>
     );
}
 
export default Profile;