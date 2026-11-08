// Items for sale. Edit this file only; index.html reads it.
// Fields per item:
//   name         shown on the card
//   category     groups items into the filter chips (Blankets, Wearables, Home & Cats, Art, Cards)
//   price        number in USD. null = "Ask" (no price set yet). 0 = "Free".
//   condition    short line under the name
//   description  a sentence or two
//   image        main photo (relative path). Optional if `images` is set.
//   images       optional list of photos; the first is the main one, the rest show as thumbnails
//   sold         true hides it by default and shows a SOLD badge
//
// Prices were set Nov 8, 2026 from current Etsy/market asking prices for comparable handmade work,
// discounted for a local cash sale. Adjust freely; null shows "Ask".
window.SHOP = {
  title: "Carly's Handmade Blankets & Art",
  tagline: "Chunky knit blankets, crochet you can wear, beds your cat will steal, and original paintings. All handmade in Colorado.",
  eyebrow: "Handmade · one of each",
  payment: "Cash or Venmo at pickup.",
  url: "https://williammalone.github.io/carlys-shop/",   // used for share links and previews
  about: {
    title: "About Carly",
    text: "Every piece here was made by hand by Carly in Colorado: chunky chenille blankets knit by the armful, crochet she wears herself first, beds her cat test-drives, and paintings of the animals she loves. Nothing is mass-made and nothing is repeated, so when a piece is gone, it's gone.",
    image: "images/blanket-navy-chunky-worn.jpg",
    alt: "Carly wrapped in the navy chunky knit blanket"
  },
  custom: {
    title: "Want something custom?",
    text: "A blanket in your colors, a pet portrait from a photo, or a card with your words. Carly takes requests."
  },
  contact: {
    // Buyers tap "I'm interested" to open one of these. Fill in one or both.
    sms: "",        // e.g. "+13035551234"
    email: "william.malone@gmail.com",
    location: "Erie, CO"
  },
  items: [
    // --- Chunky knit blankets ---
    {
      name: "Navy chunky knit blanket",
      category: "Blankets",
      price: 140,
      condition: "New, handmade",
      description: "Hand-knit chenille blanket in deep navy with color-blocked teal and sage ends. Oversized and heavy enough to wear like a wrap.",
      image: "images/blanket-navy-chunky-worn.jpg",
      sold: false
    },
    {
      name: "Purple chunky knit blanket",
      category: "Blankets",
      price: 150,
      condition: "New, handmade",
      description: "Hand-knit chenille throw in plum purple. Covers most of a queen bed. Cat not included.",
      images: ["images/blanket-purple-chunky-bed.jpg", "images/blanket-purple-chunky-detail.jpg"],
      sold: false
    },
    {
      name: "Grey two-tone chunky knit blanket",
      category: "Blankets",
      price: 120,
      condition: "New, handmade",
      description: "Hand-knit chenille blanket in light and dark grey stripes. Big enough to wrap up in.",
      image: "images/blanket-grey-chunky-worn.jpg",
      sold: false
    },

    // --- Crochet wearables ---
    {
      name: "Grey crochet off-shoulder sweater",
      category: "Wearables",
      price: 95,
      condition: "New, handmade",
      description: "Cropped boxy sweater with a granny-square motif on the front and wide bell sleeves. Wears off the shoulder. Fits roughly S to M.",
      images: ["images/sweater-grey-crochet-1.jpg", "images/sweater-grey-crochet-3.jpg", "images/sweater-grey-crochet-4.jpg", "images/sweater-grey-crochet-2.jpg"],
      sold: false
    },
    {
      name: "Granny-square hooded scarf",
      category: "Wearables",
      price: 55,
      condition: "New, handmade",
      description: "Long crochet scarf in mustard, olive, and brown granny squares with a built-in hood. Wear it as a scarf or pull the hood up.",
      images: ["images/scarf-granny-square-worn.jpg", "images/scarf-granny-square-hood.jpg", "images/scarf-granny-square-flat.jpg", "images/scarf-granny-square-cat.jpg"],
      sold: false
    },
    {
      name: "Purple granny-stitch beanie",
      category: "Wearables",
      price: 28,
      condition: "New, handmade",
      description: "Slouchy crochet beanie in purple, teal, and cream with a dark purple brim.",
      image: "images/beanie-purple-granny.jpg",
      sold: false
    },
    {
      name: "Teal beanie with gold crown",
      category: "Wearables",
      price: 25,
      condition: "New, handmade",
      description: "Sparkly teal crochet beanie with a folded brim and a little gold crown on top.",
      image: "images/beanie-teal-crown.jpg",
      sold: false
    },
    {
      name: "Grey crochet slippers",
      category: "Wearables",
      price: 28,
      condition: "New, handmade",
      description: "Thick grey crochet house slippers with a ribbed top. Women's medium.",
      image: "images/slippers-grey-crochet.jpg",
      sold: false
    },
    {
      name: "Crochet water-bottle sling",
      category: "Wearables",
      price: 22,
      condition: "New, handmade",
      description: "Crossbody bottle holder in pink, green, and purple stripes with a long strap. Fits a standard water bottle.",
      image: "images/bottle-sling-crochet.jpg",
      sold: false
    },

    // --- Home and cat things ---
    {
      name: "Chunky crochet cat bed, mint and white",
      category: "Home & Cats",
      price: 45,
      condition: "New, handmade",
      description: "Round cat bed in soft chenille, white with mint flecks. Cat-tested and approved, see photos.",
      images: ["images/cat-bed-mint-2.jpg", "images/cat-bed-mint-1.jpg", "images/cat-bed-mint-3.jpg"],
      sold: false
    },
    {
      name: "Chunky crochet cat bed, grey marble",
      category: "Home & Cats",
      price: 45,
      condition: "New, handmade",
      description: "Round cat bed in marbled grey, black, and white chenille. Same size as the mint one.",
      image: "images/cat-bed-grey-marble.jpg",
      sold: false
    },
    {
      name: "Crochet flower coasters, set of 4",
      category: "Home & Cats",
      price: 20,
      condition: "New, handmade",
      description: "Flower-shaped coasters in red, pink, yellow, and purple with lime centers. Set of four.",
      images: ["images/coasters-flower-table.jpg", "images/coasters-flower-stack.jpg"],
      sold: false
    },
    {
      name: "Crochet potted flowers",
      category: "Home & Cats",
      price: 35,
      condition: "New, handmade",
      description: "A bouquet of ruffled crochet flowers in purple, yellow, and pink in a brown crochet pot. Never needs water.",
      images: ["images/flowers-crochet-pot-2.jpg", "images/flowers-crochet-pot-1.jpg"],
      sold: false
    },
    {
      name: "Cat measuring cups with knit tails",
      category: "Home & Cats",
      price: 12,
      condition: "Like new",
      description: "Set of four ceramic cat measuring cups (1/4 to 1 cup) with black knit tail sleeves on the handles.",
      image: "images/cat-measuring-cups.jpg",
      sold: false
    },

    // --- Paintings and drawings ---
    {
      name: "Rainbow cat, acrylic on canvas",
      category: "Art",
      price: 150,
      condition: "Original, ready to hang",
      description: "Bold cat portrait in orange, green, blue, and purple brushwork on a purple background. Roughly 18 x 24 inches.",
      image: "images/painting-rainbow-cat.jpg",
      sold: false
    },
    {
      name: "Purple octopus, acrylic on canvas",
      category: "Art",
      price: 95,
      condition: "Original",
      description: "Purple octopus with dotted tentacles on a swirling teal and blue background. Roughly 16 x 20 inches.",
      image: "images/painting-purple-octopus.jpg",
      sold: false
    },
    {
      name: "Cherry blossoms, acrylic on canvas",
      category: "Art",
      price: 85,
      condition: "Original",
      description: "Pink cherry blossom branches on a warm pink and orange sky. Roughly 12 x 24 inches.",
      image: "images/painting-cherry-blossoms.jpg",
      sold: false
    },
    {
      name: "Husky on green, acrylic on canvas",
      category: "Art",
      price: 60,
      condition: "Original",
      description: "Black and white husky portrait on a textured green background. Roughly 11 x 14 inches.",
      image: "images/painting-husky-green.jpg",
      sold: false
    },
    {
      name: "Husky in purple, watercolor",
      category: "Art",
      price: 45,
      condition: "Original, on paper",
      description: "Loose watercolor husky with amber eyes and a purple-and-white coat against a purple and green wash.",
      image: "images/painting-husky-purple-watercolor.jpg",
      sold: false
    },
    {
      name: "Brown husky, watercolor",
      category: "Art",
      price: 45,
      condition: "Original, on paper",
      description: "Brown and white husky portrait on a soft purple wash.",
      image: "images/painting-husky-brown-watercolor.jpg",
      sold: false
    },
    {
      name: "Stag with paint splatter, watercolor",
      category: "Art",
      price: 55,
      condition: "Original, on paper",
      description: "Grey stag with full antlers surrounded by purple, pink, and blue splatter.",
      image: "images/painting-stag-splatter.jpg",
      sold: false
    },
    {
      name: "Orange tabby, pastel on paper",
      category: "Art",
      price: 45,
      condition: "Original, on paper",
      description: "Orange and white tabby cat with green eyes, drawn in pastel and colored pencil.",
      image: "images/drawing-orange-tabby.jpg",
      sold: false
    },
    {
      name: "Grey cat, charcoal and pastel",
      category: "Art",
      price: 40,
      condition: "Original, on paper",
      description: "Grey and white cat with bright green eyes, sketched in charcoal with pastel accents.",
      image: "images/drawing-grey-cat.jpg",
      sold: false
    },
    {
      name: "Sunburst pair, acrylic on canvas",
      category: "Art",
      price: 80,
      condition: "Original, set of 2",
      description: "Two matching sunburst canvases: one in warm oranges and pinks, one in cool blues and greens. Hang them together or apart.",
      image: "images/paintings-sunburst-pair.jpg",
      sold: false
    },
    {
      name: "Geometric abstract and sunburst, acrylic on canvas",
      category: "Art",
      price: 70,
      condition: "Original, set of 2",
      description: "A colorful geometric abstract in blues, greens, and yellows, plus a pink-and-orange sunburst. Sold as a pair or separately.",
      image: "images/paintings-geometric-and-sunburst.jpg",
      sold: false
    },

    // --- Cards ---
    {
      name: "Handmade pop-up cards, made to order",
      category: "Cards",
      price: 8,
      condition: "Made to order",
      description: "Hand-cut pop-up greeting cards with a custom message, $8 each. Shown: a \"Happy Meow-thers Day\" card with a pop-up cat in a plant pot.",
      images: ["images/card-meowthers-day-front.jpg", "images/card-meowthers-day-inside.jpg"],
      sold: false
    }
  ]
};
