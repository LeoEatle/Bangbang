<template> 
    <md-layout md-column>
        <md-layout md-flex="100">
            <baidu-map
                :style="layout_style"
                class="baidu_map"
                :scroll-wheel-zoom="true"
                :auto-resize="true"
                :center = "center"
                :zoom="zoom"
                @moving="syncCenter"
                @moveend="syncCenter"
                @zoomend="syncZoom">
                <bm-view class="map_view" :style="layout_style"></bm-view>
                <bm-geolocation anchor="BMP_ANCHOR_BOTTOM_RIGHT" :showAddressBar = "true" :autoLoaction="true"></bm-geolocation>
            </baidu-map>
        </md-layout>
    </md-layout>
    
</template>

<script>
    import AV from 'leancloud-storage';
    import AVTools from '../ext/AVTools';
    let bodyHeight =  document.body.clientHeight-114;
    console.log(bodyHeight);
    export default {
        data() {
            return {
                layout_style: {
                    width: "100%",
                    height: bodyHeight + 'px'
                },
                center: {
                    lng: 116.404,
                    lat: 39.915
                },
                zoom: 15
            }
        },
        methods: {
            syncCenter (e) {
            const {lng, lat} = e.target.getCenter()
            this.center.lng = lng
            this.center.lat = lat
            },
            syncZoom (e) {
            this.zoom = e.target.getZoom()
            }
        }
    }
</script>

<style>
    
</style>