<template>
	<div class="table">
        <!--<nav>
        <el-breadcrumb separator="/">
		  <el-breadcrumb-item>运营商管理</el-breadcrumb-item>
		  <el-breadcrumb-item>服务人员</el-breadcrumb-item>
		</el-breadcrumb>
        </nav>   -->
		<div class="crumbs">
			<el-form>
				<el-form-item label="所属运营商" label-width="100px">
		          <el-select v-model.number="dwComSN" size="small"  filterable clearable @change="search" placeholder="支持模糊搜索">
		            <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
		            </el-option>
		          </el-select>
		        </el-form-item>
				<el-form-item label="区域编号" label-width="100px">
					<el-input v-model.trim="areaCode" size="small"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="btn" @click="search">查询</el-button>
				</el-form-item>
				 <el-form-item>
	          <el-button type="danger" native-type="reset" @click="reset" class="btn ml-20">重置</el-button>
	        </el-form-item>
	       <el-form-item>
	       	<el-button type="success" @click="add" size="small" class="btn ml-20">新增</el-button>
	       	 </el-form-item>
			</el-form>

		</div>
		<div class="white">
			<el-table v-loading="staff_loading" element-loading-text="数据加载中..." :data="staffList" border stripe style="width: 100%;" label-width="100px" height="480">
				<el-table-column type="index" width="60" align="center">
				</el-table-column>
				<el-table-column prop="szTitle" label="称呼" align="center" width="120" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="szTrueName" align="center" label="姓名" :show-overflow-tooltip="true" width="80">
				</el-table-column>
				<el-table-column prop="szHandPhone" align="center" label="手机" width="150">
				</el-table-column>
				<el-table-column prop="szTel" align="center" label="电话" width="150">
				</el-table-column>
				<el-table-column prop="szAreaName" align="center" label="服务区域">
				</el-table-column>
				<el-table-column prop="dwAdminLevel"  align="center" label="行政级别" :formatter="formatterLevel">
				</el-table-column>
				<!--<el-table-column prop="szComName" align="center" label="所属运营商" width="110">
				</el-table-column>-->
				<el-table-column prop="szEmail" align="center" label="邮箱" width="150">
				</el-table-column>
				<el-table-column prop="szMemo" align="center"  label="备注">
				</el-table-column>
				<el-table-column label="操作" align="center" width="100">
					<template scope="scope">
						<el-tooltip class="item" effect="dark" content="修改" placement="bottom">
							<el-button type="text" size="mini" @click="update(scope.$index,scope.row.dwConID)">
								<img src="../../../static/img/modify.png" class="horn" />
							</el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="bottom">
							<el-button size="mini" type="text" @click.native.prevent="deleteRow(scope.$index, staffList)">
								<img src="../../../static/img/delete.png" class="horn" />
							</el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination">
			<el-pagination :total="staff_total" :page-size="staff_pageConfig.pageSize" :current-page="staff_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import api from '../../api/';
	import remoteCompany from '../../mixins/remoteCompany';
	export default {
	  mixins: [remoteCompany],
		data() {
			return {
				dwComSN:'',
				filter:{sorts:""},
				comSN:'',
				areaCode: '',
				 companySelect: []
			}
		},
		computed: {
			// 使用对象展开符将vuex中的getter混入computed
			...mapGetters([
				'staffList',
				'staff_pageConfig',
				'staff_sort',
				'staff_total',
				'staff_loading',
				'dwConID'
			])
		},
		// 路由进入事件
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				vm.initData();
				 vm.remoteCompany();
			})
		},
		methods: {
			initData() {
				this.$store.dispatch('getStaffList', {
					'offset': (this.staff_pageConfig.page - 1) * this.staff_pageConfig.pageSize + 1, // 偏移量
					'limit': this.staff_pageConfig.pageSize,
					'dwAreaCode':this.areaCode,
					'dwComSN':this.dwComSN
				}).then(()=>{

	      }).catch((error) => {
	         this.loading = false;

	      });
			},
			formatterLevel(row,value){
				if(row.dwAdminLevel== 1){
		         return '国家级'}
				if(row.dwAdminLevel== 2){
		         return '省级'}
				if(row.dwAdminLevel== 4){
		         return '地市级'}
				if(row.dwAdminLevel== 6){
		         return '县级'}
			},
			searchFieldChange(val) {
				this.placeholder = placeholders[val];
			},
			pageSizeChange(val) {
				this.staff_pageConfig.pageSize = val;
				this.initData();
			},
			pageCurrentChange(val) {
				this.staff_pageConfig.page = val;
				this.initData();
			},
			search() {
				this.initData();
			},
			reset(){
			  this.szTrueName='',
    	      this.dwConID='',
    	      this.initData();
			},
			 tableSortChange(val) {
		      if (val.prop != null) {
		        if (val.order == 'descending') {
		          this.filter.sorts = '-' + val.prop;
		        }
		        else {
		          this.filter.sorts = '' + val.prop;
		        }
		      }
		      else {
		        this.filter.sorts = '';
		      }
		    },
			deleteRow(index, rows) {
				this.$confirm('确定要删除该条记录吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					api.DelStaffById(this.staffList[index].dwConID, this.staffList[index].dwComSN)
                  this.initData();
				this.$message('删除成功');
				}).catch(() => {});
			},
			// 使用状态格式化
			formatterSex(row, value) {
				if(row.dwSex == 0) {
					return "保密"
				} else if(row.dwSex == 1) {
					return "男"
				} else if(row.dwSex == 2) {
					return "女"
				}
			},
			update(index, id) {
				this.$router.push({ name: 'newstaff', params: {typeId: 1, id: this.staffList[index].dwConID} });
			},
			add: function() {
				this.$router.push({ name: 'newstaff', params: { typeId: 2 } });
			}
		}
	}
</script>
<style scoped>
	.table {
		width: 100%;
		overflow: hidden;
	}

	.crumbs {
		background: #FFFFFF;
		height: 48px;
		line-height: 44px;
		text-align: center;
		position: relative;
	}

	.el-form-item .el-button {
		width: 78px!important;
	}

	.btn {
		height: 28px;
		line-height: 5px;
		margin-left: 30px;
		font-size:14px;
	}

	.ml-350 {
		margin-left: 350px;
	}

	.new_add {
		width: 100%;
		background: #FFFFFF;
		height: 40px;
		line-height: 40px;
	}

	.new_add img {
		vertical-align: middle;
	}

	.new_add .fr {
		width: 150px;
		height: 100%;
		float: right;
	}

	.table table {
		width: 100%;
		border-collapse: collapse;
		border: none;
		background: #FFFFFF;
		text-align: center;
	}

	.table table td {
		height: 30px;
		border: 1px solid #F2F2F2;
	}

	.el-table th>.cell {
		text-align: center;
	}

	.fr .el-button {
		margin-right: 20px;
		margin-top: -20px;
	}

	.el-form-item {
		float: left;
		margin-top: 5px;
	}

	.el-form-item .el-input,
	.el-select {
		width: 200px;
		height: 37px;
	}

	.el-form-item .el-button {
		width: 98px;
	}

	.el-table label {
		text-align: center;
	}
	nav{
		background: #FFFFFF;
		height:25px;
		line-height:25px;
		margin-top: 5px;
		padding-top: 5px;
		overflow: hidden;
	}
</style>
