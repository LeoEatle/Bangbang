<template>
    <div id="personal-center">
        <md-layout md-gutter md-align="center">
            <md-layout md-flex-xsmall="80" md-flex-medium="" md-gutter>
                <h1>个人信息</h1>
            </md-layout>
        </md-layout>

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
                    <img :src="imgDataUrl" @click = "toggleShow">
                </md-avatar>
                <p>点击头像进行设置</p>
            </md-layout>
            <md-layout md-align="center" md-flex-xsmall="80" md-flex-medium="">
                <form validate>
                    <md-list class="md-double-line">
                        <md-list-item>
                            <md-icon class="md-primary">person</md-icon>
                            <div class="md-list-text-container">
                                <span>昵称： {{nickName}}</span>
                            </div>
                            <md-list-expand>
                                <md-input-container>
                                    <label>在此编辑昵称</label>
                                    <md-input v-model="phoneNumber" type="text"></md-input>
                                </md-input-container>
                            </md-list-expand>
                        </md-list-item>

                        <md-list-item>
                            <md-icon class="md-primary fa fa-venus-mars" ></md-icon>
                            <div class="md-list-text-container">
                                <span>性别： {{gender}}</span>
                            </div>
                            <md-list-expand>
                                    <label>性别</label>
                                    <md-radio v-model="gender" id="my-test1" name="my-test-group1" md-value="男">男</md-radio>
                                    <md-radio v-model="gender" id="my-test2" name="my-test-group1" md-value="女">女</md-radio>
                                    <md-radio v-model="gender" id="my-test3" name="my-test-group1" md-value="保密">保密</md-radio>
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
                            <md-icon class="md-primary"><i class="fa fa-graduation-cap" aria-hidden="true"></i></md-icon>
                            <div class="md-list-text-container">
                                <span>学校： {{school}}</span>
                            </div>
                            <md-list-expand>
                                <md-input-container md-inline>
                                    <label>选择学校</label>
                                    <md-input v-model="school" type="text"></md-input>
                                </md-input-container>
                            </md-list-expand>
                        </md-list-item>

                        

                        <md-list-item>
                            <md-subheader class="subtips">点击下拉按钮进行设置</md-subheader>
                        </md-list-item>
                    </md-list>

                    <md-button id="saveButton" class="md-raised md-accent">
                        保存设置
                    </md-button>
                </form>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import myUpload from 'vue-image-crop-upload/upload-2.vue';
    import wechatIcon from '../assets/wechat_primary.svg';
    //require("../assets/font-awesome.min.css")
    export default {
        name: 'personalCenter',
        data: function() {
            return (
                {
                    nickName: "LeoEatle",
                    gender: "男",
                    phoneNumber: 15627862382,
                    wechatID: "liuyito811",
                    wechatIcon: wechatIcon,
                    school: "暨南大学",
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
			}
        },
        components: {
            'my-upload': myUpload
        }
    }
</script>

<style lang="css">
    svg {
        fill: currentColor;
    }

    #saveButton {
         margin-top: 30px;
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