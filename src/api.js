import axios from "axios";
import { message } from 'antd'

const http = axios.create({
    withCredentials: true,
    timeout: 3000
})

const responseDataHandler = response => {
    const data = response.data
    if (!data || typeof (data) == 'string') {
        message.error('请求失败，请重试')
        return Promise.resolve(false)
    }
    if (data.errmsg) {
        message.error(data.errmsg)
    }
    if (data.redirect) {
        window.location.href = data.redirect
    }
    if (data.errno === 0) {
        let ret = data.data
        if (ret === undefined) ret = true;
        return Promise.resolve(ret)
    }
    return Promise.resolve(false)
}

const responseErrorHandler = e => {
    message.error('请求失败，请重试[' + e.message + ']')
    return Promise.resolve(false)
}

http.interceptors.response.use(responseDataHandler, responseErrorHandler);

const API_BASE = '/api/v1'
const api = {
    http: {
        gets: async () => {
            return http.get(API_BASE + '/http-vhost')
        },
        get: async domain => {
            return http.get(API_BASE + '/http-vhost/' + encodeURIComponent(domain))
        },
        add: async v => {
            return http.post(API_BASE + '/http-vhost', v)
        },
        del: async domain => {
            return http.delete(API_BASE + '/http-vhost/' + encodeURIComponent(domain))
        },
        mod: async v => {
            return http.patch(API_BASE + '/http-vhost', v)
        },
    },

    https: {
        gets: async () => {
            return http.get(API_BASE + '/https-vhost')
        },
        get: async domain => {
            return http.get(API_BASE + '/https-vhost/' + encodeURIComponent(domain))
        },
        add: async v => {
            return http.post(API_BASE + '/https-vhost', v)
        },
        del: async domain => {
            return http.delete(API_BASE + '/https-vhost/' + encodeURIComponent(domain))
        },
        mod: async v => {
            return http.patch(API_BASE + '/https-vhost', v)
        },
    },

    http3: {
        gets: async () => {
            return http.get(API_BASE + '/http3-vhost')
        },
        get: async domain => {
            return http.get(API_BASE + '/http3-vhost/' + encodeURIComponent(domain))
        },
        add: async v => {
            return http.post(API_BASE + '/http3-vhost', v)
        },
        del: async domain => {
            return http.delete(API_BASE + '/http3-vhost/' + encodeURIComponent(domain))
        },
        mod: async v => {
            return http.patch(API_BASE + '/http3-vhost', v)
        },
    },

    cert: {
        gets: async () => {
            return http.get(API_BASE + '/cert')
        },
        get: async name => {
            return http.get(API_BASE + '/cert/' + encodeURIComponent(name))
        },
        add: async v => {
            return http.post(API_BASE + '/cert', v)
        },
        del: async name => {
            return http.delete(API_BASE + '/cert/' + encodeURIComponent(name))
        },
        mod: async v => {
            return http.patch(API_BASE + '/cert', v)
        },
    },

    api: {
        getConfig: async () => {
            return http.get(API_BASE + '/api-config')
        },
        setConfig: async v => {
            return http.post(API_BASE + '/api-config', v)
        },
    },

    vhost: {
        getListen: async () => {
            return http.get(API_BASE + '/vhost-listen')
        },
        setListen: async v => {
            return http.post(API_BASE + '/vhost-listen', v)
        },
    },

    reload: async () => {
        const url = API_BASE + '/reload'
        const config = {
            withCredentials: true,
            timeout: 5000,
        }
        const errHandler = e => {
            if (e.response) {
                if (e.response.status === 0 || e.response.status === 504)
                    return Promise.resolve(true);
            }
            message.error('请求失败，请重试[' + e.message + ']')
            return Promise.resolve(false)
        }
        const client = axios.create(config)
        client.interceptors.response.use(responseDataHandler, errHandler);
        return client.get(url)
    },

    save: async() => {
        return http.get(API_BASE + '/save')
    }
}

export default api