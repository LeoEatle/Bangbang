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

    var joinedActivitiesID = [];

    // 先获取当前用户所参与的所有Activities
    let user = AV.User.current();
    if (user !== null){
        user.fetch().then(()=>{
            user.get("joinedActivities").forEach((activityItem)=>{
                if (activityItem && activityItem.id){
                    joinedActivitiesID.push(activityItem.id);
                }
            })
        },(error)=>{
            console.log('user获取失败, error: ', error);
        })
        console.log(joinedActivitiesID);
    }

    var image = require('../assets/card-sky.jpg');

    var activity = new AV.Query('Activity');
    activity.descending('createdAt');

    var activityList = [];
    var fetchActivityList = function (){
        
        activity.find().then((result)=>{
            console.log("获取result: ", result);
            if (result.length > 0){
                result.forEach((activityItem)=>{
                    //console.log("activityItem", activityItem);
                    let joinButtonText = "JOIN NOW";
                    let joinButtonDisable = false;
                    joinedActivitiesID.forEach((itemID)=>{
                        if (itemID === activityItem.id){
                            joinButtonText = "Joined Task";
                            joinButtonDisable = true;
                        }
                    })
                    activityList.push({
                        AVObj: activityItem,
                        id: activityItem.id,
                        title: activityItem.get("title"),
                        description: activityItem.get("description"),
                        todoList: activityItem.get("todoList"),
                        personNum: activityItem.get("personNum"),
                        date: activityItem.get("date"),
                        createUser: activityItem.get("createUser"),
                        imgUrl: activityItem.get("pictureUrl"),
                        geolocation: activityItem.get("geolocation"),
                        likes: activityItem.get("likes"),

                        joinButtonText: joinButtonText,
                        joinButtonDisable: joinButtonDisable

                    })
                })

            }
        })
    }
    

    export default {
        name: 'CardList',
        // 路由钩子
        beforeRouteUpdate (to, from, next){
            //fetchActivityList();
        },
        beforeMount () {
            fetchActivityList();
        },
        data () {
            //fetchActivityList();
            return {
                // 这里是应该渲染的卡片列表
                activityList: activityList,
                
            }
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