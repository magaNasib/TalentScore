import { FC } from 'react'
import * as _ from 'lodash'

interface SeparatorProps {
  turns: number
  style: React.CSSProperties
}

interface RadialSeparatorsProps {
  count: number
  style: React.CSSProperties
}

const Separator: FC<SeparatorProps> = (props) => {
  return (
    <div
      style={{
        position: 'absolute',
        height: '101%',
        transform: `rotate(${props.turns}turn)`,
        zIndex: 6,
        top: '-0.3%',
        left: '49.65%',
      }}
    >
      <div style={props.style} />
    </div>
  )
}

const RadialSeparators: FC<RadialSeparatorsProps> = (props) => {
  const turns = 1 / props.count

  return _.range(props.count).map((index: number) => (
    <Separator key={index} turns={index * turns} style={props.style} />
  ))
}

export default RadialSeparators
