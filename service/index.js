import TrackPlayer from 'react-native-track-player'

// service.js
module.exports = async function() {

    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());

    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());

    /*TrackPlayer.addEventListener('remote-stop', async() => {
        await TrackPlayer.seekTo(0)
    });*/

    TrackPlayer.addEventListener('remote-next', async() => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        const queue = await TrackPlayer.getQueue();
        if(currentTrack < queue.length) {
            TrackPlayer.skipToNext();
        }
    });

    TrackPlayer.addEventListener('remote-previous', async() => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if(currentTrack > 0) {
            TrackPlayer.skipToPrevious();
        }
    });
    // ...

};