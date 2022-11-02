import { ColumnFilter } from './ColumnFilter'

export const COLUMNS = [
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
        Header: 'סדיר/לא סדיר',
        accessor: 'issadir',
        Filter: ColumnFilter
    },
    {
        Header: 'תאריך עדכון אחרון',
        accessor: 'maxdate',
        Filter: ColumnFilter,
        sortType:'datetime'
    },
    {
        Header: 'תקין/לא תקין',
        accessor: 'istakin',
        Filter: ColumnFilter
    },
]