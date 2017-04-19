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
                                            <label>在此编辑邮箱</label>
                                            <md-input v-model="email" type="mail"></md-input>
                                        </md-input-container>
                                </md-list-item>
                                <md-list-item>
                                        <md-input-container md-has-password>
                                            <label>在此编辑密码</label>
                                            <md-input v-model="password" type="password"></md-input>
                                        </md-input-container>
                                </md-list-item>
                            </md-list>

                        </form>
                        

                        <md-layout md-align="center" md-column>
                            <span id="otherType" class="md-subheading" md-flex="100">其他登录方式</span>


                            <md-layout md-align="center">
                                <md-layout>
                                    <md-button class="md-primary">微信登录</md-button>                            
                                </md-layout>

                                <md-layout>
                                    <md-button class="md-primary">微博登录</md-button>
                                </md-layout>
                                
                                <md-layout>
                                    <md-button class="md-primary">豆瓣登录</md-button>
                                </md-layout>
                            </md-layout>
                            <md-button id="saveButton" @click.native="login" class="md-raised md-accent">
                                登录
                            </md-button>
                            <md-snackbar md-position="bottom center" ref="snackbarFailed" md-duration=4000>
                                <span>登录失败！请检查邮箱和密码是否正确</span>
                            </md-snackbar>

                            <md-snackbar md-position="bottom center" ref="snackbarSuccess" md-duration=4000>
                                <span>登录成功！跳转到首页</span>
                            </md-snackbar>
                        </md-layout>
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
                    // 登录成功，跳转到商品 list 页面
                    console.log(loginedUser);
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
