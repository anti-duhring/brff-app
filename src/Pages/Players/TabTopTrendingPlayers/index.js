import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {useNavigation} from '@react-navigation/native'

const TabTopTrendingPlayers = ({activeButton}) => {
    const navigation = useNavigation();
    let addStyle = [styles.tabItem,styles.active];
    let dropStyle = [styles.tabItem];

    
        if(activeButton=='Drop'){
            addStyle = [styles.tabItem];
            dropStyle = [styles.tabItem, styles.active]
        } 
    

    return ( 
        <View style={styles.tabContainer}>
            <View style={addStyle}>
                <TouchableOpacity onPress={() => navigation.navigate('Add',{ active: 'Add'})}>
                    <Text style={styles.textItem}>Trending Up</Text>
                </TouchableOpacity>
            </View>
            <View style={dropStyle}>
                <TouchableOpacity onPress={() => navigation.navigate('Drop',{ active: 'Drop'})}>
                    <Text style={styles.textItem}>Trending Down</Text>
                </TouchableOpacity>
            </View>
        </View>
     );
}
 
export default TabTopTrendingPlayers;

const styles = StyleSheet.create({
    tabContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:0,
        paddingBottom:0,
        paddingTop:10,
        backgroundColor:'white',
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
        color:'black'
    }
})