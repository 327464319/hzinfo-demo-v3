<template>
	<basic-container>
		<avue-crud :option="option"
          		:table-loading="loading"
          		:data="data"
          		ref="crud"
          		v-model="form"
              :page="page"
          		:permission="permissionList"
          		:before-open="beforeOpen"
          		:before-close="beforeClose"
          		@row-del="rowDel"
          		@row-update="rowUpdate"
          		@row-save="rowSave"
          		@search-change="searchChange"
          		@search-reset="searchReset"
          		@selection-change="selectionChange"
          		@current-change="currentChange"
          		@size-change="sizeChange"
          		@refresh-change="refreshChange"
          		@on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permissionList.delBtn"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
	</basic-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import {isMobile, isEmail, isPhone} from '@/util/validate';
	export default {
		data() {
      const validateMobile = (rule, value, callback) => {
        if (value && !isMobile(value) ) {
          callback(new Error('请输入有效手机号码'));
        } else {
          callback();
        }
      };
      const validateTel = (rule, value, callback) => {
        if (value && !isMobile(value) && !isPhone(value) ) {
          callback(new Error('请输入有效电话号码'));
        } else {
          callback();
        }
      };
			return {
				form: {},
				query: {},
				loading: true,
				page: {
					pageSize: 10,
					currentPage: 1,
					total: 4
				},
				selectionList: [],
				option:{
					title:'表格的标题',
          tip: false, // 提示
					align:'center', 
					menuAlign:'center', // 
					searchMenuSpan: 6, // 搜索所占宽比例  24是整行
          border: true, // 边
          excelBtn:true, // 导入按钮
          selection: true, // 选择/反选
          dialogClickModal: false,  // 遮罩层点击是否可关闭  true/false（关闭/否）
					column:[
					{
						label:'姓名',
						search: true,
						prop:'name',
            rules: [    // 校验
              {
                required: true,
                message: "请输入姓名",
                trigger: "blur"
              },
              {
                max: 20,
                type: 'string',
                message: "长度20字符以内",
              }
            ]
					},
					{
						label:'性别',
            type: "radio",
						prop:'sex',
            dicData: [
              {
                label: "男",
                value: 0
              },
              {
                label: "女",
                value: 1
              },
              {
                label: "保密",
                value: 2
              }
            ],
					},{
            label:'年龄',
            prop:'number',
            type: "number",
            value: 18,
            rules: [
              {
                required: true,
                message: "请输入年龄",
                trigger: "blur"
              },{
                max: 200,
                type: 'number',
                min: 0,
                message: "长度0~200以内",
              }
            ]
          },{
						label: "日期",
						prop: "date",
						type: "date",
						format: "yyyy-MM-dd hh:mm:ss",
						valueFormat: "yyyy-MM-dd hh:mm:ss",
					},
          {
            label: "手机",
            prop: "phone",
            rules: [{
              max: 11,
              message: '请输入有效手机号码'
            },{
              validator: validateMobile,
              trigger: "blur"
            }]
          },
          {
            label: "电话号码",
            prop: "Tel",
            rules: [{
              validator: validateTel, 
              trigger: 'blur'
            },{
              max: 20,
              message: "长度20字符以内",
            }]
          }
					]
				},
				data: [
				{
					name:'张三',
					sex:'男',
					date:'1994-02-23 00:00:00',
				}, {
					name:'李四',
					sex:'女',
					date:'1994-02-23 00:00:00',
				}, {
					name:'王五',
					sex:'女',
					date:'1994-02-23 00:00:00',
				}, {
					name:'赵六',
					sex:'男',
					date:'1994-02-23 00:00:00',
          number: 65,
				}
				]
			}
		},
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          /*
           * website.isDev 本地开发，默认为true，即显示按钮
           * permission.list_add 权限按钮 
           * 运用：看上文删除按钮 v-if="permissionList.delBtn"
          */
          addBtn: this.website.isDev ? true : this.vaildData(this.permission.list_add, false),
          viewBtn: this.website.isDev ? true : this.vaildData(this.permission.list_view, false),
          delBtn: this.website.isDev ? true : this.vaildData(this.permission.list_delete, false),
          excelBtn: this.website.isDev ? true : this.vaildData(this.permission.list_excle_export, false),
          editBtn: this.website.isDev ? true : this.vaildData(this.permission.list_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        // add(row).then(() => {
        //   this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        // }, error => {
          // loading();
        //   window.console.log(error);
        // });
      },
      rowUpdate(row, index, done, loading) {
        // update(row).then(() => {
        //   this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        // }, error => {
        //   window.console.log(error);
        // });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning"
        })
          .then(() => {
            // this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,  // 遮罩层点击是否可关闭  true/false（关闭/否）
          type: "warning"
        })
          .then(() => {
            // this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        // if (["edit", "view"].includes(type)) {
        //   getDetail(this.form.id).then(res => {
        //     this.form = res.data.data;
        //   });
        // }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      messageTips(name){
        this.$message({
          message: `${name}字符过长，请重新输入`,
          type: 'warning'
        });
      },
      searchChange(params, done) {
        if (params.sex && params.sex.length > 20) {
          this.messageTips('性别')
          done();
          return
        }
        if (params.name && params.name.length > 20) {
          this.messageTips('姓名')
          done();
          return
        }
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        // this.loading = true;
        // getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        //   const data = res.data.data;
        //   this.page.total = data.total;
        //   this.data = data.records;
          this.loading = false;
        //   this.selectionClear();
        // });
      }
    }
	}
</script>

<style>
</style>