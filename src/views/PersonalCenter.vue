<template>
    <div id="personal-center">
        <md-layout md-gutter md-align="center">
            <md-layout md-flex="80" md-gutter>
                <h1>个人信息</h1>
            </md-layout>
        </md-layout>

        <md-layout md-column md-gutter md-flex="80">
             <VueCoreImageUpload
                v-bind:class="['pure-button','pure-button-primary','js-btn-crop']" 
                v-bind:crop="true"
                crop-ratio="1:1" 
                url="./crop.php" 
                extensions="png,gif,jpeg,jpg">
            </VueCoreImageUpload>      
        </md-layout>
    </div>
</template>

<script>
    import VueCoreImageUpload from 'vue-core-image-upload';

    export default {
        name: 'PersonalCenter',
        data: function() {
            return (
                {
                    imgSrc: 'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png'
                }
            )
        },
        methods: {
            imageuploaded: function(res) {
                if (res.errcode == 0) {
                    this.src = 'http://img1.vued.vanthink.cn/vued751d13a9cb5376b89cb6719e86f591f3.png';
                }
            }
        },
        component: {
            'VueCoreImageUpload': VueCoreImageUpload
        }
    }
</script>