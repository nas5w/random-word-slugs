# Random Word Slugs

A handy utility to create those random word slugs (e.g., `generous-pink-biscuit`) you see all over the place.

[![Build Status](https://travis-ci.org/nas5w/random-word-slugs.svg?branch=master)](https://travis-ci.org/nas5w/random-word-slugs) [![Codecov Status](https://codecov.io/gh/nas5w/random-word-slugs/branch/master/graph/badge.svg)](https://codecov.io/gh/nas5w/random-word-slugs/branch/master)

<hr />

# Installation

Install with npm

```bash
npm i random-word-slugs
```

Install with yarn

```bash
yarn add random-word-slugs
```

# Usage

The `random-word-slugs` package can be used without any parameters and defaults to a three-word, kebab-cased slug. **Currently, the default configuration has {{uniqueCombinations}} unique slug combinations**.

```javascript
import { generateSlug } from "random-word-slugs";

const slug = generateSlug();
console.log(slug);
// "elegant-green-coat"
```

The `generateSlug` function takes up to two arguments. The first argument is the `numberOfWords` in the slug (defaulting to three) and the second argument is the package `options`. The following example makes use of both parameters and provides an option to title-case the output:

```javascript
const slug = generateSlug(4, { format: "title" });
console.log(slug);
// "Elegant Happy Green Coat"
```

# Available Options

The `options` object can have any partial set of the following key/value pairs:

```
{
  format: "kebab" | "camel" | "sentence" | "lower" | "title",
  partsOfSpeech: ("adjective" | "noun")[],
  categories: {
    adjective: ("color" | "appearance" | etc...)[],
    noun: ("people" | "animals" | etc...)[]
  }
}
```

Note that, if provided, `partsOfSpeech` must be an array the same length as the number of words you're requesting. If using Typescript, the compiler will check this for you.

An example of a completed `options` object might look like this for a three-word slug:

```javascript
const options = {
  format: "camel",
  partsOfSpeech: ["adjective", "noun", "adjective"],
  categories: {
    adjective: ["color", "appearance"],
    noun: ["animals"],
  },
};
```

Based on these options, our output might look something like `blueBearTall`.

# Typescript Support for Options

The package exposes a `RandomWordOptions<N>` type, with `N` being the number of words in the slug. If you want to use this type to specify an options object, it might look something like this (although a `Partial` options object is certainly allowed and probably more common):

```typescript
import { RandomWordOptions } from "random-word-slugs";

const options: RandomWordOptions<3> = {
  format: "title",
  categories: {
    noun: ["animals", "place"],
    adjective: ["color", "personality"],
  },
  partsOfSpeech: ["adjective", "noun", "adjective"],
};
```

Importantly, the generic `3` here will enforce `partsOfSpeech` being a three-element tuple.

# Categories

The `categories` option allows you to generate your random slug from a subset of categories. Perhaps you only want colorful animals! You can specify one or many categories for the adjectives and nouns that comprise your random slug. The following is a list of categories currently in the repository:

Adjective Categories:

{{adjectiveCategories}}

Noun Categories:

{{nounCategories}}

# Assessing the Combinatorics

When using the package, you might be curious about how many different slug combinations exist. The package exposes a function to help with this called `totalUniqueSlugs`. This function can be used without arguments and will assume a three-slug `adjective-adjective-noun` format:

```javascript
import { totalUniqueSlugs } from "random-word-slugs";

const totalSlugs = totalUniqueSlugs();
console.log(totalSlugs);
// 100000
```

**Note:** The `100000` number shown here is just an example and not a representation of the total number of slugs in the package at any moment (that evolves as words are added).

You can also assess the combinatoric space if you have a different number of words, word ordering, or a subset of categories. In the following example, we'll assume a four-word slug, in the order `adjective-noun-adjective-noun`, with only color adjectives and animal nouns:

```javascript
import { totalUniqueSlugs } from "random-word-slugs";

const totalSlugs = totalUniqueSlugs(4, {
  partsOfSpeech: ["adjective", "noun", "adjective", "noun"],
  categories: {
    adjective: ["color"],
    noun: ["animals"],
  },
});
console.log(totalSlugs);
// 1000
```

Again, this `1000` is just an example. Importantly, this could help you determine that you're not comfortable with this limited combinatoric space and you can choose to add additional categories.
