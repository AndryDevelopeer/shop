import MutationInterface from "./interfaces/AuthMutationInterface";
import ActionInterface from "./interfaces/AuthActionInterface";
import StateInterface from "./interfaces/AuthStateInterface";
import ModuleInterface from "../ModuleInterface";
import router from "../../../router";
import axios from "axios";

const AUTH_URL = 'http://localhost:4000/api'
const $axios = axios.create({
    withCredentials: true,
    baseURL: AUTH_URL
})
/*$axios.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem('accessToken');
    return config;
});*/

const state: StateInterface = {
    authentication: {
        form: {
            email: null,
            password: null,
        },
        errors: {
            email: null,
            password: null
        },
    },
    registration: {
        form: {
            email: null,
            password: null,
            confirm: null
        },
        errors: {
            email: null,
            password: null,
            confirm: null
        }
    },
    client: null,
    successCheckRefresh: false,
    successAccess: false,
}

const mutations: MutationInterface = {
    logout(state): void {
        document.cookie = "accessToken=''; max-age=0; path=/;"
        window.localStorage.removeItem('refreshToken')
        state.client = null
        router.replace('/')
    },
    clearErrors(state, data: { form: string, field: string }): void {
        state[data.form].errors[data.field] = null
    },
    setToken(state, token: string): void {
        document.cookie = "accessToken=" + token + "; max-age=900; path=/;"
        state.successCheckRefresh = true
        state.successAccess = true
    },
    setTokens(state, tokens: { accessToken: string, refreshToken: string }): void {
        document.cookie = "accessToken=" + tokens.accessToken + "; max-age=900; path=/;"
        window.localStorage.setItem('refreshToken', tokens.refreshToken)
        state.successAccess = true
        state.form.password = null
        state.form.email = null
    },
    setErrors(state, data: { form, errors }): void {
        state[data.form].errors.email = data.errors.email
        state[data.form].errors.password = data.errors.password
        state.successCheckRefresh = false
    },
    setAuthErrors(state, errors: { param, value }[]): void {
        errors.forEach(el => {
            state.errors[el.param] = el.value;
        })
    }
}

const actions: ActionInterface = {
    logout({commit}): void {
        commit('logout')
    },
    clearErrors({commit}, data: object) {
        commit('clearErrors', data)
    },
    registration(context) {
        $axios.post('/registration', context.state.registration.form)
            .then(response => {
                console.log(response);
            })
    },
    login(context): void {
        axios.post(AUTH_URL + '/login', context.state.authentication.form)
            .then(response => {
                console.log(response);
                const result = response?.data
                result?.success
                    ? context.commit('setTokens', result.data)
                    : context.commit('setErrors', {form: 'authentication', errors: result.errors})
            })
            .then(() => {
                if (!context.state.successAccess) return;
                router.replace('personal')
            })
            .catch((error) => {
                context.commit('setErrors', {form: 'authentication', errors: error.response.data.errors})
            })
    },
    develop(context): void {
        const instance = axios.create({
            withCredentials: true,
            baseURL: AUTH_URL
        })
        instance.get('/develop')
        //axios.get(AUTH_URL + '/develop', {withCredentials: true})
    },
    checkRefresh(context): void {
        axios.post('/api/auth/check-refresh-token',
            {'refreshToken': window.localStorage.getItem('refreshToken')})
            .then(response => {
                const result = response.data
                result.success
                    ? context.commit('setToken', result.data.accessToken)
                    : router.replace('auth')
            })
            .then(() => {
                if (!context.state.successCheckRefresh || !context.state.successAccess) return;
                context.dispatch('getUserData')
            })
            .catch((error) => {
                console.log('что то пошле не так');
            })
    }
}

const AuthModule: ModuleInterface = {
    state: state,
    mutations: mutations,
    actions: actions,
}

export default AuthModule