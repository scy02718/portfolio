import React from 'react'

const Button = ({ name, isBeam = false, containerClass }) => {
    // When isBeam is true, we can render a <span> element
    // This span element will contain two child elements, used for the beam effect
    return (
        <button className={`btn ${containerClass}`}>
            {isBeam && (
                <span className='relative flex h-3 w-3'>
                    <span className='btn-ping' />
                    <span className='btn-ping_dot' />
                </span>
            )}
            {name}
        </button>
    )
}

export default Button