import { View, StyleSheet, Text } from "react-native";
import { BORDER_RADIUS, LIGHT_BLACK, LIGHT_GRAY, WHITE } from "../Variables";

const ViewLightDark = (props) => {
    return ( 
        <View style={[styles.container,props.containerStyle]}>
            {props.title && <View style={styles.titleContainer}>
                <Text style={[styles.title, {textAlign:props.titleAlign}]}>{props.title}</Text>
            </View>}
            <View style={props.style}>
                {props.children}
            </View>
        </View>
     );
}
 
export default ViewLightDark;

const styles = StyleSheet.create({
    container: {
        borderRadius:BORDER_RADIUS,
        margin:10,
        padding:10,
        elevation:10,
        backgroundColor: LIGHT_BLACK,
    },
    title: {
        fontSize:17,
        fontWeight:'bold',
        color:WHITE,
        flex:1
    }, 
    titleContainer: {
        marginBottom:10,
    }
})