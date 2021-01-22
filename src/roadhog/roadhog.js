/* eslint-disable */
import Vue from 'vue';
import DlgDraggable from 'vue-element-dialog-draggable';
import LanDialog from './LanDialog';
import LanFormDialog from './LanFormDialog';
import PageHeader from './PageHeader';

function install(Vue) {
    Vue.use(DlgDraggable);
    Vue.component('lan-dialog', LanDialog);
    Vue.component('lan-form-dialog', LanFormDialog);
    Vue.component('page-header', PageHeader);
}

if (typeof exports === 'object') {
    module.exports = install;
} else if (typeof define === 'function' && define.amd) {
    define([], () => {
        return install;
    });
} else if (window.Vue) {
    Vue.use(install);
}

export default install;
