import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import axios from 'axios'
import domtoimage from 'dom-to-image'
import Report from './ReportFile'
import Modal from './Modal'
import download from './../../../../../assets/downloadicon.svg'
import { axiosPrivateInstance } from 'axioss'
import useAuth from 'hooks/useAuth'

interface Data {
  report_file: string
}

const Free = ({ mdata, userName, setErrorText, setStatus,status }: any) => {


  // This variable used for posting to backend
  const [data, setData] = useState<Data>({ report_file: '' })

  const [modal, setModal] = useState(false)
  const [img, setImg] = useState('')

  // This variable used for the sharing process 
  const [imgUrl, setImgUrl] = useState('')



  // This variable used for the disable share button until getting response
  const [disable, setDisable] = useState(true)
  const { user } = useAuth()

  const componentRef = useRef<HTMLDivElement>(null)



  useEffect(() => {

    // This function used for convert component to the image
    const fetchData = async () => {

      try {
        if (componentRef.current) {
          const dataUrl = await domtoimage.toJpeg(componentRef.current, {
            quality: 0.98,
            cacheBust: true
          });
          setImg(dataUrl);
          setData({ ...data, report_file: dataUrl });
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData()
  }, [])



  // This function used for posting data to the backend 
  const postData = async () => {

    try {

      const response = await axiosPrivateInstance.post('user/upload-report/', {
        report_file: img
      })
      setDisable(true)
      console.log(response);


      if (response.status === 201) {
        setStatus('')

        setErrorText('')
      }
      else {
        throw new Error("Your file couldn't be created")
      }


      // console.log(data);
    } catch (error) {
      setStatus('')
      setErrorText('Fail!')
    }
  }


  // This useEffect used for checking data and running posData function
  useEffect(() => {
    if (img !== null && img !== undefined && img !== '' && !user.report_test) {
      setStatus('Your file is being created...')
      setErrorText('')
      postData()
    }
  }, [img])


  // console.log(img);

  // This function used to toggle modal
  const toggleModal = () => {
    setModal(!modal)
  }


  // This function used for convert component to the pdf
  const generatePDF = useReactToPrint({
    content: () => componentRef.current as HTMLElement,
    documentTitle: 'TalentScoreReport',
  })


  return (
    <>

      <div className={`free`}>
        <h2 className='free-header'>Get a free report</h2>
        <h2 className='free-header'>with overall and sector-specific percentiles</h2>
        <div className='free-report'>
          <div className='scaled-report'>
            <Report mydata={mdata} userName={userName} ref={componentRef} />
          </div>
          <button onClick={generatePDF} className='report-download'>
            <p className='download-text'>FREE DOWNLOAD</p>
            <img src={download} alt='Report Download Icon' />
          </button>
        </div>
        <button onClick={toggleModal} disabled={disable ? true : false} className='share-button'>SHARE</button>
        <Modal modal={modal} setModal={setModal} imgUrl={imgUrl} />
      </div>
    </>
  )
}

export default Free
