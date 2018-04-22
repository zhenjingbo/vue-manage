/**
 * 利用Vue混合(mixins)特性，把远程请求运营商的功能封装到这里
 */
import api from '../api/';
export default {
  data () {
    return {
       companySelect: [] // 运营商数据
    }
  },
  methods: {
    // 远程获取的运营商
    remoteCompany() {
      api.GetCompanySelect().then((res) => {
        this.companySelect = res.data.data.rows
      })
    }
  }
}
