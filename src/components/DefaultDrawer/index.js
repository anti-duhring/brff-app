import { View, Text } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

const DefaultDrawer = (props) => {
    return (
    <DrawerContentScrollView {...props}>  
        <DrawerItemList {...props} />
    </DrawerContentScrollView>
    );
}
 
export default DefaultDrawer;