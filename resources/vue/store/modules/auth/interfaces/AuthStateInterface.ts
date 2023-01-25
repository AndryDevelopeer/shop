interface state {
    authentication: {
        form: object
        errors: object
    }
    registration: {
        form: object
        errors: object
    }
    successCheckRefresh: boolean
    successAccess: boolean
    client: object
}

export default state