import React, { createContext, useReducer }  from 'react'
import { reducer, ModalState, ModalAction, initialState } from './reducer'


type ModalContextValue = {
    state: ModalState,
    dispatch: React.Dispatch<ModalAction>
}


export const ModalContext = createContext<ModalContextValue>(undefined!)

const ModalContextProvider = ({ children }: React.PropsWithChildren)  => {

    const [state, dispatch] = useReducer(reducer, initialState)

   return (
    <ModalContext.Provider value={{ state, dispatch }}>
        {children}
    </ModalContext.Provider>
   )
}


export default ModalContextProvider;