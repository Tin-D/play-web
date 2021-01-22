<template>
    <lan-dialog
            ref="lanDialog"
            @close="handleClose"
            :title="title"
            v-loading="isLoading"
            :fullscreen="fullscreen"
            :top="top"
            :width="width"
    >

        <template v-if="!isLoading">
            <slot/>
        </template>

        <div slot="footer">
            <slot name="buttons">
                <el-button
                        type="primary"
                        @click="$emit('submit')"
                        icon="fa fa-save"
                        size="mini"
                >
                    {{ submitText || '提交' }}
                </el-button>

                <el-button
                        type="danger"
                        @click="$emit('remove')"
                        icon="fa fa-trash"
                        size="mini"
                        v-if="showRemove"
                >
                    {{ '删除' }}
                </el-button>
            </slot>
        </div>
    </lan-dialog>
</template>

<script>
    import LanDialog from './LanDialog';

    export default {
        components: {
            LanDialog,
        },
        methods: {
            closeDialog () {
                this.$refs.lanDialog.closeDialog();
            },
            handleClose () {
                this.$emit('close');
            },
        },
        props: {
            submitText: {
                type: String,
            },
            title: {
                type: String,
                required: true,
            },
            formRef: {
                type: String,
                default: 'form',
            },
            isLoading: {
                type: Boolean,
                default: true,
            },
            showRemove: {
                type: Boolean,
                default: false,
            },
            fullscreen: {
                type: Boolean,
                default: false,
            },
            top: {
                type: String,
            },
            width: {
                type: String,
            },
        },
    };
</script>
