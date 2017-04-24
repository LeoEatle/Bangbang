<template>
    <div>
        <md-layout md-gutter md-align="center">
            <md-layout md-flex="80" md-gutter> 
                <h1>创建任务</h1>
            </md-layout>
            

            <md-layout md-column md-gutter md-flex="80"> 
                <md-layout>
                    <div class="block_header">{{tipText}}</div>
                </md-layout>

                <md-progress :md-progress="progress" v-show="progressShow" md-flex="60"></md-progress>

                <md-layout  class="uploadBlock">
                    <VueImgInputer v-model="picValue" theme="light" placeholder="点击选择图片" bottomText="点击图片进行修改" @onChange="setImg"></VueImgInputer>
                </md-layout>

                <md-layout>
                    <div class="block_header">请填写基本信息</div>
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
                    

                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            accessibility
                            </md-icon>
                            <label>人数</label>
                            <md-input v-model="personNum" type="number"></md-input>
                        </md-input-container>
                    </md-layout>

                    <md-layout>
                        <div class="block_header">根据流程添加目标地和预定时间</div>
                    </md-layout>
                    
                    <md-layout md-row>
                        <md-icon class="dateIcon">
                        access_time
                        </md-icon>
                        <datePicker v-model="time" md-flex="95" class="dateInput" hintText="请选择具体日期"></datePicker>
                    </md-layout>

                   <md-layout md-column>
                        <md-input-container>
                            <md-icon>room</md-icon>
                            <label>详细位置</label>
                            <md-input v-model="todoPlace" ></md-input>
                        </md-input-container>
                        <div class="amap_page_container">
                            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" :events="events"></el-amap-search-box>
                            <el-amap :vid="amap" :plugin="plugin" :center="mapCenter" :zoom="12">
                                <el-amap-marker v-for="marker in markers" :key="marker.position.toString()" :position="marker"></el-amap-marker>
                            </el-amap>
                        </div>
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
            let self = this;
            return {

                tipText: "请上传描述图片",

                // 基本信息
                title: "",
                description: "",
                place: "",
                time: "",
                personNum: "",

                // 标题图片相关信息
                picValue: "",
                picName: "",
                // 进度条
                progressShow: false,
                progress: 0,

                // 地图组件相关信息
                amap:'amap-vue-2',
                // 这里需要先初始化为定位点
                markers: [

                ],
                searchOption: {
                    city: '广州',
                    citylimit: true
                },
                // 初始化定位点
                mapCenter: [],
                events: {
                    init(o){
                        console.log(o);
                    }
                },
                todoPlace: '',
                plugin: [{
                    pName: 'Geolocation',
                    events: {
                    init(instance) {
                        instance.getCurrentPosition((status, result) => {
                        self.mapCenter = [result.position.lng, result.position.lat];
                        });
                    }
                    }
                }]

            }
        },
        methods:{
            // 地图组件相关方法
            addMarker(){
                let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
                let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
                this.markers.push([lng, lat]);
            },
            onSearchResult(pois) {
                let latSum = 0;
                let lngSum = 0;
                if (pois.length > 0) {
                    pois.forEach(poi => {
                        let {lng, lat} = poi;
                        lngSum += lng;
                        latSum += lat;
                        this.markers.push([poi.lng, poi.lat]);
                    });
                    let center = {
                        lng: lngSum / pois.length,
                        lat: latSum / pois.length
                    };
                    this.mapCenter = [center.lng, center.lat];
                }
            },
            // 设置图片相关
            setImg(file, filePath){
                this.picName = "activity_" + file.name;
                console.log("picValue", this.picValue);
                console.log(file, filePath);
            },
            // 创建活动，和leancloud的互动
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
                        that.tipText = "正在上传图片, 进度："+ e.percent + "%";
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

    .block_header {
        width: 100%;
        text-align: center;

        border-bottom: 2px dotted #3f51b5;

        font-size: 16px;
        line-height: 32px;
        font-family: inherit;
        color: rgba(0,0,0,0.54);
    }

    .uploadBlock{
        display: block !important;
        margin: 5px auto;
        height:  150px !important;
        
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

    // 地图组件相关css
     .amap-page-container {
        margin: auto;
    }

    .amap-page-container .el-vue-amap {
        height: 400px;
    }

    .search-box {
        position: relative;
        top: 65px;
        left: 20px;
    }
</style>