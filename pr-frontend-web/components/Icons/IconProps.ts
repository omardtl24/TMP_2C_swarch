
type IconSize = 'xs' | 'sm' | 'md' | 'lg'| 'xl' | '2xl';
 
export const sizeClasses: Record<IconSize, string> = {
  xs: 'w-4 h-4',    // 16px
  sm: 'w-6 h-6',    // 24px
  md: 'w-8 h-8',    // 32px
  lg: 'w-12 h-12',  // 48px
  xl: 'w-16 h-16',  // 64px
  '2xl': 'w-24 h-24' // 96px
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: IconSize;
  className?: string;
  label?: string;
}