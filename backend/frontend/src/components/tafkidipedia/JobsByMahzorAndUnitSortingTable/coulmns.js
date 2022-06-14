import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'תפקיד',
        accessor: 'job.jobname',
        Filter: ColumnFilter
    },
    {
        Header: 'יחידה',
        accessor: 'job.unit.name',
        Filter: ColumnFilter
    },
    {
        Header: 'מגזר',
        accessor: 'job.migzar',
        Filter: ColumnFilter
    },
    {
        Header: 'אופי התפקיד',
        accessor: 'job.pikodi_or_mikzoi',
        Filter: ColumnFilter
    },
    // {
    //     Header: 'ודאי/אופציה',
    //     accessor: 'job.certain',
    //     Filter: ColumnFilter
    // },
]