import './certificate.css'
import numbers from './assets/img/numbers.png'
import logo from './assets/img/logo.png'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface United {
  uniqueId: { code: string; unique: boolean }
  userName: { first_name: string; last_name: string }
  desContent: { 'certificate_designation_content': string }
  introContent: { 'certificate-intro-content': string }
}

const Certificate = () => {
  const [currentDate, setCurrentDate] = useState('')

  const [data, setData] = useState<United>({
    uniqueId: { code: '', unique: false },
    userName: { first_name: '', last_name: '' },
    desContent: { certificate_designation_content: '' },
    introContent: { 'certificate-intro-content': '' }
  })

  const apiUrl = 'https://nazimbudaqli.pythonanywhere.com/user/'
  const idEndpoint = 'get-unique-cert-id/'
  const desContentEndpoint = 'get-certificate-designation-content/'
  const introContentEndpoint = 'get-certificate-intro/'
  const userNameEndpoint = 'user/'

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const responses = await Promise.all([
          fetch(apiUrl + idEndpoint).then(response => response.json()),
          fetch(apiUrl + userNameEndpoint).then(response => response.json()),
          fetch(apiUrl + desContentEndpoint).then(response => response.json()),
          fetch(apiUrl + introContentEndpoint).then(response => response.json())
        ])

        const [uniqueId, userName, desContent, introContent] = responses

        setData({
          uniqueId,
          userName,
          desContent,
          introContent
        })
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchEndpoints()
  }, [])

  const { uniqueId, userName, desContent, introContent } = data
  const fullName = `${userName.first_name} ${userName.last_name}`


  // if (
  //   Object.values(data).every(value => 
  //     Object.values(value).every(innerValue => innerValue !== '')
  //   )
  // ) {
  //   const {uniqueId, userName, desContent, introContent} = data
  //   const fullName = `${userName.first_name} ${userName.last_name}`

  //   console.log(`id: ${uniqueId.code}, desContent: ${desContent.certificate_designation_content}, introContent: ${introContent['certificate-intro-content']}, userName: ${fullName}`)
  // }



  // This useEffect create a current date
  useEffect(() => {
    const today = new Date()
    setCurrentDate(formatDate(today))
  }, [])

  // This function used for get dd.mm.yyyy time format
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).split('/').join('.')
  }

  // This function used to get the date 10 months later
  const getFutureDate = () => {
    const future = new Date()
    future.setMonth(future.getMonth() + 10)

    return formatDate(future)
  }

  return (

    <>
      <div className='bg-[#1a1919] text-white' >

        <Link to={'/profile'}>
          Profile
        </Link>
      </div>
      <div id='certificate'>

        <div className='certificate'>
          <div className='certificate-inner'>
            <div className='certificate-header'>
              <h1>Talent Excellence Certificate</h1>
              <img src={numbers} alt='Numbers' />
            </div>
            <div className='certificate-body'>
              <div className='certificate-svg'>
                <svg className='path' xmlns='http://www.w3.org/2000/svg' width='223' height='27' viewBox='0 0 223 27' fill='none'>
                  <path d='M0 0H223V27H29.994C25.2455 27 20.7424 24.8908 17.7025 21.243L0 0Z' fill='#003F4D' />
                  <text fill='white' x='50%' y='50%' alignmentBaseline='middle' textAnchor='middle'>{desContent.certificate_designation_content}</text>
                </svg>
                {/* <p>{desContent.certificate_designation_content}</p> */}
              </div>
              <div>
                <h2 className='certificate-fullName'>{fullName}</h2>
                <p className='certificate-text'>This is to certify that {fullName} has been thoroughly evaluated by our comprehensive Talent Scoring System, which examines career accomplishments, educational background, specialized proficiencies, sports involvement, language skills, programming knowledge, and more. Based on a comprehensive analysis and assessment, {fullName} has exhibiteda range of talents and capabilities.</p>
                <h3 className='certificate-summary'>CERTIFICATE SUMMARY</h3>
                <p className='certificate-summary-text'>{introContent['certificate-intro-content']}</p>
                <div className='certificate-signature'>
                  <div>
                    <p>Signature:</p>
                    <div className='certificate-signature-place'>
                      <p>Talent Score Testing Center</p>
                      <svg xmlns='http://www.w3.org/2000/svg' width='112' height='2' viewBox='0 0 112 2' fill='none'>
                        <path d='M1 1H111' stroke='black' strokeOpacity='0.65' strokeWidth='0.7' strokeLinecap='round' />
                      </svg>
                    </div>
                  </div>
                  <img src={logo} alt='Talent Score Logo' />
                </div>
                <div className='certificate-footer'>
                  <p>The validity of this certificate can be verified online at: www.talentscoring.az/verication</p>
                  <div>
                    <p>Issuance Date: <span>{currentDate}</span></p>
                    <p>Validity Period: <span>{getFutureDate()}</span></p>
                    <p>Certification ID: <span>{uniqueId.code}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></>
  )
}

export default Certificate
