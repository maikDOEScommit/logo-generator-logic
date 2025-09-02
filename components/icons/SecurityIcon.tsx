import { IconProps } from '@/lib/types';
import { FC } from 'react';

const SecurityIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={props.color || 'currentColor'}/>
  </svg>
);
export default SecurityIcon;