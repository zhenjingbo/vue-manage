<template>
  <div>
    <!--<div class="air" v-if="test"></div>-->
    <div class="ms-doc">
      <img src="../../../static/img/revise.png" />
      <span>设置纸型</span>
      <el-button type="primary" class="add" @click="newAdd">新增</el-button>
    </div>
    <div class="modify">
      <el-table :data="paperList" border stripe style="width: 100%;" label-width="100px">
        <el-table-column prop="szName" label="名称" align="center">
        </el-table-column>
        <el-table-column prop="dwPaperID" label="ID" align="center">
        </el-table-column>
        <el-table-column prop="dwWidth" label="宽度" align="center">
        </el-table-column>
        <el-table-column prop="dwHeight" label="高度" align="center">
        </el-table-column>
        <el-table-column prop="szMemo" label="备注" align="center">
        </el-table-column>
        <el-table-column label="设置" width="100" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button type="text" size="small" @click="setup(scope.$index,scope.row)">
                <img src="../../../static/img/modify.png" class="horn" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button size="small" type="text" @click.native.prevent="deleteRow(scope.$index,paperList)">
                <img src="../../../static/img/delete.png" class="horn" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新增纸型" v-model="newPaper" class="dialogSize" size="tiny">
        <el-form :model="paperNew" ref="ruleNew" :rules="rulesNew" label-width="80px" class="demo-ruleForm" label-position="right">
           <el-form-item label="ID" prop="dwPaperID"  required>
            <el-input v-model.trim="paperNew.dwPaperID" size="small" class="med" type="number"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="szName"  required>
            <el-input v-model.trim="paperNew.szName" size="small" class="med"></el-input>
          </el-form-item>
          <el-form-item label="宽度" prop="dwWidth"  required>
            <el-input v-model.trim="paperNew.dwWidth" size="small" class="med" type="number"></el-input>
          </el-form-item>
          <el-form-item label="高度" prop="dwHeight"  required>
            <el-input v-model.trim="paperNew.dwHeight" size="small" class="med" type="number"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="szMemo">
            <el-input v-model.trim="paperNew.szMemo" size="small" class="med"></el-input>
          </el-form-item>
            <el-button type="primary" @click="submitNew" size="small" class="ml-30">提交</el-button>
            <el-button @click="newPaper=false" size="small" class="ml-60">关闭</el-button>
        </el-form>
      </el-dialog>
      
      <el-dialog title="修改纸型" v-model="paper" class="dialogSize" size="tiny">
        <el-form :model="paperForm" ref="rulePaper" :rules="rulesPaper" label-width="80px" class="demo-ruleForm" label-position="right">
           <el-form-item label="ID" prop="dwPaperID" required>
            <el-input v-model.trim="paperForm.dwPaperID" size="small" class="med" type="number"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="szName" required>
            <el-input v-model.trim="paperForm.szName" size="small" class="med"></el-input>
          </el-form-item>
          <el-form-item label="宽度" prop="dwWidth" required>
            <el-input v-model.number.trim="paperForm.dwWidth" size="small" class="med" type="number"></el-input>
          </el-form-item>
          <el-form-item label="高度" prop="dwHeight" required>
            <el-input v-model.number.trim="paperForm.dwHeight" size="small" class="med" type="number"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="szMemo">
            <el-input v-model.trim="paperForm.szMemo" size="small" class="med"></el-input>
          </el-form-item>
            <el-button type="primary" @click="submit" size="small" class="ml-30">提交</el-button>
            <el-button @click="paper=false" size="small" class="ml-60" >关闭</el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import api from '../../api/';
  export default {
    data() {
      return {
        paperList:[],
        paper: false,
        newPaper:false,
        paperForm: {
          dwPaperID:'',
          szName: '',
          dwWidth: '',
          dwHeight: '',
          szMemo:''
        },
         paperNew: {
           dwPaperID:'',
          szName: '',
          dwWidth: '',
          dwHeight: '',
          szMemo:''
        },
        resetForm:{
           dwPaperID:'',
          szName: '',
          dwWidth: '',
          dwHeight: '',
          szMemo:''
        },
        rulesPaper:{
          dwPaperID:[
            { required:true,type:'number',message:'ID不能为空且只能为数字',trigger: 'blur' }
          ],
           szName: [
            { required:true,message:'名称不能为空',trigger: 'blur' }
          ],
          dwWidth: [
            { required:true,type:'number',message:'宽度不能为空且只能为数字',trigger: 'blur' }
          ],
          dwHeight: [
            { required:true,type:'number',message:'高度不能为空且只能为数字',trigger: 'blur' }
          ],
        },
        rulesNew:{
           dwPaperID:[
            { required:true,message:'ID不能为空',trigger: 'blur' }
          ],
           szName: [
            { required:true,message:'名称不能为空',trigger: 'blur' }
          ],
          dwWidth: [
            { required:true,message:'宽度不能为空且只能为数字',trigger: 'blur' }
          ],
          dwHeight: [
            { required:true,message:'高度不能为空且只能为数字',trigger: 'blur' }
          ],
        }
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        vm.initData();
      })
    },
    computed: {
      test: function() {
        return this.$store.state.flag;
      }
    },
    methods: {
      initData(words){
        api.GetPaperList(words).then((res) => {
          this.paperList = res.data.data
        })
        .catch(error=>{
          this.$message.error(error.message);
      })
      },
      setup(index,row){
        this.paper = true;
        this.paperForm = Object.assign({}, row);
      },
      newAdd(){
        this.newPaper = true;
      },
        deleteRow(index, rows) {
      this.$confirm('确定要删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DeletePaper({'id':rows[index].dwPaperID})
          .then(() => {
            this.$message({ type: 'success', message: '删除成功' });
          })
          .catch(() => {
            this.$message({ type: 'error', message: '删除失败' });
          })
        this.initData();
      }).catch((error) => {
        this.$message.error(error.message);
      });
    },
    submitNew() {
        this.$refs["ruleNew"].validate((valid) => {
          if(valid) {
            api.SavePaper({ 'dwPaperID': this.paperNew.dwPaperID, 'szName': this.paperNew.szName, 'dwWidth': this.paperNew.dwWidth,'dwHeight': this.paperNew.dwHeight,'szMemo': this.paperNew.szMemo })
              .then(res => {
                this.newPaper =false;
                this.$message("新增纸型成功");
                this.initData();
                this.$refs['ruleNew'].resetFields();
              })
              .catch(() => {
                this.$message.error(error.msg);
                this.initData();
              })
          } else {
            this.$message.error("请输入必填项目")
          }
        })
      },
      submit() {
        this.$refs["rulePaper"].validate((valid) => {
          if(valid) {
            api.UpdatePaper({ 'dwPaperID': this.paperForm.dwPaperID, 'szName': this.paperForm.szName, 'dwWidth': this.paperForm.dwWidth,'dwHeight': this.paperForm.dwHeight,'szMemo': this.paperForm.szMemo })
              .then(res => {
                 this.paper =false;
                this.$message("修改纸型成功");
                this.initData();
              })
              .catch(() => {
                this.$message.error("修改纸型失败")
                this.initData();
              })
          } else {
            this.$message.error("请输入必填项目")
          }
        })
      },
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      }
    }
  }
</script>
<style scoped>
  .ms-doc {
    width: 100%;
    min-width: 980px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background: #FFFFFF;
    height: 50px;
    line-height: 50px;
  }
  
  .ms-doc span {
    margin-left: 5px;
    font-family: 'microsoft yahei';
    color: #13ce66;
  }
  
  .ms-doc .el-button {
    font-size: 12px;
    float: right;
    width: 60px;
    height: 30px;
    line-height: 10px;
    margin-right: 30px;
    margin-top: 10px;
  }
  
  .ms-doc img {
    vertical-align: middle;
    margin-left: 30px;
  }
  .modify {
    width: 100%;
    height: 100%;
    margin-top: 5px;
    background: #FFFFFF;
    overflow: hidden;
  }
  
  .modify ul {
    width: 840px;
    height: 500px;
    left: 0;
    right: 0;
    margin: 30px auto;
    list-style: none;
  }
  
  .modify ul li {
    height: 42px;
    width: 100%;
    line-height: 42px;
    margin-top: 40px;
    vertical-align: middle;
    position: relative;
  }
  
  .el-select {
    width: 240px;
    height: 37px;
    margin-left: 16px;
    margin-right: 50px;
  }
  
  .el-input {
    width: 240px;
    height: 37px;
    font-size: 16px;
    color: #1f2d3d;
    margin-left: 20px;
    margin-right: 50px;
  }
  
  .modify ul .center {
    text-align: center;
  }
  
  .modify ul li .el-button {
    width: 114px;
    height: 33px;
    position: relative;
    margin-left: 50px;
    margin-right: 50px;
  }
  
  .med {
    width: 150px;
  }
  .ml-60{
    margin-left: 130px!important;
  }
  .ml-30{
    margin-left: 38px!important;
  }
  .mt-ten {
    margin-top: -10px;
  }
</style>