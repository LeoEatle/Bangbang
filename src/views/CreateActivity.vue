<template>
    <div>
        <md-layout md-gutter md-align="center">
            <md-layout md-flex="80" md-gutter> 
                <h1>创建任务</h1>
            </md-layout>
            

            <md-layout md-column md-gutter md-flex="80"> 
                <div class="uploadText">{{tipText}}</div>
                <md-progress :md-progress="progress" v-show="progressShow" md-flex="60"></md-progress>
                <md-layout  class="uploadBlock">
                    <VueImgInputer v-model="picValue" theme="light" placeholder="点击选择图片" bottomText="点击图片进行修改" @onChange="setImg"></VueImgInputer>
                </md-layout>
                <form validate @submit.stop.prevent="submit">
                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            grade
                            </md-icon>
                            <label>标题</label>
                            <md-input v-model="title" placeholder="起个标题吧（不多于20字）" maxlength="20" required></md-input>
                        </md-input-container>
                    </md-layout>

                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            view_headline
                            </md-icon>
                            <label>介绍</label>
                            <md-input v-model="description" placeholder="请用一句话介绍（不多于40个字）" maxlength="40" required></md-input>
                        </md-input-container>
                    </md-layout>
                    
                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            room
                            </md-icon>
                            <label>地点</label>
                            <md-input v-model="place" placeholder="请说明要进行任务的地方" maxlength="40" required></md-input>
                        </md-input-container>
                    </md-layout>
                    
                    <md-layout md-row>
                        <md-icon class="dateIcon">
                        access_time
                        </md-icon>
                        <datePicker v-model="time" md-flex="95" class="dateInput" hintText="请选择具体日期"></datePicker>
                    </md-layout>

                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            accessibility
                            </md-icon>
                            <label>大概人数</label>
                            <md-input v-model="personNum" type="number"></md-input>
                        </md-input-container>
                    </md-layout>
                </form>

                <div>
                    <md-button class="md-raised md-accent newActivityButton" @click.native="newActivity()">创建活动</md-button>
                </div>
            </md-layout>
            <md-snackbar md-position="bottom center" ref="snackbarSuccess" md-duration=3000>
                <span>保存成功！返回首页</span>
            </md-snackbar>
            <md-snackbar md-position="bottom center" ref="snackbarFailed" md-duration=3000>
                <span>保存发生错误，这不是您的问题，是服务器的问题</span>
            </md-snackbar>
        </md-layout>
    </div>
</template>

<script>
    import AV from 'leancloud-storage';
    import AVTools from '../ext/AVTools.js';
    import VueImgInputer from 'vue-img-inputer';
    import datePicker from 'muse-components/datePicker';
    AVTools.AVInit();
    export default {
        name: 'CreateActivity',
        components: {
            VueImgInputer,
            datePicker
        },
        data: function(){
            return {
                tipText: "请上传描述图片",

                title: "",
                description: "",
                place: "",
                time: "",
                personNum: "",
                picValue: "",
                picName: "",
                // 进度条
                progressShow: false,
                progress: 0,
            }
        },
        methods:{
            setImg(file, filePath){
                this.picName = "activity_" + file.name;
                console.log("picValue", this.picValue);
                console.log(file, filePath);
            },
            newActivity() {
                console.log("开始创建新活动！");
                // 构建一个新的AV.Object
                var ActivityCreator = AV.Object.extend('Activity');
                // 创建一个新的activity
                var activity = new ActivityCreator();

                activity.set("title", this.title);
                activity.set("description", this.description);
                activity.set("place", this.place);
                activity.set("time", this.time);
                activity.set("personNum", this.personNum);
                activity.set("createUser", AV.User.current())

                // 处理图片
                
                var file = new AV.File(this.picName, this.picValue);
                var that = this;
                file.save({onprogress: function(e){
                    that.progressShow = true;
                    if(e.percent < 100){
                        console.log("图片已上传"+ e.percent + "%");
                        that.progress = e.percent;
                        that.tipText = "正在上传图片";
                    }

                }}).then(function(msg){
                    that.progressShow = false;
                    console.log("图片上传成功, msg:" + msg);
                    activity.set('titlePicture', file);
                    activity.save();
                }, function(error){
                    that.progressShow = false;
                    console.log("图片上传失败, error:" + error);
                }).then(function(msg){
                    console.log("activity saved! msg: ", msg);
                    that.$refs.snackbarSuccess.open();
                    that.$router.push({
                        path: "/success_upload_activity"
                    })
                }, function(error){
                    console.error("activity save failed! code: ", error);
                    that.$refs.snackbarFailed.open();
                });
            }
        }
    }
</script>

<style>
    .newActivityButton{
        margin-top: 50px;
    }

    .uploadText {
        font-size: 16px;
        line-height: 32px;
        font-family: inherit;
        color: rgba(0,0,0,0.54);
    }

    .uploadBlock{
        margin: 0 auto;
        
    }

    .dateIcon{
        display: inline-block;
        float: left;
        margin: 8px 8px 8px 0px !important;
        
    }
    .dateInput{
        display: inline-block;
        width: 200px !important;
        float: left;
    }
</style>