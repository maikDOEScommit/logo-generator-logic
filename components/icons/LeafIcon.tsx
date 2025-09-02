import { IconProps } from '@/lib/types';
import { FC } from 'react';

const LeafIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={props.color || 'currentColor'}/>
    <path d="M12 2a10 10 0 00-2 19.8" stroke={props.color || 'currentColor'}/>
  </svg>
);
export default LeafIcon;