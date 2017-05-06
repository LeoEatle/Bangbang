<template>
        <md-layout md-column md-align="center" md-flex-xsmall="80" md-flex-medium="60">
                <md-layout md-column md-gutter>
                    <md-avatar id="user-avatar" class="md-large">
                        <img :src="imgDataUrl" >
                    </md-avatar>
                </md-layout>
                <md-layout md-align="center" >
                        <form validate>
                            <md-list class="md-double-line">
                                <md-list-item>
                                        <md-input-container>
                                            <label>{{ $t("login.email_label") }}</label>
                                            <md-input v-model="email" type="mail"></md-input>
                                        </md-input-container>
                                </md-list-item>
                                <md-list-item>
                                        <md-input-container md-has-password>
                                            <label>{{ $t("login.password_label") }}</label>
                                            <md-input v-model="password" type="password"></md-input>
                                        </md-input-container>
                                </md-list-item>
                            </md-list>
                        </form>
                </md-layout>

                <md-layout md-align="center" md-column md-flex="60">
                    <span id="otherType" class="md-subheading" md-flex="100">{{ $t("login.other_type") }}</span>
                    <md-layout md-align="center" md-flex="100">
                        <md-layout md-align="center" md-flex="50">
                            <md-button class="md-primary">{{ $t("login.wechat_login") }}</md-button>                            
                        </md-layout>

                        <md-layout md-align="center" md-flex="50">
                            <md-button class="md-primary">{{ $t("login.weibo_login") }}</md-button>
                        </md-layout>
                        
                        <md-layout md-align="center" md-flex="50">
                            <md-button class="md-primary">{{ $t("login.douban_login") }}</md-button>
                        </md-layout>

                        <md-layout md-align="center" md-flex="50">
                            <md-button class="md-primary">{{ $t("login.QQ_login") }}</md-button>
                        </md-layout>
                        
                    </md-layout>
                    <md-layout md-align="center" md-flex="50">
                        <md-button  id="saveButton" @click.native="login" class="md-raised md-accent">
                            {{ $t("login.login") }}
                        </md-button>
                    </md-layout>
                    <md-snackbar md-position="bottom center" ref="snackbarFailed" md-duration=4000>
                        <span>{{ $t("login.fail") }}</span>
                    </md-snackbar>

                    <md-snackbar md-position="bottom center" ref="snackbarSuccess" md-duration=4000>
                        <span>{{ $t("login.success") }}</span>
                    </md-snackbar>
                </md-layout>
                

        </md-layout>
    </div>

</template>


<script>
    import wechatIcon from '../assets/wechat_primary.svg';
    import AV from 'leancloud-storage';
    import AVTools from '../ext/AVTools';
    //require("../assets/font-awesome.min.css")
    export default {
        name: 'personalCenter',
        data: function() {
            return (
                {
                    nickName: "",
                    phoneNumber: 0,
                    email: '',
                    password: '',
                    wechatID: "",
                    wechatIcon: wechatIcon,
                    show: false,
                    imgDataUrl: 'https://placeimg.com/64/64/people/8' // the datebase64 url of created image
                }
            )
        },
        methods: {
            login(){
                 // LeanCloud - 登录
                // https://leancloud.cn/docs/leanstorage_guide-js.html#用户名和密码登录
                var that = this;
                AVTools.AVInit();
                AV.User.logIn(this.email, this.password).then(function (loginedUser) {
                    // 登录成功，跳转到首页
                    var query = new AV.Query('_User');
                    console.log('用户登录成功！query: ', query);
                    console.log('用户名：',loginedUser.getUsername());
                    that.$refs.snackbarSuccess.open();
                    that.$router.push({
                        path: '/'
                    });
                }, function (error) {
                    alert(JSON.stringify(error));
                    that.$refs.snackbarFailed.open();
                });
            },
            wechatLogin(){
                //TODO: 这里要补上微信登录逻辑
            }
        }
    }
</script>

<style>
    #otherType {
        display: block;
        margin: 0px 5px 10px 5px;
    }

</style>
