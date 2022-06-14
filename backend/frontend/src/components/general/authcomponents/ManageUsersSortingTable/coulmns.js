import {ColumnFilter} from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'שם',
        Footer:'שם',
        accessor:'name',
        Filter:ColumnFilter
    },
    {
        Header: 'שם משפחה',
        Footer:'שם משפחה',
        accessor:'lastname',
        Filter:ColumnFilter

    },
    {
        Header: 'מספר אישי',
        Footer:'מספר אישי',
        accessor:'personalnumber',
        Filter:ColumnFilter

    },
    {
        Header: 'הרשאה',
        Footer:'הרשאה',
        accessor:'role',
        Filter:ColumnFilter
    },
    {
        Header: 'נוצר בתאריך',
        Footer:'נוצר בתאריך',
        accessor:'createdAt',
        Filter:ColumnFilter

    },
    {
        Header: 'עודכן בתאריך',
        Footer:'עודכן בתאריך',
        accessor:'updatedAt',
        Filter:ColumnFilter

    }
] 