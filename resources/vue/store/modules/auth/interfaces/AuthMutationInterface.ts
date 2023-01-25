interface mutations {
    logout(state): void

    clearErrors(state, data): void

    setToken(state, token): void

    setTokens(state, tokens): void

    setErrors(state, data): void

    setAuthErrors(state, errors): void
}

export default mutations