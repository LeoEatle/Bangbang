<template>
    <div>
        <md-layout md-gutter md-align="center">
            <md-layout md-flex="80" md-gutter> 
                <h1>创建任务</h1>
            </md-layout>
            

            <md-layout class="formWrapper" md-column md-gutter md-flex="80"> 
                <md-layout>
                    <div class="block_header">1.{{tipText}}</div>
                </md-layout>

                <md-progress :md-progress="progress" v-show="progressShow" md-flex="60"></md-progress>

                <md-layout  class="uploadBlock">
                    <VueImgInputer v-model="picValue" theme="light" placeholder="点击选择图片" bottomText="点击图片进行修改" @onChange="setImg"></VueImgInputer>
                </md-layout>

                <md-layout>
                    <div class="block_header">2.请填写基本信息</div>
                </md-layout>

                <form id="form" validate @submit.stop.prevent="submit">
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
                            accessibility
                            </md-icon>
                            <label>人数</label>
                            <md-input v-model="personNum" type="number"></md-input>
                        </md-input-container>
                    </md-layout>

                    <md-layout>
                        <div class="block_header">3.根据流程添加目标地和预定时间</div>
                    </md-layout>


                    

                    <md-layout class="todoList-layout" md-column>
                        <ul>
                            <mu-sub-header>已添加的步骤</mu-sub-header>
                            <oi v-for="todo in todoList" :title="todo.todoName" :key="todo.todoName">
                                <span>{{todo.todoName}}</span>
                                <mu-flat-button slot="right" label="删除" class="demo-flat-button" secondary/>
                                <mu-divider inset/>
                            </oi>
                        </ul>
                    </md-layout>



                    <md-button id="newTodoButton" class="md-raised newTodoButton" @click.native="showTodoBlock()">添加一个步骤</md-button>


                    <md-layout md-column id="add-todo-block" v-show="todoShow">
                        <md-layout>
                            <md-input-container>
                                <md-icon>
                                grade
                                </md-icon>
                                <label>步骤名称</label>
                                <md-input v-model="todoName" placeholder="步骤的名字（不多于20字）" maxlength="20" ></md-input>
                            </md-input-container>
                        </md-layout>

                        <md-layout md-row>
                            <md-icon class="dateIcon">
                            access_time
                            </md-icon>
                            <datePicker v-model="todoDate" md-flex="95" class="dateInput" hintText="请选择具体日期"></datePicker>
                        </md-layout>

                        <md-layout md-column>
                            <md-input-container>
                                <md-icon>room</md-icon>
                                <label>详细位置</label>
                                <md-input v-model="todoAddress" ></md-input>
                            </md-input-container>
                            <div class="amap-page-container">
                                <el-amap-search-box class="search-box"  :search-option="searchOption" :on-search-result="onSearchResult" :events="events"></el-amap-search-box>
                                <el-amap class="el-vue-amap" :plugin="plugin" :zoom="12" :center="mapCenter" >
                                    <el-amap-marker v-for="marker in markers" :key="marker.toString()" :position="marker"></el-amap-marker>
                                </el-amap>
                            </div>
                        </md-layout>

                        <md-button id="confirmTodoButton" class="md-raised confirmTodoButton" @click.native="newTodoItem()">确定</md-button>

                    </md-layout>
                </form>

                <div>
                    <md-button id="newActivityButton" class="md-raised md-accent newActivityButton" @click.native="newActivity()">创建活动</md-button>
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
                personNum: "",

                // 标题图片相关信息
                picValue: "",
                picName: "",
                // 进度条
                progressShow: false,
                progress: 0,

                // 缓存的todo项目
                todoShow: false,
                todoName: '',
                todoDate: '',
                todoAddress: '',
                todoGeolocation: {
                    lat: 23.132486,
                    lng: 113.347936
                },

                // 已添加的todoList
                todoList: [],

                // 地图组件相关信息
                amap:'amap-vue-2',
                // 这里需要先初始化为定位点
                markers: [

                ],
                searchOption: {
                    city: '广州',
                    citylimit: true
                },
                events: {
                    init(o){
                        console.log(o);
                    }
                },
                plugin: [{
                    pName: 'Geolocation',
                    panToLocation: true,
                    zoomToAccuracy: true,
                    events: {
                        init(instance) {
                            instance.getCurrentPosition((status, result) => {
                                console.log("获取当前位置的result: ", result);
                                if (result.info === "SUCCESS"){
                                    self.mapCenter = [result.position.lng, result.position.lat];
                                    self.todoAddress = result.todoAddress;
                                    self.todoGeolocation.lng = result.position.lng;
                                    self.todoGeolocation.lat = result.position.lat;
                                }
                                else {
                                    alert("获取位置失败，请点击左下角刷新");
                                }
                            });
                        }
                    }
                },
                {
                    pName: 'ToolBar',
                    position: 'LT',
                    events: {
                        init(instance) {
                            console.log(instance);
                        }
                    }
                }
                ],
                // 初始化定位点
                mapCenter: [23.132486, 113.347936],

            }
        },
        methods:{
            // 地图组件相关方法
            onSearchResult(pois) {
                let latSum = 0;
                let lngSum = 0;
                if (pois.length > 0) {
                    console.log(pois);
                    this.todoAddress = pois[0].name;
                    this.todoGeolocation.lng = pois[0].lng;
                    this.todoGeolocation.lat = pois[0].lat;
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
            },

            // 创建新的Todo项目
            newTodoItem() {
                this.todoList.push({
                    todoName: this.todoName,
                    todoAddress: this.todoAddress,
                    todoDate: this.todoDate,
                    todoGeolocation: this.todoGeolocation
                })
            },
            showTodoBlock() {
                this.todoShow = !this.todoShow;
            }
        }
    }
</script>

<style lang="less">
    canvas{
        max-width: none !important;
    }

    .formWrapper{
        text-align: center;
    }

    #form{
        width: auto;
        text-align: center;
    }

    .hidden{
        display: hidden !important;
    }


    .todoList-layout{
        text-align: left;
        ul{
            padding-left: 0px;
        }
    }

    .newActivityButton, #confirmTodoButton{
        margin-top: 50px;
    }


    .block_header {
        width: 100%;
        text-align: left;
        margin-bottom: 10px;

        font-size: 14px;
        line-height: 32px;
        font-family: inherit;
        color: #e91e63;
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
        position: relative;
        display: block;
        margin: auto;
        width: 100%;
        height: 400px !important;
    }

    .amap-page-container .el-vue-amap {
        position: relative;
        width: 100%;
        height: 400px;
        top: -20px;
    }

    .search-box{
        position: absolute;
        width: auto !important;
        top: 50px;
        z-index: 10000 !important;
    }

    .search-box-wrapper {
        top: 0px;
        left: 0px;
    }
</style>