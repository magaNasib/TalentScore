import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import RadialSeparators from './RadialSeparators'

interface SpeedometerChartProps {
  val: number
}

const SpeedometerChart = ({ val }: SpeedometerChartProps) => {
    return (
        <div className='half-progress-bar'>
            <CircularProgressbarWithChildren
                value={val}
                strokeWidth={1}
                circleRatio={0.5}
                styles={buildStyles({
                    pathColor: '#00E5BC', 
                    trailColor: '#D9D9D9',
                    strokeLinecap: 'butt',
                    rotation: 1 / 2 + 1 / 4,
                })}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                    <CircularProgressbarWithChildren
                        value={val < 80 ? val : 80}
                        strokeWidth={1}
                        circleRatio={0.5}
                        styles={buildStyles({
                            pathColor: '#03E10C', 
                            trailColor: 'transparent',
                            strokeLinecap: 'butt',
                            rotation: 1 / 2 + 1 / 4,
                        })}
                    />
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}>
                    <CircularProgressbarWithChildren
                        value={val < 60 ? val : 60}
                        strokeWidth={1}
                        circleRatio={0.5}
                        styles={buildStyles({
                            pathColor: '#FFF200', 
                            trailColor: 'transparent',
                            strokeLinecap: 'butt',
                            rotation: 1 / 2 + 1 / 4,
                        })}
                    />
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}>
                    <CircularProgressbarWithChildren
                        value={val < 40 ? val : 40}
                        strokeWidth={1}
                        circleRatio={0.5}
                        styles={buildStyles({
                            pathColor: '#FC7D1D',
                            trailColor: 'transparent',
                            strokeLinecap: 'butt',
                            rotation: 1 / 2 + 1 / 4,
                        })}
                    />
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 4 }}>
                    <CircularProgressbarWithChildren
                        value={val < 20 ? val : 20}
                        strokeWidth={1}
                        circleRatio={0.5}
                        styles={buildStyles({
                            pathColor: '#FF0038', 
                            trailColor: 'transparent',
                            strokeLinecap: 'butt',
                            rotation: 1 / 2 + 1 / 4,
                        })}
                    />
                </div>
                <RadialSeparators
                    count={20}
                    style={{
                      background: '#fff',
                      width: '1.5px',
                      height: `${10}%`,
                    }}
                />
                <p className='half-progress-bar-text'>{val}<span className='percent-sign'>%</span></p>
            </CircularProgressbarWithChildren>
            {
                // This method used for display the decimals of speedometer chart from 0 to 100
                Array.from({ length: 11 }, (_, i) => (
                    <span key={i} className={`chart-1-percentile percentile-${i}`}>{i * 10}</span>
                ))
            }
        </div>
    )
}

export default SpeedometerChart
