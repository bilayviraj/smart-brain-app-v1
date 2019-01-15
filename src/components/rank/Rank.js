import React from 'react';


const Rank = ({ userName, entries }) => {
    return (
        <div>
            <div className='white f3' style={{display: 'inline-block'}}>
            { userName + ', your total entries are...  ' + entries}
            </div>
        </div>
    );
}

export default Rank;