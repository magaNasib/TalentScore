import React, { useState } from 'react'
import ImageModal from './ImageModal'
import { Link } from 'react-router-dom'

interface DataElem {
    file_category: string
    file: string
    path: string
    state?: any
}

interface DocumentProps {
    data: DataElem[]
}

const Document: React.FC<DocumentProps> = ({ data }) => {
    console.log(data);
    
    const checkButtonText = (type: string | undefined) => {
        return type === 'Career planning' ? 'Open Report' : `Open ${type}`
    }

    const [image, setImage] = useState<DataElem | null>(null)
    const [open, setOpen] = useState<boolean>(false)

    const launchModal = (file: DataElem) => {
        setOpen(true)
        setImage(file)
    }

    return (
        <>
            <div className='flex flex-wrap gap-28 justify-center'>
                {
                    data.map((elem, i) => (
                        <div key={i} className={`group ${elem.file_category === 'CERTIFICATE' ? 'w-[169px]' : 'w-[136px]'}`}>
                            <div className='flex justify-between elems-center relative'>
                                <p className='group-hover:text-black text-[#7c7c7c] transition duration-[0.35s]'>{elem.file_category}</p>
                                {
                                    elem.file_category !== 'REPORT' && (
                                        <svg
                                            className='absolute right-0'
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='24'
                                            height='24'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                        >
                                            <path d='M5 18H19M5 14H19L20 5L16 8L12 3L8 8L4 5L5 14Z' stroke='#FFA723' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                        </svg>
                                    )
                                }
                            </div>
                            <div className={`${elem.file_category === 'CERTIFICATE' ? 'h-[118px]' : 'h-[190px]'} group-hover:opacity-100 group-hover:border-qss-secondary overflow-hidden cursor-zoom-in transition duration-[0.35s] relative border-[1px] border-[#bcbcbc] opacity-60 mt-[10px] mb-8`}>
                                <img
                                    className='object-cover'
                                    src={elem.file}
                                    alt={elem.file_category}
                                    onClick={() => { launchModal(elem) }}
                                />
                                <svg
                                    className='absolute right-[4px] bottom-[4px]'
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='18'
                                    height='18'
                                    viewBox='0 0 18 18' fill='none'
                                >
                                    <path d='M3.4 16H5C5.28334 16 5.521 16.096 5.713 16.288C5.905 16.48 6.00067 16.7173 6 17C6 17.2833 5.904 17.521 5.712 17.713C5.52 17.905 5.28267 18.0007 5 18H1C0.71667 18 0.479003 17.904 0.287003 17.712C0.0950034 17.52 -0.000663206 17.2827 3.46021e-06 17V13C3.46021e-06 12.7167 0.0960036 12.479 0.288004 12.287C0.480004 12.095 0.717337 11.9993 1 12C1.28334 12 1.521 12.096 1.713 12.288C1.905 12.48 2.00067 12.7173 2 13V14.6L4.4 12.2C4.58334 12.0167 4.81667 11.925 5.1 11.925C5.38334 11.925 5.61667 12.0167 5.8 12.2C5.98334 12.3833 6.075 12.6167 6.075 12.9C6.075 13.1833 5.98334 13.4167 5.8 13.6L3.4 16ZM14.6 16L12.2 13.6C12.0167 13.4167 11.925 13.1833 11.925 12.9C11.925 12.6167 12.0167 12.3833 12.2 12.2C12.3833 12.0167 12.6167 11.925 12.9 11.925C13.1833 11.925 13.4167 12.0167 13.6 12.2L16 14.6V13C16 12.7167 16.096 12.479 16.288 12.287C16.48 12.095 16.7173 11.9993 17 12C17.2833 12 17.521 12.096 17.713 12.288C17.905 12.48 18.0007 12.7173 18 13V17C18 17.2833 17.904 17.521 17.712 17.713C17.52 17.905 17.2827 18.0007 17 18H13C12.7167 18 12.479 17.904 12.287 17.712C12.095 17.52 11.9993 17.2827 12 17C12 16.7167 12.096 16.479 12.288 16.287C12.48 16.095 12.7173 15.9993 13 16H14.6ZM2 3.4V5C2 5.28334 1.904 5.521 1.712 5.713C1.52 5.905 1.28267 6.00067 1 6C0.71667 6 0.479003 5.904 0.287003 5.712C0.0950034 5.52 -0.000663206 5.28267 3.46021e-06 5V1C3.46021e-06 0.71667 0.0960036 0.479003 0.288004 0.287003C0.480004 0.0950034 0.717337 -0.000663206 1 3.46021e-06H5C5.28334 3.46021e-06 5.521 0.0960036 5.713 0.288004C5.905 0.480004 6.00067 0.717337 6 1C6 1.28334 5.904 1.521 5.712 1.713C5.52 1.905 5.28267 2.00067 5 2H3.4L5.8 4.4C5.98334 4.58334 6.075 4.81667 6.075 5.1C6.075 5.38334 5.98334 5.61667 5.8 5.8C5.61667 5.98334 5.38334 6.075 5.1 6.075C4.81667 6.075 4.58334 5.98334 4.4 5.8L2 3.4ZM16 3.4L13.6 5.8C13.4167 5.98334 13.1833 6.075 12.9 6.075C12.6167 6.075 12.3833 5.98334 12.2 5.8C12.0167 5.61667 11.925 5.38334 11.925 5.1C11.925 4.81667 12.0167 4.58334 12.2 4.4L14.6 2H13C12.7167 2 12.479 1.90434 12.287 1.713C12.095 1.52167 11.9993 1.284 12 1C12 0.71667 12.096 0.479003 12.288 0.287003C12.48 0.0950034 12.7173 -0.000663206 13 3.46021e-06H17C17.2833 3.46021e-06 17.521 0.0960036 17.713 0.288004C17.905 0.480004 18.0007 0.717337 18 1V5C18 5.28334 17.904 5.521 17.712 5.713C17.52 5.905 17.2827 6.00067 17 6C16.7167 6 16.479 5.904 16.287 5.712C16.095 5.52 15.9993 5.28267 16 5V3.4Z' fill='#1E877C' />
                                </svg>
                            </div>
                            <Link to={{pathname:`/profile/${elem.file_category.toLowerCase()}`}} state={elem || {}}>
                            <button className='w-full group-hover:bg-qss-secondary group-hover:text-white transition duration-[0.35s] text-xs py-[6.5px] px-[13px] rounded-[15px] cursor-pointer border-[1px] border-qss-secondary text-qss-secondary'>{checkButtonText(elem.file_category)}</button>
                        </Link>
                        </div>
            ))
                }
        </div >
            <ImageModal open={open} setOpen={setOpen} image={image} />
        </>
    )
}

export default Document
