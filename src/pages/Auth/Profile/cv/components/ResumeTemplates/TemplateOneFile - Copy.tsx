
import { forwardRef, useEffect } from 'react'
import { FaLinkedin, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa6";
import TextSkeleton from "../Skeleton/TextSkeleton";
import EditText from './components/EditText';


interface CvProps {
    data: {
        sample_job_title: string
        sample_summary: string
        job_experience: string[]
        program_questions: any
        secondary_education_questions: any
        work_experience_questions: any

    }
    user: {
        first_name: string
        last_name: string
        email: string
        profile_photo?: string
    }
    summaryLoading: boolean
}

const getIcon = (iconKey: string) =>
({
    in: <FaLinkedin className="text-xs" />,
    fb: <FaFacebook className="text-xs" />,
    insta: <FaInstagram className="text-xs" />,
    github: <FaGithub className="text-xs" />,
}[iconKey]);



const TemplateOneFile = forwardRef<HTMLDivElement, CvProps>(({ data, user, summaryLoading }, ref) => {

    const contacts = {
        phone: "+994 51 123 45 67",
        links: [
            { name: "in", link: "linkedin.com/in/JavidM" },
            { name: "fb", link: "facebook.com/JavidM" },
            { name: "github", link: "github.com/JavidM" },
        ]
    }

    return (
        <div className="relative overflow-hidden border rounded shadow w-[100%] p-3 font-montserrat cv min-h-[55rem]" ref={ref}>
            <Rectangle className="fill-[#FFCC06] absolute top-0 right-0" />

            <div className="relative space-y-8">
                <div className="px-8">
                    <div className="flex items-center justify-between mt-10 -tracking-[0.2px]">
                        <div className="space-y-10">
                            <div className="text-[11px]">
                                <h1 className="font-semibold">{user.first_name + ' ' + user.last_name}</h1>

                                <EditText/>
                                <p className="text-qss-base-500">{data?.sample_job_title} </p>
                            </div>

                            <div className="text-[8px]">
                                <p>{user?.email}</p>

                                <p className="font-semibold ">{contacts.phone}</p>
                            </div>
                        </div>

                        {user.profile_photo && <img
                            // src="https://scontent.fgyd8-1.fna.fbcdn.net/v/t39.30808-6/346986411_906370997125512_3222888757866143043_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=lFLXvjcrFwMAX-n72TR&_nc_ht=scontent.fgyd8-1.fna&oh=00_AfCBRuHLIGm_8gypZsPi21mMIdgT8qruY7ebfUreserJqA&oe=64BCFEF3"
                            src={user.profile_photo}
                            className=" object-cover w-[121px] h-[121px] rounded-full outline outline-4 outline-qss-base-500 outline-offset-[10px] bg-slate-400"
                        ></img>}

                        <ul className="space-y-1 text-[8px] tracking-normal">
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

                    <p className="mt-10 text-[10px] w-full -tracking-[0.2px]">
                        {summaryLoading ? (
                            <TextSkeleton />
                        ) : (
                            data?.["sample_summary"]
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 px-3 pt-5">
                    {data?.work_experience_questions?.formData?.experiences.length > 0 && <div className="flex gap-1.5">
                        <h2 className=" [writing-mode:vertical-lr]  uppercase tracking-[0.7px] text-[7px] text-end rotate-180">
                            WORK EXPERIENCE
                        </h2>
                        <div className="border-l border-dotted border-qss-alternative min-h-72" />

                        <div className="pl-2 space-y-4">
                            {data?.work_experience_questions?.formData?.experiences.map(({ company, profession, startDate, endDate, currentWorking }: any, index: number) => (
                                <div key={index} className="text-[8px]">
                                    <h2 className="font-bold">{profession}</h2>
                                    <p className="text-qss-base-500">{company}</p>
                                    <p>
                                        {(startDate).split('-')[0] + ' / ' + (startDate).split('-')[1] + " - " + (!currentWorking ? ((startDate).split('-')[0] + ' / ' + (startDate).split('-')[1]) : endDate)}
                                    </p>

                                    {/* <ul className="text-[6px] list-inside list-disc pt-1">
                                        {data?.["job_experience"]?.map(
                                            (d: string, index: number) => (
                                                <li key={index}>{d}</li>
                                            )
                                        )}
                                        {desc.map((d, index) => (
                                            <li key={index}>{d}</li>
                                        ))}
                                    </ul> */}
                                </div>
                            ))}
                        </div>
                    </div>}

                    <div className="space-y-10">
                        {data?.['secondary_education_questions']?.formData?.education.length > 0 && <div className="flex gap-1.5">
                            <h2 className=" [writing-mode:vertical-lr]  uppercase tracking-[0.7px] text-[7px] text-end rotate-180">
                                EDUCATION
                            </h2>
                            <div className="border-l border-dotted border-qss-alternative min-h-28" />

                            <div className="pl-2 space-y-2 text-[8px]">
                                {data?.['secondary_education_questions']?.formData?.education.map(
                                    ({ specialty, university, country, date, currentWorking, tehsil }: any, index: number) => (
                                        <div key={index} className="text-[8px]">
                                            <h2 className="font-bold">{specialty.answer}</h2>
                                            <p className="text-qss-base-500">{university} - {tehsil.answer}</p>
                                            <p>{country.answer} / {(date.start).split('-')[0] + " - " + (!currentWorking ? ((date.end).split('-')[0]) : date.end)}</p>
                                        </div>
                                    )
                                )}

                            </div>
                        </div>}

                        {data?.program_questions?.formData?.programSkills.length > 0 && <div className="flex gap-1.5">
                            <h2 className=" [writing-mode:vertical-lr]  uppercase tracking-[0.7px] text-[7px] text-end rotate-180">
                                Skills
                            </h2>
                            <div className="border-l border-dotted border-qss-alternative min-h-28" />

                            <div className="pl-2 space-y-2 text-[8px] w-full">
                                {data?.program_questions?.formData?.programSkills.map((items: any) =>
                                    items?.whichLevel.map((item: any, index: number) => (
                                        <div key={index} className="gap-2 capitalize flexCenter">
                                            {item.name}
                                            <div className="h-0.5 w-full relative rounded bg-gray-300">
                                                <div
                                                    className="absolute h-full bg-gray-500 rounded"
                                                    style={{ width: `${item.value.value}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
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