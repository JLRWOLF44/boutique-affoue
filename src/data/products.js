import pull1 from "../assets/images/pull 1.avif";
import pull2 from "../assets/images/pull 2.avif";

import robe1 from "../assets/images/robe fleuri.avif";
import robe2 from "../assets/images/robe fleurie 2.webp";
import robe3 from "../assets/images/robe fleuri 3.avif";

import sac1 from "../assets/images/sac a main 1.webp";
import sac2 from "../assets/images/sac a main 2.webp";

import veste1 from "../assets/images/veste 1.avif";
import veste2 from "../assets/images/veste 2.avif";

export const products = [
  {
    id: 1,
    name: "Robe fleurie",
    price: 20,
    image: robe1,
    images: [robe1, robe2, robe3],
    size: "M",
    category: "Robe",
    condition: "Très bon état",
    description: "Une jolie robe fleurie légère et élégante.",
  },
  {
    id: 2,
    name: "Veste en jean",
    price: 25,
    image: veste1,
    images: [veste1, veste2],
    size: "L",
    category: "Veste",
    condition: "Bon état",
    description: "Veste en jean classique, facile à porter.",
  },
  {
    id: 3,
    name: "Pull chaud",
    price: 15,
    image: pull1,
    images: [pull1, pull2],
    size: "S",
    category: "Pull",
    condition: "Comme neuf",
    description: "Pull doux et chaud pour l’hiver.",
  },
  {
    id: 4,
    name: "Sac à main",
    price: 18,
    image: sac1,
    images: [sac1, sac2],
    size: "Unique",
    category: "Accessoire",
    condition: "Très bon état",
    description: "Sac élégant pour toutes les occasions.",
  },
];