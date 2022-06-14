import { Button } from 'reactstrap'
import React from 'react'
import searchpic from "assets/img/search.png";

export const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column
    const [collapseOpen, setcollapseOpen] = React.useState(false);

    const toggleCollapse = () => {
        setcollapseOpen(!collapseOpen);
    };

    return (
        <>     
         {/* {collapseOpen ?
            <>
                <span >
                    <input style={{ borderRadius: '10px', width: '5rem' }} placeholder='חיפוש חופשי' value={filterValue || ''}
                        onChange={e => setFilter(e.target.value)} />
                </span>
                <Button onClick={() => toggleCollapse()} style={{ padding: '0.5rem' }}>
                    <img src={searchpic} alt="searchpic" style={{ height: '1rem' }} />
                </Button>
            </>
            : <Button onClick={() => toggleCollapse()} style={{ padding: '0.5rem' }}>
                <img src={searchpic} alt="searchpic" style={{ height: '1rem' }} />
            </Button>} */}
        </>
    )
}