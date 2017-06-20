<template>
    <div>
        <md-layout md-gutter md-align="center">
            <md-layout md-flex="80" md-gutter> 
                <h1>Create new task</h1>
            </md-layout>
            <mu-stepper id="formWrapper" :activeStep="activeStep" orientation="vertical">
                <mu-step>
                    <mu-step-label>
                        Upload the picture for description
                    </mu-step-label>
                    <mu-step-content>
                        <md-layout>
                            <div class="block_header">{{tipText}}</div>
                        </md-layout>

                        <md-progress :md-progress="progress" v-show="progressShow" md-flex="60"></md-progress>

                        <md-layout  class="uploadBlock">
                            <VueImgInputer v-model="picValue" theme="light" placeholder="Click to choose the picture" bottomText="Click to change the picture" @onChange="setImg"></VueImgInputer>
                        </md-layout>
                    </mu-step-content>
                </mu-step>
                <mu-step>
                    <mu-step-label>
                        Fill in the basic information
                    </mu-step-label>
                    <mu-step-content>
                        <md-layout>
                            <md-input-container>
                                <md-icon>
                                grade
                                </md-icon>
                                <label>Title</label>
                                <md-input v-model="title" placeholder="Give it a name!（Less than 50）" maxlength="50" required></md-input>
                            </md-input-container>
                        </md-layout>

                        <md-layout>
                            <md-input-container>
                                <md-icon>
                                view_headline
                                </md-icon>
                                <label>Introduction</label>
                                <md-input v-model="description" placeholder="Please introduce the task with one sentence（less than 100）" maxlength="100" required></md-input>
                            </md-input-container>
                        </md-layout>
                        
                        <md-layout md-row>
                                <md-icon class="dateIcon">
                                access_time
                                </md-icon>
                                <mu-date-picker v-model="date" :dateTimeFormat="enDateFormat" class="dateInput" okLabel="Ok" cancelLabel="Cancel" hintText="Please select the concret date"/><br/>
                        </md-layout>

                        

                        <md-layout>
                            <md-input-container>
                                <md-icon>
                                accessibility
                                </md-icon>
                                <label>Person Number</label>
                                <md-input v-model="personNum" type="number"></md-input>
                            </md-input-container>
                        </md-layout>
                    </mu-step-content>
                </mu-step>
                <mu-step>
                    <mu-step-label>
                        Add procedure based on the destination and scheduled time
                    </mu-step-label>
                    <mu-step-content>
                        <md-layout md-column id="add-todo-block" v-show="todoShow">
                            <md-layout>
                                <md-input-container>
                                    <md-icon>
                                    grade
                                    </md-icon>
                                    <label>Step name</label>
                                    <md-input v-model="todoName" placeholder="The name of this step（less than 20 letters）" maxlength="20" ></md-input>
                                </md-input-container>
                            </md-layout>

                            <md-layout md-row>
                                <md-icon class="dateIcon">
                                access_time
                                </md-icon>
                                <mu-time-picker v-model="todoDate" class="dateInput" hintText="Select the scheduled time (12 hours system)"/><br/>

                            </md-layout>

                            <md-layout md-column>
                                <md-input-container>
                                    <md-icon>room</md-icon>
                                    <label>Destination</label>
                                    <md-input v-model="todoAddress" ></md-input>
                                </md-input-container>
                                <div class="amap-page-container">
                                    <el-amap-search-box class="search-box"  :search-option="searchOption" :on-search-result="onSearchResult" :events="events"></el-amap-search-box>
                                    <el-amap class="el-vue-amap" :plugin="plugin" :zoom="12" :center="mapCenter" :events="events">
                                        <el-amap-marker v-for="marker in markers" :key="marker.toString()" :position="marker"></el-amap-marker>
                                    </el-amap>
                                </div>
                            </md-layout>

                            <md-button id="confirmTodoButton" class="md-raised confirmTodoButton" @click.native="newTodoItem()">Confirm</md-button>
                        </md-layout>

                        <md-layout class="todoList-layout" md-column>
                            <ul>
                                <mu-sub-header>Added steps</mu-sub-header>
                                <mu-list-item v-for="(todo,index) in todoList" :title="todo.todoName" :key="index">
                                    <mu-flat-button @click="deleteTodoItem(index)" slot="right" label="Delete" class="demo-flat-button" secondary/>
                                    <mu-divider inset/>
                                </mu-list-item>
                            </ul>
                        </md-layout>
                    </mu-step-content>
                </mu-step>
            </mu-stepper>
            <div class="demo-step-content">
                <p v-if="finished">
                        <md-button id="newActivityButton" class="md-raised confirmTodoButton" @click.native="newActivity()">Finish the configuration</md-button>
                        Congratulations!<a href="javascript:;" @click="reset">Click here</a> to reset
                </p>
                <template v-if="!finished">
                <p>
                    {{content}}
                </p>
                <div>
                    <mu-flat-button class="demo-step-button" label="Last step" :disabled="activeStep === 0" @click="handlePrev"/>
                    <mu-raised-button class="demo-step-button" :label="activeStep === 2 ? 'Finish' : 'Next step'" primary @click="handleNext"/>
                </div>
                </template>
            </div>
            <mu-snackbar v-if="snackbar" :message="snackbarText" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
            
            
            <md-snackbar md-position="bottom center" ref="snackbarSuccess" md-duration=3000>
                <span>Success! Return to home page</span>
            </md-snackbar>
            <md-snackbar md-position="bottom center" ref="snackbarFailed" md-duration=3000>
                <span>Error when saving. This is not your fault. It is a server error.</span>
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

    // 英文版的Date picker
    const dayAbbreviation = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec']
    const monthLongList = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

    const enDateFormat = {
    formatDisplay (date) {
        return `${dayList[date.getDay()]}, ${monthList[date.getMonth()]} ${date.getDate()}`
    },
    formatMonth (date) {
        return `${monthLongList[date.getMonth()]} ${date.getFullYear()}`
    },
    getWeekDayArray (firstDayOfWeek) {
        let beforeArray = []
        let afterArray = []
        for (let i = 0; i < dayAbbreviation.length; i++) {
        if (i < firstDayOfWeek) {
            afterArray.push(dayAbbreviation[i])
        } else {
            beforeArray.push(dayAbbreviation[i])
        }
        }
        return beforeArray.concat(afterArray)
    }
    }

    export default {
        name: 'CreateActivity',
        components: {
            VueImgInputer,
            datePicker
        },

        
        data: function(){
            let self = this;
            return {
                // 高德地图英文化
                events: {
                    init(o) {
                        console.log("map.o", o);
                        o.setLang('en');
                    }
                },

                // datepicker 英文化
                enDateFormat,

                // stepper
                activeStep: 0,
                snackbar: false,
                snackbarText: "Success! Return to home page",
                tipText: "There are no pictures yet",

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
                                    alert("Fail to get the position，Please click the left corner to refresh");
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
                message = 'Upload the picture of task'
                break
                case 1:
                message = 'Fill in the basic information'
                break
                case 2:
                message = 'Add new step'
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
                        console.log("The picture is uploaded: "+ e.percent + "%");
                        that.progress = e.percent;
                        that.tipText = "Uploading...Progress："+ e.percent.toFixed(2) + "%";
                    }else{
                        that.tipText = "Uploading complete！";
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
                console.log("Start to new activity");
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
                let user = AV.User.current();
                console.log("user", user);
                
                // activity.save({fetchWhenSave: true}).then((msg)=>{
                //     console.log("activity saved! msg: ", msg);
                //     //let user = AV.User.current();
                //     console.log("user.get('createdActivities')", user.get("createdActivities"));
                //     // user.get("createdActivities").push(msg);
                //     // user.save();
                //     //that.showSnackbar();
                // }, (error)=>{
                //     console.error("activity save failed! code: ", error);
                //     that.$refs.snackbarFailed.open();
                // });

                activity.save().then((msg)=>{
                    console.log("activity saved! msg: ", msg);
                    let activityQuery = new AV.Query("Activity");
                    activityQuery.get(msg.id);
                }, (error)=>{
                    console.error("activity save failed! code: ", error);
                    that.$refs.snackbarFailed.open();
                }).then((item)=>{
                    user.get("createdActivities").push(item);
                    user.save();
                }).then(()=>{
                    console.log("success");
                    that.showSnackbar();// 没想到我竟然在答辩前一天晚上发现这个bug，并解决这个神奇的bug
                    // 如果这里不先通过id去get这个activity，这里的user发送leancloud请求不是PUT而是POST了一个batch，就会出错！
                    // 没有办法！我不明白为什么，但只能这么做，可能是如果不先get，leancloud没办法判断这个Pointer的属性，无法加入到数组中

                });
            },

            // 创建新的Todo项目
            newTodoItem() {
                this.todoList.push({
                    todoName: this.todoName,
                    todoAddress: this.todoAddress,
                    todoDate: this.todoDate,
                    todoGeolocation: {lat:this.todoGeolocation.lat, lng:this.todoGeolocation.lng}
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