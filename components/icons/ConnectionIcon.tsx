import { IconProps } from '@/lib/types';
import { FC } from 'react';

const ConnectionIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 00-5-5H3M14 7a5 5 0 005-5V0M3 21h2a5 5 0 005-5v-1M14 17v1a5 5 0 005 5h2" stroke={props.color || 'currentColor'} />
  </svg>
);
export default ConnectionIcon;