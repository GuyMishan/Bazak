import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'יחידה',
        accessor: 'job.unit.name',
        Filter: ColumnFilter
    },
    {
        Header: 'תפקיד',
        accessor: 'job.jobname',
        Filter: ColumnFilter
    },
    {
        Header: 'ודאי/אופציה',
        accessor: 'certain',
        Filter: ColumnFilter
    },
    {
        Header: '',
        accessor: 'preferencerankings',
        Filter: ColumnFilter
    },
]