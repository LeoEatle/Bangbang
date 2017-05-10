<template>
    <div id="personal-center">
                <mu-flexbox orient="vertical" >
                    <h2>用户信息</h2>
                    <mu-flexbox-item>
                        <md-avatar  id="user-avatar" class="md-large">
                            <img :src="avatarUrl">
                        </md-avatar>
                    </mu-flexbox-item>
                    <mu-flexbox-item>
                        <div class="information"><md-icon class="md-primary icon">person</md-icon>{{nickName}}</div>
                        <mu-divider/>
                        <div class="information"><md-icon class="md-primary icon">mail</md-icon>{{email}}</div>
                        <mu-divider/>
                        <div class="information"><md-icon class="md-primary icon">phone</md-icon>{{mobilePhoneNumber}}</div>
                        <mu-divider/>
                        <div class="information"><md-icon class="md-primary icon" :md-src="wechatIcon" ></md-icon>{{wechatID}}</div>
                        <mu-divider/>
                    </mu-flexbox-item>
                </mu-flexbox>
    </div>
</template>

<script>
    import wechatIcon from '../assets/wechat_primary.svg';
    import AV from 'leancloud-storage';
    //require("../assets/font-awesome.min.css")
    export default {
        name: 'personalCenter',
        props: ['id'],
        beforeMount(){
            let userID = this.id;
            let query = new AV.Query("_User");
            query.get(userID).then((user)=>{
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
                    mobilePhoneNumber: 15627862382,
                    email: 'liuyitao811@hotmail.com',
                    wechatID: "liuyito811",
                    wechatIcon: wechatIcon,

                    avatarUrl: 'https://placeimg.com/64/64/people/8' // the datebase64 url of created image
                }
            )
        },
        methods: {
            toggleShow() {
                this.show = !this.show;
            },
             
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