import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import { actionTypes } from '@/store/actionTypes';
import dayjs from 'dayjs';

Vue.use(Vuex);

function renderDateTime (value, defaultValue = null) {
    if (!value) {
        return defaultValue;
    }
    return dayjs(value).format('HH:mm:ss');
};

export default new Vuex.Store({
    state: {
        jobs: [],
        ports: [],
        finishJobs: [],
    },
    mutations: {
        setJobs (state, jobs) {
            state.jobs = jobs;
        },
        setPorts (state, ports) {
            state.ports = ports;
        },
        setFinishJobs (state, finishJobs) {
            state.finishJobs = finishJobs;
        },
    },
    actions: {
        async [actionTypes.listRunningJobs] ({ commit }) {
            const { data } = await axios.get('/job');
            commit('setJobs', data);
        },
        // 实时电压
        async [actionTypes.voltageEcharts] (store, { id, index }) {
            const { data } = await axios.get(`/job/data_chart_battery/${id}/${index}`);
            return data;
        },
        // 历史电压
        async [actionTypes.historyVoltageEcharts] (store, { id, index }) {
            const { data } = await axios.get(`/job/data_chart_battery_history/${id}/${index}`);
            return data;
        },
        // 电流
        async [actionTypes.currentEcharts] (store, { id }) {
            const { data } = await axios.get(`/job/data_chart_current/${id}`);
            const echartData = [];
            data.forEach((i) => {
                i.createTime = renderDateTime(i.createTime);
                i.voltage = (i.voltage / 1000).toFixed(2);
                const a = {
                    createTime: i.createTime,
                    current: i.voltage,
                };
                echartData.push(a);
            });
            return echartData;
        },
        // 总电压
        async [actionTypes.voltagesSum] (store, { id }) {
            const { data } = await axios.get(`/job/data_chart_sum/${id}`);
            const echartData = [];
            data.forEach((i) => {
                i.createTime = renderDateTime(i.createTime);
                i.voltage = (i.voltage / 1000).toFixed(2);
                const a = {
                    createTime: i.createTime,
                    voltage: i.voltage,
                };
                echartData.push(a);
            });
            return echartData;
        },
        // 平均电压
        async [actionTypes.averageVoltage] (store, { id }) {
            const { data } = await axios.get(`/job/data_chart_avg/${id}`);
            const echartData = [];
            data.forEach((i) => {
                i.createTime = renderDateTime(i.createTime);
                i.voltage = (i.voltage / 1000).toFixed(2);
                const a = {
                    createTime: i.createTime,
                    averageVoltage: i.voltage,
                };
                echartData.push(a);
            });
            return echartData;
        },
        // 功率
        async [actionTypes.power] (store, { id }) {
            const { data } = await axios.get(`/job/data_chart_power/${id}`);
            const echartData = [];
            data.forEach((i) => {
                i.createTime = renderDateTime(i.createTime);
                i.voltage = (i.voltage / 1000).toFixed(2);
                const a = {
                    createTime: i.createTime,
                    voltage: i.voltage,
                };
                echartData.push(a);
            });
            return echartData;
        },
        async [actionTypes.saveAndStartJob] ({ dispatch }, job) {
            await axios.post('/job/add', job, { formPost: true });
            await dispatch(actionTypes.listRunningJobs);
        },
        async [actionTypes.stopJob] ({ dispatch }, id) {
            await axios.put(`/job/stop/${id}`, { formPost: true });
            await dispatch(actionTypes.listRunningJobs);
        },
        async [actionTypes.removeJob] ({ dispatch }, id) {
            await axios.delete(`/job/${id}`, { formPost: true });
            await dispatch(actionTypes.listRunningJobs);
        },
        async [actionTypes.listComPorts] ({ commit }) {
            const { data } = await axios.get(`/com_port/list`);
            commit('setPorts', data);
        },
        async [actionTypes.getFinishJobs] ({ commit }) {
            const { data } = await axios.get('/job/get_finish_job');
            commit('setFinishJobs', data);
        },
        [actionTypes.download] (store, { id }) {
            window.open(`${process.env.VUE_APP_BASE_URL || ''}/job/download/${id}`, '_blank');
        },
        async [actionTypes.removeFinishJob] (store, id) {
            await axios.delete(`/job/delete_job/${id}`, { formPost: true });
        },
    },
    modules: {},
});
