<template>
    <div>
        <h1>创建任务需求</h1>
        <form novalidate @submit.stop.prevent="submit">
            <md-input-container>
                <label>标题</label>
                <md-input placeholder="给需求起个名字（不多于20字）" maxlength="40" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>请用一句话介绍</label>
                <md-input placeholder="请用一句话介绍（不多于40个字）" maxlength="80" required></md-input>
            </md-input-container>

        </form>
    </div>
</template>

<script>
    export default {
        name: 'CreateActivity',
        components: {
            
        }
    }
</script>