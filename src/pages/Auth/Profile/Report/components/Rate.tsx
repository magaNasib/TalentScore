import React from 'react'

interface Range {
    min: number
    max: number
    color: string
    result: string
}

interface RateProps {
    val: number
    ranges: Range[]
}

const Rate: React.FC<RateProps> = ({ val, ranges }) => {
    return (
        <div className='result-rate'>
            {
                // This method used for display the rate section which located under the speedometer chart
                ranges.map((elem, i) => (
                    <div key={i} className='rate-collection'>
                        <div
                            className='percentile-div'
                            style={
                                {
                                    backgroundColor: elem.color,
                                    height: val >= elem.min && val <= elem.max ? '3.5px' : '2px',
                                    marginTop: val >= elem.min && val <= elem.max ? '-1.5px' : '0',
                                }
                            }
                        >
                        </div>
                        {val >= elem.min && val <= elem.max ? <i style={{ color: elem.color }} className='fa-solid fa-chevron-up'></i> : ''}
                        {val >= elem.min && val <= elem.max ? <span style={{ color: elem.color }} className='chart1-result'>{elem.result}</span> : ''}
                    </div>
                ))
            }
        </div>
    )
}

export default Rate
