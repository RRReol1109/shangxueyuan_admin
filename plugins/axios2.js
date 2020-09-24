/*
 * @Author: your name
 * @Date: 2019-12-30 14:38:11
 * @LastEditTime : 2020-01-02 14:25:52
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /shangxueyuan_admin/plugins/axios2.js
 */
import axios from 'axios';
import { Message } from 'element-ui';
import qs from 'qs';
// import router from 'router'

axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://bs.hk.darkal.cn/';
axios.defaults.baseURL = 'http://bs.hk.darkal.cn/';


//http request 拦截器
axios.interceptors.request.use(
    config => {
        console.log('localStorage.getItem("message")::', localStorage.getItem("message"));
        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'authorization': localStorage.getItem("message")
        }
        return config;
    },
    error => {
        if (error.response && error.response.data && error.response.data.message) {
            Message.error({
                message: error.response.data.message
            });
        } else {
            Message.error({
                message: '服务器请求异常'
            });
        }
    }
);


//http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.code == 401) {
            location.href = '/shangxueyuan_admin/Login'
        }
        return response;
    },
    error => {
        if (error.response && error.response.data && error.response.data.message) {
            Message.error({
                message: error.response.data.message
            });
        } else {
            Message.error({
                message: '服务器响应异常'
            });
        }
    }
)



export default {
    $get: function (url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: params
            })
                .then(response => {
                    if (response) {
                        resolve(response.data);
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    $post: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(data))
                .then(response => {
                    if (response) {
                        resolve(response.data);
                    }
                }, err => {
                    reject(err)
                })
        })
    },
    $download: function (url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: params,
                responseType: 'blob'
            })
                .then(response => {
                    if (response) {
                        resolve(response.data);
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}