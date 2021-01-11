export type PartsOfSpeech = keyof typeof wordList;

export const wordList = {
  noun: [
    { word: "mother", categories: ["people", "family"] },
    { word: "father", categories: ["people", "family"] },
    { word: "baby", categories: ["people", "family"] },
    { word: "child", categories: ["people", "family"] },
    { word: "toddler", categories: ["people", "family"] },
    { word: "teenager", categories: ["people", "family"] },
    { word: "grandmother", categories: ["people", "family"] },
    { word: "student", categories: ["people", "education"] },
    { word: "teacher", categories: ["people", "education"] },
    { word: "minister", categories: ["people", "religion"] },
    { word: "businessperson", categories: ["people", "business"] },
    { word: "salesclerk", categories: ["people", "business"] },
    { word: "woman", categories: ["people"] },
    { word: "man", categories: ["people"] },
    { word: "lion", categories: ["animals"] },
    { word: "tiger", categories: ["animals"] },
    { word: "bear", categories: ["animals"] },
    { word: "dog", categories: ["animals"] },
    { word: "cat", categories: ["animals"] },
    { word: "alligator", categories: ["animals"] },
    { word: "cricket", categories: ["animals"] },
    { word: "bird", categories: ["animals"] },
    { word: "wolf", categories: ["animals"] },
    { word: "table", categories: ["thing"] },
    { word: "truck", categories: ["thing", "transportation"] },
    { word: "book", categories: ["thing", "education"] },
    { word: "pencil", categories: ["thing", "education"] },
    { word: "computer", categories: ["thing", "technology"] },
    { word: "coat", categories: ["thing"] },
    { word: "boots", categories: ["thing"] },
    { word: "city", categories: ["place"] },
    { word: "state", categories: ["place"] },
    { word: "country", categories: ["place"] },
    { word: "continent", categories: ["place"] },
    { word: "coffeeshop", categories: ["place"] },
    { word: "restaurant", categories: ["place"] },
    { word: "park", categories: ["place"] },
    { word: "zoo", categories: ["place"] },
  ] as const,
  adjective: [
    { word: "green", categories: ["colors"] },
    { word: "jealous", categories: ["emotions"] },
    { word: "attractive", categories: ["appearance"] },
    { word: "bald", categories: ["appearance"] },
    { word: "beautiful", categories: ["appearance"] },
    { word: "chubby", categories: ["appearance"] },
    { word: "clean", categories: ["appearance"] },
    { word: "dazzling", categories: ["appearance"] },
    { word: "drab", categories: ["appearance"] },
    { word: "elegant", categories: ["appearance"] },
    { word: "fancy", categories: ["appearance"] },
    { word: "fit", categories: ["appearance"] },
    { word: "attractive", categories: ["appearance"] },
  ] as const,
};

export type WordList = typeof wordList;

export type Categories = {
  [K in keyof WordList]: WordList[K][number]["categories"][number];
};

export function getWordsByCategory<P extends PartsOfSpeech>(
  partOfSpeech: P,
  categories: Categories[P][] = []
) {
  const selectedCategoried = new Set(categories);
  const selectedWords: WordList[P][number]["word"][] = [];

  for (let word of wordList[partOfSpeech]) {
    if (
      categories.length === 0 ||
      word.categories.some((cat: any) => selectedCategoried.has(cat))
    ) {
      selectedWords.push(word.word);
    }
  }

  return selectedWords;
}
