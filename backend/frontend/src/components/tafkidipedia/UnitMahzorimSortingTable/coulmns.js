import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'אוכלוסייה',
        accessor: 'population.name',
        Filter: ColumnFilter
    },
    // {
    //     Header: 'תאריך התחלה',
    //     accessor: 'startdate',
    //     Filter: ColumnFilter
    // },
    // {
    //     Header: 'תאריך סיום',
    //     accessor: 'enddate',
    //     Filter: ColumnFilter
    // },
    {
        Header: 'עונת איוש',
        accessor: 'season',
        Filter: ColumnFilter
    },
    {
        Header: 'סטטוס מחזור',
        accessor: 'status',
        Filter: ColumnFilter
    },
]