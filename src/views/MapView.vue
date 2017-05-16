<template> 
    <md-layout md-column>
        <md-layout md-flex="100">
             <div class="mapview-container" :style="layout_style" >
                <el-amap-search-box class="mapview-search-box"  :on-search-result="onSearchResult"></el-amap-search-box>
                <el-amap :style="layout_style"  class="vue-amap" :plugin="plugin" :zoom="12" :center="mapCenter" :events="events">
                    <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker" ></el-amap-marker>
                    <el-amap-marker v-for="(item, index) in windows" :key="index" :title="item.activityID"  :position="item.position" :content="item.html" :events="item.event">
                    </el-amap-marker>
                </el-amap>
            </div>
            <mu-bottom-sheet  :open="bottomSheet" @close="closeBottomSheet">
                <div class="activity-bottomSheet" v-if="bottomActivity != null">
                    <img :src="bottomActivity.get('pictureUrl')" />
                    <h2>{{bottomActivity.get('title')}}</h2>
                    <div class="description">
                        {{bottomActivity.get('description')}}
                    </div>
                    <div class="description">
                        <md-icon>location_on</md-icon>
                        <span>{{bottomActivity.get('todoList')[0].todoAddress}}</span>
                    </div>
                    <div class="card-reservation">
                            <md-icon>access_time</md-icon>
                            <p class="activity_time">{{ $t("Card.date") }}：{{bottomActivity.get("date")}} </p>
                    </div>
                    <md-button @click.native="goDetail(bottomActivity.id)" id="detailButton" class="md-raised">{{ $t("Card.detail") }}</md-button>
                </div>


            </mu-bottom-sheet>
        </md-layout>
    </md-layout>
    
</template>

<script>
    import AV from 'leancloud-storage';
    import AVTools from '../ext/AVTools';
    import Card from '../components/Card.vue';

    let bodyHeight =  document.body.clientHeight-114;
    let bodyWidth = document.body.clientWidth;
    console.log(bodyHeight);


    var activity = new AV.Query("Activity");
    

    export default {
        data() {
            var self = this;
            return {
                // 高德地图英文化
                events: {
                    init(o) {
                        console.log("map.o", o);
                        o.setLang('en');
                    }
                },
                bottomSheet: false,
 

                layout_style: {
                    width: bodyWidth+'px',
                    height: bodyHeight + 'px'
                },


                // 初始化定位点
                mapCenter: [113.34793, 23.13248],
                zoom: 12,
                markers: [],
                showNeighborhood: [],
                windows: [],
                
                // bottomSheet的内容
                bottomActivity: null,

                // 地图插件
                plugin: [
                    {
                        pName: 'Geolocation',
                        panToLocation: true,
                        zoomToAccuracy: true,
                        events: {
                            init(instance) {
                                instance.getCurrentPosition((status, result) => {
                                    console.log("获取当前位置的result: ", result);
                                    if (result.info === "SUCCESS"){
                                        self.mapCenter = [result.position.lng, result.position.lat];
                                        let point = new AV.GeoPoint(self.mapCenter[1], self.mapCenter[0]);
                                        // Find the task within 5 kilometers
                                        activity.withinKilometers("geolocation", point, 5.0);
                                        activity.find().then((result)=>{
                                            console.log("result", result);
                                            // Add information in the point tag
                                            result.forEach((item)=>{
                                                let position = item.get('geolocation');
                                                self.windows.push({
                                                    position: [position.longitude, position.latitude],
                                                    html: `<div class='message-content'><img class='message-img' src='${item.get('pictureUrl')}'/></div>`,
                                                    //content: `<div class='message-content'>test</div>`
                                                    event: {
                                                        click: () => {
                                                            self.openBottomSheet();
                                                            self.bottomActivity = item;
                                                            console.log(item);
                                                        },
                                                    },
                                                    
                                                })
                                            })

                                            showNeighborhood = result;
                                        },(error)=>{
                                            console.log("Get neighborhood error: ", error);
                                        })
                                        
                                    }
                                    else {
                                        alert("Fail to get the position，Please click the left corner to refresh");
                                    }
                                });
                            }
                        }
                    },
                    {
                        pName: 'ToolBar',
                        position: 'LT',
                        events: {
                            init(instance) {
                                console.log(instance);
                            }
                        }
                    }
                ],

            }
        },
        methods: {
            closeBottomSheet () {
               this.bottomSheet = false
            },
            openBottomSheet () {
                this.bottomSheet = true
            },
            goDetail: function(activityID){
                this.$router.push({
                    path: "activity_detail/"+ activityID
                })
            },
            // 地图组件相关方法
            onSearchResult(pois) {
                let latSum = 0;
                let lngSum = 0;
                if (pois.length > 0) {
                    console.log(pois);
                    
                    pois.forEach(poi => {
                        let {lng, lat} = poi;
                        lngSum += lng;
                        latSum += lat;
                        this.markers.push([poi.lng, poi.lat]);
                    });
                    let center = {
                        lng: lngSum / pois.length,
                        lat: latSum / pois.length
                    };
                    this.mapCenter = [center.lng, center.lat];
                }
            },
        }
    }
</script>

<style lang="scss">
    .window{
        width: 100px;
        height: 50px;
        background: #fff;
    }
     .mapview-container{

     }

    .mapview-search-box{
        position: absolute !important;
        width: 100%;
        top: 50px;
        z-index: 10000 !important;
    }

    .search-box-wrapper {
        top: 0px;
        left: 0px;
    }
    
    .message-content{
        width: 80px;
        height: 80px;
        .message-img{
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
    }

    .activity-bottomSheet{
        height: 500px;
        padding-top: 24px;
        padding: 16px;
        margin-bottom: 8px;
        h2{
            font-size: 24px;
            letter-spacing: 0;
            line-height: 32px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.87);
        }
        .description{
            opacity: 0.54;
            font-size: 14px;
            letter-spacing: .01em;
            line-height: 20px;
            color: #2c3e50;
        }
        #detailButton{
            display: block;
            margin: 10px auto;
        }
    }

    .card-reservation {
            margin-top: 8px;
            display: flex;
            align-items: center;
            

            .md-icon {
            margin: 8px;
            color: rgba(#000, .54) !important;
            }

            .md-button {
            border-radius: 2px !important;
            }
    }
</style>