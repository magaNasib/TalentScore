import React, { useEffect, useRef, useState } from 'react'
import { CiEdit } from "react-icons/ci";
import { MdDone } from "react-icons/md";
import './editText.css'
import { Link } from 'react-router-dom';

function EditText({ className, text, children, url }: any) {

    const [editing, setEditing] = useState(false)

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState(text)
    const handleEditBtn = () => {
        setEditing(!editing)
    }

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight > textarea.clientHeight ? textarea.scrollHeight : textarea.clientHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [value]);


    const handleChange = (e: any) => {
        setValue(e.target.value)
        setValue(e.target.value);
        adjustTextareaHeight();
    };

    return (

        <div className={`${className}`}>

            {!editing &&
                <>
                    <p className={`${className}`}>

                        {
                            url ? (<><Link to={value} className='break-words inline items-center gap-1' target='_blank'> {children}{value}</Link></>) : <span>{value}</span>
                        }
                        <CiEdit onClick={() => setEditing(!editing)} className='editBtn ml-2 inline cursor-pointer shadow-sm rounded-full p-[.1rem] shadow-[#025C60]' />
                    </p>
                </>}

            {
                editing &&
                <>
                    <div className='flex items-center gap-2'>
                        <textarea
                            ref={textareaRef}
                            className='w-full p-1.5 text-black'
                            style={{ minHeight: '35px', border: '1px solid #ccc', fontSize: '1.1em' }}
                            value={value}
                            onChange={handleChange}
                        />
                        <MdDone onClick={handleEditBtn} className='text-[1.8em] cursor-pointer shadow-sm rounded-full p-[.1rem] shadow-[#025C60]' /></div>
                </>

            }
        </div>

    )
}

export default EditText

