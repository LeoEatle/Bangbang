<template>
        <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
            <md-card class="card-task">
                <md-card-area md-inset>
                    <md-card-media md-ratio="16:9">
                    <img v-bind:src="item.imgUrl" alt="Coffee House">
                    </md-card-media>

                    <md-card-header>
                    <h2 class="md-title">Coffee House</h2>
                    <div class="md-subhead">
                        subhead here
                    </div>
                    <div class="md-subhead">
                        <md-icon>location_on</md-icon>
                        <span>2 miles</span>
                    </div>
                    </md-card-header>
                    
                   
                </md-card-area>
                

                <md-card-expand>
                    <md-card-actions>
                        <md-button v-on:click="joinNow" class="md-raised md-accent">马上参加</md-button>
                        <md-button class="md-raised md-default"><md-icon class="starIcon">thumb_up</md-icon> (13)</md-button>
                        <span style="flex: 1"></span>
                        <md-button class="md-icon-button" md-expand-trigger>
                            <md-icon>keyboard_arrow_down</md-icon>
                        </md-button>
                    </md-card-actions>
                    <md-card-content>
                        <p>这是详情内容</p>
                        <h3 class="md-subheading">可选的时间</h3>
                        <div class="card-reservation">
                        <md-icon>access_time</md-icon>
                        <md-button-toggle md-single class="md-button-group">
                            <md-button>5:30PM</md-button>
                            <md-button>7:30PM</md-button>
                            <md-button>9:00PM</md-button>
                        </md-button-toggle>
                        </div>
                    </md-card-content>
                </md-card-expand>
            </md-card>
        </md-layout>
</template>

<script>
    export default {
        name: 'Card',
        props: ['item','index'],
        data () {
            return {
                
            }
        },
        methods: {
            joinNow: function(){
                console.log('joinNow clicked!')
            }
        }
    }
</script>

<style lang="scss">
    .md-card-header {
        .md-title {
            color: rgba(0, 0, 0, .87);
        }
        text-align: left;
    }

    .md-card-expand {
        .md-subheading {
            text-align: center;
        }
        .card-reservation {
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-around;

            .md-icon {
            margin: 8px;
            color: rgba(#000, .54) !important;
            }

            .md-button {
            border-radius: 2px !important;
            }
        }
    }
</style>