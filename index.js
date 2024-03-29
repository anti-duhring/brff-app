import 'react-native-gesture-handler'
import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
AppRegistry.registerComponent('main', () => App);

// AppRegistry.registerComponent(...);
TrackPlayer.registerPlaybackService(() => require('./service'));