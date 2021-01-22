<template>
    <el-dialog
            :title="title"
            :visible="true"
            modal-append-to-body
            @close="handleClose"
    >

        <el-form ref="form"
                 :model="form"
                 label-width="100px"
                 size="mini"
                 :rules="rules"
        >
            <el-form-item prop="computerRoomName" label="机房名称">
                <el-input label="机房名称" v-model="form.computerRoomName"/>
            </el-form-item>

            <el-form-item label="备注">
                <el-input label="备注" v-model="form.remake"/>
            </el-form-item>

            <div v-for="(i, index) in form.batteryPacks" :key="index">
                <el-form-item :prop="`batteryPacks[${index}].batteryPackName`" label="电池组名称" :rules="rules.batteryPackName">
                    <el-input label="a" v-model="i.batteryPackName"/>
                </el-form-item>
            </div>

            <el-form-item>
                <el-button type="primary" @click="addBatteryPacks()">添加电池组</el-button>
                <el-button type="primary" @click="deleteBatteryPacks()" v-if="form.batteryPacks === null || form.batteryPacks.length > 0">删除电池组</el-button>
            </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="handleSubmit('form')">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import axios from 'axios';

    export default {
        data () {
            return {
                title: this.isCreate ? '新增机房' : '修改机房',
                customers: null,
                oldForm: null,
                form: {
                    id: null,
                    computerRoomName: null,
                    remake: null,
                    batteryPacks: [],
                },
                rules: {
                    computerRoomName: [
                        { required: true, message: '请输入机房名称', trigger: 'blur' },
                    ],
                    batteryPackName: [
                        { required: true, message: '请输入电池组名称', trigger: 'blur' },
                    ],
                },
            };
        },
        created () {
            if (this.row && this.id !== null) {
                if (this.row.batteryPacks === null) {
                    this.row.batteryPacks = [];
                    Object.assign(this.form, this.row);
                } else {
                    this.row.batteryPacks = _.chain(this.row.batteryPacks).orderBy(['batteryPackName'], ['asc']).value();
                    Object.assign(this.form, this.row);
                }
            }
        },
        methods: {
            addBatteryPacks () {
                this.form.batteryPacks.push({
                    computerRoomId: null,
                    batteryPackName: null,
                    id: null,
                });
            },
            deleteBatteryPacks () {
                this.form.batteryPacks.shift();
            },
            handleSubmit (form) {
                if (this.id !== null) {
                    this.$refs[form].validate(async (valid) => {
                        if (valid) {
                            await axios.put('/computer_room/update', this.form);
                            this.message('修改成功', 'success');

                            this.$emit('close', true);
                        } else {
                            return false;
                        }
                    });
                } else {
                    this.$refs[form].validate(async (valid) => {
                        if (valid) {
                            await axios.post('/computer_room/add', this.form);
                            this.message('新增成功', 'success');

                            this.$emit('close', true);
                        } else {
                            return false;
                        }
                    });
                }
            },
            handleClose () {
                this.$emit('close');
            },
            message (message, type) {
                return this.$message({
                    showClose: true,
                    message: message,
                    type: type,
                });
            },
        },
        props: {
            id: {
                type: String,
                require: true,
            },
            row: {
                type: Object,
            },
            isCreate: {
                type: Boolean,
                require: true,
            },
        },
    };
</script>
