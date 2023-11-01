import { forwardRef, useEffect } from 'react'
import SpeedometerChart from './SpeedometerChart'
import PolarAreaChart from './PolarAreaChart'
import Rate from './Rate'
import Human from './../../../../../assets/human.png'
import useAuth from 'hooks/useAuth'
import { getAge } from 'helper/date'

interface Range {
  min: number
  max: number
  result: string
  color: string
}


interface PersonalInfo {
  name: string
  surname: string
  age: number
  testDate: string
  testId: string
  profile_photo: string
  birth_date?:Date
}
interface Data {
  sport: DataItem
  education: DataItem
  program: DataItem
  work: DataItem
  special: DataItem
  language: DataItem
}
interface MyData {
  data: Data
  report_key: string
}
interface DataItem {
  text: string
  score: number
  result: string
  education_color: string
}
interface ReportProps {
  mydata: MyData;
  userName: string
}

const Report = forwardRef<HTMLDivElement, ReportProps>((props, ref) => {
  const data = props?.mydata?.data

  const { user } = useAuth()


  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Note: January is 0!
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const today = new Date();
  const userAge =  getAge(new Date(user?.birth_date))
  const formattedDate = formatDate(today);

  const personalInfo: PersonalInfo = {
    name: user?.first_name,
    surname: user?.last_name,
    profile_photo: user?.profile_photo,
    age: userAge || 0,
    testDate: formattedDate,
    testId: props.mydata?.report_key,
  }

  const ranges: Range[] = [
    { min: 0, max: 20, result: 'Low', color: '#FF0038' },
    { min: 21, max: 40, result: 'Marginal', color: '#FC7D1D' },
    { min: 41, max: 60, result: 'Average', color: '#FFF200' },
    { min: 61, max: 80, result: 'Good', color: '#03E10C' },
    { min: 81, max: 100, result: 'Outstanding', color: '#00E5BC' },
  ]

  const { sport, education, program, work, special, language } = data
  const { name, surname, age, testDate, testId, profile_photo } = personalInfo

  const fullName = `${name} ${surname}`
  const peerVal = 81
  let overallVal = 0
  // function roundToTenDecimalPlaces(number: any) {
  //   return number.toFixed(2)
  // }
  Object.values(data).forEach((item) => {
    overallVal += +item?.score;
  });

  // overallVal = roundToTenDecimalPlaces(+overallVal) / (Object.keys(data)).length
  overallVal = Number((overallVal / (Object.keys(data)).length).toFixed(2))
  // This function used for the create suffix for the number
  const addOrdinalSuffix = (number: number) => {
    const lastDigit = number % 10

    switch (lastDigit) {
      case 1:
        return <>{number}<sup>st</sup></>
      case 2:
        return <>{number}<sup>nd</sup></>
      case 3:
        return <>{number}<sup>rd</sup></>
      default:
        return <>{number}<sup>th</sup></>
    }
  }

  // This function used for the getting text information for the each stage depends on rate 
  const getText = (arg: any) => {
    return (arg?.result)
  }

  // In this code we must use props but we don't need to props. Props is empty
  const a = false
  useEffect(() => {
    if (a) {
      console.log(props)
    }
  }, [])

  return (
    <div className='report' ref={ref}>
      <div className='report-header'>
        <div>
          <div className='header-logo-result'>
            <svg xmlns='http://www.w3.org/2000/svg' className='report-header-logo' viewBox='0 0 129 18' fill='none'>
              <path d='M4.20001 5.52002H0.820011C0.650011 5.52002 0.51001 5.38002 0.51001 5.21002V3.83002C0.51001 3.66002 0.650011 3.52002 0.820011 3.52002H9.77001C9.94001 3.52002 10.08 3.66002 10.08 3.83002V5.21002C10.08 5.38002 9.94001 5.52002 9.77001 5.52002H6.39001V14.84C6.39001 15.01 6.25001 15.15 6.08001 15.15H4.50001C4.33001 15.15 4.19001 15.01 4.19001 14.84V5.52002H4.20001Z' fill='white' />
              <path d='M23.85 3.83002V13.12H29.52C29.69 13.12 29.83 13.26 29.83 13.43V14.84C29.83 15.01 29.69 15.15 29.52 15.15H21.96C21.79 15.15 21.65 15.01 21.65 14.84V3.83002C21.65 3.66002 21.79 3.52002 21.96 3.52002H23.54C23.71 3.52002 23.85 3.66002 23.85 3.83002Z' fill='white' />
              <path d='M39.73 15.15H31.64C31.47 15.15 31.33 15.01 31.33 14.84V3.83002C31.33 3.66002 31.47 3.52002 31.64 3.52002H39.73C39.9 3.52002 40.04 3.66002 40.04 3.83002V5.34002C40.04 5.51002 39.9 5.65002 39.73 5.65002H33.51V8.32002H39.5C39.67 8.32002 39.81 8.46002 39.81 8.63002V10.06C39.81 10.23 39.67 10.37 39.5 10.37H33.51V12.99H39.73C39.9 12.99 40.04 13.13 40.04 13.3V14.85C40.04 15.02 39.9 15.16 39.73 15.16V15.15Z' fill='white' />
              <path d='M127.77 15.15H119.68C119.51 15.15 119.37 15.01 119.37 14.84V3.83002C119.37 3.66002 119.51 3.52002 119.68 3.52002H127.77C127.94 3.52002 128.08 3.66002 128.08 3.83002V5.34002C128.08 5.51002 127.94 5.65002 127.77 5.65002H121.55V8.32002H127.54C127.71 8.32002 127.85 8.46002 127.85 8.63002V10.06C127.85 10.23 127.71 10.37 127.54 10.37H121.55V12.99H127.77C127.94 12.99 128.08 13.13 128.08 13.3V14.85C128.08 15.02 127.94 15.16 127.77 15.16V15.15Z' fill='white' />
              <path d='M49.49 11.35V3.84003C49.49 3.67003 49.63 3.53003 49.8 3.53003H51.38C51.55 3.53003 51.69 3.67003 51.69 3.84003V14.85C51.69 15.02 51.55 15.16 51.38 15.16H50.06C49.97 15.16 49.88 15.12 49.82 15.05L43.74 7.43003V14.86C43.74 15.03 43.6 15.17 43.43 15.17H41.85C41.68 15.17 41.54 15.03 41.54 14.86V3.85003C41.54 3.68003 41.68 3.54003 41.85 3.54003H43.17C43.26 3.54003 43.35 3.58003 43.41 3.66003L49.49 11.36V11.35Z' fill='white' />
              <path d='M56.8701 5.52002H53.4901C53.3201 5.52002 53.1801 5.38002 53.1801 5.21002V3.83002C53.1801 3.66002 53.3201 3.52002 53.4901 3.52002H62.4401C62.6101 3.52002 62.7501 3.66002 62.7501 3.83002V5.21002C62.7501 5.38002 62.6101 5.52002 62.4401 5.52002H59.0601V14.84C59.0601 15.01 58.9201 15.15 58.7501 15.15H57.1701C57.0001 15.15 56.8601 15.01 56.8601 14.84V5.52002H56.8701Z' fill='white' />
              <path d='M75.12 6.21C74.99 6.28 74.83 6.24 74.74 6.13C74.26 5.55 73.26 5.04 72.13 5.04C70.5 5.04 69.72 5.72 69.72 6.58C69.72 7.59 70.92 7.88 72.31 8.04C74.73 8.34 76.99 8.97 76.99 11.74C76.99 14.33 74.7 15.44 72.11 15.44C69.84 15.44 68.07 14.77 67.17 12.86C67.1 12.71 67.16 12.53 67.3 12.45L68.59 11.78C68.74 11.7 68.92 11.76 69 11.91C69.59 13 70.84 13.48 72.14 13.48C73.52 13.48 74.81 13 74.81 11.74C74.81 10.64 73.66 10.2 72.12 10.03C69.75 9.74999 67.55 9.11999 67.55 6.50999C67.55 4.11999 69.91 3.14 72.05 3.12C73.76 3.12 75.53 3.58 76.46 5.14C76.55 5.29 76.5 5.49 76.34 5.57L75.11 6.2L75.12 6.21Z' fill='white' />
              <path d='M88.47 13.4701C88.6 13.6001 88.58 13.8 88.45 13.92C87.29 14.94 85.84 15.42 84.27 15.42C79.95 15.42 78.13 12.4501 78.11 9.43005C78.09 6.39005 80.07 3.30005 84.27 3.30005C85.74 3.30005 87.14 3.82005 88.29 4.85005C88.42 4.97005 88.43 5.18005 88.3 5.30005L87.27 6.29005C87.16 6.40005 86.98 6.41005 86.87 6.31005C86.13 5.69005 85.19 5.40005 84.26 5.40005C81.45 5.40005 80.24 7.49005 80.26 9.43005C80.28 11.3601 81.39 13.37 84.26 13.37C85.19 13.37 86.22 13.0201 86.98 12.3801C87.1 12.2801 87.28 12.2901 87.39 12.4001L88.46 13.48L88.47 13.4701Z' fill='white' />
              <path d='M104.15 15.48C100.81 18.82 95.39 18.82 92.05 15.48C88.71 12.14 88.71 6.72 92.05 3.38C95.39 0.04 100.81 0.04 104.15 3.38C107.49 6.72 107.49 12.14 104.15 15.48ZM103.37 5.61L103.91 5.07C104.02 4.96 104.03 4.78 103.93 4.66C103.77 4.47 103.61 4.28 103.43 4.1C103.25 3.92 103.07 3.76 102.87 3.6C102.75 3.5 102.57 3.51 102.46 3.62L101.92 4.16C102.19 4.36 102.46 4.58 102.7 4.83C102.95 5.08 103.17 5.34 103.37 5.61L98.8 10.18C98.42 10.56 97.83 10.58 97.43 10.25C97.4 10.23 97.38 10.2 97.35 10.18C97.32 10.15 97.3 10.13 97.28 10.1C96.95 9.7 96.98 9.1 97.35 8.73L101.92 4.16C99.27 2.24 95.5 2.55 93.22 5.12C91.06 7.55 91.05 11.28 93.2 13.72C95.71 16.57 100.05 16.67 102.7 14.03C104.99 11.74 105.22 8.15 103.37 5.61Z' fill='#00EBC2' />
              <path d='M118.13 14.64L114.93 11.03C117.14 10.58 117.87 8.97001 117.87 7.38001C117.87 5.37001 116.43 3.54001 113.69 3.53001C111.95 3.53001 110.21 3.52001 108.47 3.51001C108.3 3.51001 108.16 3.65001 108.16 3.82001V14.85C108.16 15.02 108.3 15.16 108.47 15.16H110.05C110.22 15.16 110.36 15.02 110.36 14.85V11.27H112.58L115.86 15.05C115.92 15.12 116 15.16 116.09 15.16H117.91C118.17 15.16 118.31 14.85 118.14 14.65L118.13 14.64ZM110.35 9.29001V5.57001H113.69C115.07 5.57001 115.68 6.50001 115.68 7.43001C115.68 8.36001 115.08 9.29001 113.69 9.29001H110.35Z' fill='white' />
              <path d='M20.14 14.74L15.94 3.73003C15.89 3.61003 15.7801 3.53003 15.6501 3.53003H13.7201C13.5901 3.53003 13.4801 3.61003 13.4301 3.73003L9.23005 14.74C9.15005 14.94 9.30005 15.15 9.52005 15.15H11.21C11.34 15.15 11.4501 15.07 11.5001 14.95L14.69 6.60003L17.8801 14.95C17.9301 15.07 18.04 15.15 18.17 15.15H19.8601C20.0701 15.15 20.2201 14.94 20.1501 14.74H20.14Z' fill='white' />
            </svg>
            <div className='header-vertical-line'></div>
            <p className='test-result'>TEST RESULT</p>
          </div>
          <div className='person-info'>
            <p className='name-age'>{fullName}, {age} years old</p>
            <p className='test-info'>Test date: {testDate}</p>
            <p className='test-info'>Test ID: {testId}</p>
          </div>
        </div>
        {profile_photo && <img src={profile_photo} alt='Report Human' className='report-photo' />
        }      </div>
      <div className='horizontal-line'></div>
      <div className='report-body'>
        <div className='report-part-1'>
          <div className='preliminary-info'>
            <p>{name} test results position him in the {addOrdinalSuffix(peerVal)} percentile, indicating that he has outperformed {peerVal}% of his peers.</p>
          </div>
          <div className='preliminary-info'>
            <p>Furthermore, in terms of the overall percentile, {name} is placed in the {addOrdinalSuffix(overallVal)} percentile, indicating that he is better than {overallVal} percent of everyone</p>
          </div>
        </div>
        <div className='report-part-2'>
          <div className='chart-1'>
            <SpeedometerChart val={peerVal} />
            <Rate val={peerVal} ranges={ranges} />
            <p className='percentile-title'>Peer percentile</p>
          </div>

          <div className='percentile-ranges'>
            <h3 className='percentile-ranges-title'>PERCENTILE RANGES</h3>
            <div className='percentile-ranges-info'>
              <div className='percentile-ranges-1'>
                {
                  // This method used for display the ranges with its colored circle
                  ranges.map((elem, i) => (
                    <div key={i} className='percentile-color-number'>
                      <div className='percentile-color' style={{ backgroundColor: elem.color }}></div>
                      <p className='percentile-number'>{elem.min}-{elem.max}</p>
                    </div>
                  ))
                }
              </div>
              <div className='percentile-ranges-2'>
                {
                  // This method used for display the text of ranges
                  ranges.map((elem, i) => (
                    <div key={i} className='percentile-ranges-word'>
                      <p className='percentile-word'>{elem.result}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className='chart-1'>
            <SpeedometerChart val={overallVal} />
            <Rate val={overallVal} ranges={ranges} />
            <p className='percentile-title'>Overall percentile</p>
          </div>
        </div>
        <div className='report-part-3'>
          <h3 className='report-part3-title'>Comprehensive Talent Percentiles</h3>
          <p className='report-part3-text'>{name}'s talent percentiles show his <span className='report-part3-bold-text'>{getText(special)} performance in special talents · {special?.score}%, {getText(work)} work experience · {work?.score}%, {getText(education)} education · {education?.score}%, {getText(language)} language skills · {language?.score}%, {getText(program)} program skills · {program?.score}%, and a {getText(sport)} percentile in sports successes · {sport?.score}%.</span></p>
        </div>
        <PolarAreaChart data={data} />
        <svg xmlns='http://www.w3.org/2000/svg' className='report-bottom-logo' viewBox='0 0 129 18' fill='none'>
          <path d='M4.20001 4.90991H0.820011C0.650011 4.90991 0.51001 4.76991 0.51001 4.59991V3.21991C0.51001 3.04991 0.650011 2.90991 0.820011 2.90991H9.77001C9.94001 2.90991 10.08 3.04991 10.08 3.21991V4.59991C10.08 4.76991 9.94001 4.90991 9.77001 4.90991H6.39001V14.2299C6.39001 14.3999 6.25001 14.5399 6.08001 14.5399H4.50001C4.33001 14.5399 4.19001 14.3999 4.19001 14.2299V4.90991H4.20001Z' fill='#003F4D' />
          <path d='M23.85 3.21991V12.5099H29.52C29.69 12.5099 29.83 12.6499 29.83 12.8199V14.2299C29.83 14.3999 29.69 14.5399 29.52 14.5399H21.96C21.79 14.5399 21.65 14.3999 21.65 14.2299V3.21991C21.65 3.04991 21.79 2.90991 21.96 2.90991H23.54C23.71 2.90991 23.85 3.04991 23.85 3.21991Z' fill='#003F4D' />
          <path d='M39.73 14.5399H31.64C31.47 14.5399 31.33 14.3999 31.33 14.2299V3.21991C31.33 3.04991 31.47 2.90991 31.64 2.90991H39.73C39.9 2.90991 40.04 3.04991 40.04 3.21991V4.72992C40.04 4.89992 39.9 5.03992 39.73 5.03992H33.51V7.70996H39.5C39.67 7.70996 39.81 7.84996 39.81 8.01996V9.44995C39.81 9.61995 39.67 9.75995 39.5 9.75995H33.51V12.3799H39.73C39.9 12.3799 40.04 12.5199 40.04 12.6899V14.2399C40.04 14.4099 39.9 14.5499 39.73 14.5499V14.5399Z' fill='#003F4D' />
          <path d='M127.77 14.5399H119.68C119.51 14.5399 119.37 14.3999 119.37 14.2299V3.21991C119.37 3.04991 119.51 2.90991 119.68 2.90991H127.77C127.94 2.90991 128.08 3.04991 128.08 3.21991V4.72992C128.08 4.89992 127.94 5.03992 127.77 5.03992H121.55V7.70996H127.54C127.71 7.70996 127.85 7.84996 127.85 8.01996V9.44995C127.85 9.61995 127.71 9.75995 127.54 9.75995H121.55V12.3799H127.77C127.94 12.3799 128.08 12.5199 128.08 12.6899V14.2399C128.08 14.4099 127.94 14.5499 127.77 14.5499V14.5399Z' fill='#003F4D' />
          <path d='M49.49 10.7399V3.22992C49.49 3.05992 49.63 2.91992 49.8 2.91992H51.38C51.55 2.91992 51.69 3.05992 51.69 3.22992V14.2399C51.69 14.4099 51.55 14.5499 51.38 14.5499H50.06C49.97 14.5499 49.88 14.5099 49.82 14.4399L43.74 6.81995V14.2499C43.74 14.4199 43.6 14.5599 43.43 14.5599H41.85C41.68 14.5599 41.54 14.4199 41.54 14.2499V3.23993C41.54 3.06993 41.68 2.92993 41.85 2.92993H43.17C43.26 2.92993 43.35 2.96993 43.41 3.04993L49.49 10.7499V10.7399Z' fill='#003F4D' />
          <path d='M56.8701 4.90991H53.4901C53.3201 4.90991 53.1801 4.76991 53.1801 4.59991V3.21991C53.1801 3.04991 53.3201 2.90991 53.4901 2.90991H62.4401C62.6101 2.90991 62.7501 3.04991 62.7501 3.21991V4.59991C62.7501 4.76991 62.6101 4.90991 62.4401 4.90991H59.0601V14.2299C59.0601 14.3999 58.9201 14.5399 58.7501 14.5399H57.1701C57.0001 14.5399 56.8601 14.3999 56.8601 14.2299V4.90991H56.8701Z' fill='#003F4D' />
          <path d='M75.12 5.59973C74.99 5.66973 74.83 5.62978 74.74 5.51978C74.26 4.93978 73.26 4.42975 72.13 4.42975C70.5 4.42975 69.72 5.10973 69.72 5.96973C69.72 6.97973 70.92 7.26975 72.31 7.42975C74.73 7.72975 76.99 8.35976 76.99 11.1298C76.99 13.7198 74.7 14.8298 72.11 14.8298C69.84 14.8298 68.07 14.1598 67.17 12.2498C67.1 12.0998 67.16 11.9198 67.3 11.8398L68.59 11.1697C68.74 11.0897 68.92 11.1497 69 11.2997C69.59 12.3897 70.84 12.8698 72.14 12.8698C73.52 12.8698 74.81 12.3898 74.81 11.1298C74.81 10.0298 73.66 9.58974 72.12 9.41974C69.75 9.13974 67.55 8.50978 67.55 5.89978C67.55 3.50978 69.91 2.52977 72.05 2.50977C73.76 2.50977 75.53 2.96979 76.46 4.52979C76.55 4.67979 76.5 4.87978 76.34 4.95978L75.11 5.58978L75.12 5.59973Z' fill='#003F4D' />
          <path d='M88.47 12.8499C88.6 12.9799 88.58 13.1799 88.45 13.2999C87.29 14.3199 85.84 14.7999 84.27 14.7999C79.95 14.7999 78.13 11.8299 78.11 8.80994C78.09 5.76994 80.07 2.67993 84.27 2.67993C85.74 2.67993 87.14 3.19992 88.29 4.22992C88.42 4.34992 88.43 4.55993 88.3 4.67993L87.27 5.66992C87.16 5.77992 86.98 5.78994 86.87 5.68994C86.13 5.06994 85.19 4.77997 84.26 4.77997C81.45 4.77997 80.24 6.86994 80.26 8.80994C80.28 10.7399 81.39 12.7499 84.26 12.7499C85.19 12.7499 86.22 12.3999 86.98 11.7599C87.1 11.6599 87.28 11.67 87.39 11.78L88.46 12.8599L88.47 12.8499Z' fill='#003F4D' />
          <path d='M104.15 14.8599C100.81 18.1999 95.39 18.1999 92.05 14.8599C88.71 11.5199 88.71 6.09988 92.05 2.75988C95.39 -0.580117 100.81 -0.580117 104.15 2.75988C107.49 6.09988 107.49 11.5199 104.15 14.8599ZM103.37 4.98986L103.91 4.44989C104.02 4.33989 104.03 4.15985 103.93 4.03985C103.77 3.84985 103.61 3.65985 103.43 3.47985C103.25 3.29985 103.07 3.13985 102.87 2.97985C102.75 2.87985 102.57 2.88987 102.46 2.99987L101.92 3.53985C102.19 3.73985 102.46 3.95989 102.7 4.20989C102.95 4.4599 103.17 4.71986 103.37 4.98986L98.8 9.55987C98.42 9.93987 97.83 9.95988 97.43 9.62988C97.4 9.60988 97.38 9.57987 97.35 9.55987C97.32 9.52987 97.3 9.50985 97.28 9.47985C96.95 9.07985 96.98 8.47986 97.35 8.10986L101.92 3.53985C99.27 1.61985 95.5 1.92987 93.22 4.49987C91.06 6.92987 91.05 10.6598 93.2 13.0998C95.71 15.9498 100.05 16.0498 102.7 13.4098C104.99 11.1198 105.22 7.52986 103.37 4.98986Z' fill='#00EBC2' />
          <path d='M118.13 14.0299L114.93 10.4199C117.14 9.96986 117.87 8.3599 117.87 6.7699C117.87 4.7599 116.43 2.92986 113.69 2.91986C111.95 2.91986 110.21 2.9099 108.47 2.8999C108.3 2.8999 108.16 3.0399 108.16 3.2099V14.2399C108.16 14.4099 108.3 14.5499 108.47 14.5499H110.05C110.22 14.5499 110.36 14.4099 110.36 14.2399V10.6599H112.58L115.86 14.4399C115.92 14.5099 116 14.5499 116.09 14.5499H117.91C118.17 14.5499 118.31 14.2399 118.14 14.0399L118.13 14.0299ZM110.35 8.67987V4.9599H113.69C115.07 4.9599 115.68 5.88989 115.68 6.81989C115.68 7.74989 115.08 8.67987 113.69 8.67987H110.35Z' fill='#003F4D' />
          <path d='M20.14 14.1199L15.94 3.10992C15.89 2.98992 15.7801 2.90991 15.6501 2.90991H13.7201C13.5901 2.90991 13.4801 2.98992 13.4301 3.10992L9.23005 14.1199C9.15005 14.3199 9.30005 14.53 9.52005 14.53H11.21C11.34 14.53 11.4501 14.45 11.5001 14.33L14.69 5.97992L17.8801 14.33C17.9301 14.45 18.04 14.53 18.17 14.53H19.8601C20.0701 14.53 20.2201 14.3199 20.1501 14.1199H20.14Z' fill='#003F4D' />
        </svg>
      </div>
    </div>
  )
})

export default Report