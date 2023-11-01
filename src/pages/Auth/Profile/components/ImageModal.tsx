import React from 'react'
import { Backdrop, Box, Modal, Fade } from '@mui/material'

interface ImageModalProps {
    image: DataElem  | null

    open: boolean
    setOpen: (open: boolean) => void
}

interface DataElem  {
    type?: string
    url?: string
    file:string
    file_category:string
}

const ImageModal: React.FC<ImageModalProps> = ({ image, open, setOpen }) => {
    const width = ( image?.file_category === 'CERTIFICATE' ) ? '60%' : '32%'

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {width}
    }
    
    return (
        <div>
            <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                className='max-w-[1440px] m-auto'
                open={open}
                onClose={() => { setOpen(false) }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                          timeout: 300,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style} className='outline-none relative'>
                        <img src={image?.file} alt={image?.file_category} />
                        <svg
                            xmlns='http://www.w3.org/2000/svg' 
                            width='40' 
                            height='40' 
                            viewBox='0 0 40 40' 
                            fill='#fff'
                            className='hover:cursor-pointer hover:fill-[#CFF3EE] transition duration-500 absolute top-0 right-[-40px]'
                            onClick={() => { setOpen(false) }}
                        >
                            <path d='M20.0001 6.66663C12.6351 6.66663 6.66675 12.6366 6.66675 20C6.66675 27.3633 12.6351 33.3333 20.0001 33.3333C27.3651 33.3333 33.3334 27.3633 33.3334 20C33.3334 12.6366 27.3651 6.66663 20.0001 6.66663ZM26.1784 23.8216C26.4909 24.1341 26.6665 24.558 26.6665 25C26.6665 25.4419 26.4909 25.8658 26.1784 26.1783C25.8659 26.4908 25.442 26.6664 25.0001 26.6664C24.5581 26.6664 24.1343 26.4908 23.8217 26.1783L20.0001 22.3566L16.1784 26.1783C16.024 26.3336 15.8404 26.4568 15.6382 26.5409C15.4359 26.625 15.2191 26.6683 15.0001 26.6683C14.7811 26.6683 14.5642 26.625 14.362 26.5409C14.1598 26.4568 13.9762 26.3336 13.8217 26.1783C13.6668 26.0236 13.5439 25.84 13.4601 25.6378C13.3762 25.4356 13.3331 25.2188 13.3331 25C13.3331 24.7811 13.3762 24.5643 13.4601 24.3621C13.5439 24.1599 13.6668 23.9763 13.8217 23.8216L17.6434 20L13.8217 16.1783C13.5092 15.8658 13.3337 15.4419 13.3337 15C13.3337 14.558 13.5092 14.1341 13.8217 13.8216C14.1343 13.5091 14.5581 13.3335 15.0001 13.3335C15.442 13.3335 15.8659 13.5091 16.1784 13.8216L20.0001 17.6433L23.8217 13.8216C24.1343 13.5091 24.5581 13.3335 25.0001 13.3335C25.442 13.3335 25.8659 13.5091 26.1784 13.8216C26.4909 14.1341 26.6665 14.558 26.6665 15C26.6665 15.4419 26.4909 15.8658 26.1784 16.1783L22.3567 20L26.1784 23.8216Z'/>
                        </svg>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default ImageModal
