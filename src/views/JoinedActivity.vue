<template>
    <div id="joined_activity">
        <div v-show="loading">
            Loading...
        </div>

        <mu-flexbox class="container" v-show="loading == false" orient="vertical" :gutter="8" >
            <mu-list>
                <mu-sub-header>参加的活动列表</mu-sub-header>

                <mu-list-item v-for="(item, index) in activityList" :key="index" :title="item.get('title')" @click="goDetail(item.id)">
                          <mu-icon value="navigate_next" slot="right"/>
                          <span slot="describe">
                            {{item.get("description")}}
                          </span>
                          <mu-divider slot="default" shallowInset/>
                </mu-list-item>
                

            </mu-list>
        </mu-flexbox>
    </div>
</template>

<script>
    import AV from 'leancloud-storage';
    

   
    
    export default {
        name: "JoinedActivity",
        props: ['id'],
        // 挂载前获取数据
        beforeMount (){
            let user = AV.User.current();
            console.log("user", user);
            let that = this; // 虽然用了箭头函数以防万一还是做一个声明
            user.fetch({
                include: "joinedActivities"
            }).then((user)=>{
                console.log(user.get("joinedActivities"));
                let joinedActivities = user.get("joinedActivities");
                joinedActivities.forEach((item)=>{
                    that.activityList.push(item);
                })
                that.loading = false;
            })
            // user.get("joinedActivities").forEach((item)=>{
            //     if(item !== null){
            //         this.activityList.push(item);
            //     }
            // })
            // this.activityList.forEach((item)=>{
            //     console.log(AV.Object.createWithoutData('Activity', item.id));
            //     // console.log(item.get("title"));
            // })
            // console.log("activityList", this.activityList);
        },
        data() {        
            return {
                loading: true,
                activityList: []
            }
        },
        methods: {
            goDetail(activityID){
                console.log("goDetail clicked", activityID);
                this.$router.push({
                    path: "activity_detail/"+ activityID
                })
            }
        }
    }
</script>

<style lang="scss">

    #joined_activity{
        width: 100%;
    }
    .mu-item-title{
        overflow: hidden;
    }
</style>