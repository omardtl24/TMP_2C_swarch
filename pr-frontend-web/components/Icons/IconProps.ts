
type IconSize = 'xs' | 'sm' | 'md' | 'lg';

export const sizeClasses: Record<IconSize, string> = {
  xs: 'w-4 h-4',    // 16px
  sm: 'w-6 h-6',    // 24px
  md: 'w-8 h-8',    // 32px
  lg: 'w-12 h-12',  // 48px
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: IconSize;
  className?: string;
  label?: string;
}