<template>
    <div id="activity_detail">
        <div v-show="loading">
            Loading...
        </div>

        <mu-flexbox v-show="loading == false" orient="vertical" :gutter="8" >
            <mu-flexbox-item class="base_information">
                <h2 class="title">{{title}}</h2>
                <img :src="pictureUrl" alt="任务图片">
                <h3>Introduction</h3>
                <p class="description">{{description}}</p>
                <h3>Person number limited</h3>
                <p class="numberLimit">{{joinUsers.length}}/{{personNum}}</p>
                <h3>Scheduled date</h3>
                <p class="activityDate">{{activityDate}}</p>
                <h3>Contact information</h3>
                <p><md-icon v-bind:md-src="wechat"></md-icon>  <span>Wechat: {{userWechat}}</span></p>
                <p><md-icon>phone</md-icon> <span>Mobile phone number：{{userPhoneNumber}}</span> </p>
            </mu-flexbox-item>

            <mu-flexbox-item>
                <h3>The participants</h3>
                <div class="joinUsers" v-if="joinUsers.length !== 0">
                    <div>Now these people have joined this task：</div>
                    <div class="joinUsers">
                        <span v-for="(item, index) in joinUsers">
                            {{item.get("nickName")}}
                        </span>
                    </div>
                </div>
                <div v-else>
                    <div>There are no any participants yet！</div>
                </div>
            </mu-flexbox-item>
            

            <mu-flexbox-item class="todoListBlock" >
                <h3>Plan List   <small>Click the item to see the detail</small></h3>
                <ol class="todoList">
                    <li class="todoItem" v-for="(item, index) in todoList" :key="index" >
                        <span @click="itemDetail(item.todoGeolocation, item.todoDate)">{{item.todoName}}</span> <mu-checkbox :nativeValue="index.toString()" v-model="todoStatus" v-on:change="todoStatusChange" :disabled="checkBoxDisable"></mu-checkbox>
                    </li>
                </ol>
                <h3>Concret time</h3>
                <p>{{todoTime}}</p>
                <h3>Address</h3>
                <div class="amap-page-container">
                    <el-amap :events="events" class="el-vue-amap" :plugin="plugin" :center="mapCenter" :zoom="16">
                        <el-amap-marker :position="mapCenter"></el-amap-marker>
                    </el-amap>
                </div>
            </mu-flexbox-item>

            <mu-flexbox-item class="button_list">
                <md-button class="md-raised md-accent joinButton" @click.native="joinClick" :disabled="joinButtonDisable">{{joinButtonText}}</md-button>
                <md-button class="md-raised starButton" @click.native="starClick">Star</md-button>
            </mu-flexbox-item>

            <mu-flexbox-item class="comment_list">
                <mu-list>
                    <mu-sub-header>Comments</mu-sub-header>
                    <mu-list-item v-if="commentList.length === 0">There is no any comments yet.</mu-list-item>
                    <mu-list-item v-for="(item, index) in commentList" :title="item.title" :key="index">
                        <mu-avatar :src="item.avatar" slot="leftAvatar"/>
                        <span slot="describe">
                            <span style="color: rgba(0,0,0,0.87)">{{item.creator}}</span>
                            <br/>
                            {{item.content}}
                        </span>
                        <mu-divider inset/>
                    </mu-list-item>
                </mu-list>
                <mu-text-field v-model="commentTitle" label="title" labelFloat fullWidth></mu-text-field>
                <mu-text-field v-model="commentContent" hintText="Input your comment" fullWidth></mu-text-field>
                <md-button style="display: block; margin: 0px auto 15px auto;" class="md-raised commentButton" @click.native="comment">Leave comments</md-button>

            </mu-flexbox-item>
            
            <mu-snackbar v-if="snackbar" :message="snackbarText" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>




        </mu-flexbox>
    </div>
</template>

<script>
    import AV from 'leancloud-storage';
    import wechatIcon from '../assets/wechat_black.svg';

    var activityID = this.id;
    let user = AV.User.current();
    let userType = "participants";
    let checkBoxDisable = true;

    let joinButtonText = "JOIN NOW";
    let joinButtonDisable = false;

    if (user.get("type") == "需求者"){
        userType = "creator";
        checkBoxDisable = false;
    }
    
    export default {
        name: "ActivityDetail",
        props: ['id'],
        // 路由钩子
        beforeRouteUpdate (to, from, next){
            //fetchActivityList();
        },
        // 挂载前获取数据
        beforeMount (){
            let activityID = this.id;
            let query = new AV.Query("Activity");
            let detail;
            query.include("createUser");
            query.include("joinUsers");
            query.get(activityID).then((activity)=>{
                //console.log("activity", activity);
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

                // 判断此用户是否有参加
                this.joinButtonText = "JOIN NOW";
                this.joinButtonDisable = false;
                this.joinUsers.forEach((joinUser)=>{
                    console.log("joinUser", joinUser);
                    console.log("AV.User.current", AV.User.current());
                    if(joinUser.id == AV.User.current().id){
                        this.joinButtonText = "Participated";
                        this.joinButtonDisable = true;
                    }
                })

                this.commentList = activity.get("commentList");

            }, (error)=>{
                console.log("获取任务信息出错，error: ", error);
            })
        },
        data() {
                        
            return {
                

                // 用户的type判断
                userType: userType,
                checkBoxDisable: checkBoxDisable,

                joinButtonText: joinButtonText,
                joinButtonDisable: joinButtonDisable,

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

                // 留言相关数据
                commentList: [],
                commentTitle: "",
                commentContent: "",

                snackbar: false,
                snackbarText: "Comment successfully!"
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
                let self = this;
                console.log(user);
                let activity = new AV.Query("Activity");
                activity.get(this.activity.id).then((item)=>{
                    item.get('joinUsers').push(user);
                    item.save();
                }, (error)=>{
                    console.log(error);
                }).then((msg)=>{
                    console.log("任务添加参与者成功", msg);
                    user.get("joinedActivities").push(self.activity);
                    user.save();
                    // self.showSnackbar();
                    self.joinButtonText = "Participated";
                    self.joinButtonDisable = true;
                }, (error)=>{
                    console.log("任务添加参与者失败", error);
                }).then((msg)=>{
                    console.log("用户添加参与活动成功", msg);
                    
                }, (error)=>{
                    console.log("用户添加参与活动失败", error);
                })
                
            },
            starClick(){
                console.log("收藏活动按钮click");
                user.get("staredActivities").push(this.activity);
                user.save().then(()=>{
                    console.log("stared success");
                })
            },
            itemDetail(geolocation, time){
                console.log(geolocation, time);
                this.mapCenter = [geolocation.lng, geolocation.lat];
                this.todoTime = time;
            },
            showSnackbar () {
                this.snackbar = true
                if (this.snackTimer) clearTimeout(this.snackTimer)
                this.snackTimer = setTimeout(() => { 
                    this.snackbar = false;
                 }, 2000)
            },
            hideSnackbar () {
                this.snackbar = false
                if (this.snackTimer) clearTimeout(this.snackTimer)
            },

            comment(){
                // 增加新的评论
                let comment = {
                    title: this.commentTitle,
                    content: this.commentContent,
                    avatar: user.get("avatar").get("url"),
                    creator: user.get("nickName")
                }
                this.commentList.push(comment);
                this.activity.set("commentList", this.commentList);
                var that = this;
                this.activity.save().then(function(msg){
                    console.log("comment saved! msg: ", msg);
                    that.commentTitle = "";
                    that.commentContent = "";
                    that.showSnackbar();
                }, function(error){
                    that.snackbarText = "Error!";
                    that.showSnackbar();
                })
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
        line-height: 21px;
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

    .commentButton{
        display: block;
        margin: 0 auto 5px auto;
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