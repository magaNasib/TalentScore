import React, { useEffect, useRef } from 'react'
import { FacebookShareButton, LinkedinShareButton } from 'react-share'

interface ModalProps {
  modal: boolean
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  imgUrl: string
}

const Modal = ({ modal, setModal, imgUrl }: ModalProps): JSX.Element => {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setModal(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [setModal])

    // This function used for the change background of share buttons
    const changeColor = (event: React.MouseEvent<HTMLButtonElement>) => {
        const clickedButton = event.currentTarget
        const icon = clickedButton.querySelector('i') as HTMLElement

        if (clickedButton.classList.contains('active')) {
            clickedButton.classList.remove('active')
            icon.classList.remove('active')
        } else {
            clickedButton.classList.add('active')
            icon.classList.add('active')
        }
    }

    // Disable scroll when the modal is open
    useEffect(() => {
        if (modal) {
            document.body.classList.add('active-modal')
        } else {
            document.body.classList.remove('active-modal')
        }
    }, [modal])

  return (
    <>
        {modal && (
            <>
                <div className='modal-bg'></div>
                <div className='modal' ref={modalRef}>
                    <LinkedinShareButton
                        url={imgUrl}
                        onClick={changeColor}
                        className='linkedin-share'
                    >
                        <i className='fa-brands fa-linkedin-in'></i>
                    </LinkedinShareButton>
                    <FacebookShareButton
                        url={imgUrl}
                        onClick={changeColor}
                        className='linkedin-share'
                    >
                        <i className='fa-brands fa-facebook-f'></i>
                    </FacebookShareButton>
                </div>
            </>
        )}
    </>
  )
}

export default Modal
