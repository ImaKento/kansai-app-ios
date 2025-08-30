export interface RouteData {
  id: number;
  time: string;
  duration: string;
  price: string;
  transfers: string;
  lines: { name: string; color: string }[];
  route?: string;
}
