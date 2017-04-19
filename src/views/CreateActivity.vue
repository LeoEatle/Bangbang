<template>
    <div>
        <md-layout md-gutter md-align="center">
            <md-layout md-flex="80" md-gutter> 
                <h1>创建任务</h1>
            </md-layout>
            <md-layout md-column md-gutter md-flex="80">
                <form validate @submit.stop.prevent="submit">
                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            grade
                            </md-icon>
                            <label>标题</label>
                            <md-input v-model="title" placeholder="起个标题吧（不多于20字）" maxlength="20" required></md-input>
                        </md-input-container>
                    </md-layout>

                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            view_headline
                            </md-icon>
                            <label>介绍</label>
                            <md-input v-model="description" placeholder="请用一句话介绍（不多于40个字）" maxlength="40" required></md-input>
                        </md-input-container>
                    </md-layout>
                    
                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            room
                            </md-icon>
                            <label>地点</label>
                            <md-input v-model="place" placeholder="请说明要进行任务的地方" maxlength="40" required></md-input>
                        </md-input-container>
                    </md-layout>
                    
                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            access_time
                            </md-icon>
                            <label>时间</label>
                            <md-input v-model="time" placeholder="请选择将要进行的具体时间" maxlength="40" required></md-input>
                        </md-input-container>
                    </md-layout>

                    <md-layout>
                        <md-input-container>
                            <md-icon>
                            accessibility
                            </md-icon>
                            <label>大概人数</label>
                            <md-input v-model="personNum" type="number"></md-input>
                        </md-input-container>
                    </md-layout>
                </form>

                <div>
                    <md-button class="md-raised md-accent newActivityButton" @click.native="newActivity()">创建活动</md-button>
                </div>
            </md-layout>
        </md-layout>
        
        
    </div>
</template>

<script>
    import AV from 'leancloud-storage';
    export default {
        name: 'CreateActivity',
        components: {
            
        },
        data: function(){
            return {
                title: "",
                description: "",
                place: "",
                time: "",
                personNum: 0
            }
        },
        methods:{
            newActivity() {
                console.log("开始创建新活动！");
                // 构建一个新的AV.Object
                var ActivityCreator = AV.Object.extend('Activity');
                // 创建一个新的activity
                var activity = new ActivityCreator();
                activity.set("title", this.title);
                activity.set("description", this.description);
                activity.set("place", this.place);
                activity.set("time", this.time);
                activity.set("personNum", this.personNum);
                activity.save().then(function(msg){
                    console.log("activity saved! msg: ", msg);
                }, function(error){
                    console.error("activity save failed! code: ", error);
                });
            }
        }
    }
</script>

<style>
    .newActivityButton{
        margin-top: 50px;
    }
</style>