import {ColumnFilter} from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'תפקיד',
        accessor:'jobname',
        Filter:ColumnFilter
    },
    {
        Header: 'קוד תפקיד',
        accessor:'jobcode',
        Filter:ColumnFilter

    },
    {
        Header: 'יחידה',
        accessor:'unit.name',
        Filter:ColumnFilter

    },
    {
        Header: 'מחלקה',
        accessor:'mahlaka',
        Filter:ColumnFilter
    },
    {
        Header: 'מגזר',
        accessor:'migzar',
        Filter:ColumnFilter

    },
    {
        Header: 'דרגת תקן',
        accessor:'rank',
        Filter:ColumnFilter
    },
    // {
    //     Header: 'הערות תפקיד',
    //     accessor:'jobremarks',
    //     Filter:ColumnFilter
    // },
    {
        Header: 'דמ"ח',
        accessor:'damah',
        Filter:ColumnFilter
    },
    {
        Header: 'פיקודי/מקצועי',
        accessor:'pikodi_or_mikzoi',
        Filter:ColumnFilter
    },
    // {
    //     Header: 'נתוני סף 1',
    //     accessor:'saf1',
    //     Filter:ColumnFilter
    // },
    // {
    //     Header: 'נתוני סף 2',
    //     accessor:'saf2',
    //     Filter:ColumnFilter
    // },
    // {
    //     Header: 'נתוני סף 3',
    //     accessor:'saf3',
    //     Filter:ColumnFilter
    // },
    // {
    //     Header: 'נתוני סף 4',
    //     accessor:'saf4',
    //     Filter:ColumnFilter
    // },
    {
        Header: 'מיקום',
        accessor:'location',
        Filter:ColumnFilter
    },
    {
        Header: 'יחידה פתוחה/סגורה',
        accessor:'ptoha_or_sgora',
        Filter:ColumnFilter
    },
    {
        Header: 'רמת פעילות',
        accessor:'peilut_level',
        Filter:ColumnFilter
    },
    // {
    //     Header: 'מאפייני תפקיד',
    //     accessor:'description',
    //     Filter:ColumnFilter
    // },
    // {
    //     Header: 'תרומת התפקיד לפרט',
    //     accessor:'job_contribution',
    //     Filter:ColumnFilter
    // },
    // {
    //     Header: 'יכולת חשיבה ותכנון',
    //     accessor:'thinking_ability',
    //     Filter:ColumnFilter
    // },
    // {
    //     Header: 'יחסים בין אישיים',
    //     accessor:'realtionship_ability',
    //     Filter:ColumnFilter
    // },
    // {
    //     Header: 'יכולת ניהול וארגון',
    //     accessor:'management_ability',
    //     Filter:ColumnFilter
    // },
    // {
    //     Header: 'מנהיגות ופיקוד',
    //     accessor:'leadership_ability',
    //     Filter:ColumnFilter
    // },
    {
        Header: 'סיווג',
        accessor:'sivug',
        Filter:ColumnFilter
    },
] 