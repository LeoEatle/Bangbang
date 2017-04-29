<template>
    <div>
        <md-layout md-gutter>
                <Card v-for="(item, index) in activityList" v-bind:item="item" v-bind:key="index"></Card>
        </md-layout>
    </div>
</template>



<script>
    import Card from '../components/Card.vue';
    import AV from 'leancloud-storage';
    import AVTools from '../ext/AVTools.js';

    AVTools.AVInit();

    var image = require('../assets/card-sky.jpg');

    var activity = new AV.Query('Activity');
    var activityList = [];
    activity.find().then((result)=>{
        console.log("获取result: ", result);
        if (result.length > 0){
            result.forEach((activityItem)=>{
                activityList.push({
                    id: activityItem.id,
                    title: activityItem.get("title"),
                    description: activityItem.get("description"),
                    todoList: activityItem.get("todoList"),
                    personNum: activityItem.get("personNum"),
                    date: activityItem.get("date"),
                    createUser: activityItem.get("createUser"),
                    imgUrl: activityItem.get("pictureUrl"),
                    geolocation: activityItem.get("geolocation"),
                    likes: activityItem.get("likes")

                })
            })
            console.log("activityList", activityList);

        }
    })

    export default {
        name: 'CardList',
        data () {
            return {
                // 这里是应该渲染的卡片列表
                activityList: activityList,
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