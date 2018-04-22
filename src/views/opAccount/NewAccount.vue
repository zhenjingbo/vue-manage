<template>
  <div class="body">
    <div class="ms-doc">
      <img src="../../../static/img/revise.png" />
      <span>单个开户</span>
    </div>
    <div class="modify2">
      <el-form :model="countSingle" :rules="rules" ref="ManForm" label-width="100px" label-position="left">
        <ul>
          <li>
            <el-form-item label="登录名" prop="szLogonName">
              <el-input v-model.trim="countSingle.szLogonName"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="szTrueName">
              <el-input v-model.trim="countSingle.szTrueName"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="地址" prop="szAddress">
              <el-input v-model.trim="countSingle.szAddress"></el-input>
            </el-form-item>
             <el-form-item label="行政区域" prop="dwAreaCode">
              <city-select v-model="countSingle.dwAreaCode" :isCode="true" class="ml-19"></city-select>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="手机" prop="szHandPhone">
              <el-input v-model.trim="countSingle.szHandPhone"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="szTel">
              <el-input v-model.trim="countSingle.szTel"></el-input>
            </el-form-item>
          </li>
          <li>
          <el-form-item label="身份证号" prop="szIDCard">
              <el-input v-model.trim="countSingle.szIDCard"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="dwSex">
              <el-select v-model="countSingle.dwSex" placeholder="请选择性别">
                <el-option label="保密" :value="0"></el-option>
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="邮编" prop="szPostCode">
              <el-input v-model.trim="countSingle.szPostCode"></el-input>
            </el-form-item>
             <el-form-item label="邮箱" prop="szEmail">
              <el-input v-model.trim="countSingle.szEmail"></el-input>
            </el-form-item>
          </li>
          <li v-if="$route.params.typeId == 2">
            <el-form-item label="身份证号" prop="szIDCard">
              <el-input v-model.trim="countSingle.szIDCard" :disabled="finish"></el-input>
            </el-form-item>
          </li>
          <li class="center mt-50">
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button onclick="window.history.go(-1)">返回</el-button>
          </li>
        </ul>
      </el-form>
    </div>
  </div>
  <!--</div>-->
</template>

<script>
  import * as types from '../../store/mutation-types';
  import CitySelect from '../../components/City';
  import { mapGetters } from 'vuex';
  import api from '../../api/';
  export default {
    data() {
       // 自定义验证规则
    var checkSzLogonName = (rule, value, callback) => { // 远程检测打印名称
      if (!value) {
        return callback(new Error('请输入登录名'));
      }else {
        
        api.CheckAccount({ 'szLogonName': value})
          .then(res => {
            if (res.data.data) {
              return callback(new Error('此登录名已经存在'));
            } else {
              callback();
            }
          }).catch(error => {
            return callback(new Error('远程检测出错'));
          })
    }
    };
      return {
        countSingle: {
          dwSex: 0
        },
        rules: {
          szLogonName: [
            {pattern: /^[A-Za-z0-9-_]{1,16}$/, message: '登录名只能为字母或数字长度在1-16位之间'},
            {validator: checkSzLogonName, trigger: 'blur' },
          ],
          szTrueName: [
            {pattern: /^[\u4e00-\u9fa5A-Za-z0-9-_]{1,16}$/, message: '姓名长度在1-16位之间'}
          ],
          szAddress: [
            {pattern: /^[\u4e00-\u9fa5A-Za-z-_]{1,64}$/, message: '地址长度在1-64位之间不能为数字'}
          ],
          szHandPhone: [
             { pattern: /^1(3|4|5|7|8)[0-9]\d{8}$/, message: '手机号格式输入不正确' }
          ],
          szTel: [
             { pattern: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/, message: '电话号输入不正确' }
          ],
          szIDCard: [
            { pattern: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/, message: '身份号格式输入不正确' }
          ],
          szPostCode: [
            { pattern: /^[1-9][0-9]{5}$/, message: '邮编格式不正确' }
          ],
          szEmail: [
            { type: 'email', message: '邮箱格式不正确'}
          ]
        },
      }
    },
    components: {
      CitySelect
    },
    methods: {
      submit(){
        this.$refs["ManForm"].validate((valid) => {
          if(valid) {
            api.SaveAccount({ 'dwAccNo': this.countSingle.dwAccNo, 'szLogonName': this.countSingle.szLogonName, 'szTrueName': this.countSingle.szTrueName, 'dwAreaCode': this.countSingle.dwAreaCode,'szHandPhone':this.countSingle.szHandPhone,'szEmail':this.countSingle.szEmail,'szAddress':this.countSingle.szAddress})
              .then(res => {
                this.$message({ type: 'success', message: '开户成功!' });
                this.$router.push({ path: '/opAccount/index' });
              })
              .catch(error => {
               
              });
          } else {
             this.$message.error('请填入正确的数据');
          }
        });
      }
    }
  }
</script>
<style scoped>
  .ms-doc {
    width: 100%;
    min-width: 460px;
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

  .ms-doc img {
    vertical-align: middle;
    margin-left: 30px;
  }

  .modify2 {
    width: 100%;
    min-height: 460px;
    margin-top: 5px;
    background: #FFFFFF;
    overflow: hidden;
  }

  .modify2 .el-form-item {
    display: inline-block;
  }

  .modify2 ul {
    width: 840px;
    height: 500px;
    left: 0;
    right: 0;
    margin: 30px auto;
    list-style: none;
  }

  .modify2 ul li {
    height: 42px;
    width: 100%;
    line-height: 42px;
    margin-top: 20px;
    vertical-align: middle;
    position: relative;
  }

  .el-select {
    width: 220px;
    height: 30px!important;
    margin-left:21px;
    margin-right: 50px;
  }

  .el-input--small .el-input__inner {
    height: 37px!important;
  }

  .city-select {
    height: 37px;
  }

  .el-input {
    width: 220px;
    height: 30px!important;
    font-size: 14px;
    color: #1f2d3d;
    margin-left: 20px;
    margin-right: 50px;
  }

  .modify2 ul .center {
    text-align: center;
  }

  .modify2 ul li .el-button {
    width: 114px;
    height: 33px;
    position: relative;
    margin-left: 50px;
    margin-right: 50px;
  }

  .inline-input {
    width: 240px;
    margin-left: 17px;
  }

  .el-autocomplete {
    width: 220px!important;
  }
</style>
