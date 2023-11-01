
import { useEffect, useRef, useState } from "react";
import { axiosPrivateInstance } from "axioss";
import useAuth from "hooks/useAuth";
import TemplateOneFile from "./TemplateOneFile";
import download from './../../../../../../assets/downloadicon.svg'
import domtoimage from 'dom-to-image'
import { useReactToPrint } from "react-to-print";
import { store } from 'state/store'
import { BiErrorCircle } from 'react-icons/bi';
import { PiEye } from 'react-icons/pi';
import { FiUpload } from 'react-icons/fi';
import { FaArrowRightLong } from 'react-icons/fa6';

import { useLocation } from 'react-router-dom';

interface WorkExperienceProps {

  company: string;
  startDate: string;
  endDate: string;
  profession: string,
  currentWorking: boolean

}

const DefaultContacts = {
  phone: "+994 51 123 45 67",
  links: [
    { name: "Linkedin", link: "linkedin.com" },
    // { name: "Facebook", link: "facebook.com" },
    { name: "Github", link: "github.com" },
    { name: "Portfolio", link: "mywebsite.com" },
  ]
}
const TemplateOne = () => {

  const location = useLocation();

  const stateValue = location.state;


  const [data, setData] = useState<any>({

    ...DefaultContacts,
    first_name: '',
    last_name: '',
    email: '',
    profile_photo: ''
  });

  const componentRef = useRef<HTMLDivElement>(null)



  const [img, setImg] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {

    async function getUser() {
      console.log('first');

      const resp = await axiosPrivateInstance('user/user/')

      const response = await axiosPrivateInstance.get('user/get-summry-prompt/')
      // const response2 = await axiosPrivateInstance.get('user/get-cv-content-prompt/')
      const response3 = await axiosPrivateInstance.get('user/get-job-title-prompt/')
      // const response4 = await axiosPrivateInstance.get('user/get-experiance-prompt/')

      const response2 = await axiosPrivateInstance.get('user/get-cv-info/')


      let cvInfoData = {
        programSkills: await response2.data.program_questions.formData.programSkills.flatMap((skill: any) => {
          return skill.whichLevel.map((item: any) => {
            return {
              name: item.name,
              value: item.value.value
            }
          })
        }),
        secondary_education: await response2.data.secondary_education_questions.formData.education.map((education: any) => {
          return {
            country: education.country.answer,
            currentWorking: education.currentWorking,
            date: education.date,
            specialty: education.specialty.answer,
            tehsil: education.tehsil.answer,
            university: education.university
          }

        }),
        work_experience: await response2.data.work_experience_questions.formData.experiences.map((experience: any) => {
          return {
            company: experience.company,
            profession: experience.profession,
            startDate: experience.startDate,
            endDate: experience.endDate,
            currentWorking: experience.currentWorking,
            workingActivityForm: experience.workingActivityForm.answer,
            degreeOfProfes: experience.degreeOfProfes.answer

          }
        })
      }

      setData({
        ...data,
        ...response.data,
        ...cvInfoData,
        ...response3.data,
        first_name: resp?.data.first_name,
        email: resp?.data?.email,
        last_name: resp?.data?.last_name,
        profile_photo: resp?.data?.profile_photo
      })
      // summary = response.data?.
      response.status === 200 && setSummaryLoading(false)

    }

    async function getCvData() {
      const resp = await axiosPrivateInstance.get(`user/get-resume/${stateValue.id}`)
      console.log('second', resp);

      resp.status === 201 && setData(resp.data)

    }
    !stateValue.id && getUser()
    stateValue.id && getCvData()
  }, [])


  console.log(data);



  const postData = () => {

    async function componentToImg() {
      try {
        if (componentRef.current) {
          await domtoimage.toJpeg(componentRef.current, {
            quality: 0.98,
            cacheBust: true
          }).then(function (dataUrl: string) {
            setImg(dataUrl)
            setData({ ...data, resume_file: dataUrl })
          })
        }

        const response = await axiosPrivateInstance.post('user/resume-upload/', data)


        // console.log(img);

        console.log(response);

      } catch (error) {
        console.log(error);

      }


    }
    componentToImg()
  }
  useEffect(() => {
    if (img !== null && img !== undefined && img !== '') {
      // postData()
    }
  }, [img])


  const generatePDF = useReactToPrint({
    content: () => componentRef.current as HTMLElement,
    documentTitle: 'TalentScoreCV',
  })


  return (


    <>
      <div className="flex gap-10">
        <div className="w-[40rem] min-w-[45rem] min-h-[55rem] bg-white flex-1">

          <TemplateOneFile ref={componentRef} cvData={data} summaryLoading={summaryLoading} />
        </div>

        <div className="bg-white flex-1 rounded-[.43rem] border border-[#eee] p-8  font-inter">

          {/* heading */}
          <div className="text-[1.125rem]">
            <h4>Cv-niz  <span className="text-qss-secondary"> 94 % </span> hazırdır!</h4>
            <div className="my-2 flex gap-4 items-center">
              <div className="bg-[#F2F6F6] rounded-lg h-4 flex-1 ">
                <div className="bg bg-qss-secondary rounded-lg h-full w-[94%]">

                </div>
              </div>
              <span className="text-qss-secondary font-semibold">
                94%
              </span>
            </div>


          </div>
          <div className="font-inter  text-[.975rem] my-4">

            {
              currentPage === 0 && <>
                <div className="flex items-center gap-4 text-[#848383]">
                  <span>
                    <BiErrorCircle className="text-[1.5rem]" />
                  </span><p>
                    Cv-nizi tamamlamaq üçün, zəhmət olmasa qeyd olunan xanaların dəqiqliyini yoxlayın və iş təcrübənizi ətraflı şəkildə qeyd edin.
                  </p>
                </div>

                <div className="my-10">
                  <label htmlFor="position">
                    Position
                  </label>
                  <input type="text" name="" id="position" className="bg-white rounded-lg" />
                </div>
                {
                  data?.work_experience?.map((exp: WorkExperienceProps, index: number) => {
                    const { company, startDate, endDate, currentWorking, profession } = exp;
                    return (
                      <div className="my-10 text-[#505050]  text-[.9rem]" key={index}>
                        <p>
                          <span className="font-semibold">
                            {index + 1}.
                            {' ' + (startDate).split('-')[0] + '-' + (!currentWorking ? ((startDate).split('-')[0]) : endDate)}
                            {" " + "-" + " "}
                            {company}
                          </span>
                          ,
                          {profession}:
                        </p>
                        <textarea placeholder="Write about your activites or tasks here" name="" className="my-2 border rounded-lg w-full h-[5rem] p-2"></textarea>
                      </div>
                    )
                  })
                }
                <div className="flex items-center justify-between">
                  <button className="border border-qss-secondary text-qss-secondary rounded-3xl px-[1.8rem] py-[.75rem] flex items-center gap-3">
                    Review
                    <PiEye className="text-[1.4em]" />
                  </button>
                  <button onClick={() => setCurrentPage((curr) => curr + 1)} className="border bg-qss-secondary text-white rounded-3xl px-[1.8rem] py-[.75rem] flex items-center gap-3">
                    Next
                    <FaArrowRightLong className="text-[1.4em]" />
                  </button>
                </div>
              </>

            }
            {
              currentPage === 1 &&
              <>
                <div className="flex items-center gap-4 text-[#848383]">
                  <span>
                    <BiErrorCircle className="text-[1.5rem]" />
                  </span><p>
                    Sonuncu toxunuşlar, zəhmət olmasa Telefon nomrenizi, Linkedin, Github, Portfolio linkini yerləşdirərdiz.

                  </p>
                </div>
                <div className="my-10 ">
                  <label htmlFor="phone">
                    Phone number: 
                  </label>
                  
                  <input type="tel" name="" id="phone" className="bg-white rounded-md w-full p-1 mt-2 block " />
                </div>
                {
                  DefaultContacts.links.map(({name,link},index:number)=>{
                    return(
                      <div className="my-10" key={index}>
                      <label htmlFor={name}>
                        {name} link: 
                      </label>
                      
                      <input type="url" name="" id={name} className="bg-white rounded-md w-full p-1 mt-2 block " />
                    </div>
                    )
                  })                  
                } <div className="flex items-center justify-between">
                <button className="border border-qss-secondary text-qss-secondary rounded-3xl px-[1.8rem] py-[.75rem] flex items-center gap-3">
                  Review
                  <PiEye className="text-[1.4em]" />
                </button>
                <button onClick={() => setCurrentPage((curr) => curr - 1)} className="border bg-qss-secondary text-white rounded-3xl px-[1.8rem] py-[.75rem] flex items-center gap-3">
                  Save
                  <FiUpload className="text-[1.4em]" />
                </button>
              </div>


              </>
            }
          </div>


        </div>
      </div>
      <div className="flex gap-4 ">
        <button onClick={generatePDF} className='flex w-44 px-6 py-3 bg-blue-200 rounded-md mt-4'>
          DOWNLOAD
          {/* <img src={download} alt='Report Download Icon' /> */}

        </button>
        {!stateValue.id && <button type="button" className="px-6 w-44 py-3 bg-blue-200 rounded-md mt-4" onClick={postData}>
          Save
        </button>}
      </div>
    </>

  );
};



export default TemplateOne;


