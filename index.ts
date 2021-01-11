import { getWordsByCategory, PartsOfSpeech, Categories } from "./words";

const DEFAULT_NUMBER_OF_WORDS = 3;

interface FixedLengthArray<T extends any, L extends number> extends Array<T> {
  0: T;
  length: L;
}

type Case = "kebab" | "camel" | "title" | "lower" | "sentence";

type Options<T, L extends number> = {
  partsOfSpeech: FixedLengthArray<T, L>;
  categories: Partial<
    {
      [K in PartsOfSpeech]: Categories[K][];
    }
  >;
  format: Case;
};

export type RandomWordOptions<N extends number> = Partial<
  Options<PartsOfSpeech, N>
>;

export function generateSlug<N extends number>(
  numberOfWords?: N,
  options?: Partial<Options<PartsOfSpeech, N>>
) {
  const numWords = numberOfWords || DEFAULT_NUMBER_OF_WORDS;
  const defaultOptions: Options<PartsOfSpeech, typeof numWords> = {
    partsOfSpeech: getDefaultPartsOfSpeech(numWords),
    categories: {},
    format: "kebab",
  };
  const opts: Options<PartsOfSpeech, typeof numWords> = {
    ...defaultOptions,
    ...options,
  };

  const words = [];

  for (let i = 0; i < numWords; i++) {
    const partOfSpeech = opts.partsOfSpeech[i];
    const candidates = getWordsByCategory(
      opts.partsOfSpeech[i],
      opts.categories[partOfSpeech]
    );
    const rand = candidates[Math.floor(Math.random() * candidates.length)];
    words.push(rand);
  }

  return formatter(words, opts.format);
}

function getDefaultPartsOfSpeech<N extends number>(length: N) {
  const partsOfSpeech = [];
  for (let i = 0; i < length - 1; i++) {
    partsOfSpeech.push("adjective");
  }
  partsOfSpeech.push("noun");
  return partsOfSpeech as FixedLengthArray<PartsOfSpeech, N>;
}

function formatter(arr: string[], format: Case) {
  if (format === "kebab") {
    return arr.join("-").toLowerCase();
  }
  if (format === "camel") {
    return arr
      .map((el, i) => {
        if (i === 0) return el.toLowerCase();
        return el[0].toUpperCase() + el.slice(1).toLowerCase();
      })
      .join("");
  }
  if (format === "lower") {
    return arr.join(" ").toLowerCase();
  }
  if (format === "sentence") {
    return arr
      .map((el, i) => {
        if (i === 0) {
          return el[0].toUpperCase() + el.slice(1).toLowerCase();
        }
        return el;
      })
      .join(" ");
  }

  return arr
    .map((el) => {
      return el[0].toUpperCase() + el.slice(1).toLowerCase();
    })
    .join(" ");
}

export function totalUniqueSlugs<N extends number>(
  numberOfWords?: N,
  options?: RandomWordOptions<N>
) {
  const numAdjectives = getWordsByCategory(
    "adjective",
    options?.categories?.adjective
  ).length;
  const numNouns = getWordsByCategory("noun", options?.categories?.noun).length;
  const nums = {
    adjective: numAdjectives,
    noun: numNouns,
  };

  const numWords = numberOfWords || DEFAULT_NUMBER_OF_WORDS;
  const partsOfSpeech =
    options?.partsOfSpeech || getDefaultPartsOfSpeech(numWords);

  let combos = 1;
  for (let i = 0; i < numWords; i++) {
    combos *= nums[partsOfSpeech[i]];
  }
  return combos;
}
