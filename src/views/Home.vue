<template>
    <div>
        <md-tabs md-fixed>
            <md-tab id="find" md-label="Find">
                <CardList></CardList>
            </md-tab>
            <md-tab id="map" md-label="Map">
                <p>地图</p>
            </md-tab>
        </md-tabs>  
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