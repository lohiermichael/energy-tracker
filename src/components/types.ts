export interface Reading {
  date: string;
  value: number;
  id?: string;
}

export interface ProcessedReading extends Reading {
  consumption: number;
}
