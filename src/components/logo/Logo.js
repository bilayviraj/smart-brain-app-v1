import React from 'react';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0 br2 shadow-2 grow' style={{ height: '150px', width: '150px', display: 'inline-block', position: 'absolute', left: '0'}}>
            <img style={{paddingTop: '25px'}} src={brain} alt='Brain'></img>
        </div>
    );
}

export default Logo;