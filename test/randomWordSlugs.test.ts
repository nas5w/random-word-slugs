import randomWordSlugs from "../index";
import { wordList } from "../words";

const allAdjectives = wordList.adjective.map(({ word }) => word) as string[];
const allNouns = wordList.noun.map(({ word }) => word) as string[];

describe("randomWordSlugs", () => {
  it("generates three random kebab case words by default", () => {
    const slug = randomWordSlugs();
    const parts = slug.split("-");
    expect(parts.length).toBe(3);
    expect(allAdjectives.includes(parts[0])).toBe(true);
    expect(allAdjectives.includes(parts[1])).toBe(true);
    expect(allNouns.includes(parts[2])).toBe(true);
  });
});
