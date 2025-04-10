import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = 'text',
    className = '',
    ...props
}, ref){
    const id = useId();
    return (
        <div className='w-full'>
            { label &&
            <label className='inline-block mb-1 pl-1'
            htmlFor={id}>
                {label}
            </label> }
            <input
            type={type}
            className={`px-3 py-2 rounded-lg w-full bg-white text-black outline-none duration-200 border border-gray-200 focus:bg-gray-50 ${className}`}
            id={id}
            ref={ref}
            {...props}
            />
        </div>
    )
})

export default Input