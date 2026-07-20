const plans={
    FREE: {
    id: "free",
    name: "Free",
    planType: "FREE",
    price: 0,
    durationHours: null,
    benefits: [
      "Basic profile access",
      "Profile management",
    ],
  },
  SILVER_1H:{
    id: "silver_1H",
    name: "SILVER_1H",
    planType: "SILVER_1H",
    price: 99,
    durationHours: 1,
    benefits: [
      "Basic profile access",
      "Profile management",
    ],
  },
  SILVER_6H:{
    id: "silver_6H",
    name: "SILVER_6H",
    planType: "SILVER_6H",
    price: 199,
    durationHours: 6,
    benefits: [
      "Basic profile access",
      "Profile management",
    ],
  },
  GOLD:{
    id: "gold",
    name: "GOLD",
    planType: "GOLD",
    price: 299,
    durationHours:12,
    benefits: [
      "Basic profile access",
      "Profile management",
    ],
  }
}

module.exports=plans