<template>
    <md-sidenav md-swipeable class="md-left" ref="sidenav">
        <md-toolbar class="md-account-header">
        <md-list class="md-transparent">
            <md-list-item class="md-avatar-list">
            <md-avatar class="md-large">
                <img :src="avatarUrl" alt="People">
            </md-avatar>

            <span style="flex: 1"></span>
            <div class="test" @click="test">测试</div>
            <div class="logOut" @click="logOut">注销</div>
            </md-list-item>

            <md-list-item>
            <div id="sidenav-person-information" class="md-list-text-container">
                <span>{{userName}}</span>
                <span><md-icon v-bind:md-src="wechat"></md-icon>{{wechatID}}</span>
            </div>

            <md-button class="md-icon-button md-list-action">
                <md-icon>arrow_drop_down</md-icon>
            </md-button>
            </md-list-item>
        </md-list>
        </md-toolbar>

        <md-list>
        <md-list-item @click.native="createActivity" class="md-primary">
            <md-icon>add_circle</md-icon> <span>创建活动</span>
        </md-list-item>

        <md-list-item @click.native="$refs.sidenav.toggle()">
            <md-icon>contacts</md-icon> <span>近期联系人</span>
        </md-list-item>

        <md-list-item @click.native="$refs.sidenav.toggle()">
            <md-icon>access_time</md-icon> <span>参加的活动</span>
        </md-list-item>

        <md-list-item @click.native="$refs.sidenav.toggle()">
            <md-icon>turned_in</md-icon> <span>活动收藏</span>
        </md-list-item>

        <md-list-item @click.native="$refs.sidenav.toggle()">
            <md-icon>archive</md-icon> <span>我的成就</span>
        </md-list-item>

        
        <md-list-item @click.native="$refs.sidenav.toggle()">
            <md-icon>stars</md-icon> <span>我的徽章</span>
        </md-list-item>


        <md-list-item @click.native="personalCenter">
            <md-icon>person</md-icon> <span>个人信息</span>
        </md-list-item>

        </md-list>
    </md-sidenav>    
    

</template>

<script>
    import wechatIcon from '../assets/wechat.svg';
    import AVTools from '../ext/AVTools';
    import AV from 'leancloud-storage';
    // 获取当前用户实例
    AVTools.AVInit();

    var currentUser = AV.User.current();
    if(currentUser){
        var wechatID = currentUser.get('wechatID');
        var userName = currentUser.getUsername();
    }
    export default {
        name: 'Sidenav',
        created(){
            
        },
        data: function(){
            return {
                wechat: wechatIcon,
                wechatID: wechatID||'游客',
                userName:  userName||'游客',
                // TODO: 这里是头像的图像url
                avatarUrl: currentUser.get("avatar").get("url")||'https://placeimg.com/64/64/people/8'
            }
        },
        methods: {
            toggleSidenav() {
                this.$refs.sidenav.toggle();
            },
            createActivity() {
                if (AVTools.AVCurrentUser() === null){
                    //this.$refs.dialog5.open();
                    console.log('用户尚未登录');
                    this.$parent.$emit('ask-sign', 'close');
                    //this,props.askSign();
                }
                else{
                    this.$refs.sidenav.toggle();
                    this.$router.push({
                        path: 'create-activity'
                    });
                }
            },
            personalCenter() {
                this.$refs.sidenav.toggle();
                this.$router.push({
                    path: 'personal-center'
                });
            },
            logOut() {
                // 注销并回到首页
                AVTools.AVLogout();
                this.toggleSidenav();     
                this.$router.push({
                    path: '/'
                });
            },
            test() {
                console.log("email", currentUser.getEmail());
                console.log("mobile phone number", currentUser.getMobilePhoneNumber());
                console.log("user name", currentUser.getUsername());
                console.log("type", currentUser.get("type"));
                console.log("avatar", currentUser.get("avatar").get("url"))
            }
        }
    }

</script>

<style lang="scss">
    .logOut {
        margin-top: 20px;
    }

    .md-title {
        color: #fff;
    }

    .md-list {
        overflow: auto;
    }

    .md-list-action .md-icon {
        color: rgba(#fff, .26);
    }

    .md-avatar-icon .md-icon {
        color: #fff !important;
    }

    .md-sidenav .md-list-text-container > :nth-child(2) {
        color: rgba(#fff, .54) !important;
    }

    .md-account-header {
        .md-list-item:hover .md-button:hover {
        background-color: inherit;
        }

        .md-avatar-list .md-list-item-container:hover {
        background: none !important;
        }
    }

    #sidenav-person-information {
        color: #fff;

        .md-icon {
            margin-right: 6px;
        }
    }


</style>