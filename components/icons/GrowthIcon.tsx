import { IconProps } from '@/lib/types';
import { FC } from 'react';

const GrowthIcon: FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3L21 7L15 13L11 9L3 17" stroke={props.color || 'currentColor'} />
    <polyline points="14 3 17 3 17 6" stroke={props.color || 'currentColor'} />
  </svg>
);
export default GrowthIcon;