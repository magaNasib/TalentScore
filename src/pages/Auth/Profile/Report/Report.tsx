import './report.css'
import darklogo from './../../../../assets/darklogo.svg'
import Free from './components/Free'
import Premium from './components/Premium'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBar from 'pages/Landing/components/NavBar'
import { store } from 'state/store'
import axiosInstance, { axiosPrivateInstance } from 'axioss'
import { getAge } from './../../../../helper/date'
import useAuth from 'hooks/useAuth'
import { useLocation } from 'react-router-dom';

import { HashLoader } from 'react-spinners'
import { GiCancel } from 'react-icons/gi'

interface User {
  first_name: string,
  last_name: string,
  report_test: boolean,
  email: string,
  profile_photo: string

}
function App(props: any) {

  const currentState = store.getState();
  const location = useLocation();

  const stateValue = location.state;

  // const axiosPrivateInstance = useAxiosPrivate()


  const [data, setData] = useState()

  // const {user} = useAuth()
  const [user, setUser] = useState<User>()
  const [status, setStatus] = useState('Your report is loading...')
  const [errorText, setErrorText] = useState('')


  const getScoresFirstTime = async () => {

    console.log('first time');
    try {

      const response = await axiosPrivateInstance.post('user/user-education-score/', {
        user_info: currentState.stageForm
        // user_info: USERS[0].user_info
      })
      response.status === 200 && setData(response.data)
      if (response.status === 200) {
        setStatus('Your file is being created...')
        setErrorText('')
      }
      else {
        throw new Error("Fail!")
      }
      console.log(response);
    } catch (error) {
      console.log(error);

      setStatus('')
      setErrorText('Fail')

    }

  }

  const getScoresThen = async () => {
    console.log('second time');

    try {
      const response = await axiosPrivateInstance.get(`user/get-report/${stateValue?.id}/`)
      console.log('response', response);
      setData(response.data)
      if (response.status === 200) {
        setStatus('')
        setErrorText('')
      }
      else {
        throw new Error("Fail!")
      }

    } catch (error) {
      console.log(error);

      setStatus('')
      setErrorText('Fail')

    }
    // response.status === 200 && setData(response.data)
  }

  useEffect(() => {
    async function getUser() {
      try {
        const resp = await axiosPrivateInstance('user/user/');
        setUser(resp.data);

        // Put the code that depends on user here
        currentState?.stageForm?.length > 0 && !resp.data?.report_test && getScoresFirstTime();
        console.log(resp);
        resp.data?.report_test && getScoresThen();


      } catch (error) {

      }
    }

    getUser();
  }, []);




  return (
    <>
      <div className="w-full z-10 relative px-[220px]">
        <NavBar />

      </div>
      <div className='container'>

        <h1 className='report-done mt-8'>Well done!</h1>
        <h3 className='report-title'>Your talent report is here, offering valuable insights into your abilities. Embrace your talents and set new goals!</h3>

        <div className='free-premium-report'>
          {
            status &&
            <div className='free'>
              <div className='flex gap-10 items-center text-xl'><HashLoader /> {status}</div>
            </div>
          }

          {
            errorText && <div className='free'>
              <div className='flex gap-10 items-center text-xl'>< GiCancel className='text-red-500 text-3xl' /> {errorText}</div>
            </div>
          }
          {data &&
            <Free mdata={data} setStatus={setStatus} setErrorText={setErrorText} status={status} />
          }
          <Premium />
        </div>

      </div>
    </>
  )
}

export default App
