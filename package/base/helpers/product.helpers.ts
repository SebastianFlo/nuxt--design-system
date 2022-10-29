export const createTags = (tags: string[]) => {
  return (
    tags &&
    tags.map((tag) => ({
      id: Math.floor(Math.random() * 100000),
      title: tag,
      image: tag,
      description: 'no description',
    }))
  );
};
