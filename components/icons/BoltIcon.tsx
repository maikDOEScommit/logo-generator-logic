import { IconProps } from '@/lib/types';
import { FC } from 'react';

const BoltIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={props.color || 'currentColor'}/>
  </svg>
);
export default BoltIcon;