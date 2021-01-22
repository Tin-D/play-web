<template>
    <div v-loading="isLoading">
        <page-header v-if="showPageHeader"/>

        <el-form size="mini" inline class="toolbar">

            <el-form-item title="名称">
                <el-input placeholder="名称" v-model="computerRoomName" clearable/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load(true)">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button icon="el-icon-plus" @click="computerRoomEditDialog.handleAdd">新增</el-button>
            </el-form-item>

        </el-form>

        <el-table :data="tableData"
                  border
                  stripe
                  :default-sort="{prop: 'computerRoomName', order: 'ascending'}"
        >

            <el-table-column prop="computerRoomName" label="名称" sortable=""/>

            <el-table-column prop="remake" label="备注" sortable=""/>

            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <el-button size="mini" type="primary" @click="computerRoomEditDialog.handleEdit(row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="computerRoomEditDialog.handleRemove(row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <computer-room-editor v-if="computerRoomEditDialog.show"
                              :id="computerRoomEditDialog.id"
                              :row="computerRoomEditDialog.row"
                              @close="computerRoomEditDialog.handleClose"
                              @remove="computerRoomEditDialog.handleRemove"
                              :isCreate="isCreate"
        />
    </div>
</template>

<script>
    import axios from 'axios';
    import { confirmDialog } from '@/roadhog/alert';
    import ComputerRoomEditor from '@/components/computerRoom/ComputerRoomEditor';

    export default {
        components: {
            ComputerRoomEditor,
        },
        created () {
            this.load();
        },
        data () {
            return {
                computerRoomName: null,
                isLoading: true,
                tableData: [],
                isCreate: null,
                computerRoomEditDialog: {
                    show: false,
                    row: null,
                    handleClose: (returnValue) => {
                        this.computerRoomEditDialog.show = false;
                        this.computerRoomEditDialog.id = null;
                        if (returnValue) {
                            this.load();
                        }
                    },
                    handleAdd: () => {
                        this.isCreate = true;
                        this.computerRoomEditDialog.show = true;
                        this.computerRoomEditDialog.id = null;
                    },
                    handleEdit: (row) => {
                        this.isCreate = false;
                        this.computerRoomEditDialog.show = true;
                        this.computerRoomEditDialog.id = row.id;
                        this.computerRoomEditDialog.row = row;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });
                        await axios.delete(`/computer_room/delete_computer_room/${row.id}`);
                        this.load();
                    },
                },
            };
        },
        methods: {
            async load () {
                const res = await axios.get('/computer_room/list');
                this.tableData = res.data;
                if (res.status === 200) {
                    this.isLoading = false;
                }
            },
        },
        props: {
            showPageHeader: {
                type: Boolean,
                default: true,
            },
        },
    };
</script>
