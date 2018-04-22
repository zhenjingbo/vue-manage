<template>
    <div class="table">
    	<!--<div class="air" v-if="test"></div>-->
        <div class="crumbs">
        	<div class="mid">
       <el-form ref="form" :model="form" >
                <el-form-item label="姓名" label-width="60px">
                    <el-input v-model="form.num" size="small" class="short"></el-input>
                </el-form-item>
                <el-form-item label="所属运营商" label-width="100px">
                    <el-input v-model="form.name" size="small"></el-input>
                </el-form-item>      
            <el-form-item >
		      <el-button type="primary" size="small">查询</el-button>
		      </el-form-item>
		     </el-form>		              		
        	</div>
            <div class="fr">
        		<!--<img src="../../../static/img/adduser.png"/>-->
        	<el-button type="success" @click="addFormVisible=true">新增收费标准</el-button>
        	</div>     
        </div>
         <el-table
    :data="feeList"
    border
    stripe
    style="width: 100%;" label-width="100px" >
    <el-table-column type="index" width="30">
        </el-table-column>
    <el-table-column
      prop="dwSN"
      label="编号"
       width="120"
      >
    </el-table-column>
    <el-table-column
      prop="szName"
      label="名称"
      >
    </el-table-column>
    <el-table-column
      prop="dwKind"
      label="复印机序列号"
      >
    </el-table-column>
    <el-table-column
      prop="dwKind"
      label="类型"
      >
    </el-table-column>
    <el-table-column
      prop="dwPriority"
      label="优先级"
      >
    </el-table-column>
    <el-table-column
      prop="szMemo"
      label="备注"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      width="160"
      >
      <template scope="scope">
      	<el-tooltip class="item" effect="dark" content="修改" placement="bottom">
      	<el-button
          type="text"
          size="small"
          @click="dialogFormVisible = true">
          <img src="../../../static/img/modify.png" class="horn"/>
          </el-button>
           </el-tooltip>
           <el-tooltip class="item" effect="dark" content="设置" placement="bottom">
          <el-button
          type="text"
          size="small"
          @click="setup">
          <img src="../../../static/img/device.png" class="horn"/>
          </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
         <el-button
          size="small"
          type="text"
         @click.native.prevent="deleteRow(scope.$index, tableData4)">
          <img src="../../../static/img/delete.png" class="horn"/>
        </el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
        <!--<div class="pagination">
            <el-pagination
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
        </div>-->

<!--修改收费标准-->
  <!--<el-dialog title="修改收费标准" v-model="dialogFormVisible" class="dialogSize" size="tiny">
 <el-form :model="ruleForm" ref="ruleForm" label-width="60px" class="demo-ruleForm" label-position=left>
  <el-form-item label="名称" prop="name" class="mt-ten" required>
    <el-input v-model="ruleForm.name" size="small" ></el-input>
  </el-form-item>
  <el-form-item label="身份" prop="region" >
    <el-select v-model="ruleForm.region" placeholder="请选择活动区域" size="small" required>
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="优先级" prop="region">
    <el-select v-model="ruleForm.region" placeholder="请选择活动区域" size="small">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="类型" prop="region">
    <el-select v-model="ruleForm.region" placeholder="请选择活动区域" size="small">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="备注" prop="name">
    <el-input v-model="ruleForm.name" size="small"></el-input>
  </el-form-item>
  <el-form-item class="ml-0">
    <el-button type="primary" @click="submitForm('ruleForm')" size="small" class="ml-0">提交</el-button>
    <el-button @click="dialogFormVisible=false" size="small">关闭</el-button>
  </el-form-item>
</el-form>
</el-dialog>-->

<!--新增收费标准-->
  <el-dialog title="新增收费标准" v-model="addFormVisible" class="dialogSize" size="tiny">
 <el-form :model="ruleForm" ref="ruleForm" label-width="60px" class="demo-ruleForm" label-position=left>
  <el-form-item label="名称" prop="name" class="mt-ten" required>
    <el-input v-model="ruleForm.name" size="small"></el-input>
  </el-form-item>
  <el-form-item label="身份" prop="region" required>
    <el-select v-model="ruleForm.region" placeholder="请选择活动区域" size="small">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="优先级" prop="level" required>
    <el-select v-model="ruleForm.region" placeholder="请选择活动区域" size="small">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="类型" prop="type" required>
    <el-select v-model="ruleForm.region" placeholder="请选择活动区域" size="small">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="备注" prop="name">
    <el-input v-model="ruleForm.name" size="small"></el-input>
  </el-form-item>
  <el-form-item class="ml-0">
    <el-button type="primary" @click="submitForm('ruleForm')" size="small" class="ml-0">提交</el-button>
    <el-button @click="addFormVisible=false" size="small">关闭</el-button>
  </el-form-item>
</el-form>
</el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
    export default {
        data() {
            return {
            	 form: {
            	 	num:'',
                    name: '',
                    region: '',
                    level: '',
                    type: ''
               },
        addFormVisible:false,
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '80px',
          ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
           region: [
            { type: 'array', required: true, message: '请选择区域', trigger: 'change' }
          ],
          level: [
            { required: true, message: '请选择级别', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请选择类型', trigger: 'change' }
          ]
        },
        value: ''
            }
        },
        computed:{
        ...mapGetters([
          'feeList',
          'pageConfig',
          'fee_sort',
          'fee_total',
          'fee_loading'
        //   'dwConID'
         ])
        },
        // 路由进入事件
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        vm.initData();
      })
    },
        methods: {
       initData() {
        this.$store.dispatch('getFeeList', {
          'page': this.pageConfig.page,
          'rows': this.pageConfig.pageSize,
        //   szTrueName:this.szTrueName,
        //   dwComSN:this.dwComSN
        });
      },
       submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
            deleteRow(index, rows) {
            this.$confirm('确定要删除该条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        rows.splice(index, 1)

        }).catch(() => {
       
        });
      
            }, 
             add:function (){
              	this.$router.push({ path :'/main/Revise'});
              },
              setup:function (){
              	this.$router.push({ path :'/main/Details'});
              }  
        }
    }
</script>
<style scoped>
     .table{
     	width: 100%;overflow: hidden;
     }
     .crumbs{
     	background: #FFFFFF;
		height:50px;
		line-height: 50px;
		text-align: center;
		overflow: hidden;	
     }
	.crumbs input{
		margin-left: 20px;
		margin-right: 30px;
	}
	.new_add{
		width: 100%;
		background: #FFFFFF;
		height: 40px;
		line-height: 40px;
		-moz-line-height:40px;
	}
	.new_add img{
		vertical-align: middle;
	}
	.new_add .fr{
		width: 150px;
		height: 100%;
		float: right;
	}
	.table table{
		width: 100%;
		border-collapse:collapse;
		border:none;
		background: #FFFFFF;
		text-align:center;
	}
	.table table td{
	height:30px;
   	border:1px solid #F2F2F2;
	}
	.el-table th > .cell{
		text-align: center;
	}
	.fr .el-button{
		margin-right: 20px;
		height: 30px;
		line-height: 5px;
	}
    .el-form-item{
    	float: left;
    	margin-top:8px;
    }
    .el-form-item .el-input,.el-select{
    	width:200px;
    	height:37px;
    }
    .el-form-item .el-button{
    	 width:78px;
    	 margin-left:40px;
    }
     .ml-40{
     	margin-left: 40px;
     }
     .ml-10{
     	margin-left: 10px;
     }
     .el-table label{
     	text-align: center;
     }
     .mt-ten{
         margin-top: -10px;
     }
     .dialogSize .el-form-item__label{
         text-align: left!important;
     }
</style>