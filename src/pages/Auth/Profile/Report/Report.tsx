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
function App() {

  const currentState = store.getState();
  

    // const axiosPrivateInstance = useAxiosPrivate()

  const USERS = [
    {
      email: "admin@mail.ru",
      name: 'Admin Adminov',
      user_info: [
        {
          "name": "umumi-suallar",
          "formData": {
            "curOccupation": {
              "answer": "Təhsil alıram",
              "answer_weight": 0.4
            },
            "education": {
              "answer": "Bakalavr",
              "answer_weight": 0.3
            },
            "educationGrant": {
              "answer": "Əlaçı",
              "answer_weight": 0.2
            }
          }
        },
        {
          "name": "orta-texniki-ve-ali-tehsil-suallari",
          "formData": {
            "education": [
              {
                "tehsil": {
                  "answer": "Bakalavr"
                },
                "country": {
                  "answer": "Albaniya",
                  "answer_weight": null
                },
                "university": "sad",
                "specialty": {
                  "answer": "Aerokosmik informasiya sistemləri",
                  "answer_weight": null
                },
                "date": {
                  "start": "2023-09-20",
                  "end": "currently working"
                },
                "criterian": {
                  "answer": "Müraciyyət",
                  "answer_weight": null
                },
                "local": {},
                "otherExam": {},
                "application": [
                  "Language test (IELTS TOEFL)"
                ],
                "currentWorking": true,
                "ielts": "231231",
                "toefl": "1221"
              }
            ]
          }
        },
        {
          "name": "olimpiada-suallari",
          "formData": {
            "wonOlympics": {
              "answer": "Bəli",
              "answer_weight": null
            },
            "subjectOlympiad": {
              "answer": "Riyyaziyyat",
              "answer_weight": null
            },
            "highestOlympiad": {
              "answer": "Rayon",
              "answer_weight": 0.3
            },
            "rankOlympiad": {
              "answer": "1-ci yer (Qızıl medal)",
              "answer_weight": 0.5
            }
          }
        },
        {
          "name": "dil-bilikleri-substage",
          "formData": {
            "languageSkills": [
              {
                "language": {
                  "answer": "Ingilis dili",
                  "answer_weight": null
                },
                "langCert": {
                  "answer": ""
                },
                "engLangCert": {
                  "answer": "İELTS",
                  "answer_weight": null
                },
                "langCertName": "",
                "engCertResult": {
                  "answer": "4.5-5.0",
                  "answer_weight": 0.6
                },
                "langLevel": {
                  "answer": "B1 (İlkin orta)",
                  "answer_weight": 0.6
                }
              },
              {
                "language": {
                  "answer": "Rus dili",
                  "answer_weight": null
                },
                "langCert": {
                  "answer": "Bəli",
                  "answer_weight": null
                },
                "engLangCert": {
                  "answer": "",
                  "answer_weight": ""
                },
                "langCertName": "cz",
                "langCertResult": "23",
                "engCertResult": {
                  "answer": "",
                  "answer_weight": ""
                },
                "langLevel": {
                  "answer": "C1 (Üst orta)",
                  "answer_weight": 0.2
                }
              }
            ],
            "haveLanguageSkills": {
              "answer": "Var",
              "answer_weight": ""
            }
          }
        },
        {
          "name": "xususi-bacariqlar-substage",
          "formData": {
            "haveSpecialSkills": {
              "answer": "Var",
              "answer_weight": null
            },
            "specialSkills": [
              "Rəsm",
              "Musiqi"
            ],
            "skills": [
              {
                "name": "Rəsm",
                "value": {
                  "answer": "Həvəskar",
                  "answer_weight": 0.2
                }
              },
              {
                "name": "Musiqi",
                "value": {
                  "answer": "Peşəkar",
                  "answer_weight": 0.5
                }
              }
            ]
          }
        },
        {
          "name": "xususi-bacariqlar-sertifikat-substage",
          "formData": {
            "certificates": [
              {
                "name": "Musiqi",
                "value": "asdsda"
              }
            ]
          }
        },
        {
          "name": "idman-substage",
          "formData": {
            "haveSport": {
              "answer": "Var",
              "answer_weight": ""
            },
            "whichSport": [
              "Futbol",
              "Basketbol",
              "Güləş"
            ],
            "sports": [
              {
                "name": "Futbol",
                "value": {
                  "answer": "Həvəskar",
                  "answer_weight": 0.3
                }
              },
              {
                "name": "Basketbol",
                "value": {
                  "answer": "Həvəskar",
                  "answer_weight": 0.3
                }
              },
              {
                "name": "Güləş",
                "value": {
                  "answer": "Peşəkar",
                  "answer_weight": 0.03
                }
              }
            ]
          }
        },
        {
          "name": "idman-substage2",
          "formData": {
            "professionalSports": [
              {
                "name": "Güləş",
                "value": {
                  "whichScore": {
                    "answer": "Rayon",
                    "answer_weight": 0.5
                  },
                  "whichPlace": {
                    "answer": "Olimpiada",
                    "answer_weight": 0.6
                  }
                }
              }
            ]
          }
        },
        {
          "name": "is-tecrubesi-substage",
          "formData": {
            "haveJobExperience": {
              "answer": "Bəli",
              "answer_weight": null
            },
            "experiences": [
              {
                "company": "sad",
                "profession": "das",
                "workingActivityForm": {
                  "answer": "Fiziki əmək",
                  "answer_weight": 0.7
                },
                "degreeOfProfes": {
                  "answer": "Kiçik mütəxəssis",
                  "answer_weight": 0.8
                },
                "startDate": "2023-09-13",
                "endDate": "currently working",
                "currentWorking": true
              }
            ]
          }
        },
        {
          "name": "proqram-bilikleri-substage",
          "formData": {
            "haveProgramSkills": {
              "answer": "Var",
              "answer_weight": null
            },
            "whichProgram": [
              "MS Office",
              "Proqramlaşdırma dilləri"
            ],
            "programSkills": [
              {
                "whichProgram": "MS Office",
                "whichLevel": [
                  {
                    "name": "Excel",
                    "answer_weight": 0.6,
                    "value": {
                      "answer": "İrəli",
                      "answer_weight": 0.9
                    }
                  }
                ]
              },
              {
                "whichProgram": "Proqramlaşdırma dilləri",
                "whichLevel": [
                  {
                    "name": "Python",
                    "answer_weight": 0.4,
                    "value": {
                      "answer": "Senior",
                      "answer_weight": 0.5
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },




    {
      email: "tamerlan@mail.ru",
      name: 'Tamerlan Aliyev',
      user_info: [
        {
          "name": "umumi-suallar",
          "formData": {
            "curOccupation": {
              "answer": "Çalışıram",
              "answer_weight": 0.4
            },
            "education": {
              "answer": "Peşə təhsili",
              "answer_weight": 0.3
            },
            "educationGrant": {
              "answer": "Əlaçı",
              "answer_weight": 0.3
            }
          }
        },
        {
          "name": "orta-texniki-ve-ali-tehsil-suallari",
          "formData": {
            "education": [
              {
                "tehsil": {
                  "answer": "Peşə təhsili"
                },
                "country": {
                  "answer": "Albaniya",
                  "answer_weight": null
                },
                "university": "asd",
                "specialty": {
                  "answer": "Aerokosmik informasiya sistemləri",
                  "answer_weight": null
                },
                "date": {
                  "start": "2023-09-05",
                  "end": "currently working"
                },
                "criterian": {
                  "answer": "Lokal imtahan",
                  "answer_weight": null
                },
                "local": {
                  "examName": "sad",
                  "score": "23",
                  "maxScore": "43"
                },
                "otherExam": {},
                "application": [],
                "currentWorking": true
              }
            ]
          }
        },
        {
          "name": "olimpiada-suallari",
          "formData": {
            "wonOlympics": {
              "answer": "Xeyr",
              "answer_weight": null
            }
          }
        },
        {
          "name": "dil-bilikleri-substage",
          "formData": {
            "languageSkills": [],
            "haveLanguageSkills": {
              "answer": "Yoxdur",
              "answer_weight": null
            }
          }
        },
        {
          "name": "xususi-bacariqlar-substage",
          "formData": {
            "haveSpecialSkills": {
              "answer": "Var",
              "answer_weight": null
            },
            "specialSkills": [
              "Rəsm",
              "Musiqi"
            ],
            "skills": [
              {
                "name": "Rəsm",
                "value": {
                  "answer": "Həvəskar",
                  "answer_weight": 0.4
                }
              },
              {
                "name": "Musiqi",
                "value": {
                  "answer": "Həvəskar",
                  "answer_weight": 0.4
                }
              }
            ]
          }
        },
        {
          "name": "idman-substage",
          "formData": {
            "haveSport": {
              "answer": "Var",
              "answer_weight": ""
            },
            "whichSport": [
              "Futbol",
              "Basketbol"
            ],
            "sports": [
              {
                "name": "Futbol",
                "value": {
                  "answer": "Peşəkar",
                  "answer_weight": 0.2
                }
              },
              {
                "name": "Basketbol",
                "value": {
                  "answer": "Peşəkar",
                  "answer_weight": 0.2
                }
              }
            ]
          }
        },
        {
          "name": "idman-substage2",
          "formData": {
            "professionalSports": [
              {
                "name": "Futbol",
                "value": {
                  "whichScore": {
                    "answer": "Rayon",
                    "answer_weight": 0.4
                  },
                  "whichPlace": {
                    "answer": "1-ci yer",
                    "answer_weight": 0.5
                  }
                }
              },
              {
                "name": "Basketbol",
                "value": {
                  "whichScore": {
                    "answer": "Rayon",
                    "answer_weight": 0.2
                  },
                  "whichPlace": {
                    "answer": "1-ci yer",
                    "answer_weight": 0.3
                  }
                }
              }
            ]
          }
        },
        {
          "name": "is-tecrubesi-substage",
          "formData": {
            "haveJobExperience": {
              "answer": "Xeyr",
              "answer_weight": null
            },
            "experiences": []
          }
        },
        {
          "name": "proqram-bilikleri-substage",
          "formData": {
            "haveProgramSkills": {
              "answer": "Yoxdur",
              "answer_weight": null
            },
            "whichProgram": [],
            "programSkills": []
          }
        }
      ]

    }

  ]
  const [data, setData] = useState()


  useEffect(() => {


    const getScores = async () => {
      const response = await axiosPrivateInstance.post('user/user-education-score/', {
        user_info: currentState.stageForm
      })
      response.status === 200 && setData(response.data)

      console.log(response);

    }
    currentState?.stageForm?.length > 0 && getScores()
  }, [])

  // useEffect(() => {

  //   const fetchData = async () => {

  //     try {
  //       await axios
  //         .post('https://qssanalyticstalentscore.pythonanywhere.com/user/user-education-score/', {
  //           user_info: myUser
  //         })
  //         .then(res => {
  //           setData(res.data)
  //         })
  //     } catch (error) { }
  //   }
  //   email && fetchData();
  // }, [myUser])








  return (
    <>
      <div className="w-full z-10 relative px-[220px]">
        <NavBar />

      </div>
      <div className='container'>

        <h1 className='report-done mt-8'>Well done!</h1>
        <h3 className='report-title'>Your talent report is here, offering valuable insights into your abilities. Embrace your talents and set new goals!</h3>

        <div className='free-premium-report'>
          {data && <Free mdata={data} />}
          <Premium />
        </div>

      </div>
    </>
  )
}

export default App
