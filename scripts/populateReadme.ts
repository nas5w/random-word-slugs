import fs from "fs";
import { totalUniqueSlugs } from "../index";
import { WordList, wordList } from "../words";

console.log("Adding stats to README");

// Populate slug count
const combos = totalUniqueSlugs().toLocaleString("en-US");
const readme = fs.readFileSync("./scripts/README_TEMPLATE.md", "utf-8");

// Populate categories
function listToUnique(list: WordList[keyof WordList]) {
  const unique = new Set<string>();
  list.forEach(({ categories }: WordList[keyof WordList][number]) => {
    categories.forEach(
      (category: WordList[keyof WordList][number]["categories"][number]) =>
        unique.add(category)
    );
  });
  return "- " + [...unique].sort().join("\n- ");
}

const adjectiveCategories = listToUnique(wordList.adjective);
const nounCategories = listToUnique(wordList.noun);

const replaced = readme
  .replace("{{uniqueCombinations}}", combos)
  .replace("{{adjectiveCategories}}", adjectiveCategories)
  .replace("{{nounCategories}}", nounCategories);

// Write final README
fs.writeFileSync("./README.md", replaced);
