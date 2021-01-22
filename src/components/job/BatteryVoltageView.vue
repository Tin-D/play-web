<template>
    <div>
        <div>
            <span style="margin-right: 30px;">更新时间: {{ renderDateTime(lastReportTime) }}</span>
            <span style="margin-right: 30px;">总电压: <el-tag>{{ voltagesSum }}</el-tag></span>
            <span>平均电压: <el-tag>{{ averageVoltage }}</el-tag></span>
            <span style="margin-left: 20px;"><el-tag type="success">高于平均电压</el-tag> <el-tag type="warning">低于平均电压</el-tag></span>
        </div>

        <el-row :gutter="10" type="flex">
            <el-col :span="24" style="margin: 10px 15px;display: flex;flex-wrap: wrap;justify-content: flex-start">
                <div class="battery-voltage" style="margin: 10px;borderColor: #409eff;" @click="voltagesSumEcharts()" v-if="voltagesSum">
                    <div style="color: #409eff">总电压</div>
                    <hr style="borderColor: #409eff"/>
                    <div class="tip" style="font-size: 16px;color: #409eff">
                        <strong>{{ voltagesSum }}</strong>
                    </div>
                </div>
                <div class="battery-voltage" style="borderColor: #E05FDA;margin: 10px;" @click="averageVoltageEcharts()" v-if="averageVoltage">
                    <div style="color: #E05FDA">平均电压</div>
                    <hr style="borderColor: #E05FDA"/>
                    <div class="tip" style="font-size: 16px;color: #E05FDA">
                        <strong>{{ averageVoltage }}</strong>
                    </div>
                </div>
                <div class="battery-voltage" style="borderColor: #6218a5;margin: 10px;" @click="powerEcharts()" v-if="power">
                    <div style="color: #6218a5">功率</div>
                    <hr style="borderColor: #6218a5"/>
                    <div class="tip" style="font-size: 16px;color: #6218a5">
                        <strong>{{ power }}</strong>
                    </div>
                </div>
                <div class="battery-voltage" style="borderColor: #921F1F;margin: 10px;" @click="currentEcharts()" v-if="current">
                    <div style="color: #921F1F">电流</div>
                    <hr style="borderColor: #921F1F"/>
                    <div class="tip" style="font-size: 16px;color: #921F1F">
                        <strong>{{ current }}</strong>
                    </div>
                </div>

                <div class="battery-voltage" v-for="(v, index) of newVoltages" :key="index" style="margin: 10px;" :style="'border-color:' +
                        (v.num === 0 ? 'black' : '' ||
                        v.num < 0 ? '#f56c6c' : '' ||
                        (v.num / 1000) < averageVoltage ? '#e6a23c' : '' ||
                        (v.num / 1000) > averageVoltage ? '#67c23a' : '') + ';' +  'color:' + (index===newVoltages.length-1  ? 'black' : '' ||
                        v.num === 0 ? 'black' : '' || v.num < 0 ? '#f56c6c' : '' ||
                        (v.num / 1000) < averageVoltage ? '#e6a23c' : '' ||
                        (v.num / 1000) > averageVoltage ? '#67c23a' : '') + ';' " @click="batteryEcharts(index)">

                    <div v-for="(o, index1) of oldVoltages" :key="index1">
                        <div v-if="index === index1 && (v.num / 1000).toFixed(2) > (o / 1000).toFixed(2) ? v.top = true : '' "></div>
                        <div v-if="index === index1 && (v.num / 1000).toFixed(2) < (o / 1000).toFixed(2) ? v.bottom = true : '' "></div>
                    </div>

                    <div>{{ index+1 }}号电池</div>

                    <hr :style="'border-color:' + (v.num === 0 ? 'black' : '' ||
                    v.num < 0 ? '#f56c6c' : '' ||
                    (v.num / 1000) < averageVoltage ? '#e6a23c' : '' ||
                    (v.num / 1000) > averageVoltage ? '#67c23a' : '') + ';'"/>

                    <div class="tip" style="font-size: 16px;" :style="'color:' + (v.num === 0 ? 'black' : '' ||
                    v.num < 0 ? '#f56c6c' : '' ||
                    (v.num / 1000) < averageVoltage ? '#e6a23c' : '' ||
                    (v.num / 1000) > averageVoltage ? '#67c23a' : '') + ';'">
                        <strong>{{ (v.num / 1000).toFixed(2) }}</strong>
                        <i class="el-icon-top" v-if="v.top"></i><i class="el-icon-bottom" v-if="v.bottom"></i>
                    </div>
                </div>
            </el-col>
        </el-row>

        <echart-dialog v-if="EchartDialog.show"
                       @close="EchartDialog.handleClose"
                       :index="index"
                       :id="id"
        />
        <current-echart-dialog v-if="CurrnetEchartDialog.show"
                               @close="CurrnetEchartDialog.handleClose"
                               :id="id"
        />
        <voltages-sum-dialog v-if="VoltagesSumDialog.show"
                             @close="VoltagesSumDialog.handleClose"
                             :index="index"
                             :id="id"
        />
        <average-voltage-dialog v-if="AverageVoltageDialog.show"
                                @close="AverageVoltageDialog.handleClose"
                                :index="index"
                                :id="id"
        />
        <power-dialog v-if="PowerDialog.show"
                      @close="PowerDialog.handleClose"
                      :index="index"
                      :id="id"/>
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    import EchartDialog from '@/components/job/VoltageDialog.vue';
    import CurrentEchartDialog from '@/components/job/CurrentEchartDialog.vue';
    import VoltagesSumDialog from '@/components/job/VoltagesSumDialog.vue';
    import AverageVoltageDialog from '@/components/job/AverageVoltageDialog.vue';
    import PowerDialog from '@/components/job/PowerDialog.vue';

    export default {
        components: { EchartDialog, CurrentEchartDialog, AverageVoltageDialog, VoltagesSumDialog, PowerDialog },
        filters: {
            rounding (value) {
                return (value / 1000).toFixed(2);
            },
        },
        data () {
            return {
                index: null,
                voltagesSum: null,
                averageVoltage: null,
                current: null,
                power: null,
                oldVoltages: [],
                newVoltages: [],
                EchartDialog: {
                    show: false,
                    handleOpen: () => {
                        this.EchartDialog.show = true;
                    },
                    handleClose: () => {
                        this.EchartDialog.show = false;
                    },
                },
                CurrnetEchartDialog: {
                    show: false,
                    handleOpen: () => {
                        this.CurrnetEchartDialog.show = true;
                    },
                    handleClose: () => {
                        this.CurrnetEchartDialog.show = false;
                    },
                },
                VoltagesSumDialog: {
                    show: false,
                    handleOpen: () => {
                        this.VoltagesSumDialog.show = true;
                    },
                    handleClose: () => {
                        this.VoltagesSumDialog.show = false;
                    },
                },
                AverageVoltageDialog: {
                    show: false,
                    handleOpen: () => {
                        this.AverageVoltageDialog.show = true;
                    },
                    handleClose: () => {
                        this.AverageVoltageDialog.show = false;
                    },
                },
                PowerDialog: {
                    show: false,
                    handleOpen: () => {
                        this.PowerDialog.show = true;
                    },
                    handleClose: () => {
                        this.PowerDialog.show = false;
                    },
                },
            };
        },
        watch: {
            voltages: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.power = 0;
                        this.current = 0;
                        this.voltagesSum = 0;
                        this.averageVoltage = 0;
                        this.newVoltages = [];

                        const averageVoltage = [];
                        newVal.map((item, index) => {
                            this.newVoltages.push({ num: item, top: false, bottom: false });
                            if (item > 0 && index >= 0 && index <= 39) {
                                averageVoltage.push(item);
                            }
                            if (index === 40) {
                                this.current = (item / 1000).toFixed(2);
                            }
                            if (index === 41) {
                                this.voltagesSum = (item / 1000).toFixed(2);
                            }
                            if (index === 42) {
                                this.power = (item / 1000).toFixed(2);
                            }
                        });

                        this.averageVoltage = (this.voltagesSum / averageVoltage.length).toFixed(2);
                        this.newVoltages = this.newVoltages.slice(0, 40);
                        this.$emit('loading');
                    }
                    if (oldVal) {
                        this.oldVoltages = oldVal;
                        this.oldVoltages = this.oldVoltages.slice(0, 40);
                    }
                },
            },
        },
        methods: {
            batteryEcharts (index) {
                this.index = index + 1;
                this.EchartDialog.handleOpen();
            },
            voltagesSumEcharts () {
                this.VoltagesSumDialog.handleOpen();
            },
            averageVoltageEcharts () {
                this.AverageVoltageDialog.handleOpen();
            },
            currentEcharts () {
                this.CurrnetEchartDialog.handleOpen();
            },
            powerEcharts () {
                this.PowerDialog.handleOpen();
            },
            renderDateTime (value, defaultValue = null) {
                if (!value) {
                    return defaultValue;
                }
                return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        props: {
            voltages: {
                type: Array,
                required: true,
            },
            lastReportTime: {
                type: String,
            },
            id: {
                type: String,
                required: true,
            },
        },
    };
</script>
