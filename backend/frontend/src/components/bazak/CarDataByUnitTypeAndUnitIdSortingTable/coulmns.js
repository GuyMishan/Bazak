import { ColumnFilter } from './ColumnFilter'

function daysOff(row) {
    if (row.tipuls == undefined || row.tipuls.length == 0)
        return "";
    var today = new Date();
    var dates = [];
    for (var i = 0; i < row.tipuls.length; i++) {
        var x = row.tipuls[i];
        if ('takala_mizdamenet_date' in x && x['takala_mizdamenet_date'] != "")
            dates.push(x['takala_mizdamenet_date']);
        if ('tipul_entry_date' in x && x['tipul_entry_date'] != "")
            dates.push(x['tipul_entry_date']);
        if ('harig_tipul_date' in x && x['harig_tipul_date'] != "")
            dates.push(x['harig_tipul_date']);
    }
    if (dates.length == 0) {
        return ("לא הוזן תאריך")
    }
    var sorted = dates.sort(function (a, b) {
        return new Date(a) - new Date(b)
    });

    var unavailableFrom = new Date(sorted[0]);

    var timediff = Math.ceil((today.getTime() - unavailableFrom.getTime()) / (1000 * 3600 * 24));

    return String(timediff)
}

export const COLUMNS = [
    {
        Header: "צ'",
        accessor: 'carnumber',
        Filter: ColumnFilter
    },
    {
        Header: 'מאגד על',
        accessor: 'magadal',
        Filter: ColumnFilter
    },
    {
        Header: 'מאגד',
        accessor: 'magad',
        Filter: ColumnFilter
    },
    {
        Header: 'מקבץ',
        accessor: 'mkabaz',
        Filter: ColumnFilter
    },
    {
        Header: 'מק"ט',
        accessor: 'makat',
        Filter: ColumnFilter
    },
    {
        Header: 'תיאור מק"ט',
        accessor: 'makat_description',
        Filter: ColumnFilter
    },
    {
        Header: 'משפחה',
        accessor: 'family',
        Filter: ColumnFilter
    },
    {
        Header: 'פיקוד',
        accessor: 'pikod',
        Filter: ColumnFilter
    },
    {
        Header: 'אוגדה',
        accessor: 'ogda',
        Filter: ColumnFilter
    },
    {
        Header: 'חטיבה',
        accessor: 'hativa',
        Filter: ColumnFilter
    },
    {
        Header: 'גדוד',
        accessor: 'gdod',
        Filter: ColumnFilter
    },
    {
        Header: 'פלוגה',
        accessor: 'pluga',
        Filter: ColumnFilter
    },
    {
        Header: 'שבצ"ק',
        accessor: 'shabzak',
        Filter: ColumnFilter
    },
    {
        Header: 'מיקום בימ"ח',
        accessor: 'mikum_bimh',
        Filter: ColumnFilter
    },
    {
        Header: 'מעמד הכלי',
        accessor: 'stand',
        Filter: ColumnFilter
    },
    {
        Header: 'סטאטוס הכלי',
        accessor: 'status',
        Filter: ColumnFilter
    },
    {
        Header: 'זמינות',
        accessor: 'zminot',
        Filter: ColumnFilter
    },
    {
        Header: 'כשירות למלחמה',
        accessor: 'kshirot',
        Filter: ColumnFilter
    },
    {
        Header: 'ימי שהייה',
        accessor: daysOff,
        Filter: ColumnFilter
    },
    {
        Header: 'מיקום',
        accessor: 'mikum',
        Filter: ColumnFilter
    },
    {
        Header: 'מועד כיול אחרון',
        accessor: 'latest_recalibration_date',
        Filter: ColumnFilter
    },
    {
        Header: 'סיבות אי-זמינות',
        accessor: 'tipuls',
        Filter: ColumnFilter
    },
    {
        Header: 'תאריך עדכון אחרון',
        accessor: 'updatedAt',
        Filter: ColumnFilter
    },
]