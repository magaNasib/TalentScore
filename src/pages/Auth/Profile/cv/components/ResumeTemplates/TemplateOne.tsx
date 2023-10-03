import useSWR from "swr";
import { templateOne } from "../../constants/resumes";
import { FaLinkedin, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa6";
import { read } from "../../services/axios";
import TextSkeleton from "../Skeleton/TextSkeleton";
import { useEffect, useState } from "react";
import { axiosPrivateInstance } from "axioss";
import useAuth from "hooks/useAuth";
// import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "row",
//     backgroundColor: "#E4E4E4",
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
// });

// // Create Document Component
// const TemplateOne = () => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text>Section #1</Text>
//       </View>
//       <View style={styles.section}>
//         <Text>Section #2</Text>
//       </View>
//     </Page>
//   </Document>
// );

const getIcon = (iconKey: string) =>
({
  in: <FaLinkedin className="text-xs" />,
  fb: <FaFacebook className="text-xs" />,
  insta: <FaInstagram className="text-xs" />,
  github: <FaGithub className="text-xs" />,
}[iconKey]);



const getPerc = (levelKey: string) =>
({
  beginner: 25,
  junior: 50,
  middle: 75,
  senior: 100,
}[levelKey]);

const TemplateOne = () => {

  const {
    fullName,
    job,
    contacts,
    summary,
    workExperience,
    educationAndCertifcates,
    skills,
  } = templateOne;



  const [data, setData] = useState<any>();
  const {user} = useAuth()
  // let user = {
  //   email
  //     :
  //     "mnasibdev@gmail.com",
  //   first_name
  //     :
  //     "Mahammad",
  //   gender
  //     :
  //     "Male",
  //   last_name
  //     :
  //     "Nasibov",
  //   report_test
  //     :
  //     true
  // }
  const [summaryLoading, setSummaryLoading] = useState(true);
  useEffect(() => {

    async function getCvData() {
      const response = await axiosPrivateInstance.get('user/get-summry-prompt/')
      const response2 = await axiosPrivateInstance.get('user/get-cv-content-prompt/')
      const response3 = await axiosPrivateInstance.get('user/get-job-title-prompt/')
      const response4 = await axiosPrivateInstance.get('user/get-experiance-prompt/')

      setData({
        ...response.data,
        ...response2.data,
        ...response3.data,
        ...response4.data
      })
      // summary = response.data?.
      response.status === 200 && setSummaryLoading(false)

    }
    getCvData()
  }, [])
  // console.log(user);
  

  return (
    <div className="relative overflow-hidden border rounded shadow w-[100%] p-3 font-montserrat">
      <Rectangle className="fill-[#FFCC06] absolute top-0 right-0" />

      <div className="relative space-y-8">
        <div className="px-8">
          <div className="flex items-center justify-between mt-10 -tracking-[0.2px]">
            <div className="space-y-10">
              <div className="text-[11px]">
                <h1 className="font-semibold">{user.first_name + ' ' + user.last_name}</h1>

                <p className="text-qss-base-500">{data?.sample_job_title}</p>
              </div>

              <div className="text-[8px]">
                <p>{user?.email}</p>

                <p className="font-semibold ">{contacts.phone}</p>
              </div>
            </div>

            <img
              src="https://scontent.fgyd8-1.fna.fbcdn.net/v/t39.30808-6/346986411_906370997125512_3222888757866143043_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=lFLXvjcrFwMAX-n72TR&_nc_ht=scontent.fgyd8-1.fna&oh=00_AfCBRuHLIGm_8gypZsPi21mMIdgT8qruY7ebfUreserJqA&oe=64BCFEF3"
              className=" object-cover w-[121px] h-[121px] rounded-full outline outline-4 outline-qss-base-500 outline-offset-[10px] bg-slate-400"
            ></img>

            <ul className="space-y-1 text-[5px] tracking-normal">
              {contacts.links.map((contact) => (
                <li
                  key={contact.name}
                  className="flex items-center justify-start gap-1 text-white"
                >
                  {getIcon(contact.name)}
                  <span>{contact.link}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-10 text-[8px] max-w-sm -tracking-[0.2px]">
            {summaryLoading ? (
              <TextSkeleton />
            ) : (
              data?.["sample_summary"]
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 px-3">
          <div className="flex gap-1.5">
            <h2 className=" [writing-mode:vertical-lr]  uppercase tracking-[0.7px] text-[7px] text-end rotate-180">
              WORK EXPERIENCE
            </h2>
            <div className="border-l border-dotted border-qss-alternative min-h-72" />

            <div className="pl-2 space-y-4">
              {/* {workExperience.map(({ header, desc }, index) => (
                <div key={index} className="text-[8px]">
                  <h2 className="font-bold">{header.jobTitle}</h2>
                  <p className="text-qss-base-500">{header.workPlace}</p>
                  <p>
                    {header.date.startDate} - {header.date.endDate}
                  </p>

                  <ul className="text-[6px] list-inside list-disc pt-1"> */}
              {data?.["job_experience"]?.map(
                (d: string, index: number) => (
                  <li key={index}>{d}</li>
                )
              )}
              {/* {desc.map((d, index) => (
                      <li key={index}>{d}</li>
                    ))} */}
              {/* </ul>
                </div>
              ))} */}
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex gap-1.5">
              <h2 className=" [writing-mode:vertical-lr]  uppercase tracking-[0.7px] text-[7px] text-end rotate-180">
                EDUCATION
              </h2>
              <div className="border-l border-dotted border-qss-alternative min-h-28" />

              <div className="pl-2 space-y-2 text-[8px]">
                {educationAndCertifcates?.master?.map(
                  ({ specialty, university, desc }, index) => (
                    <div key={index} className="text-[8px]">
                      <h2 className="font-bold">{specialty}</h2>
                      <p className="text-qss-base-500">{university}</p>
                      <p>{desc}</p>
                    </div>
                  )
                )}
                {educationAndCertifcates?.bachelor?.map(
                  ({ specialty, university, desc }, index) => (
                    <div key={index} className="text-[8px]">
                      <h2 className="font-bold">{specialty}</h2>
                      <p className="text-qss-base-500">{university}</p>
                      <p>{desc}</p>
                    </div>
                  )
                )}
                <div>
                  {educationAndCertifcates?.certifacetes?.map((cert, index) => (
                    <p key={index}>{cert}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-1.5">
              <h2 className=" [writing-mode:vertical-lr]  uppercase tracking-[0.7px] text-[7px] text-end rotate-180">
                Skills
              </h2>
              <div className="border-l border-dotted border-qss-alternative min-h-28" />

              <div className="pl-2 space-y-2 text-[8px] w-full">
                {Object.entries(skills).map(([key, value]) => (
                  <div className="gap-2 capitalize flexCenter">
                    {key}
                    <div className="h-0.5 w-full relative rounded bg-gray-300">
                      <div
                        className="absolute h-full bg-gray-500 rounded"
                        style={{ width: `${getPerc(value)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Rectangle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="278"
    height="189"
    viewBox="0 0 278 189"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_104_3)">
      <path
        d="M241.823 188.558C254.115 188.558 266.188 187.629 278.01 185.85V0H0C30.8001 108.999 127.398 188.558 241.823 188.558Z"
        className="fill-qss-alternative"
      />
    </g>
    <defs>
      <clipPath id="clip0_104_3">
        <rect width="278" height="188.558" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default TemplateOne;
