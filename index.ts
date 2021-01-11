import { getWordsByCategory, PartsOfSpeech, Categories } from "./words";

interface FixedLengthArray<T extends any, L extends number> extends Array<T> {
  0: T;
  length: L;
}

type Format = "kebabCase" | "camelCase" | "titleCase" | "lowercase";

type Options<T, L extends number> = {
  partsOfSpeech: FixedLengthArray<T, L>;
  categories: Partial<
    {
      [K in PartsOfSpeech]: Categories[K][];
    }
  >;
  format: Format;
};

export type RandomWordOptions<L extends number> = Partial<
  Options<PartsOfSpeech, L>
>;

function randomWordSlugs<N extends number>(
  numberOfWords?: N,
  options?: Partial<Options<PartsOfSpeech, N>>
) {
  const numWords = numberOfWords || 3;
  const defaultOptions: Options<PartsOfSpeech, typeof numWords> = {
    partsOfSpeech: getDefaultPartsOfSpeech(numWords),
    categories: {},
    format: "kebabCase",
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

export default randomWordSlugs;

function getDefaultPartsOfSpeech<N extends number>(length: N) {
  const partsOfSpeech = [];
  for (let i = 0; i < length - 1; i++) {
    partsOfSpeech.push("adjective");
  }
  partsOfSpeech.push("noun");
  return partsOfSpeech as FixedLengthArray<PartsOfSpeech, N>;
}

function formatter(arr: string[], format: Format) {
  if (format === "kebabCase") {
    return arr.join("-").toLowerCase();
  }
  if (format === "camelCase") {
    return arr
      .map((el, i) => {
        if (i === 0) return el.toLowerCase();
        return el[0].toUpperCase() + el.slice(1).toLowerCase();
      })
      .join("");
  }
  if (format === "lowercase") {
    return arr.join(" ").toLowerCase();
  }
  return arr
    .map((el) => {
      return el[0].toUpperCase + el.slice(1).toLowerCase();
    })
    .join(" ");
}
