import { ProcessedReading, Reading } from "@/components/types";

export function processReadings(readings: Reading[]): ProcessedReading[] {
  return readings.map((reading, index) => ({
    ...reading,
    consumption: index === 0 ? 0 : reading.value - readings[index - 1].value
  }));
}
