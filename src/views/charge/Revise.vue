<template>
    <div>
    	<div class="air"></div>
    	<div class="ms-doc">
    		<img src="../../../static/img/revise.png"/>
        <span>修改收费标准</span> 
        </div>
        <div class="modify">
        	<ul>
        		<li>
        		<span class="spec">名&#12288;称</span><el-input v-model="input" placeholder="" ></el-input>         		
        		</li>
        		<li>
        		<span class="spec">身&#12288;份</span> <el-select v-model="value" placeholder="">
      <el-option
      v-for="item in options"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>	

        		</li>
        		<li>
        		<span class="spec">优先级</span> <el-select v-model="value" placeholder="" >
      <el-option
      v-for="item in options"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
        		</li>
        		<li>
        			<span class="spec">类&#12288;型</span> <el-select v-model="value" placeholder="" >
      <el-option
      v-for="item in options"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
        		</li>
        		<li>
        			<span class="spec">备&#12288;注</span><el-input v-model="input" placeholder="" ></el-input>
        		</li>
        		<li class="center">
        			<el-button type="primary" class="fl">提交</el-button>
        			<el-button class="fr"  onclick="window.history.go(-1)">返回</el-button>
        		</li>
        	</ul>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            	 input: '',
                tableData: [{
                    num: '1',
                    ident: '1507328',
                    name:'中山市奥图电子工程有限公司',
                    level:'总公司',
                    region:'广东省-中山市',
                    address: '东莞市长安镇步步高大道18号',
                    zip:'310312'
                }, {
                    date: '2',
                    name: '小天才',
                    address: '东莞市长安镇步步高大道17号',
                    tag: '公司'
                }, {
                    date: '3',
                    name: '小天才',
                    address: '东莞市长安镇步步高大道19号',
                    tag: '家'
                }, {
                    date: '4',
                    name: '小天才',
                    address: '东莞市长安镇步步高大道16号',
                    tag: '公司'
                }],
                options: [{
          value: '选项1',
          label: '省级运营商'
        }, {
          value: '选项2',
          label: '市级运营商'
        }, {
          value: '选项3',
          label: '县级运营商'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
            }
        },
        methods: {
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            }
        }
    }
</script>
<style scoped>
	.ms-doc{
        width:100%;
        min-width: 980px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        background: #FFFFFF;height: 50px;line-height: 50px;
    }
    .ms-doc span{
    	margin-left:5px;
    	font-family: 'microsoft yahei';
    	color: #13ce66;
    }
    .ms-doc img{
    	vertical-align: middle;
    	margin-left: 30px;
    }
    .modify{
    	width: 100%;
    	height:100%;
    	margin-top: 5px;
    	background: #FFFFFF;
    	overflow: hidden;
    }
    .modify ul{
    	width: 400px;
    	height:500px;
    	left: 0;
    	right: 0;
    	margin:30px auto;
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
    .el-select{
    	width:240px;
    	height: 37px;
    	margin-left: 16px;
    	margin-right: 50px;
    	
    }
    .el-input{
    	width:240px;
    	height:37px;
    	font-size: 16px;
    	color:#1f2d3d;
    	margin-left: 20px;
    	margin-right: 50px;
    }

    .modify ul .center{
    	text-align: center;
    }
    .modify ul li .el-button{
    	width: 114px;
    	height: 33px;
    	position: relative;
    /*	margin-left: 50px;*/
    	margin-right: 50px;
    }
</style>