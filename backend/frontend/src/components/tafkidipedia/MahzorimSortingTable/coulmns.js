import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'אוכלוסייה',
        accessor: 'population',
        Filter: ColumnFilter
    },
    {
        Header: 'עונת איוש',
        accessor: 'season',
        Filter: ColumnFilter
    },
    {
        Header: 'שלב',
        accessor: 'status',
        Filter: ColumnFilter
    },
]