/**
 * 注册的全局过滤器，主要用于格式化：钱数、打印点的一些属性
 * @time 2017-07-04 11:34:12 by 张晓东 为所有过滤器添加默认的返回值
 */

/**
 * 格式化money
 * 如果传入的不是数值返回为空
 * @export
 * @param {any} val 传入的钱数（分）
 * @returns 返回的钱数（元）
 */
export function formatMoney(val) {
  if (parseFloat(val).toString() === 'NaN') {
    return '';
  } else {
    return val / 100;
  }
}
/**
 * 格式化时间
 *@time 2017-07-05 09:20:12 by 甄景博
 */
export function formatTime(val) {
  var time = parseInt(val * 1000);
  var format = 'yyyy-MM-dd HH:mm';
  var t = new Date(time);
  var tf = function (i) {
    return (i < 10
      ? '0'
      : '') + i
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}
/**
 * 格式化纸型
 *
 * @export
 * @param {any} val 纸型ID
 * @returns 返回对应的纸型
 */
export function formatPaper(val) {
  if (val === 8) {
    return 'A3';
  } else if (val === 9) {
    return 'A4';
  } else if (val === 258) {
    return '扫描'
  } else if (val === 260) {
    return '发票'
  } else if (val === 281) {
    return '5寸'
  } else if (val === 285) {
    return '6寸'
  } else {
    return '未知纸型'
  }
}
/**
 * 格式化日期
 *
 * @export
 * @param {any} val
 * @returns
 */
export function formatDate(val) {
  var date = val.toString();
  var y = date.substring(0, 4);
  var m = date.substring(4, 6);
  var d = date.substring(6, 8);
  return y + "-" + m + "-" + d;
}
/**
 * 格式化类型
 *
 * @export
 * @param {any} val
 * @returns
 */
export function itemType(val) {
  if (val == 1) {
    return "货物"
  } else if (val == 2) {
    return "服务"
  } else {
    return "未知类型"
  }
}
export function itemPart(val) {
  if (val == 1) {
    return "国税"
  } else if (val == 2) {
    return "地税"
  } else {
    return "未知类型"
  }
}
/**
 * 格式化打印点收费标准对应的属性
 *
 * @export
 * @param {any} val 属性的对应值
 * @returns 支持的属性
 */
export function formatItemSN(val) {
  if (val === 2) {
    return '打印';
  } else if (val === 3) {
    return '复印';
  } else {
    return '未知属性';
  }
}

/**
 * 格式化激活码类型
 *
 * @export
 * @param {any} val 属性的对应值
 * @returns 支持的属性
 */
export function proKind(val) {
  if (val == 1) {
    return '多人一码'
  } else if (val == 2) {
    return '一人一码'
  } else {
    return "未知类型"
  }
}
/**
 * 格式化记录查询对应的属性
 *
 * @export
 * @param {any} val 属性的对应值
 * @returns 支持的属性
 */
export function formatType(val) {
  if ((val & 1) > 0) {
    return "打印";
  } else if ((val & 2) > 0) {
    return "复印";
  } else if ((val & 4) > 0) {
    return "扫描";
  } else {
    return '其他';
  }
}

/**
 * 格式化记录查询对应的颜色
 *
 * @export
 * @param {any} val 属性的对应值
 * @returns 支持的属性
 */
export function formatColor(val) {
  if ((val & 8) > 0) {
    return "彩色";
  } else if (val === "4294967295") {
    return "";
  } else {
    return "黑白"
  }
}
/**
 * 格式化文印点机型的显示
 *
 * @export
 * @param {any} typeId  对应的机型ID
 * @returns 返回对应的机型名称
 */
export function formatMachine(typeId) {
  if (value === 103) {
    return '施乐';
  } else if (value === 403) {
    return '理光';
  } else if (value === 503) {
    return 'EPSON';
  } else {
    return '未知机型'
  }
}
/**
 * 格式化退款来源
 *
 * @export
 * @param {any}
 * @returns
 */
export function formatOrigin(val) { // 格式化充值来源
  if (val === 1)
    return '微信';
  else if (val === 2)
    return '支付宝';
  else
    return '未知来源';
  }
/**
 * 格式化活动状态
 *
 * @export
 * @param {any}
 * @returns
 */
export function proState(val) {
  if (val == 1) {
    return "未开放"
  } else if (val == 2) {
    return "开放中"
  } else if (val == 4) {
    return "已结束"
  } else {
    return '未知类型'
  }
}
/**
 * 优惠码状态
 *
 * @export
 * @param {any}
 * @returns
 */
export function codeStat(val) {
  if (val === 1)
    return '未开放';
  else if (val === 2)
    return '开放中';
  else if (val === 4)
    return '已结束';
  else
    return "未知类型"
}
/**
 * 公司类型
 *
 * @export
 * @param {any}
 * @returns
 */
export function formatKind(val) {
  if (val === 1)
    return '平台所有者';
  else if (val === 2)
    return '投资商';
  else if (val === 4)
    return '运营商';
  else if (val === 8)
    return '耗材供应商';
  else if (val === 10)
    return '场地出租方';
  else if (val === 20)
    return '维保商';
  else if (val === 40)
    return '委托代开发票单位';
  else
    return "未知类型"
}
/**
 *
 * 管理员角色
 */
export function formatRole(val) {
  if (val === 257)
    return '超级管理员';
  else if (val === 1)
    return '普通管理员';
  else if (val === 516)
    return '运营商';
  else if (val === 513)
    return '商务';
  else if (val === 2049)
    return '数据统计员';
  else
    return "未知类型"
}
