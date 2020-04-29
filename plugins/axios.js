import { Message } from 'element-ui';
import qs from 'qs';

export default function ({ store, redirect, app: { $axios } }) {
    $axios.setHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    $axios.onRequest(config => {
        config.baseURL = 'http://bsoa.csu.edu.cn/bs/';
        console.log('config:::', store.state.token);
        // $axios.setHeader('authorization', store.state.token);
        if (config.method === 'post') {
            config.data = qs.stringify(config.data);
        }
    })

    $axios.onError(error => {
        // console.log('axios error', error);.
        const code = parseInt(error.response && error.response.status);
        if (code != 401) {
            Message.error({
                message: 'error'
            });
        }
        if (code === 400) {
            redirect('/400')
        }
    });

    $axios.onResponse(response => {
        console.log('axios response', response.data);
    });

    $axios.onRequestError((err, a, b, c) => {
        console.log('axios onRequestError', err);
    });

    $axios.onResponseError((err) => {
        console.log('axios onResponseError', err);
    });
}