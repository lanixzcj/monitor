const initialState = {
    data: [],
    loading: true,
    error: false,
};

export function loadArticles(name, host, time='hour') {
    return {
        url: `http://192.168.3.106:8000/monitor/${name}/${host}?r=${time}`,
        types: [`LOAD_ARTICLES_${name}`, `LOAD_ARTICLES_SUCCESS_${name}`, `LOAD_ARTICLES_ERROR_${name}`],
    };
}

export default  function createReducerWithNamedType(name = '') {
    return (state = initialState, action) => {
        switch (action.type) {
            case `LOAD_ARTICLES_${name}`: {
                return {
                    ...state,
                    loading: true,
                    error: false
                };
            }

            case `LOAD_ARTICLES_SUCCESS_${name}`: {
                return {
                    ...state,
                    data: action.payload,
                    loading: false,
                    error: false
                };
            }

            case `LOAD_ARTICLES_ERROR_${name}`: {
                return {
                    ...state,
                    loading: false,
                    error: true
                };
            }

            default:
                return state;
        }
    }
}
