import { DEFAULT_ERROR_TITLE } from "./constants"

export type ModalState = {
    showErrorModal: boolean,
    errorModalTitle: string,
    errorModalBody: string,
    showConfirmModal: boolean,
    confirmModalTitle: string,
    confirmModalBody: string,
    selectedWaterbody: number | null,
    confirmType: 'DELETE' | 'EDIT' | null
}

export type ModalAction = 
|   { type: 'SHOW_ERROR_MODAL', title?: string, body: string }
|   { type: 'HIDE_ERROR_MODAL' }
|   { type: 'SHOW_CONFIRM_DELETE', selectedWaterbody: number }
|   { type: 'SUBMIT_CONFIRM' }
|   { type: 'CANCEL_CONFIRM' }


export const initialState: ModalState = {
    showErrorModal: false,
    errorModalTitle: 'There was an error',
    errorModalBody: '',
    showConfirmModal: false,
    confirmModalTitle: 'Confirm this action',
    confirmModalBody: '',
    selectedWaterbody: null,
    confirmType: null
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
    }
    else if(action.type === 'SHOW_CONFIRM_DELETE'){
        return {
            ...state,
            showConfirmModal: true,
            confirmModalBody: 'Are you sure you want to delete this resource?',
            selectedWaterbody: action.selectedWaterbody,
            confirmType: 'DELETE'
        }
    }
    else if(action.type === 'SUBMIT_CONFIRM'){
        return {
            ...state,
            showConfirmModal: false,
            confirmModalBody: '',
            selectedWaterbody: null,
            confirmType: null
        }
    }
    else if(action.type === 'CANCEL_CONFIRM'){
        return {
            ...state,
            showConfirmModal: false,
            confirmModalBody: '',
            selectedWaterbody: null,
            confirmType: null
        }
    }
    else{
        return state;
    }
}