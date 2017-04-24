<template>
    <md-layout md-column md-flex="100">
        <md-tabs md-fixed>
            <md-tab id="find" md-label="Find">
                <CardList></CardList>
            </md-tab>
            <md-tab id="map" md-label="Map">
                <MapView></MapView>
            </md-tab>
        </md-tabs>  
        <md-button @click.native="enterCreate()" class="md-fab home-add-button md-fab-bottom-right" id="home-add-button">
            <md-icon >add</md-icon>
        </md-button>
    </md-layout>
</template>

<script>
    import CardList from './CardList.vue';
    import AVTools from '../ext/AVTools';
    import MapView from './MapView.vue';
    export default {
        name: 'Home',
        methods: {
            toggleLeftSidenav() {
                this.$refs.leftSidenav.toggle();
            },
            open(ref) {
                console.log('Opened: '+ ref);
            },
            close(ref) {
                console.log('Closed: '+ ref);
            },
            enterCreate(e) {
                AVTools.AVInit();
                console.log("AV AVCurrentUser", AVTools.AVCurrentUser());
                if (AVTools.AVCurrentUser() === null){
                    console.log('用户尚未登录');
                    this.$parent.$emit('ask-sign');
                }
                else{
                    this.$router.push({
                        path: 'create-activity'
                    });
                }
            }
        },
        components: {
            CardList,
            MapView

        }
    }
</script>

<style>

    html {
        height: 100%;
    }

    body {
        height: 100%;
    }

    #home-add-button {
        position: fixed !important;
    }

    #map {
        padding: 0px;
    }
    
</style>