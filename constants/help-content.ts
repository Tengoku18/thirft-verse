export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  items: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "getting-started",
    icon: "rocket_launch",
    title: "Getting Started",
    description: "Everything you need to know to start selling on ThriftVerse.",
    items: [
      {
        id: "gs-1",
        question: "How do I create my store on ThriftVerse?",
        answer:
          "After signing up, complete your seller profile by adding a store name, profile photo, and bio. Once your profile is complete, you can start listing items immediately — no approval needed.",
      },
      {
        id: "gs-2",
        question: "What can I sell on ThriftVerse?",
        answer:
          "You can sell pre-loved clothing, shoes, bags, accessories, home décor, and vintage items. All items must be second-hand or pre-owned. New or counterfeit items are not permitted.",
      },
      {
        id: "gs-3",
        question: "How do I list my first item?",
        answer:
          "Tap the + button at the bottom of the screen. Add up to 5 photos, write a clear description, select a category, set your price, and tap Publish. Your listing goes live instantly.",
      },
      {
        id: "gs-4",
        question: "Is ThriftVerse free to use?",
        answer:
          "Listing items is completely free. ThriftVerse charges a small platform fee on completed sales to cover payment processing, buyer protection, and platform maintenance.",
      },
      {
        id: "gs-5",
        question: "What is the Founder Circle?",
        answer:
          "Founder Circle is our exclusive early-seller program. Founders receive a verified badge, priority customer support, reduced platform fees, and access to exclusive promotions. Check Settings → Founder Circle to learn more.",
      },
    ],
  },
  {
    id: "selling",
    icon: "storefront",
    title: "Selling on ThriftVerse",
    description: "Tips and guidance to help you sell faster and smarter.",
    items: [
      {
        id: "sell-1",
        question: "How do I write a good listing?",
        answer:
          "Include 4–5 clear photos (front, back, label, and any flaws), the brand name, size, condition (New with Tags, Like New, Good, Fair), and your measurements if it's clothing. Honest, detailed listings sell faster and reduce returns.",
      },
      {
        id: "sell-2",
        question: "How should I price my items?",
        answer:
          "Browse similar listings on ThriftVerse for pricing guidance. Most pre-loved items sell for 20–40% of their original retail price, depending on brand and condition. Pricing slightly lower than similar items helps you sell quickly.",
      },
      {
        id: "sell-3",
        question: "Can I edit or delete a listing?",
        answer:
          "Yes. Tap any active listing in your store to edit the title, description, price, or photos. You can also archive a listing to temporarily hide it, or delete it permanently.",
      },
      {
        id: "sell-4",
        question: "What happens when someone buys my item?",
        answer:
          "You'll receive a push notification the moment a purchase is made. You have 3 business days to ship the item. A prepaid shipping label will be sent to your registered email address.",
      },
      {
        id: "sell-5",
        question: "Can I offer discounts or bundle deals?",
        answer:
          "You can manually lower prices on listings at any time. Bundle pricing for multiple items from the same seller is something we're actively working on — stay tuned for updates.",
      },
    ],
  },
  {
    id: "payments",
    icon: "payments",
    title: "Payments & Earnings",
    description: "How your money moves on ThriftVerse.",
    items: [
      {
        id: "pay-1",
        question: "When will I get paid?",
        answer:
          "Earnings are released to your ThriftVerse wallet 48 hours after the buyer confirms delivery (or 7 days after the item is marked delivered if the buyer doesn't respond). You can then withdraw to your linked bank account.",
      },
      {
        id: "pay-2",
        question: "Are there any selling fees?",
        answer:
          "ThriftVerse charges a 10% platform fee on each completed sale. This covers secure payment processing, buyer protection, and platform operations. There are no listing fees.",
      },
      {
        id: "pay-3",
        question: "How do I withdraw my earnings?",
        answer:
          "Go to the Earnings tab and tap Withdraw. Enter the amount and confirm your bank details. Withdrawals are processed within 2–5 business days depending on your bank.",
      },
      {
        id: "pay-4",
        question: "What payment methods do buyers use?",
        answer:
          "Buyers can pay using credit cards, debit cards, UPI, and other supported methods. All payments are processed securely through our payment partner — your banking details are never stored on our servers.",
      },
      {
        id: "pay-5",
        question: "What if a buyer requests a refund?",
        answer:
          "If a buyer opens a refund request, our team reviews the case within 48 hours. If the item was significantly not as described, a refund may be issued and the item returned to you. Sellers with accurate listings have fewer disputes.",
      },
    ],
  },
  {
    id: "shipping",
    icon: "local_shipping",
    title: "Shipping & Fulfillment",
    description: "How orders get from your hands to your buyer's door.",
    items: [
      {
        id: "ship-1",
        question: "How do I ship an item?",
        answer:
          "Once an order is placed, you'll receive a prepaid shipping label via email. Print the label, pack your item securely, and drop it off at your nearest designated courier partner location.",
      },
      {
        id: "ship-2",
        question: "How long do I have to ship?",
        answer:
          "You have 3 business days from the time the order is placed to ship the item. If you miss this window, the order may be automatically cancelled and a refund issued to the buyer, which may affect your seller rating.",
      },
      {
        id: "ship-3",
        question: "How do I track my shipment?",
        answer:
          "Once you drop off the parcel and it is scanned by the courier, tracking updates automatically appear in the order details for both you and the buyer. You can view this in your Orders section.",
      },
      {
        id: "ship-4",
        question: "What if an item is lost or damaged in transit?",
        answer:
          "All ThriftVerse shipments are covered by basic transit protection. If a parcel is lost or arrives damaged, contact our support team immediately with photos and order details. We will investigate with the courier and resolve the issue.",
      },
      {
        id: "ship-5",
        question: "Can I offer local pickup?",
        answer:
          "Currently, ThriftVerse supports nationwide shipping only. Local or in-person pickup is not available, as shipping ensures buyer protection and secure transactions for all parties.",
      },
    ],
  },
  {
    id: "account",
    icon: "shield_person",
    title: "Account & Security",
    description: "Managing your account, privacy, and security settings.",
    items: [
      {
        id: "acc-1",
        question: "How do I change my password?",
        answer:
          "Go to Settings → Change Password. Enter your current password, then your new password twice to confirm. If you signed up with Google, your password is managed through your Google account.",
      },
      {
        id: "acc-2",
        question: "How do I update my store profile?",
        answer:
          "Tap your profile picture to open your store page, then tap the Edit button. You can update your store name, bio, and banner photo. Changes are reflected immediately across the app.",
      },
      {
        id: "acc-3",
        question: "How do I report a damaged or wrong item?",
        answer:
          "Open the relevant order in your Orders section and tap Report a Problem. Select the issue type (damaged, wrong item, not as described), attach photos, and submit. Our team responds within 24–48 hours.",
      },
      {
        id: "acc-4",
        question: "Is my personal information safe?",
        answer:
          "Yes. ThriftVerse uses industry-standard encryption for all data in transit and at rest. We never sell your personal information to third parties. You can review our full Privacy Policy in Settings.",
      },
      {
        id: "acc-5",
        question: "How do I delete my account?",
        answer:
          "To request account deletion, go to Settings → Data & Privacy → Delete Account. Please note that any pending orders must be fulfilled or resolved before deletion. Once deleted, your store and listings are permanently removed.",
      },
    ],
  },
];

export interface TopQuestion {
  id: string;
  question: string;
  categoryId: string;
  questionId: string;
}

export const TOP_QUESTIONS: TopQuestion[] = [
  {
    id: "tq-1",
    question: "How do I ship an item?",
    categoryId: "shipping",
    questionId: "ship-1",
  },
  {
    id: "tq-2",
    question: "When will I get paid?",
    categoryId: "payments",
    questionId: "pay-1",
  },
  {
    id: "tq-3",
    question: "How to report a damaged item?",
    categoryId: "account",
    questionId: "acc-3",
  },
  {
    id: "tq-4",
    question: "Are there any selling fees?",
    categoryId: "payments",
    questionId: "pay-2",
  },
  {
    id: "tq-5",
    question: "How do I list my first item?",
    categoryId: "getting-started",
    questionId: "gs-3",
  },
];
