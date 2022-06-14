import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'שם מתמודד',
        accessor: 'candidate.user.name',
        Filter: ColumnFilter
    },
    {
        Header: 'יחידה',
        accessor: 'candidate.user.job.unit',
        Filter: ColumnFilter
    },
    {
        Header: 'תנועה',
        accessor: 'candidate.movement',
        Filter: ColumnFilter
    },
    {
        Header: 'מגזר',
        accessor: 'candidate.user.migzar',
        Filter: ColumnFilter
    },
    {
        Header: 'certjobpreferences',
        accessor: 'certjobpreferences',
        Filter: ColumnFilter
    },
    {
        Header: 'noncertjobpreferences',
        accessor: 'noncertjobpreferences',
        Filter: ColumnFilter
    },
]