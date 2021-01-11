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
  const wordCategories = (() => {
    for (let w of wordList[partOfSpeech]) {
      if (w.word === word) {
        return w.categories;
      }
    }
  })();

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
  test("should format as camelCase", () => {
    const slug = randomWordSlugs(3, { format: "camel" });
    const second = slug.match(/[A-Z].+?(?=[A-Z])/)![0];
    const [first, third] = slug.split(second!);
    expect(first[0]).toBe(first[0].toLowerCase());
    expect(allAdjectives.includes(first)).toBe(true);
    expect(second[0]).toBe(second[0].toUpperCase());
    expect(allAdjectives.includes(second.toLowerCase())).toBe(true);
    expect(third[0]).toBe(third[0].toUpperCase());
    expect(allNouns.includes(third.toLowerCase())).toBe(true);
  });
  test("should format as Title Case", () => {
    const slug = randomWordSlugs(3, { format: "title" });
    const [first, second, third] = slug.split(" ");
    expect(first[0]).toBe(first[0].toUpperCase());
    expect(allAdjectives.includes(first.toLowerCase())).toBe(true);
    expect(second[0]).toBe(second[0].toUpperCase());
    expect(allAdjectives.includes(second.toLowerCase())).toBe(true);
    expect(third[0]).toBe(third[0].toUpperCase());
    expect(allNouns.includes(third.toLowerCase())).toBe(true);
  });
  test("should format as lower case", () => {
    const slug = randomWordSlugs(3, { format: "lower" });
    const [first, second, third] = slug.split(" ");
    expect(first[0]).toBe(first[0].toLowerCase());
    expect(allAdjectives.includes(first)).toBe(true);
    expect(second[0]).toBe(second[0].toLowerCase());
    expect(allAdjectives.includes(second)).toBe(true);
    expect(third[0]).toBe(third[0].toLowerCase());
    expect(allNouns.includes(third)).toBe(true);
  });
  test("should format as Sentence case", () => {
    const slug = randomWordSlugs(3, { format: "sentence" });
    const [first, second, third] = slug.split(" ");
    expect(first[0]).toBe(first[0].toUpperCase());
    expect(allAdjectives.includes(first.toLowerCase())).toBe(true);
    expect(second[0]).toBe(second[0].toLowerCase());
    expect(allAdjectives.includes(second)).toBe(true);
    expect(third[0]).toBe(third[0].toLowerCase());
    expect(allNouns.includes(third)).toBe(true);
  });
});
