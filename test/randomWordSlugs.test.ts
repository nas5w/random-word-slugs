import randomWordSlugs, { RandomWordOptions } from "../index";
import { Categories, PartsOfSpeech, WordList, wordList } from "../words";

const allAdjectives = wordList.adjective.map(({ word }) => word) as string[];
const allNouns = wordList.noun.map(({ word }) => word) as string[];

function checkWordInCategories<P extends PartsOfSpeech>(
  partOfSpeech: P,
  word: string,
  categories: Categories[P][]
) {
  const cats = new Set(categories);
  let wordCategories: any[];

  for (let w of wordList[partOfSpeech]) {
    if (w.word === word) {
      wordCategories = (w.categories as unknown) as any[];
      break;
    }
  }

  return wordCategories!.some((cat: any) => cats.has(cat));
}

function test(name: string, fn: () => void) {
  it(name, () => {
    for (let i = 0; i < 100; i++) {
      fn();
    }
  });
}

describe("randomWordSlugs", () => {
  test("generates three random kebab-cased words by default", () => {
    const slug = randomWordSlugs();
    const parts = slug.split("-");
    expect(parts.length).toBe(3);
    expect(allAdjectives.includes(parts[0])).toBe(true);
    expect(allAdjectives.includes(parts[1])).toBe(true);
    expect(allNouns.includes(parts[2])).toBe(true);
  });
  test("generates four random kebab-cased words if requested", () => {
    const slug = randomWordSlugs(4);
    const parts = slug.split("-");
    expect(parts.length).toBe(4);
    expect(allAdjectives.includes(parts[0])).toBe(true);
    expect(allAdjectives.includes(parts[1])).toBe(true);
    expect(allAdjectives.includes(parts[2])).toBe(true);
    expect(allNouns.includes(parts[3])).toBe(true);
  });
  test("allows user to specify word categories", () => {
    const options: RandomWordOptions<3> = {
      categories: {
        noun: ["animals", "education"],
        adjective: ["colors", "appearance"],
      },
    };
    const slug = randomWordSlugs(3, options);
    const parts = slug.split("-");
    expect(
      checkWordInCategories(
        "adjective",
        parts[0],
        options!.categories!.adjective!
      )
    ).toBe(true);
    expect(
      checkWordInCategories(
        "adjective",
        parts[1],
        options!.categories!.adjective!
      )
    ).toBe(true);
    expect(
      checkWordInCategories("noun", parts[2], options!.categories!.noun!)
    ).toBe(true);
  });
});
