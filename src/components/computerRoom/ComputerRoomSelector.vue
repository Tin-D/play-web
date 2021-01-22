<template>
    <el-cascader
        :value="value"
        :placeholder="placeholder"
        @change="handleChange"
        :options="options"
        :props="{value: 'id', label: 'name', children: 'children', disabled: 'disabled', emitPath: emitPath}"
        clearable
        filterable
        :show-all-levels="showAllLevels"
        :disabled="readonly"
        style="width: 100%;">
    </el-cascader>
</template>

<script>
    import axios from 'axios';

    export default {
        data () {
            return {
                computerRooms: [],
            };
        },
        computed: {
            options () {
                const res = [];
                _.forEach(_.orderBy(this.computerRooms, ['computerRoomName'], ['desc']), i => {
                    const item = {
                        id: i.remake,
                        name: i.computerRoomName,
                        children: _.chain(i.batteryPacks).orderBy(['batteryPackName'], ['asc']).map(e => ({
                            id: e.id,
                            name: e.batteryPackName,
                        })).value(),
                    };
                    res.push(item);
                });
                return res.filter(i => i.children.length > 0);
            },
        },
        async created () {
            const res = await axios.get('/computer_room/list');
            this.computerRooms = res.data;
        },
        methods: {
            handleChange (value) {
                this.$emit('input', value);
            },
        },
        props: {
            value: {
                type: [String, Array],
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: '请选择电池组(可输入搜索)',
            },
            showAllLevels: {
                type: Boolean,
                default: false,
            },
            id: {
                type: String,
            },
            emitPath: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
