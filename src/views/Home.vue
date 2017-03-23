<template>
    <div>
        <md-toolbar>
            <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
                <md-icon>menu</md-icon>
            </md-button>
            <h2 @click="enterCreate($event)" class="md-title" style="flex: 1">Bangbang</h2>
        </md-toolbar>
        <md-sidenav md-swipeable class="md-left" ref="leftSidenav" @open="open('left')" @close="close('left')">
            <md-toolbar class="md-large">
                <div class="md-toolbar-container">
                    <h3 class="md-title">Sidenav content</h3>
                </div>
            </md-toolbar>
            <p>这里是个人中心</p>
        </md-sidenav>

        <md-tabs md-fixed>
            <md-tab id="find" md-label="Find">
                <CardList></CardList>
            </md-tab>
            <md-tab id="map" md-label="Map">
                <p>地图</p>
            </md-tab>
        </md-tabs>  
        <!-->这里有个神奇的bug，见这个issuehttps://github.com/marcosmoura/vue-material/issues/532<-->
        <md-button @click.native="enterCreate()" class="md-fab home-add-button md-fab-bottom-right" id="home-add-button">
            <md-icon >add</md-icon>
        </md-button>
    </div>
</template>

<script>
    import CardList from './CardList.vue';
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
            //TODO: 需要验证用户的身份
            checkValid() {
                return true;
            },
            enterCreate(e) {
                console.log("enterButton clicked!");
                console.log(e);
                if(this.checkValid()) {
                    this.$router.push({
                        path: 'create-activity'
                    })
                }
            }
        },
        components: {
            CardList

        }
    }
</script>

<style>
    #home-add-button {
        position: fixed !important;
    }
</style>