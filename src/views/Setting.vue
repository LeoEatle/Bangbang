<template>
    <div id="personal-center">
                <mu-flexbox orient="vertical" >
                    <h2>用户设置</h2>
                   
                    <mu-flexbox-item>
                        <h3>Language</h3>
                        <mu-radio label="中文" name="group" nativeValue="Chinese" v-model="language" class="language-radio" @change="languageChange"/> <br/>
                        <mu-radio label="English" name="group" nativeValue="English" v-model="language"  class="language-radio" @change="languageChange"/> <br/>

                        <h3>Modify information</h3>
                        <div class="information"><md-icon class="md-primary icon">person</md-icon>  <mu-text-field class="inpuField" label="Nick name" v-model="nickName" labelFloat/></div>
                        <div class="information"><md-icon class="md-primary icon">mail</md-icon><mu-text-field class="inpuField" label="Email" v-model="email" labelFloat/></div>
                        <div class="information"><md-icon class="md-primary icon">phone</md-icon><mu-text-field class="inpuField" label="Mobile phone number" v-model="mobilePhoneNumber" labelFloat/></div>
                        <div class="information"><md-icon class="md-primary icon" :md-src="wechatIcon" ></md-icon><mu-text-field class="inpuField" label="Wechat ID" v-model="wechatID" labelFloat/></div>
                    </mu-flexbox-item>

                    <md-button id="saveButton" @click.native="saveEmit" class="md-raised md-accent">
                       Save
                    </md-button>
                </mu-flexbox>
                <mu-toast v-if="toast" :message="message" />

    </div>
</template>

<script>
    import wechatIcon from '../assets/wechat_primary.svg';
    import AV from 'leancloud-storage';
    //require("../assets/font-awesome.min.css")
    export default {
        name: 'Setting',
        beforeMount(){
            // 获取个人信息先
            let currentUser = AV.User.current();

            currentUser.fetch().then((user)=>{
                console.log("获取到用户信息：", user);
                this.nickName = user.get("nickName");
                this.email = user.get("email");
                this.mobilePhoneNumber = user.get("mobilePhoneNumber");
                this.avatarUrl  = user.get("avatar").get("url");
                this.wechatID = user.get("wechatID");
            })
        },
        data: function() {
            return (
                {
                    nickName: "LeoEatle",
                    mobilePhoneNumber: "15627862382",
                    email: 'liuyitao811@hotmail.com',
                    wechatID: "liuyito811",
                    wechatIcon: wechatIcon,

                    avatarUrl: 'https://placeimg.com/64/64/people/8', // the datebase64 url of created image

                    language: "",

                    toast: false,
                    message: "保存成功"
                }
            )
        },
        methods: {
            toggleShow() {
                this.show = !this.show;
            },
            languageChange(value) {
                console.log("value", value);
            },
            saveEmit(){
                console.log("save Emit!");
                let currentUser = AV.User.current();
                currentUser.set("nickName", this.nickName);
                currentUser.set("mobilePhoneNumber", this.mobilePhoneNumber);
                currentUser.set("wechatID", this.wechatID);
                currentUser.set("email", this.email);
                currentUser.save().then((msg)=>{
                    console.log("User information update! msg: ", msg);
                    this.toast = true;
                    if (this.toastTimer) clearTimeout(this.toastTimer);
                    this.toastTimer = setTimeout(() => { this.toast = false }, 2000);
                }, (error)=>{
                    console.log("Server error! error: ", error);
                })
            }
        },
        computed: {
            hiddenPassword: function(){ 
                return this.password.replace(/./g,"*");
            }
        }
    }
</script>

<style lang="scss">
    
    #personal-center {
        width: 80%;
        margin: 0 auto;
        text-align: left;
        h2{
            width: 100%;
        }
        .icon{
            margin-right: 36px;
        }
        
        .information{

            font-size: 16px;
            font-weight: 500;
            line-height: 48px;
            height: auto;
            vertical-align: middle;
            .inpuField{
                width: 70%;
            }
        }
    }
    #user-avatar{
        display: block;
        margin: 10px auto;
    }

    

    @media only screen and (min-width: 768px) {
        form {
            width: 60%;
        }
    }
</style>