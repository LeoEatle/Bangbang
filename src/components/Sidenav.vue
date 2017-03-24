<template>
    <md-sidenav md-swipeable class="md-left" ref="sidenav">
        <md-toolbar class="md-account-header">
        <md-list class="md-transparent">
            <md-list-item class="md-avatar-list">
            <md-avatar class="md-large">
                <img src="https://placeimg.com/64/64/people/8" alt="People">
            </md-avatar>

            <span style="flex: 1"></span>

            </md-list-item>

            <md-list-item>
            <div id="sidenav-person-information" class="md-list-text-container">
                <span>John Doe</span>
                <span><md-icon v-bind:md-src=wechat></md-icon>liuyitao811</span>
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
    export default {
        name: 'Sidenav',
        data: function(){
            return {
                wechat: wechatIcon
            }
        },
        methods: {
            toggleSidenav() {
                console.log("成功调用到了子组件");
                this.$refs.sidenav.toggle();
            },
            createActivity() {
                this.$refs.sidenav.toggle();
                this.$router.push({
                    path: 'create-activity'
                });
            },
            personalCenter() {
                this.$refs.sidenav.toggle();
                this.$router.push({
                    path: 'personal-center'
                });
            }
        }
    }

</script>

<style lang="scss">
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