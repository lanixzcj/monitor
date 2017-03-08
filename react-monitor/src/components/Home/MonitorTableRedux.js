const initialState = {
    all_data: {},
    data: [],
    loading: true,
    error: false,
};

export function loadMonitors(name, host, time='hour') {
    return {
        url: `http://192.168.3.106:8000/monitor/${name}/${host}?r=${time}`,
        types: [`LOAD_MONITOR_${name}`, `LOAD_MONITOR_SUCCESS_${name}`, `LOAD_MONITOR_ERROR_${name}`],
    };
}

export function loadAllMonitors(host, time='hour') {
    return {
        url: `http://192.168.3.106:8000/monitor/all/${host}?r=${time}`,
        types: [`LOAD_MONITOR`, `LOAD_MONITOR_SUCCESS`, `LOAD_MONITOR_ERROR`],
    };
}

export default function createReducerWithNamedType(name = '') {
    return (state = initialState, action) => {
        switch (action.type) {
            case `LOAD_MONITOR_${name}`: {
                return {
                    ...state,
                    loading: true,
                    error: false
                };
            }

            case `LOAD_MONITOR_SUCCESS_${name}`: {
                return {
                    ...state,
                    data: action.payload,
                    loading: false,
                    error: false
                };
            }

            case `LOAD_MONITOR_ERROR_${name}`: {
                return {
                    ...state,
                    loading: false,
                    error: true
                };
            }

            case `LOAD_MONITOR`: {
                return {
                    ...state,
                    loading: true,
                    error: false
                };
            }

            case `LOAD_MONITOR_SUCCESS`: {
                return {
                    ...state,
                    all_data: action.payload,
                    loading: false,
                    error: false
                };
            }

            case `LOAD_MONITOR_ERROR`: {
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
