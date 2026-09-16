import { slugifyAll } from "./slugify";

type TaggableEntry = {
  data: {
    draft?: boolean;
    tags: string[];
  };
};

const getPostsByTag = <T extends TaggableEntry>(entries: T[], tag: string) =>
  entries.filter(({ data }) => slugifyAll(data.tags).includes(tag));

export default getPostsByTag;
