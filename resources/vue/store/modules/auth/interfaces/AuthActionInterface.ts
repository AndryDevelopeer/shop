interface actions {
    logout({commit}): void

    clearErrors({commit}, data): void

    registration(context): void

    login(context): void

    checkRefresh(context): void

    develop(context): void
}

export default actions