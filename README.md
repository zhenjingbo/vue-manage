# 商户管理端项目

## 开发要求

 - 工具： `vscode`
 - 项目管理：`git`
 
## 代码规范
 - CSS部分
  这一部分命名，请尽量采用`BEM`命名法，如果一个样式在多个页面出现，请添加到公用的文件中去，而且要添加说明，比如：
```html
<style scoped>
    .modify {
      width: 100%;
      background: #FFFFFF;
      height: 48px;
      overflow: hidden;
    }
    
    .el-form-item {
      margin-top: 6px;
      margin-bottom: 6px;
    }
    
    .el-form {
      margin-bottom: 6px;
    }
    
    .el-form .el-button {
      margin-top: 10px;
      margin-left: 0px;
    }
</style>
```

> 上面的这一段代码在其它文件出现的次数极高，请考虑提取到main.css文件中，并加上说明！

```css
/*作用+时间+作者*/

/*子页面通用的框架 21017-07-03 张晓东*/

/* 如果是修改了，请添加修改备注*/
/*修改了一些样式 2017-07-04 xxx*/
.modify {
  width: 100%;
  background: #FFFFFF;
  height: 48px;
  overflow: hidden;
}

.el-form-item {
  margin-top: 6px;
  margin-bottom: 6px;
}

.el-form {
  margin-bottom: 6px;
}

.el-form .el-button {
  margin-top: 10px;
  margin-left: 0px;
}
```

 - JS部分
 请在不容易理解的方法前面添加注释，一个组件的代码不能过多，有重复的代码请进行封装和提取，不要直接复制（否则后期根本没办法维护）。谁写的东西写上自己的备注，修改的时候也要写。方法名要有意义不是随意起的(options1 、 options2)
```js
// 计算打印黑白的纸型总数    by张晓东 时间：2017-07-04
 printB(row, value) {
    var fee = row.dwPA4BPages + row.dwPA3BPages;
    return fee;
 }
 // 在单独的js文件中
 这样写
   /**
   * 格式化钱（由分转换为元）
   * @author 张晓东
   * @time 2017-07-03 
   * 
   * 修改了一些东西
   * @author xxx
   * @time xxxx
   *
   * @param {any} val
   */
  formatMoney(val) {
    if (parseFloat(val).toString() === 'NaN') {
      return '';
    } else {
      return val / 100;
    }
  },
```