<template>
    <div >
        

        <md-tabs md-fixed>
            <md-tab id="login" md-label="Login">
                <login></login>
            </md-tab>

            <md-tab id="signin" md-label="signin">
                <md-layout md-column md-gutter md-flex-xsmall="80" md-flex-medium="">
                    <md-layout md-column md-gutter >
                        <md-avatar  @click.native = "toggleShow" id="user-avatar" class="md-large">
                            <img :src="imgDataUrl">
                        </md-avatar>
                        <p>{{ $t("register.click_avatar") }}</p>
                        <my-upload field="img"
                        @crop-success="cropSuccess"
                        @crop-upload-success="cropUploadSuccess"
                        @crop-upload-fail="cropUploadFail"
                        v-model="show"
                        :width="300"
                        :height="300"
                        url="/upload"
                        :params="params"
                        :headers="headers"
                        langType="en"
                        img-format="png"></my-upload>
                        </md-layout>
                    <md-layout md-align="center" md-flex-xsmall="80" md-flex-medium="">
                        <form validate>
                            <md-list class="md-double-line">

                                <md-list-item>
                                    <md-icon class="md-primary">mail</md-icon>
                                    <div class="md-list-text-container">
                                        <span>{{ $t("register.email") }}： {{email}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container>
                                            <label>{{ $t("register.email_label") }}</label>
                                            <md-input required v-model="email" type="email"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>

                                <md-list-item>
                                    <md-icon class="md-primary">vpn_key</md-icon>
                                    <div class="md-list-text-container">
                                        <span>{{ $t("register.password") }}： {{hiddenPassword}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container md-has-password>
                                            <label>{{ $t("register.password_label") }}</label>
                                            <md-input required v-model="password" type="password"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>
                                <md-list-item>
                                    <md-icon class="md-primary">person</md-icon>
                                    <div class="md-list-text-container">
                                        <span>{{ $t("register.nickName") }}： {{nickName}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container>
                                            <label>{{ $t("register.nickName_label") }}</label>
                                            <md-input v-model="nickName" type="text"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>

                                <md-list-item>
                                    <md-icon class="md-primary fa fa-venus-mars" ></md-icon>
                                    <div class="md-list-text-container">
                                        <span>{{ $t("register.type") }}： {{type}}</span>
                                    </div>
                                    <md-list-expand>
                                            <md-radio v-model="type" id="my-test1" name="my-test-group1" md-value="Service provider">{{ $t("register.type_provider") }}</md-radio>
                                            <md-radio v-model="type" id="my-test2" name="my-test-group1" md-value="Service demander">{{ $t("register.type_demander") }}</md-radio>
                                    </md-list-expand>
                                </md-list-item>

                                <md-list-item>
                                    <md-icon class="md-primary">phone</md-icon>
                                    <div class="md-list-text-container">
                                        <span>{{ $t("register.phoneNumber") }}： {{phoneNumber}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container>
                                            <label>{{ $t("register.phoneNumber_label") }}</label>
                                            <md-input v-model="phoneNumber" type="number"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>


                                <md-list-item>
                                    <md-icon class="md-primary" :md-src=wechatIcon >微信</md-icon>
                                    <div class="md-list-text-container">
                                        <span>{{ $t("register.wechat") }}： {{wechatID}}</span>
                                    </div>
                                    <md-list-expand>
                                        <md-input-container>
                                            <label>{{ $t("register.wechat_label") }}</label>
                                            <md-input v-model="wechatID" type="text"></md-input>
                                        </md-input-container>
                                    </md-list-expand>
                                </md-list-item>

                                <md-list-item>
                                    <span class="md-subheading subtips">{{ $t("register.tip") }}</span>
                                </md-list-item>
                            </md-list>

                            <md-button id="saveButton" @click.native="registerEmit" class="md-raised md-accent">
                                {{ $t("register.register") }}
                            </md-button>

                            <md-snackbar md-position="bottom center" ref="snackbarFailed" md-duration=4000>
                                <span>{{ $t("register.register_error") }}</span>
                            </md-snackbar>

                            <md-snackbar md-position="bottom center" ref="snackbarSuccess" md-duration=4000>
                                <span>{{ $t("register.register_success") }}</span>
                            </md-snackbar>
                        </form>
                    </md-layout>
                </md-layout>
            </md-tab>
        </md-tabs>

    </div>
</template>

<script>
    import myUpload from '../components/upload2.vue';
    import wechatIcon from '../assets/wechat_primary.svg';
    import login from './Login.vue';
    import AV from 'leancloud-storage';
    import AVTools from '../ext/AVTools';
    
    AVTools.AVInit();
    export default {
        name: 'Register',
        data: function() {
            return (
                {
                    nickName: "example",
                    type: "Service provider",
                    phoneNumber: 0,
                    email: 'example@example.com',
                    password: '',
                    wechatID: "example",
                    wechatIcon: wechatIcon,

                    // 关于配置头像上传参数
                    show: false,
                    params: {
                        token: '123456798',
                        name: this.nickName + '_avator'
                    },
                    headers: {
                        smail: '*_~'
                    },
                    imgDataUrl: 'https://placeimg.com/64/64/people/8', // the datebase64 url of created image,
                    avatar: null
                }
            )
        },
        methods: {
            toggleShow() {
                console.log("toggle show");
                this.show = !this.show;
            },
              /**
			 * crop success
			 *
			 * [param] imgDataUrl
			 * [param] field
			 */
			cropSuccess(createImgUrl, field){
				console.log('-------- crop success --------');
                
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
                this.avatar = jsonData;
                this.imgDataUrl = jsonData.get("url");
k 			},
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
                user.set('avatar', this.avatar)

                user.set('createActivities', []);
                user.set('joinActivities', []);
                user.set('starActivities', []);


                console.log("user", user);
                
                var that = this;// 为了将vue实例传入promise，进行router跳转
                user.signUp().then(function (msg){
                    console.log("保存成功，代码：", JSON.stringify(msg));
                    snackbarSuccess.open();
                    setTimeout(()=>{
                        that.$router.push({
                        path: '/'
                     });
                    }, 1000)
                    
                }, function(error){
                    console.log("保存失败，错误代码：", JSON.stringify(error));
                    //console.log(JSON.stringify(error));
                    snackbarFailed.open();
                });
            }
        },
        components: {
            'my-upload': myUpload,
            'login': login,
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