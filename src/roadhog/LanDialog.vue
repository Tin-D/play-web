<template>
    <el-dialog
        :visible="visible"
        :title="title"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true"
        :fullscreen="fullscreen"
        v-draggable
        @close="handleClose"
        :width="width"
        :top="top"
    >
        <slot/>

        <div slot="footer">
            <slot name="footer"/>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        data () {
            return {
                visible: true,
            };
        },
        methods: {
            handleClose () {
                this.$emit('close');
            },
            closeDialog () {
                this.visible = false;
            },
        },
        props: {
            title: {
                type: String,
                required: true,
            },
            fullscreen: {
                type: Boolean,
                default: false,
            },
            top: {
                type: String,
                default: '10vh',
            },
            width: {
                type: String,
            },
        },
    };
</script>
