<template>
    <div>
        <md-layout md-gutter md-align="center">
            <md-layout md-flex="80" md-gutter> 
                <h1>创建任务</h1>
            </md-layout>
            <mu-stepper id="formWrapper" :activeStep="activeStep" orientation="vertical">
                <mu-step>
                    <mu-step-label>
                        上传描述图片
                    </mu-step-label>
                    <mu-step-content>
                        <md-layout>
                            <div class="block_header">{{tipText}}</div>
                        </md-layout>

                        <md-progress :md-progress="progress" v-show="progressShow" md-flex="60"></md-progress>

                        <md-layout  class="uploadBlock">
                            <VueImgInputer v-model="picValue" theme="light" placeholder="点击选择图片" bottomText="点击图片进行修改" @onChange="setImg"></VueImgInputer>
                        </md-layout>
                    </mu-step-content>
                </mu-step>
                <mu-step>
                    <mu-step-label>
                        填写基本信息
                    </mu-step-label>
                    <mu-step-content>
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
                        
                        <md-layout md-row>
                                <md-icon class="dateIcon">
                                access_time
                                </md-icon>
                                <mu-date-picker v-model="date" class="dateInput" hintText="请选择具体日期"/><br/>
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
                    </mu-step-content>
                </mu-step>
                <mu-step>
                    <mu-step-label>
                        根据流程添加目的地和预定时间
                    </mu-step-label>
                    <mu-step-content>
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
                                <mu-time-picker v-model="todoDate" class="dateInput" hintText="请选择事件(12小时制)"/><br/>

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

                        <md-layout class="todoList-layout" md-column>
                            <ul>
                                <mu-sub-header>已添加的步骤</mu-sub-header>
                                <mu-list-item v-for="(todo,index) in todoList" :title="todo.todoName" :key="index">
                                    <mu-flat-button @click="deleteTodoItem(index)" slot="right" label="删除" class="demo-flat-button" secondary/>
                                    <mu-divider inset/>
                                </mu-list-item>
                            </ul>
                        </md-layout>
                    </mu-step-content>
                </mu-step>
            </mu-stepper>
            <div class="demo-step-content">
                <p v-if="finished">
                        <md-button id="newActivityButton" class="md-raised confirmTodoButton" @click.native="newActivity()">完成任务设置</md-button>
                        恭喜完成任务!<a href="javascript:;" @click="reset">点这里</a>可以重置
                        
                </p>
                <template v-if="!finished">
                <p>
                    {{content}}
                </p>
                <div>
                    <mu-flat-button class="demo-step-button" label="上一步" :disabled="activeStep === 0" @click="handlePrev"/>
                    <mu-raised-button class="demo-step-button" :label="activeStep === 2 ? '完成' : '下一步'" primary @click="handleNext"/>
                </div>
                </template>
            </div>
            <mu-snackbar v-if="snackbar" :message="snackbarText" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
            
            
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
                // stepper
                activeStep: 0,
                snackbar: false,
                snackbarText: "保存成功！返回首页",
                tipText: "还未上传图片",

                // 基本信息
                title: "",
                description: "",
                personNum: "",
                date: "",
                geolocation: [],

                // 标题图片相关信息
                picValue: "",
                picName: "",
                titlePicture: "",
                avFileID: "",
                avFileUrl: "",

                // 进度条
                progressShow: false,
                progress: 0,

                // 缓存的todo项目
                todoShow: true,
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
                mapCenter: [113.34793, 23.13248],

            }
        },

        computed: {
            content () {
            let message = ''
            switch (this.activeStep) {
                case 0:
                message = '上传活动图片'
                break
                case 1:
                message = '填写基本信息'
                break
                case 2:
                message = '添加步骤'
                break
                default:
                message = 'fuck! 又 TM 出错了！！！'
                break
            }
            return message
            },
            finished () {
            return this.activeStep > 2
            }
        },
        methods:{
            // stepper相关方法
            handleNext () {
                this.activeStep++
            },
            handlePrev () {
                this.activeStep--
            },
            reset () {
                this.activeStep = 0
            },

            showSnackbar () {
                this.snackbar = true
                if (this.snackTimer) clearTimeout(this.snackTimer)
                this.snackTimer = setTimeout(() => { 
                    this.snackbar = false;
                    this.$router.push({
                        path: '/'
                    })
                 }, 2000)
            },
            hideSnackbar () {
                this.snackbar = false
                if (this.snackTimer) clearTimeout(this.snackTimer)
            },


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
                // 直接上传图片
                var avFile = new AV.File(this.picName, this.picValue);
                var that = this;
                avFile.save({onprogress: function(e){
                    that.progressShow = true;
                    if(e.percent < 100){
                        console.log("图片已上传"+ e.percent + "%");
                        that.progress = e.percent;
                        that.tipText = "正在上传图片, 进度："+ e.percent + "%";
                    }else{
                        that.tipText = "上传完成！";
                    }

                }}).then(function(msg){
                    that.progressShow = false;
                    console.log("图片上传成功, msg:");
                    console.log(msg);
                    that.titlePicture = avFile;
                    that.avFileID = msg.id;
                    that.avFileUrl = msg.attributes.url;
                    
                    // 这里存储id
                }, function(error){
                    that.progressShow = false;
                    console.log("图片上传失败, error:" + error);
                });
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
                activity.set("date", this.date);
                activity.set("personNum", this.personNum);
                activity.set("createUser", AV.User.current());
                activity.set("joinUsers", []);
                activity.set("titlePicture", this.titlePicture);
                activity.set("pictureID", this.avFileID);
                activity.set("pictureUrl", this.avFileUrl);
                activity.set("todoList", this.todoList);
                activity.set("geolocation", new AV.GeoPoint(this.todoList[0].todoGeolocation.lat, this.todoList[0].todoGeolocation.lng));
                activity.set("likes", 0);

                // 处理图片
                
                var file = new AV.File(this.picName, this.picValue);
                var that = this;
                activity.save().then(function(msg){
                    console.log("activity saved! msg: ", msg);
                    that.showSnackbar();
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
            },
            // Delete Todo Item
            deleteTodoItem(index) {
                this.todoList.splice(index, 1);
            }
        }
    }
</script>

<style lang="less">
    canvas{
        max-width: none !important;
    }

    #formWrapper{
        width: 100%;
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

    #newActivityButton{
        width: 90%;
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