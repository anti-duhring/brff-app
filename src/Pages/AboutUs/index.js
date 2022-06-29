import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { DARK_BLACK, LIGHT_GRAY } from "../../components/Variables";
import ViewLightDark from '../../components/ViewLightDark'
import { Entypo } from '@expo/vector-icons';

const AboutUs = ({navigation}) => {
    return ( 
        <View style={styles.background}>
            <View style={styles.navigationButtonContainer}>
                <TouchableOpacity style={styles.toggleButton} onPress={() => navigation.toggleDrawer()}>
                    <Entypo name="menu" size={24} color={LIGHT_GRAY} />
                </TouchableOpacity>
            </View>
            <View style={styles.titleTextContainer}>
                <Image source={require('../../../assets/Images/cropped-logo_2.png')} style={{width:160,height:157}} resizeMode='cover' />
            </View>
            <ViewLightDark title='Sobre nós' titleSize={18}>
                <Text style={styles.text}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras molestie leo leo, vel dictum massa porttitor et. Integer erat orci, tempus at efficitur in, pretium hendrerit nunc. Aliquam imperdiet magna leo, a condimentum felis maximus quis. Praesent imperdiet in turpis vitae suscipit. Etiam sagittis nibh diam, in ultrices nisl aliquam volutpat. Proin eget sagittis nisl. Nullam malesuada a leo placerat auctor. Nunc nec risus consectetur, varius lectus non, pellentesque arcu. Suspendisse pharetra id tellus id fermentum. Integer semper purus a ipsum condimentum iaculis.

    Pellentesque dapibus eu dolor eget feugiat. Nulla ac ligula ex. Integer eleifend egestas urna, et placerat est faucibus ac. Integer non nisi ut arcu varius mollis ac nec sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ligula est, finibus et pulvinar semper, accumsan nec est. Nunc rutrum posuere ullamcorper. Vestibulum scelerisque nisl dolor, vitae cursus nibh faucibus at. Vestibulum nec lacus ullamcorper, scelerisque odio in, facilisis augue. In sagittis libero erat, nec blandit odio faucibus ut. Pellentesque finibus gravida leo, ut efficitur massa tempor sed. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In vestibulum diam sed ante luctus tincidunt.
                </Text>
            </ViewLightDark>
        </View>
     );
}
 
export default AboutUs;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: DARK_BLACK
    },
    text: {
        color: LIGHT_GRAY
    },
    navigationButtonContainer: {
        marginTop:10,
        marginLeft: 10,
    },
    titleTextContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginBottom: 10
    },
    titleText: {
        fontWeight:'bold',
        fontSize:27,
        textShadowColor: '#343434',
        textShadowOffset: {width: 2, height: 3},
        textShadowRadius: 1,
    },
    titleText1:{
        color:'#008037',
    },
    titleText2:{
      color:'#ffde59',
    },
    titleText3:{
      color:'white',
    }
})