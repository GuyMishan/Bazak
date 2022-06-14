import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'שם מתמודד',
        accessor: 'user.name',
        Filter: ColumnFilter
    },
    {
        Header: 'יחידה',
        accessor: 'user.job.unit.name',
        Filter: ColumnFilter
    },
    {
        Header: 'תנועה',
        accessor: 'movement.name',
        Filter: ColumnFilter
    },
    {
        Header: 'מגזר',
        accessor: 'user.migzar',
        Filter: ColumnFilter
    },
]