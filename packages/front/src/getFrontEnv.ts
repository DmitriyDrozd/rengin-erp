export default () => {
    const env = import.meta.env

    console.log('GetFrontEnv initialized ', env)
    return {
        RENGIN_MOCK_INPUTS:window.location.host.includes('rengin') ? false : (Boolean(env.RENGIN_MOCK_INPUTS) || false),
        RENGIN_LOG_ROCKET: env.RENGIN_LOG_ROCKET || undefined as string,
        ...env,
    }
}
