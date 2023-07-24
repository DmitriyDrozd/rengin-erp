import * as fsa from '@sha/fsa'

const factory = fsa.actionCreatorFactory('command', {persistent: true})

export const commands = {
    setPassword: factory<{ password: string, resetPasswordGuid: string }>('setPassword'),
    resetPassword: factory<{ email: string, resetPasswordGuid: string }>('resetPassword'),
    registerUser: factory<UserVO>('registerUser'),
}

export default commands

