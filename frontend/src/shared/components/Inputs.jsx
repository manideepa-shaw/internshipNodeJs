import React from 'react'

const Inputs = (props) => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return (
        <label for={props.field} className='block m-2'>
            <div className="text-red-600 font-bold inline">* </div>{capitalize(props.field)}
            <input type={props.type} name={props.field}
                className='mx-2 px-2 w-full border-b-[1px] border-blue-400 focus:outline-none focus:border-b-2'
                value={props.formData[props.field]}
                onChange={props.inputHandler} required />
        </label>
    )
}

export default Inputs