import axios from '../utils/axios';
var path = process.env.NODE_ENV === 'production' ? '/opmmanager/api' : '/api';
/**
 * 首页所用用户数据显示
 *
 * @returns
 */
export function GetHomeUsers(config) {
  return axios.post(path + '/Utils.aspx?act=homeUsers', '', config);
}

/**
 * 首页所用报表数据
 *
 * @returns
 */
export function GetReportData(config) {
  return axios.post(path + '/Utils.aspx?act=homeReport', '', config);
}
