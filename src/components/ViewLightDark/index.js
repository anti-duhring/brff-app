import { View, StyleSheet, Text } from "react-native";
import { BORDER_RADIUS, LIGHT_BLACK, LIGHT_GRAY, WHITE } from "../Variables";

const ViewLightDark = (props) => {
    return ( 
        <View style={[styles.container,props.containerStyle]}>
            {props.title && <View style={styles.titleContainer}>
                <Text style={[styles.title, {fontSize:(props.titleSize) ? props.titleSize : 15,textAlign:(props.titleAlign) ? props.titleAlign : 'left'}]}>{props.title}</Text>
            </View>}
            <View style={[props.style]}>
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
        fontWeight:'bold',
        color:WHITE,
    }, 
    titleContainer: {
        marginBottom:0,
    }
})