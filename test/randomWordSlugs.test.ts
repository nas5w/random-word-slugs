import { generateSlug, RandomWordOptions, totalUniqueSlugs } from "../index";
import { Categories, PartsOfSpeech, wordList } from "../words";

const allAdjectives = wordList.adjective.map(({ word }) => word) as string[];
const allNouns = wordList.noun.map(({ word }) => word) as string[];
const numAdjectives = allAdjectives.length;
const numNouns = allNouns.length;

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
    for (let i = 0; i < 1000; i++) {
      fn();
    }
  });
}

describe("wordList", () => {
  // TODO: generalize this for any word types
  it("has no repeats", () => {
    const { noun, adjective } = wordList;
    const allNouns = new Set<string>();
    const repeats: {
      noun: string[];
      adjective: string[];
    } = { noun: [], adjective: [] };
    noun.forEach(({ word }) => {
      if (allNouns.has(word)) {
        repeats.noun.push(word);
      } else {
        allNouns.add(word);
      }
    });
    const allAdjectives = new Set<string>();
    adjective.forEach(({ word }) => {
      if (allAdjectives.has(word)) {
        repeats.adjective.push(word);
      } else {
        allAdjectives.add(word);
      }
    });

    if (repeats.noun.length || repeats.adjective.length) {
      throw new Error(`Some words are repeated: ${JSON.stringify(repeats)}`);
    }
  });
});

describe("generateSlug", () => {
  test("generates three random kebab-cased words by default", () => {
    const slug = generateSlug();
    const parts = slug.split("-");
    expect(parts.length).toBe(3);
    expect(allAdjectives.includes(parts[0])).toBe(true);
    expect(allAdjectives.includes(parts[1])).toBe(true);
    expect(allNouns.includes(parts[2])).toBe(true);
  });
  test("generates four random kebab-cased words if requested", () => {
    const slug = generateSlug(4);
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
        adjective: ["color", "appearance"],
      },
    };
    const slug = generateSlug(3, options);
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
    const slug = generateSlug(3, { format: "camel" });
    const second = slug.match(/[A-Z].+?(?=[A-Z])/)![0];
    const splitRegex = new RegExp(second + "(.+)");
    const [first, third] = slug.split(splitRegex);
    expect(first[0]).toBe(first[0].toLowerCase());
    expect(allAdjectives.includes(first)).toBe(true);
    expect(second[0]).toBe(second[0].toUpperCase());
    expect(allAdjectives.includes(second.toLowerCase())).toBe(true);
    expect(third[0]).toBe(third[0].toUpperCase());
    expect(allNouns.includes(third.toLowerCase())).toBe(true);
  });
  test("should format as Title Case", () => {
    const slug = generateSlug(3, { format: "title" });
    const [first, second, third] = slug.split(" ");
    expect(first[0]).toBe(first[0].toUpperCase());
    expect(allAdjectives.includes(first.toLowerCase())).toBe(true);
    expect(second[0]).toBe(second[0].toUpperCase());
    expect(allAdjectives.includes(second.toLowerCase())).toBe(true);
    expect(third[0]).toBe(third[0].toUpperCase());
    expect(allNouns.includes(third.toLowerCase())).toBe(true);
  });
  test("should format as lower case", () => {
    const slug = generateSlug(3, { format: "lower" });
    const [first, second, third] = slug.split(" ");
    expect(first[0]).toBe(first[0].toLowerCase());
    expect(allAdjectives.includes(first)).toBe(true);
    expect(second[0]).toBe(second[0].toLowerCase());
    expect(allAdjectives.includes(second)).toBe(true);
    expect(third[0]).toBe(third[0].toLowerCase());
    expect(allNouns.includes(third)).toBe(true);
  });
  test("should format as Sentence case", () => {
    const slug = generateSlug(3, { format: "sentence" });
    const [first, second, third] = slug.split(" ");
    expect(first[0]).toBe(first[0].toUpperCase());
    expect(allAdjectives.includes(first.toLowerCase())).toBe(true);
    expect(second[0]).toBe(second[0].toLowerCase());
    expect(allAdjectives.includes(second)).toBe(true);
    expect(third[0]).toBe(third[0].toLowerCase());
    expect(allNouns.includes(third)).toBe(true);
  });
});

describe("totalUniqueSlugs", () => {
  it("should tally up total slugs", () => {
    const num = totalUniqueSlugs();
    const actualTotal = numAdjectives * numAdjectives * numNouns;
    expect(num).toBe(actualTotal);
  });
  it("should tally slugs in subset of categories", () => {
    const num = totalUniqueSlugs(4, {
      categories: {
        noun: ["animals", "people"],
        adjective: ["color", "appearance"],
      },
    });
    const numAdjectives = wordList.adjective.filter(({ categories }) => {
      for (let category of categories) {
        if (category === "color" || category === "appearance") {
          return true;
        }
      }
      return false;
    }).length;
    const numNouns = wordList.noun.filter(({ categories }) => {
      for (let category of categories) {
        if (category === "animals" || category === "people") {
          return true;
        }
      }
      return false;
    }).length;
    const actualTotal = numAdjectives ** 3 * numNouns;
    expect(num).toBe(actualTotal);
  });
});
