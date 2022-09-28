import { ColumnFilter } from './ColumnFilter'

export const COLUMNS = [
    {
        Header: 'רואה',
        accessor: 'see',
        Filter: ColumnFilter
    },
    {
        Header: 'מעריך',
        accessor: 'estimate',
        Filter: ColumnFilter
    },
    {
        Header: 'ממליץ',
        accessor: 'suggest',
        Filter: ColumnFilter
    },
    {
        Header: 'משתמש',
        accessor: 'user',
        Filter: ColumnFilter
    },
    {
        Header: 'תאריך עדכון אחרון',
        accessor: 'updatedAt',
        Filter: ColumnFilter
    },
]