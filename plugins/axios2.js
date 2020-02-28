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
axios.defaults.baseURL = 'http://bsart.zz.kuangyeyuan.com/';


//http request 拦截器
axios.interceptors.request.use(
    config => {
        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'authorization': localStorage.getItem("message")
        }
        return config;
    },
    error => {
        if (error.response.status === 500) {
            Message.error({
                message: error.response.data.message
            });
        }
        return Promise.reject(error);
    }
);


//http response 拦截器
axios.interceptors.response.use(
    response => {
        console.log("response.status", response);
        if (response.data.code == 401) {
            // router.push({
            //     path: "/login",
            //     querry: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
            // })
            location.href = 'Login'
        }
        return response;
    },
    error => {
        console.log('error.response---->', error.response);
        Message.error({
            message: '请求失败！'
        });
        return Promise.reject(error)
    }
)



export default {
    $get: function (url, params = {}) {
        console.log('进入get方法', url, params);
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: params
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    $post: function (url, data = {}) {
        console.log('进入post方法', url, data);
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(data))
                .then(response => {
                    resolve(response.data);
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
                    resolve(response.data);
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}