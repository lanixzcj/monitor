const initialState = {
    hosts: [],
    loading: true,
    error: false,
};

export function loadHosts() {
    return {
        url: 'http://192.168.3.106:8000/ss/',
        types: ['LOAD_HOSTS', 'LOAD_HOSTS_SUCCESS', 'LOAD_HOSTS_ERROR']
    };
}

export function addTrustedHost(mac_address) {
    return {
        url: 'http://192.168.3.106:8000/trusted_hosts/',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'mac': mac_address
        }),
        types: ['ADD_TRUSTED_HOST', 'ADD_TRUSTED_HOST_SUCCESS', 'ADD_TRUSTED_HOST_ERROR']
    }
}

export function removeTrustedHost(mac_address) {
    return {
        url: 'http://192.168.3.106:8000/trusted_hosts/',
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            'mac': mac_address
         }),
        types: ['REMOVE_TRUSTED_HOST', 'REMOVE_TRUSTED_HOST_SUCCESS', 'REMOVE_TRUSTED_HOST_ERROR']
    }
}

export function changeQuery(e) {
    return {
        type: 'CHANGE_QUERY',
        payload: {
            query: e.target.value.trim()
        }
    };
}

export function search() {
    return (dispatch, getState) => {
        const {query} = getState().hosts.table;
        return dispatch(loadHOSTS(query));
    }
}

export default function hosts(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_QUERY': {
            return {
                ...state,
                query: action.payload.query
            };
        }

        case 'LOAD_HOSTS': {
            return {
                ...state,
                loading: true,
                error: false
            };
        }

        case 'LOAD_HOSTS_SUCCESS': {
            return {
                ...state,
                hosts: action.payload,
                loading: false,
                error: false
            };
        }

        case 'LOAD_HOSTS_ERROR': {
            return {
                ...state,
                loading: false,
                error: true
            };
        }

        case 'ADD_TRUSTED_HOST_SUCCESS':
        case 'REMOVE_TRUSTED_HOST_SUCCESS': {
            return {
                ...state,
                hosts: action.payload,
                loading: false,
                error: false
            };
        }


        default:
            return state;
    }
}
