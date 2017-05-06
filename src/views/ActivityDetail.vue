<template>
    <div id="activity_detail">
        <div v-show="loading">
            Loading...
        </div>

        <mu-flexbox v-show="loading == false" orient="vertical" :gutter="8" >
            <mu-flexbox-item class="base_information">
                <h2 class="title">{{title}}</h2>
                <img :src="pictureUrl" alt="任务图片">
                <p class="description">{{description}}</p>
                <h3>人数限制</h3>
                <p class="numberLimit">{{joinUsers.length}}/{{personNum}}</p>
                <h3>预计日期</h3>
                <p class="activityDate">{{activityDate}}</p>
                <h3>联系方式</h3>
                <p><md-icon v-bind:md-src="wechat"></md-icon>  <span>微信: {{userWechat}}</span></p>
                <p><md-icon>phone</md-icon> <span>手机：{{userPhoneNumber}}</span> </p>
            </mu-flexbox-item>

            

            <mu-flexbox-item>
                <h3>计划列表   <small>点击项目可以查看详情</small></h3>
                <ol class="todoList">
                    <li class="todoItem" v-for="(item, index) in todoList" :key="index" >
                        <span>{{item.todoName}}</span> <mu-checkbox :nativeValue="index.toString()" v-model="todoStatus" v-on:change="todoStatusChange"></mu-checkbox>
                    </li>
                </ol>
                <h3>具体时间</h3>
                <p>{{todoTime}}</p>
                <h3>地址预览</h3>
                <div class="amap-page-container">
                    <el-amap :events="events" class="el-vue-amap" :plugin="plugin" :center="mapCenter" :zoom="16">
                        <el-amap-marker :position="mapCenter"></el-amap-marker>
                    </el-amap>
                </div>
            </mu-flexbox-item>

            <mu-flexbox-item class="button_list">
                <md-button class="md-raised md-accent joinButton" @click.native="joinClick">点击参加</md-button>
                <md-button class="md-raised starButton" @click.native="starClick">加入收藏</md-button>
            </mu-flexbox-item>
            
            <mu-flexbox-item>
                <div class="joinUsers" v-if="joinUsers.length !== 0">
                    <div>现在已经有这些人参加了哦：</div>
                    <div class="joinUsers">
                        <span v-for="(item, index) in joinUsers">

                        </span>
                    </div>
                </div>
                <div v-else>
                    <div>目前还没有人参加，期待您的参与！</div>
                </div>
            </mu-flexbox-item>


        </mu-flexbox>
    </div>
</template>

<script>
    import AV from 'leancloud-storage';
    import wechatIcon from '../assets/wechat_black.svg';

    var activityID = this.id;
    

    export default {
        name: "ActivityDetail",
        props: ['id'],
        // 挂载前获取数据
        beforeMount (){
            let activityID = this.id;
            let query = new AV.Query("Activity");
            let detail;
            query.include("createUser");
            query.get(activityID).then((activity)=>{
                console.log("activity", activity);
                console.log("createUser");
                console.log(activity.get("createUser"));
                this.activity = activity;
                this.activityDate = activity.get("date");
                this.userWechat = activity.get("createUser").get("wechatID");
                this.userPhoneNumber = activity.get("createUser").get("mobilePhoneNumber");
                
                
                
                this.loading = false;
                this.title = activity.get("title");
                this.description = activity.get("description");
                this.pictureUrl = activity.get("pictureUrl");

                //todo 相关
                this.todoList = activity.get("todoList");
                this.todoTime=  this.todoList[0].todoDate;
                this.todoAddress = this.todoList[0].todoAddress;
                this.todoGeolocation = this.todoList[0].todoGeolocation;
                if (activity.get("todoStatus") !== undefined){
                    this.todoStatus = activity.get("todoStatus");
                }

                this.joinUsers = activity.get("joinUsers");
                this.personNum = activity.get("personNum");
                this.mapCenter = [this.todoGeolocation.lng, this.todoGeolocation.lat];

            }, (error)=>{
                console.log("获取任务信息出错，error: ", error);
            })
        },
        data() {
                        
            return {
                // 高德地图英文化
                events: {
                    init(o) {
                        console.log("map.o", o);
                        o.setLang('en');
                    }
                },
                loading: true,

                activity: null,
                title: "Loading",
                description: "",
                pictureUrl: "",
                activityDate: "",

                joinUsers: [],
                personNum: 0,
                todoList: [],
                todoTime: "",
                todoAddress: "",
                todoGeolocation: {},

                todoStatus: [],

                // 创建者用户相关信息
                wechat: wechatIcon,
                userWechat: "",
                userPhoneNumber: "",

                // 地图相关设置
                mapCenter: [113.34793, 23.13248],
                plugin: ['ToolBar', {
                    pName: 'MapType',
                    defaultType: 0,
                    events: {
                    init(o) {
                    }
                    }
                }],


            }
        },
        methods: {
            todoStatusChange(value){
                console.log("todoStatus改变，目前状态:", value);
                
                this.activity.set("todoStatus", value);
                this.activity.save().then((msg)=>{
                    console.log("todoStatus保存成功: ", msg);
                }, (error)=>{
                    console.log("todoStatus保存失败: ", error);
                });
            },
            joinClick(){
                console.log("参加活动按钮click");
                let user = AV.User.current();
                console.log(user);
                let joinActivities = user.get("joinActivities");
                console.log(joinActivities);
                //joinActivities.push(this.activity);
                //user.set("joinActivities", joinActivities);
            },
            starClick(){
                console.log("收藏活动按钮click");
            }
        }
    }
</script>

<style lang="scss">
    #activity_detail{
        width: 80%;
        margin: 0 auto;
    }
    .title{
        position: relative;
    }
    .description{
        position: relative;
    }

    .base_information{
        p{
            height: 24px;
            span{
                display: inline-block;
                padding-top: 2px;
                height: 26px;
                line-height: 24px;
            }
        }
    }


    .amap-page-container .el-vue-amap {
        position: relative;
        width: 100%;
        height: 400px;
        top: 0px;
    }
    .button_list{
        text-align: center;
    }

    .joinButton{
        margin: 0 auto;
    }

    .todoList{
        padding-left: 0px;
        .todoItem{
            overflow: hidden;
            span{
                float: left;
                line-height: 30px;
            }
            .mu-checkbox{
                float: right;
                line-height: 30px;
            }
        }
    }
</style>