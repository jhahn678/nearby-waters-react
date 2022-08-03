import { DEFAULT_ERROR_TITLE } from "./constants"

export type ModalState = {
    showErrorModal: boolean,
    errorModalTitle: string,
    errorModalBody: string
}

export type ModalAction = 
|   { type: 'SHOW_ERROR_MODAL', title?: string, body: string }
|   { type: 'HIDE_ERROR_MODAL' }


export const initialState: ModalState = {
    showErrorModal: false,
    errorModalTitle: 'There was an error',
    errorModalBody: ''
}


export const reducer = (state: ModalState, action: ModalAction): ModalState => {
    if(action.type === 'SHOW_ERROR_MODAL'){
        return { 
            ...state, 
            showErrorModal: true ,
            errorModalTitle: action.title || DEFAULT_ERROR_TITLE,
            errorModalBody: action.body
        }
    }else if(action.type === 'HIDE_ERROR_MODAL'){
        return { 
            ...state, 
            errorModalTitle: DEFAULT_ERROR_TITLE,
            showErrorModal: false 
        }
    }else{
        return state;
    }
}