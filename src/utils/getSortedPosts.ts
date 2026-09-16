type SortableEntry = {
  data: {
    draft?: boolean;
    pubDatetime: string | Date;
  };
};

const getSortedPosts = <T extends SortableEntry>(posts: T[]) =>
  posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.pubDatetime).getTime() / 1000) -
        Math.floor(new Date(a.data.pubDatetime).getTime() / 1000)
    );

export default getSortedPosts;
