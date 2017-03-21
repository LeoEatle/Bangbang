<template>
    <div>
        <md-toolbar>
            <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
                <md-icon>menu</md-icon>
            </md-button>

            <h2 class="md-title" style="flex: 1">Bangbang</h2>
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
                <p>发现</p>
                <CardList></CardList>
            </md-tab>

            <md-tab id="map" md-label="Map">
                <p>地图</p>
            </md-tab>
        </md-tabs>  
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
            }

        },
        compon
    }
</script>

<style>
    
</style>