<template>
    <el-dialog
            :title="index + '号电池'"
            :visible.sync="dialogVisible"
            @close="handleClose"
            :append-to-body="true"
            fullscreen
            width="30%">
        <el-row>
            <div id="myChart" style="width: 100%;height:400px;"></div>
        </el-row>
    </el-dialog>
</template>

<script>
    import dayjs from 'dayjs';
    import echarts from 'echarts';
    import { actionTypes } from '@/store/actionTypes';

    export default {
        async created () {
            console.log(this.sec_to_time());
            this.history = await this.$store.dispatch(actionTypes.historyVoltageEcharts, {
                id: this.id,
                index: this.index,
            });
            this.historyData();
            this.VoltageLine();
            this.intervalId = setInterval(() => {
                this.VoltageLine();
            }, this.second());
        },
        data () {
            return {
                history: [],
                intervalId: null,
                dialogVisible: true,
                Voltage: {
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 0),
                    },
                    title: {
                        text: '电压历史数据对比',
                    },
                    dataZoom: [{
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        bottom: 0,
                        start: 0,
                        end: 100,
                    }, {
                        type: 'inside',
                    }],
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: [],
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: { readOnly: true },
                            magicType: { type: ['stack'] },
                            restore: {},
                            saveAsImage: {},
                            myFull: {
                                show: true,
                                title: '全屏查看',
                                icon: 'M1014.237213 1013.761259a28.517906 28.517906 0 0 1-22.344547 10.118285h-287.979654a32.011123 32.011123 0 0 1 0-63.962019l210.345905 0.963647-345.105808-345.135922 45.201031-45.261259 345.527403 345.527403v-212.062399a31.981009 31.981009 0 1 1 63.962019 0L1023.90379 990.965003c0 8.973956-3.764243 16.984265-9.666577 22.796256z m-22.344547-661.753938a31.981009 31.981009 0 0 1-32.011123-32.011123l1.023874-210.345904-345.196149 345.105807-45.201032-45.261259L915.975411 64.027667h-212.062399a32.011123 32.011123 0 0 1 0-64.022246h287.076236c8.913728 0 16.984265 3.764243 22.796256 9.666576a28.608248 28.608248 0 0 1 10.058058 22.344547v287.979654c0 17.676886-14.334238 32.011123-31.950896 32.011123z m-582.373579 101.393653L63.991685 107.873571v212.122627a32.011123 32.011123 0 1 1-63.962019 0V32.919962C0.029666 24.006235 3.733681 15.935697 9.636014 10.123706A28.578134 28.578134 0 0 1 32.040789 0.005421h287.919427a32.011123 32.011123 0 0 1 0 64.022246l-210.345905-1.023874 345.166036 345.196149-45.26126 45.201032zM32.040789 671.937871c17.616658 0 31.950895 14.334238 31.950896 32.011124l-0.963647 210.345904 345.135922-345.166035 45.261259 45.261259L107.897816 959.917525h212.0624a31.981009 31.981009 0 1 1 0 63.962019H32.944208c-8.973956 0-16.984265-3.704015-22.796257-9.606348A28.668475 28.668475 0 0 1 0.029666 991.868421v-287.919426c0-17.676886 14.334238-32.011123 32.011123-32.011124z',
                                onclick: (e) => {
                                    const element = document.getElementById(e.option.value);
                                    if (element.requestFullscreen) { // HTML W3C 提议
                                        element.requestFullscreen();
                                    } else if (element.msRequestFullscreen) { // IE11
                                        element.msRequestFullscreen();
                                    } else if (element.webkitRequestFullScreen) { // Webkit (works in Safari5.1 and Chrome 15)
                                        element.webkitRequestFullScreen();
                                    } else if (element.mozRequestFullScreen) { // Firefox (works in nightly)
                                        element.mozRequestFullScreen();
                                    }
                                    // 退出全屏
                                    if (element.exitFullscreen) {
                                        document.exitFullscreen();
                                    } else if (element.msExitFullscreen) {
                                        document.msExitFullscreen();
                                    } else if (element.webkitRequestFullScreen) {
                                        document.webkitCancelFullScreen();
                                    } else if (element.mozCancelFullScreen) {
                                        document.mozCancelFullScreen();
                                    }
                                },
                            },
                        },
                    },
                    grid: {
                        left: '5%',
                        right: '8%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: {
                        name: '测量时长',
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                    },
                    yAxis: {
                        name: '电压（V）',
                        axisLabel: {
                            formatter: '{value}(V)',
                        },
                        type: 'value',
                    },
                    series: [],
                },
            };
        },
        methods: {
            second () {
                if (this.$parent.$parent.$parent.job.jobInfo.interval) {
                    return this.$parent.$parent.$parent.job.jobInfo.interval * 1000;
                } else {
                    return 1000;
                }
            },
            handleClose () {
                this.$emit('close');
            },
            renderDateTime (value, defaultValue = null) {
                if (!value) {
                    return defaultValue;
                }
                return dayjs(value).format('MM-DD HH:mm');
            },
            async historyData () {
                const _series = [];
                this.history.forEach((a) => {
                    let series = [];
                    a.forEach(b => {
                        series.push((b.voltage / 1000).toFixed(2));
                    });
                    _series.push({
                        name: this.renderDateTime(a[0].createTime) + '时测量',
                        type: 'line',
                        areaStyle: {},
                        smooth: true,
                        data: series,
                    });
                });

                this.Voltage.series = _series.sort((a, b) => {
                    return b.data.length - a.data.length;
                });
                this.Voltage.series.forEach(c => {
                    this.Voltage.legend.data.push(c.name);
                });
            },
            sec_to_time (s) {
                let t;
                if (s > -1) {
                    let min = Math.floor(s / 60);
                    let sec = s % 60;
                    if (min < 10) {
                        t = '0' + min + ':';
                    } else {
                        t = min + ':';
                    }
                    if (sec < 10) { t += '0'; }
                    t += sec.toFixed();
                }
                return t;
            },

            async VoltageLine () {
                this.Voltage.series = [];
                const res = await this.$store.dispatch(actionTypes.voltageEcharts, {
                    id: this.id,
                    index: this.index,
                });
                this.$nextTick(() => {
                    this.Voltage.xAxis.data = [];
                    this.Voltage.legend.data = [];
                    this.historyData();

                    const series1 = {
                        name: '此次测量',
                        type: 'line',
                        areaStyle: {},
                        smooth: true,
                        data: [],
                    };
                    res.forEach((i, index) => {
                        this.Voltage.xAxis.data.push(this.sec_to_time((index + 1) * this.$parent.$parent.$parent.job.jobInfo.interval));

                        series1.data.push((i.voltage / 1000).toFixed(2));
                    });
                    this.Voltage.legend.data.push('此次测量');
                    this.Voltage.series.unshift(series1);

                    let myChart = echarts.init(document.getElementById('myChart'));
                    myChart.on('dataZoom', (event) => {
                        if (event.batch) {
                            // 鼠标滚轮缩放
                            this.dataZoom = {
                                start: event.batch[0].start,
                                end: event.batch[0].end,
                            };
                            this.Voltage.dataZoom[0].start = this.dataZoom.start;
                            this.Voltage.dataZoom[0].end = this.dataZoom.end;
                        } else {
                            // 滑块缩放
                            this.dataZoom = {
                                start: event.start,
                                end: event.end,
                            };
                            this.Voltage.dataZoom[0].start = this.dataZoom.start;
                            this.Voltage.dataZoom[0].end = this.dataZoom.end;
                        }
                    });
                    myChart.setOption(this.Voltage);
                    myChart.setOption({ value: 'myChart' });

                    // 浏览器宽高变化，erhart's图表自动变化
                    window.addEventListener('resize', function () {
                        myChart.resize();
                    });
                });
            },
        },
        beforeDestroy () {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        },
        props: {
            index: {
                type: Number,
                required: true,
            },
            id: {
                type: String,
                required: true,
            },
        },
    };
</script>

<style>
    :-webkit-full-screen {
        background-color: white !important;
    }
    :-moz-full-screen {
        background-color: white !important;
    }

    :-ms-fullscreen {
        background-color: white !important;
    }
    :fullscreen {
        background-color: white !important;
    }
</style>
