if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    const filesaver = require('./filesaver');
    var saveAs = filesaver.saveAs;
}

function toString(data, cols) {
    let dataString = '';
    if (data.length === 0) return dataString;

    dataString += cols.map(col => {
                return col.name;
            }
        ).filter(col => {
            return typeof col !== 'undefined';
        }).join(',') + '\n';

    cols = cols.filter(col => {
        return col.field !== undefined;
    });

    data.map(function(row) {
        cols.map(function(col, i) {
            const { field, format, extraData } = col;
            const value = typeof format !== 'undefined' ? format(row[field], row, extraData) : row[field];
            const cell = typeof value !== 'undefined' ? ('"' + value + '"') : '';
            dataString += cell;
            if (i + 1 < cols.length) dataString += ',';
        });

        dataString += '\n';
    });

    return dataString;
}

const exportCSV = function(data, keys, filename) {
    const dataString = toString(data, keys);
    if (typeof window !== 'undefined') {
        saveAs(new Blob([ '\ufeff' +dataString ],
            { type: 'text/plain;charset=utf-8' }),
            filename, true);
    }
};

export default exportCSV;