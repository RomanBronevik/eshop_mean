
import { EshopActions } from '../../store/actions';
import { User } from '../../shared/models';


export interface State {
  loading: boolean;
  user: User;
  lang: string;
  currency: string;
  convertVal: number;
}

 export const initialState: State = {
    loading: false,
    user: null,
    lang: '',
    currency: 'EUR',
    convertVal: 0
};


export function appReducer(state = initialState, action): State {
  switch (action.type) {

    case EshopActions.GetUser: {
      return { ...state, loading: true };
    }

    case EshopActions.StoreUser: {
      return { ...state, user: action.payload, loading: false };
    }

    case EshopActions.GetUserFail: {
      return { ...state, user: action.payload, loading: false };
    }

    case EshopActions.SignInSuccess: {
      return { ...state, user: action.payload };
    }

    case EshopActions.ChangeLanguage: {
      return {...state, lang: action.payload.lang, currency: action.payload.currency, convertVal: 0 };
    }


    default: {
      return state;
    }
  }
}

export const user = (state: State) => state.user;
export const lang = (state: State) => state.lang;
export const currency = (state: State) => state.currency;
export const convertVal = (state: State) => state.convertVal;
export const loading = (state: State) => state.loading;
