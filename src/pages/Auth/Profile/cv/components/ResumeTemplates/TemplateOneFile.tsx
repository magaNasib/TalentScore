
import { forwardRef, useEffect, useState } from 'react'
import { FaLinkedin, FaFacebook, FaInstagram, FaGithub,FaLink } from "react-icons/fa6";
import TextSkeleton from "../Skeleton/TextSkeleton";
import EditText from './components/EditText';


interface CvProps {
    cvData: {
        sample_job_title: string
        sample_summary: string
        job_experience: string[]
        programSkills: any
        secondary_education: any
        work_experience: any
        links: any
        phone: any
        first_name: string
        last_name: string
        email: string
        profile_photo?: string

    }
    summaryLoading: boolean
}

const getIcon = (iconKey: string) =>
({
    Linkedin: <FaLinkedin className="text-xs inline" />,
    Facebook: <FaFacebook className="text-xs inline" />,
    Instagram: <FaInstagram className="text-xs inline" />,
    Github: <FaGithub className="text-xs inline" />,
    Portfolio: <FaLink className="text-xs inline" />,
}[iconKey]);



const TemplateOneFile = forwardRef<HTMLDivElement, CvProps>(({ cvData, summaryLoading }, ref) => {


    const [data, setData] = useState({
        ...cvData
    })

    useEffect(() => {
        setData({
            ...cvData
        })

    }, [cvData])



    return (
        <div className="relative overflow-hidden border rounded shadow w-[100%] p-3 font-montserrat cv min-h-[55rem] bg-white" ref={ref}>
            <Rectangle className="fill-[#FFCC06] absolute top-0 right-0" />

            <div className="relative space-y-8">
                <div className="px-8">
                    <div className="flex items-center justify-between mt-10 -tracking-[0.2px]">
                        <div className="space-y-10">
                            <div className="text-[11px]">
                                <h1 className="font-semibold">{data?.first_name + ' ' + data?.last_name}</h1>

                                {
                                    data.sample_job_title &&
                                    <EditText className="text-qss-base-500" text={data.sample_job_title} />

                                }   </div>

                            <div className="text-[8px]">
                                <p>{data?.email}</p>
                                <EditText className='font-semibold' text={data?.phone} />
                            </div>
                        </div>

                        {data?.profile_photo && <img
                            src={data?.profile_photo}
                            className=" object-cover w-[121px] h-[121px] rounded-full outline outline-4 outline-qss-base-500 outline-offset-[10px] bg-slate-400"
                        ></img>}

                        <ul className="relative z-10 -top-10 -right-5 w-[10rem] flex flex-col text-[8px] tracking-normal">
                            {data.links.map((contact: any) => (

                                <EditText key={contact.name} text={contact.link} url={true} className="text-[.7rem]  items-center justify-start gap-1 text-white">
                                    <span className='mr-1'>
                                        {getIcon(contact.name)}
                                    </span>
                                </EditText>

                            ))}
                        </ul>
                    </div>

                    {/* {data?.["sample_summary"] && <>
                        {summaryLoading ? (
                            <TextSkeleton />
                        ) : (
                            <EditText className="mt-10 text-[10px] w-full -tracking-[0.2px]" text={data?.["sample_summary"]} />
                        )}
                    </>} */}
                    {!data?.sample_summary ? (
                        <TextSkeleton />
                    ) : (
                        <EditText className="mt-10 text-[12px] w-full -tracking-[0.2px]" text={data?.sample_summary} />
                    )}

                </div>

                <div className="grid grid-cols-2 gap-6 px-3 pt-5">
                    {data?.work_experience && data?.work_experience.length > 0 && <div className="flex gap-1.5">
                        <h2 className=" [writing-mode:vertical-lr]  uppercase tracking-[0.7px] text-[7px] text-end rotate-180">
                            WORK EXPERIENCE
                        </h2>
                        <div className="border-l border-dotted border-qss-alternative min-h-72" />

                        <div className="pl-2 space-y-4">
                            {data?.work_experience.map(({ company, profession, startDate, endDate, currentWorking }: any, index: number) => (
                                <div key={index} className="text-[8px]">
                                    <h2 className="font-bold">{profession}</h2>
                                    <p className="text-qss-base-500">{company}</p>
                                    <p>
                                        {(startDate).split('-')[0] + ' / ' + (startDate).split('-')[1] + " - " + (!currentWorking ? ((startDate).split('-')[0] + ' / ' + (startDate).split('-')[1]) : endDate)}
                                    </p>

                                    
                                </div>
                            ))}
                        </div>
                    </div>}

                    <div className="space-y-10">
                        {data?.['secondary_education'] && data?.['secondary_education']?.length > 0 && <div className="flex gap-1.5">
                            <h2 className=" [writing-mode:vertical-lr]  uppercase tracking-[0.7px] text-[7px] text-end rotate-180">
                                EDUCATION
                            </h2>
                            <div className="border-l border-dotted border-qss-alternative min-h-28" />

                            <div className="pl-2 space-y-2 text-[8px]">
                                {data?.['secondary_education']?.map(
                                    ({ specialty, university, country, date, currentWorking, tehsil }: any, index: number) => (
                                        <div key={index} className="text-[8px]">
                                            <h2 className="font-bold">{specialty}</h2>
                                            <p className="text-qss-base-500">{university} - {tehsil}</p>
                                            <p>{country} / {(date.start).split('-')[0] + " - " + (!currentWorking ? ((date.end).split('-')[0]) : date.end)}</p>
                                        </div>
                                    )
                                )}

                            </div>
                        </div>}

                        {data?.programSkills && data?.programSkills.length > 0 && <div className="flex gap-1.5">
                            <h2 className=" [writing-mode:vertical-lr]  uppercase tracking-[0.7px] text-[7px] text-end rotate-180">
                                Skills
                            </h2>
                            <div className="border-l border-dotted border-qss-alternative min-h-28" />

                            <div className="pl-2 space-y-2 text-[8px] w-full">
                                {data?.programSkills.map((item: any, index: number) =>
                                    <div key={index} className="gap-2 capitalize flexCenter">
                                        {item.name}
                                        <div className="h-0.5 w-full relative rounded bg-gray-300">
                                            <div
                                                className="absolute h-full bg-gray-500 rounded"
                                                style={{ width: `${item.value}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
})

const Rectangle = ({ className }: { className?: string }) => (
    <svg
        className={className}
        width="278"
        height="189"
        viewBox="0 0 278 189"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_104_3)">
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


export default TemplateOneFile


{/* {educationAndCertifcates?.bachelor?.map(
                                    ({ specialty, university, desc }, index) => (
                                        <div key={index} className="text-[8px]">
                                            <h2 className="font-bold">{specialty}</h2>
                                            <p className="text-qss-base-500">{university}</p>
                                            <p>{desc}</p>
                                        </div>
                                    )
                                )} */}
{/* <div>
                                    {educationAndCertifcates?.certifacetes?.map((cert, index) => (
                                        <p key={index}>{cert}</p>
                                    ))}
                                </div> */}