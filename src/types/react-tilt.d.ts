declare module 'react-tilt' {
  import { Component, ReactNode, CSSProperties } from 'react';

  export interface TiltOptions {
    reverse?: boolean;
    max?: number;
    perspective?: number;
    scale?: number;
    speed?: number;
    transition?: boolean;
    axis?: 'x' | 'y' | null;
    reset?: boolean;
    easing?: string;
  }

  export interface TiltProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    options?: TiltOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  export class Tilt extends Component<TiltProps> {}
}
