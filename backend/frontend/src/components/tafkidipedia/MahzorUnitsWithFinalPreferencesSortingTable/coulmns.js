import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'יחידה',
        accessor: 'unit.name',
        Filter: ColumnFilter
    },
    {
        Header: 'תפקידים ביחידה בדש"ב',
        accessor: 'numberofjobs',
        Filter: ColumnFilter
    },
    {
        Header: 'תפקידים ביחידה בדש"ב - עם העדפות',
        accessor: 'numberofjobpreferences',
        Filter: ColumnFilter
    },
]