/**
 * 通用表单页
 * 1. 必须实现 initForm 方法，返回表单的定义
 * 2. 如果要编辑的记录没有存在 vuex 中，必须实现 fillRecorder 方法，返回本次要展现的记录
 * 3. 如果想要在提交表单前，对提交的数据做一些修改，实现 processValues 方法
 * 4. committed 方法是配合 dialogPageMixin 使用的
 * @param moduleNamespace
 * @returns {*}
 */
export const formPageMixin = (moduleNamespace) => {
    const moduleName = moduleNamespace == null ? '' : `${moduleNamespace}/`;

    return {
        async created () {
            try {
                this.isCreate = this.checkIsCreate();
                this.generateTitle();

                if (!this.isCreate) {
                    this.recorder = await this.fillRecorder(this.id);
                    if (!this.recorder) {
                        throw new Error('fillRecorder dose not return valid value');
                    }
                }
                console.log(this.recorder);

                this.myForm = this.initForm(this.recorder);
                if (!this.myForm) {
                    throw new Error('initForm dose not return valid value');
                }
                console.log('myForm', this.myForm);

                this.process();
                console.log('form', this.form);
                console.log('rules', this.rules);

                // 通过isLoadingFormData控制form表单的v-if可见性，保证所有数据准备好后才开始执行form表单的展示
                // noinspection JSUnusedGlobalSymbols
            } finally {
                this.isLoadingFormData = false;
            }
        },
        data () {
            return {
                isCreate: true,
                recorder: {},
                myForm: {}, // 用户构建的form对象
                form: {},
                rules: {},
                isLoadingFormData: true,
                title: null,
            };
        },
        methods: {
            checkIsCreate () {
                return this.id == null || this.id === '';
            },
            async fillRecorder (id) {
                let recorder = this.$store.getters[`${moduleName}getById`](id);
                if (recorder == null) {
                    recorder = await this.$store.dispatch(`${moduleName}get`, id);
                }
                return recorder;
            },
            initForm () {
                throw new Error('you must implement method initForm!');
            },
            process () {
                _.forOwn(this.myForm, (item, key) => {
                    if (_.isFunction(item.set)) { // 如果有设置 set 函数，就执行set函数
                        item.value = item.set(this.recorder || {});
                    } else if (this.recorder == null) {
                        item.value = item.default;
                    } else {
                        // item.ts 表示要把这个值转成字符串，有时候是个数字处理起来很麻烦
                        item.value = this.recorder[key] == null ? item.default : (item.ts ? this.recorder[key].toString() : this.recorder[key]);
                    }

                    this.$set(this.form, key, item.value);

                    const rules = _.map(item.rules, (r) => _.isFunction(r) ? r() : r);
                    this.$set(this.rules, key, rules);
                });
            },
            async collectValues () {
                const valid = await this.$refs.form.validate();
                if (valid) {
                    let values = _.clone(this.form);
                    values = await this.processValues(values);
                    if (values == null) {
                        throw new Error('processValues not return values');
                    }
                    return values;
                }
                return null;
            },
            async handleSubmit () {
                const values = await this.collectValues();
                if (values) {
                    this.commit(values);
                }
            },
            processValues (values) {
                return values;
            },
            async commit (values) {
                if (this.isCreate) {
                    await this.$store.dispatch(`${moduleName}add`, values);
                } else {
                    values.id = this.id;
                    await this.$store.dispatch(`${moduleName}edit`, { id: this.id, data: values });
                }
                this.committed({ refresh: true });
                this.$emit('committed', { refresh: true });
            },
            committed () { // 完成提交后
            },
            generateTitle (partTitle) {
                if (this.title == null || partTitle != null) {
                    this.title = (this.isCreate ? '新增' : '修改') + ': ' + (partTitle || this.partTitle) || 'partTitle';
                }
                return this.title;
            },
            checkUnique (options) {
                options = options || {};
                let { id, property } = options;
                id = id || this.id;
                property = property || 'name';
                return async (value) => this.$store.dispatch(`${moduleName}checkUnique`, { id, property, value });
            },
        },
        props: {
            id: {
                type: String,
            },
        },
    };
};

export const setFormEmptyStringToNull = (form) => {
    if (!form) {
        return;
    }

    _.forEach(_.keys(form), key => {
        if (form[key] === '') {
            form[key] = null;
        }
    });
};
