<template>
    <div>
        <md-layout md-gutter md-align="center">
            <md-layout md-flex="80" md-gutter> 
                <h1>创建任务需求</h1>
            </md-layout>
            <md-layout md-column md-gutter md-flex="80">
                <form novalidate @submit.stop.prevent="submit">
                    <md-layout>
                        <md-input-container>
                            <label>标题</label>
                            <md-input placeholder="给需求起个名字（不多于20字）" maxlength="20" required></md-input>
                        </md-input-container>
                    </md-layout>

                    <md-layout>
                        <md-input-container>
                            <label>简介</label>
                            <md-input placeholder="请用一句话介绍（不多于40个字）" maxlength="40" required></md-input>
                        </md-input-container>
                    </md-layout>
                    
                    <md-layout>
                        <md-input-container>
                            <label>地点</label>
                            <md-input placeholder="请说明要进行任务的地方" maxlength="40" required></md-input>
                        </md-input-container>
                    </md-layout>
                    
                    <md-layout>
                        <md-input-container>
                            <label>时间</label>
                            <md-input placeholder="请选择将要进行的具体时间" maxlength="40" required></md-input>
                        </md-input-container>
                    </md-layout>
                </form>
            </md-layout>
        </md-layout>
        
        
    </div>
</template>

<script>
    export default {
        name: 'CreateActivity',
        components: {
            
        }
    }
</script>