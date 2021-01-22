import { confirmDialog } from '@/roadhog/alert';

export const dialogMixin = (dialogRef = 'lanDialog') => {
    return {
        methods: {
            committed (args) {
                this.closeDialog(args);
            },
            handleClose () {
                this.$emit('close');
            },
            closeDialog (returnValue) {
                this.$refs[dialogRef].closeDialog();
                this.$emit('close', returnValue);
            },
            async confirmCloseDialog (returnValue) {
                await confirmDialog({ message: '关闭窗口' });
                this.closeDialog(returnValue);
            },
        },
    };
};
