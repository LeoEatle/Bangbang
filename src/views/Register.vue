<template>
    <div id="personal-center">
        

        <md-tabs md-fixed>
            <md-tab id="login" md-label="Login">
                <login></login>
            </md-tab>

            <md-tab id="signin" md-label="signin">
                <md-layout md-column md-gutter md-flex-xsmall="80" md-flex-medium="">
                    <md-layout v-model = "show">
                        <my-upload
                            field = "img"
                            @crop-success = "cropSuccess"
                            @crop-upload-success = "cropUploadSuccess"
                            @crop-upload-fail = "cropUploadFail"
                            v-model = "show"
                            :width = "300"
                            :height = "300"
                            url="/upload"
                            :params = "params"
                            :headers = "headers"
                            img-format = "png">
                        
                        </my-upload>
                    </md-layout>
                    <md-layout md-column md-gutter >
                        <md-avatar id="user-avatar" class="md-large">
                            <img :src="imgDataUrl" @click.native = "toggleShow">
                        </md-avatar>
                        <p>点击头像进行设置</p>
                    </md-layout>
                    <md-layout md-align="center" md-flex-xsmall="80" md-flex-medium="">
                        <form validate>
                            <md-list class="md-double-line">

                                <md-list-item>
                                    <md-icon class="md-primary">mail</md-icon>
                                    <div class="md-list-text-container">
                                        <span>邮箱： {{email}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container>
                                            <label>在此编辑电子邮箱（注意！邮箱即唯一ID）</label>
                                            <md-input required v-model="email" type="email"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>

                                <md-list-item>
                                    <md-icon class="md-primary">vpn_key</md-icon>
                                    <div class="md-list-text-container">
                                        <span>密码： {{hiddenPassword}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container md-has-password>
                                            <label>在此编辑密码</label>
                                            <md-input required v-model="password" type="password"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>
                                <md-list-item>
                                    <md-icon class="md-primary">person</md-icon>
                                    <div class="md-list-text-container">
                                        <span>昵称： {{nickName}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container>
                                            <label>在此编辑昵称</label>
                                            <md-input v-model="nickName" type="text"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>

                                <md-list-item>
                                    <md-icon class="md-primary fa fa-venus-mars" ></md-icon>
                                    <div class="md-list-text-container">
                                        <span>类型： {{type}}</span>
                                    </div>
                                    <md-list-expand>
                                            <label>类型</label>
                                            <md-radio v-model="type" id="my-test1" name="my-test-group1" md-value="志愿者">志愿者</md-radio>
                                            <md-radio v-model="type" id="my-test2" name="my-test-group1" md-value="需求者">需求者</md-radio>
                                    </md-list-expand>
                                </md-list-item>

                                <md-list-item>
                                    <md-icon class="md-primary">phone</md-icon>
                                    <div class="md-list-text-container">
                                        <span>电话： {{phoneNumber}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container>
                                            <label>在此编辑电话号码</label>
                                            <md-input v-model="phoneNumber" type="number"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>


                                <md-list-item>
                                    <md-icon class="md-primary" :md-src=wechatIcon >微信</md-icon>
                                    <div class="md-list-text-container">
                                        <span>微信： {{wechatID}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container>
                                            <label>选择微信ID</label>
                                            <md-input v-model="wechatID" type="text"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>

                                <md-list-item>
                                    <span class="md-subheading subtips">点击下拉按钮进行设置</span>
                                </md-list-item>
                            </md-list>

                            <md-button id="saveButton" @click.native="registerEmit" class="md-raised md-accent">
                                注册
                            </md-button>

                            <md-snackbar md-position="bottom center" ref="snackbarFailed" md-duration=4000>
                                <span>注册发生错误，这不是您的问题，是服务器的问题</span>
                            </md-snackbar>

                            <md-snackbar md-position="bottom center" ref="snackbarSuccess" md-duration=4000>
                                <span>注册成功！返回首页</span>
                            </md-snackbar>
                        </form>
                    </md-layout>
                </md-layout>
            </md-tab>
        </md-tabs>

    </div>
</template>

<script>
    import myUpload from 'vue-image-crop-upload/upload-2.vue';
    import wechatIcon from '../assets/wechat_primary.svg';
    import login from './Login.vue';
    import AVTools from '../ext/AVTools';
    //import AV from 'leancloud-storage';
    //require("../assets/font-awesome.min.css")
    export default {
        name: 'personalCenter',
        data: function() {
            return (
                {
                    nickName: "LeoEatle",
                    type: "志愿者",
                    phoneNumber: 15627862382,
                    email: 'liuyitao811@hotmail.com',
                    password: '8415860l',
                    wechatID: "liuyito811",
                    wechatIcon: wechatIcon,
                    show: false,
                    params: {
                        token: '123456798',
                        name: 'avatar'
                    },
                    headers: {
                        smail: '*_~'
                    },
                    imgDataUrl: 'https://placeimg.com/64/64/people/8' // the datebase64 url of created image
                }
            )
        },
        methods: {
            toggleShow() {
                this.show = !this.show;
            },
              /**
			 * crop success
			 *
			 * [param] imgDataUrl
			 * [param] field
			 */
			cropSuccess(imgDataUrl, field){
				console.log('-------- crop success --------');
				this.imgDataUrl = imgDataUrl;
			},
			/**
			 * upload success
			 *
			 * [param] jsonData  server api return data, already json encode
			 * [param] field
			 */
			cropUploadSuccess(jsonData, field){
				console.log('-------- upload success --------');
				console.log(jsonData);
				console.log('field: ' + field);
			},
			/**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
			cropUploadFail(status, field){
				console.log('-------- upload fail --------');
				console.log(status);
				console.log('field: ' + field);
			},
            /**
            * userSetting
            */
            registerEmit(){
                //this.$refs.snackbarSuccess.open();
               console.log("开始为用户进行注册");
                // AVTools.AVInit();
                // LeanCloud - 注册
                // https://leancloud.cn/docs/leanstorage_guide-js.html#注册
                var user = new AV.User();
                var snackbarSuccess = this.$refs.snackbarSuccess;
                var snackbarFailed = this.$refs.snackbarFailed;
                user.setUsername(this.email);
                user.setPassword(this.password);
                user.setEmail(this.email);
                user.set("mobilePhoneNumber", this.phoneNumber);
                user.set('wechatID', this.wechatID);
                user.set('nickName', this.nickName);
                user.set('type', this.type);
                console.log("user", user);
                
                user.signUp().then(function (currentUser) {
                    // 注册成功，跳转到商品 list 页面
                    console.log("注册成功！开始录入其他信息");
                    var currentUser = AV.User.current();
                    //console.log(currentUser);

                    // currentUser.set("mobilePhoneNumber", this.phoneNumber);
                    // currentUser.set('wechatID', this.wechatID);
                    // currentUser.set('nickName', this.nickName);
                    // currentUser.set('type', this.type);
                    return currentUser.save();
                }, (function (error) {
                    snackbarFailed.open();
                    console.log(JSON.stringify(error));
                })).then(function (){
                    console.log("保存成功");
                    snackbarSuccess.open();
                    this.$router.push({
                        path: '/'
                    });
                }, function(error){
                    console.log("保存失败");
                    snackbarFailed.open();
                });
            }
        },
        components: {
            'my-upload': myUpload,
            'login': login
        },
        computed: {
            hiddenPassword: function(){ 
                return this.password.replace(/./g,"*");
            }
        }
    }
</script>

<style lang="css">
    svg {
        fill: currentColor;
    }

    #saveButton {
         margin-top: 20px;
    }

    form {
        width: 90%;
    }

    .subtips{
        display: block;
        margin: 0 auto;
    }

    @media only screen and (min-width: 768px) {
        form {
            width: 60%;
        }
    }
</style>