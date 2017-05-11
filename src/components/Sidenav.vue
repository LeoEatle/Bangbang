<template>
    <md-sidenav md-swipeable class="md-left" ref="sidenav">
        <md-toolbar class="md-account-header">
        <md-list class="md-transparent">
            <md-list-item class="md-avatar-list">
            <md-avatar class="md-large">
                <img :src="avatarUrl" alt="People">
            </md-avatar>

            <span style="flex: 1"></span>
            <div class="logOut" @click="logOut">{{ $t("sideNav.logoff") }}</div>
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
        <md-list-item @click.native="backHome" class="md-primary">
            <md-icon>home</md-icon><span>{{ $t("sideNav.homePage") }}</span>
        </md-list-item>

        <md-list-item @click.native="createActivity" class="md-primary">
            <md-icon>add_circle</md-icon> <span>{{ $t("sideNav.createTask") }}</span>
        </md-list-item>

        <md-list-item @click.native="joinedActivity">
            <md-icon>access_time</md-icon> <span>{{ $t("sideNav.joinedTasks") }}</span>
        </md-list-item>

        <md-list-item @click.native="$refs.sidenav.toggle()">
            <md-icon>turned_in</md-icon> <span>{{ $t("sideNav.staredTasks") }}</span>
        </md-list-item>

        <md-list-item @click.native="$refs.sidenav.toggle()">
            <md-icon>archive</md-icon> <span>{{ $t("sideNav.achievement") }}</span>
        </md-list-item>

        <md-list-item @click.native="personalCenter">
            <md-icon>person</md-icon> <span>{{ $t("sideNav.personalInformation") }}</span>
        </md-list-item>

        <md-list-item @click.native="setting">
            <md-icon>settings</md-icon> <span>{{ $t("sideNav.setting") }}</span>
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

    
    export default {
        name: 'Sidenav',
        created(){
            var currentUser = AV.User.current();
            if(currentUser){
                this.wechatID = currentUser.get('wechatID');
                this.userName = currentUser.getUsername();
                this.avatarUrl = currentUser.get("avatar").get("url");
            }        
        },
       

        data: function(){
            return {
                wechat: wechatIcon,
                wechatID: '游客',
                userName:  '游客',
                // TODO: 这里是头像的图像url
                avatarUrl: 'https://placeimg.com/64/64/people/8'
            }
        },
        methods: {
            toggleSidenav() {
                this.$refs.sidenav.toggle();
            },
            backHome(){
                this.$refs.sidenav.toggle();
                this.$router.push({
                    path: '/'
                })
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
                        path: '/create-activity'
                    });
                }
            },
            // 参加的活动
            joinedActivity() {
                this.$refs.sidenav.toggle();
                this.$router.push({
                    path: '/joined_activity'
                })
            },
            // 个人信息中心
            personalCenter() {
                this.$refs.sidenav.toggle();
                var currentUser = AV.User.current();

                this.$router.push({
                    path: '/personal-center/'+currentUser.id
                });
            },
            // 用户设置
            setting() {
                this.$refs.sidenav.toggle();
                this.$router.push({
                    path: '/setting'
                });
            },
            logOut() {
                // 注销并回到首页
                AVTools.AVLogout();
                this.wechatID = "Visitor";
                this.userName = "Visitor2";
                this.avatarUrl = 'https://placeimg.com/64/64/people/8';
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