export interface Image {
  filename: string;
  description: string;
  focus?: string;
}

export interface SourceSet {
  src: string;
  width: number;
  breakpoint: number;
}

export interface Breakpoint {
  breakpoint: number;
  width: number;
}
