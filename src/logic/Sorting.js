export const loadSortingSettings = () =>
  JSON.parse(global.localStorage.getItem(`sorting`) || "{}");
export const updateSortingSettings = (sorting) => {
  global.localStorage.setItem(`sorting`, JSON.stringify(sorting));
  return sorting;
};
