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

                            <span id="otherType" class="md-subheading" flex="100">其他登录方式</span>
                            <md-button-toggle id="otherType" class="md-primary" md-single>
                                <md-button class="md-icon-button md-toggle">
                                    <md-icon :md-src='wechatIcon'></md-icon>
                                </md-button>

                                <md-button class="md-icon-button md-toggle">
                                    微博
                                </md-button>

                                <md-button class="md-icon-button">
                                    QQ
                                </md-button>

                                <md-button class="md-icon-button">
                                    豆瓣
                                </md-button>
                            </md-button-toggle>
                            <md-button id="saveButton" @click.native="login" class="md-raised md-accent">
                                登录
                            </md-button>
                        </form>
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
                AVTools.AVInit();
                AV.User.logIn(this.username, this.password).then(function (loginedUser) {
                    // 登录成功，跳转到商品 list 页面
                    console.log(loginedUser);
                }, function (error) {
                    alert(JSON.stringify(error));
                });
            }
        }
    }
</script>

<style>
    #otherType {
        display: block;
        margin: 5px auto;
    }

</style>
