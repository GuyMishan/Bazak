import React from 'react'

export const  GlobalFilter = ({filter, setFilter}) => {
    return (
      <>
            <span>
              {''}
                <input style={{borderRadius:'10px',marginBottom:'5px'}} placeholder= 'חיפוש גלובלי' value={filter || ''}
                onChange={ e => setFilter(e.target.value)}/>
            </span>
            </>

    )
}