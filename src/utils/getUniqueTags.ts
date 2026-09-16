import { slugifyStr } from "./slugify";

type TaggableEntry = {
  data: {
    draft?: boolean;
    tags: string[];
  };
};

const getUniqueTags = (entries: TaggableEntry[]) => {
  const tags: string[] = entries
    .filter(({ data }) => !data.draft)
    .flatMap(({ data }) => data.tags)
    .map(tag => slugifyStr(tag))
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((tagA, tagB) => tagA.localeCompare(tagB));

  return tags;
};

export default getUniqueTags;
