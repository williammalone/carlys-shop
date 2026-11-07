// Items for sale. Replace these placeholders with the items Carly texted.
// Fields: name, price (number, USD), condition, description, image (optional URL or relative path), sold (true/false)
window.SHOP = {
  title: "For Sale",
  tagline: "Good stuff, fair prices, local pickup.",
  contact: {
    // Buyers will tap one of these to claim an item.
    sms: "",        // e.g. "+13035551234"
    email: "",      // e.g. "you@example.com"
    location: "Erie, CO"
  },
  items: [
    {
      name: "Example item one",
      price: 25,
      condition: "Like new",
      description: "Placeholder. Replace with the first item from Carly's message.",
      image: "",
      sold: false
    },
    {
      name: "Example item two",
      price: 40,
      condition: "Good",
      description: "Placeholder. Replace with the second item from Carly's message.",
      image: "",
      sold: false
    },
    {
      name: "Example item three",
      price: 10,
      condition: "Fair",
      description: "Placeholder. Replace with the third item from Carly's message.",
      image: "",
      sold: true
    }
  ]
};
