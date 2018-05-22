export const Size = {
    LARGE: 'large',
    SMALL: 'small',
    XSMALL: 'xsmall',
  };
  
  export const SIZE_MAP = {
    large: 'lg',
    medium: 'md',
    small: 'sm',
    xsmall: 'xs',
    lg: 'lg',
    md: 'md',
    sm: 'sm',
    xs: 'xs',
  };
  
  export type DeviceSizeType = 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  
  export const DEVICE_SIZES: DeviceSizeType[] = [
    'xl',
    'lg',
    'md',
    'sm',
    'xs',
  ];
  
  export type StateType = 'success' | 'warning' | 'danger' | 'info';
  
  export const State = {
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
    INFO: 'info',
  };
  
  export type StyleType = 'default' | 'primary' | 'link' | 'inverse';
  
  export const Style = {
    DEFAULT: 'default',
    PRIMARY: 'primary',
    LINK: 'link',
    INVERSE: 'inverse',
  };