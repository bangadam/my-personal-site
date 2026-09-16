declare module "/public/data.json" {
  export interface AllGptResource {
    title: string;
    url: string;
    text: string;
    category: string;
  }

  const data: AllGptResource[];
  export default data;
}
