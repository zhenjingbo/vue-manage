/**
 * 系统默认一些工具函数或者是通用的变量
 */

// 全局系统默认的element ui datapicker 配置
export const pickerOptions = [{
  text: '今天',
  onClick(picker) {
    picker.$emit('pick', new Date());
  }
}, {
  text: '昨天',
  onClick(picker) {
    const date = new Date();
    date.setTime(date.getTime() - 3600 * 1000 * 24);
    picker.$emit('pick', date);
  }
}, {
  text: '一周前',
  onClick(picker) {
    const date = new Date();
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
    picker.$emit('pick', date);
  }
}, {
  text: '一个月前',
  onClick(picker) {
    const date = new Date();
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
    picker.$emit('pick', date);
  }
}, {
  text: '三个月前',
  onClick(picker) {
    const date = new Date();
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
    picker.$emit('pick', date);
  }
}]
//结束日期配置
export const pickerOptions1 = [{
  text: '今天',
  onClick(picker) {
    picker.$emit('pick', new Date());
  }
}, {
  text: '昨天',
  onClick(picker) {
    const date = new Date();
    date.setTime(date.getTime() - 3600 * 1000 * 24);
    picker.$emit('pick', date);
  }
}, {
  text: '一周前',
  onClick(picker) {
    const date = new Date();
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
    picker.$emit('pick', date);
  }
}]
//优惠码状态选项
export const codeOption = [{
  value: '1',
  label: '未开放'
}, {
  value: '2',
  label: '开放中'
}, {
  value: '4',
  label: '已结束'
}]
//新建管理员角色选项
export const roleSelect = [
        {
          value: '1',
          label: '普通管理员'
        }, {
          value: '516',
          label: '运营商'
        }, {
          value: '513',
          label: '商务'
        }, {
          value: '2049',
          label: '数据统计员'
        }
]
// 根据传入的数据返回给平台用量的options
export function getDosageOptions(data) {
  var sum = data.dwCA3BPages+data.dwCA4BPages+data.dwCA3CPages+data.dwCA4CPages+data.dwPA3BPages+data.dwPA4BPages+data.dwPA3CPages+data.dwPA4CPages+data.dwSBPages+data.dwSCPages
  var option = {
    color: ["#20a0ff", "#13CE66", "#F7BA2A", "#FF4949", "#61a0a8"],
    title: {
      text: 'JustPrint平台用量图',
      subtext: '平台用量：' + sum,
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['打印', '复印', '扫描']
    },
    series: [{
      name: '用量',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [{
          value: data.dwPA3BPages+data.dwPA4BPages+data.dwPA3CPages+data.dwPA4CPages,
          name: '打印'
        },
        {
          value: data.dwCA3BPages+data.dwCA4BPages+data.dwCA3CPages+data.dwCA4CPages,
          name: '复印'
        },
        {
          value: data.dwSBPages+data.dwSCPages,
          name: '扫描'
        }
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        normal: {
          label: {
            show: true,
            formatter: '{b} : {c} ({d}%)'
          },
          labelLine: {
            show: true
          }
        }
      }
    }]
  }
  return option;
}

// 根据数据，返回平台费用所用的options
export function getCostOptions(data) {
  var option = {
    color: ["#20a0ff", "#13CE66", "#F7BA2A", "#FF4949", "#61a0a8"],
    title: {
      text: 'JustPrint平台消费图',
      subtext: (data.dwPlatFormMoney + data.dwSubsidy + data.dwThirdMoney)/100+'元',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['平台', '补助', '第三方']
    },
    series: [{
      name: '消费',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [{
          value: data.dwPlatFormMoney/100,
          name: '平台'
        },
        {
          value: data.dwSubsidy/100,
          name: '补助'
        },
        {
          value: data.dwThirdMoney/100,
          name: '第三方'
        }
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        normal: {
          label: {
            show: true,
            formatter: '{b} : {c} ({d}%)'
          },
          labelLine: {
            show: true
          }
        }
      }
    }]
  }
  return option;
}
