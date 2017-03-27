<template>
    <md-layout md-gutter>
            <Card v-for="(item, index) in items" v-bind:item="item" v-bind:key="index"></Card>
    </md-layout>
</template>



<script>
    import Card from '../components/Card.vue';
    var image = require('../assets/card-sky.jpg');
    export default {
        name: 'CardList',
        data () {
            return {
                // 这里是应该渲染的卡片列表
                items: [
                    {
                        imgUrl: image
                    },{
                        imgUrl: image
                    },{
                        imgUrl: image
                    }
                ]
            }
        },
        methods: {

        },
        components: {
            Card
        }
    }
</script>


<style lang="">
    .card-task {
        margin: 10px auto;
        text-align: left;
        .md-subhead {
            text-align: left;
            .md-icon {
            $size: 16px;



            width: $size;
            min-width: $size;
            height: $size;
            min-height: $size;
            font-size: $size;
            line-height: $size;
            }

            span {
            vertical-align: middle;
            }
        }

        
    }

    @media only screen and (min-width: 768px) {
        .md-card {
            width: 80%;
        }
    }
</style>