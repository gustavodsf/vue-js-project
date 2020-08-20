const STATUS = {
  underConstruction: 0,
  inReview: 1,
  revised: 2,
  finished: 3
};
Object.freeze(STATUS);

const ALL_STATUS = Object.values(STATUS);
Object.freeze(ALL_STATUS);

const STATUS_LIST = [
  { value: 0, text: "em construção" },
  { value: 1, text: "em revisão" },
  { value: 2, text: "revisada" },
  { value: 3, text: "finalziada" }
];
Object.freeze(STATUS_LIST);

export default {
  STATUS,
  ALL_STATUS,
  STATUS_LIST
};
