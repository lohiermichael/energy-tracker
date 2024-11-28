export interface Reading {
  date: string;
  value: number;
}

export interface ProcessedReading extends Reading {
  consumption: number;
}
