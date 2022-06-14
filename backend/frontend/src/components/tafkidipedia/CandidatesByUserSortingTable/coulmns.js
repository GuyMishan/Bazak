import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'אוכלוסייה',
        accessor: 'mahzor.population.name',
        Filter: ColumnFilter
    },
    {
        Header: 'עונת איוש',
        accessor: 'mahzor.season',
        Filter: ColumnFilter
    },
    {
        Header: 'סטטוס מחזור',
        accessor: 'mahzor.status',
        Filter: ColumnFilter
    },
]