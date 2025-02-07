import {createSlice , configureStore} from '@reduxjs/toolkit'

const initialState = {
    loading : false,
    auth : false,
    userId : null,
}

const authSlice = createSlice(
    {
        name : "auth",
        initialState : initialState,
        reducers : {

            authRequest : (state) => {

                state.loading  = true

            },
            authSuccess : (state , action) => {

                state.auth = true
                state.userId = action.payload.userId
                localStorage.setItem("userId" ,  state.userId)
                state.loading = false

            },
            authFail : (state) => {
                state.auth = false
                state.userId = null
                state.loading = false
            },
            sucess : (state , action) => {
                state.loading = false
                state.auth = action.payload.auth
            },
            stopeRequest : (state) => {
                state.loading = false
            }
        }
    }
)

const store = configureStore(authSlice)

export default store
export const {authRequest , authFail , authSuccess , sucess,stopeRequest} = authSlice.actions