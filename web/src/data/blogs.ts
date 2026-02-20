export interface BlogStep {
  title: string;
  description: string;
  tip?: string;
  highlight?: string;
  labelUrl?: string;
  alternative?: string;
}

export interface Blog {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  coverEmoji: string;
  intro: string;
  steps: BlogStep[];
  conclusion: string;
}

export const blogs: Blog[] = [
  {
    slug: 'how-to-handle-orders',
    title: 'How to Handle Orders as a Thriftverse Seller',
    excerpt:
      'A step-by-step guide for store owners on receiving, packing, and shipping orders through Thriftverse and NCM delivery.',
    category: 'Seller Guide',
    readTime: '5 min read',
    publishedAt: 'February 21, 2026',
    author: 'Thriftverse Team',
    coverEmoji: '📦',
    intro: `When a buyer places an order on Thriftverse, you become responsible for getting that item safely to their doorstep. Don't worry — we've made the process simple. This guide walks you through every step, from the moment you receive the order to the moment it's on its way via NCM.`,
    steps: [
      {
        title: 'Receive the Order Notification',
        description:
          "When someone purchases from your store, you'll instantly receive both an email and a push notification on your Thriftverse mobile app. This confirms that a buyer has placed an order and is waiting for their item.",
        tip: 'Make sure notifications are enabled in the Thriftverse app settings so you never miss a sale.',
      },
      {
        title: 'View the Order in the App',
        description:
          "Open the Thriftverse app and go to the Orders section from the bottom navigation. Here you'll see all your active and past orders. Tap on the new order to view the buyer's details, the items ordered, and the delivery address.",
      },
      {
        title: "Use 'Move to NCM' in the App",
        description:
          "On the Order Details page, tap the 'Move to NCM' button. This automatically creates the shipment order on the NCM portal using your Thriftverse Vendor ID (35788) — so NCM already has your order registered before you arrive at the branch. You don't need to provide your Vendor ID manually at the counter.",
        tip: "Do this before heading to the NCM branch so the staff can instantly locate your order.",
        highlight: "The 'Move to NCM' button registers your order on the NCM portal automatically — no manual entry needed at the counter.",
      },
      {
        title: 'Pack the Order',
        description:
          'Carefully pack the item(s) using your own packaging materials — a box, bubble wrap, or a sturdy bag that protects the product during transit. Make sure the item is secure and cannot shift around inside the package.',
        tip: 'Use clean, presentable packaging. Your packaging reflects your brand and creates a great unboxing experience for the buyer.',
      },
      {
        title: 'Download and Fill the Shipping Label',
        description:
          "From the Order Details page in the Thriftverse app, download the Thriftverse shipping label. Print it out and fill in the required fields — especially the Order ID, which must be clearly and legibly written on the label. You can preview the label below before downloading.",
        highlight: 'The Order ID must be clearly written on the shipping label — NCM will use this to register your shipment.',
        labelUrl: '/images/shipping-label.png',
        alternative: "Don't want to use the Thriftverse label? Simply write your NCM Order ID (received after tapping 'Move to NCM') clearly on the package itself — NCM can identify your shipment using just the Order ID.",
      },
      {
        title: 'Visit Your Nearest NCM Branch',
        description:
          "Take your packed and labelled package to the nearest NCM (Nepal Can Move) branch. NCM is Thriftverse's official delivery partner for shipping orders across Nepal. Since you've already registered via the app, just show your Order ID to the staff.",
      },
      {
        title: 'Confirm Your Order ID at the Counter',
        description:
          'At the NCM counter, hand over your package and confirm your Order ID with the staff. Since you already used "Move to NCM" in the app, your shipment is pre-registered in their system. The staff will quickly locate it and generate the official NCM shipment label.\n\n• Order ID: (as written on your shipping label)\n\nIf asked, you can also provide the Thriftverse Vendor ID: 35788.',
        highlight: 'Thriftverse Vendor ID: 35788 — keep this as a backup in case the staff needs it.',
      },
      {
        title: 'Attach the NCM Label and Hand Over',
        description:
          'NCM will print their own shipment label for your package. Stick it on the package as instructed by the NCM staff, then hand it over. Your order is now officially in transit and on its way to the buyer!',
      },
    ],
    conclusion: `Once the package is handed over to NCM, you can track the delivery progress directly from the Order Details page in the Thriftverse app. Your buyer will also receive tracking updates as the order moves through the delivery network. That's all there is to it — keep selling and keep thrifting!`,
  },
  {
    slug: 'payment-and-pricing',
    title: 'Payments & Pricing — Honest, Simple, and Only When You Earn',
    excerpt:
      'No subscriptions, no monthly fees. Thriftverse takes a small 5% commission only after you make a sale — and here is exactly where every rupee goes.',
    category: 'Pricing',
    readTime: '4 min read',
    publishedAt: 'February 21, 2026',
    author: 'Thriftverse Team',
    coverEmoji: '💰',
    intro: `We built Thriftverse for sellers who are just starting out — people who shouldn't have to pay to try. That's why we have no subscription plans, no listing fees, and no monthly charges. You only ever pay us anything when you successfully make a sale. And even then, we want you to know exactly where that 5% goes — because you deserve to.`,
    steps: [
      {
        title: 'Zero Fees to Get Started',
        description:
          'Creating your store on Thriftverse is completely free. Listing your products is free. Having a storefront link you can share with your customers is free. There are no trial periods, no credit card required, and no hidden costs just to be on the platform.\n\nYou can list as many products as you want and run your store for as long as you want — without paying a single rupee until you make your first sale.',
        highlight: 'You only pay Thriftverse when a customer successfully places and pays for an order.',
      },
      {
        title: 'Just 5% Commission — Only After You Earn',
        description:
          "When a buyer completes a purchase from your store, Thriftverse deducts a 5% commission from the order total. That's it. No other charges.\n\nThis 5% isn't profit we pocket — it's divided across real services that are actively working for you every day. Here's exactly how it's used.",
        tip: 'A 5% commission on a Rs. 1,000 order means you receive Rs. 950. On a Rs. 5,000 order, you receive Rs. 4,750.',
      },
      {
        title: '2% Goes to eSewa — Not to Us',
        description:
          "Every order on Thriftverse is processed securely through eSewa, Nepal's most trusted digital payment gateway. eSewa charges a 2% transaction fee on every payment they process — this is their standard rate, not something Thriftverse marks up or profits from.\n\nWe simply pass it through transparently. Your buyers get a secure, familiar checkout experience, and you get the confidence that every payment is protected.",
        highlight: 'This 2% goes entirely to eSewa. Thriftverse receives nothing from this portion.',
      },
      {
        title: 'We Cover Shipping — Including Failed COD Deliveries',
        description:
          "Shipping in Nepal is unpredictable. Sometimes a buyer places a Cash on Delivery order and isn't available to receive it. The package gets returned. That return journey costs money — and we believe that's not your burden to carry.\n\nThriftverse absorbs the return shipping cost on failed COD deliveries. You packed the order, you did your part — you shouldn't be penalised because a customer wasn't home.",
        tip: 'This coverage applies to genuine failed deliveries. Our team reviews return cases to keep things fair for everyone.',
        highlight: "If a COD order is returned because the customer didn't receive it, Thriftverse covers the return shipping fee — not you.",
      },
      {
        title: 'Free Ad Promotion on Your Products (~0.5%)',
        description:
          "A small portion of the commission — roughly 0.5% per order — goes towards running ads and promotional campaigns for Thriftverse products. This means your listings get exposure on external platforms and search engines, reaching buyers who wouldn't have found you otherwise.\n\nYou're not paying for ads separately. You're not managing campaigns or setting budgets. It's built into the platform — and it works in the background to bring more buyers to your store.",
        tip: 'Products with good photos and complete descriptions tend to perform better in our ad campaigns.',
      },
      {
        title: 'What You Actually Keep',
        description:
          "Let's make this real. On a Rs. 1,000 order:\n\n• You receive: Rs. 950\n• eSewa fee (2%): Rs. 20 — paid to eSewa\n• Shipping & service (3%): Rs. 30 — covers delivery, COD protection, and ads\n\nYou listed for free. You got promoted for free. Your COD risk was covered for free. And you keep 95% of every sale you make.",
        highlight: 'You keep 95% of every successful order. No subscriptions. No surprises.',
      },
    ],
    conclusion: `We're not here to take a cut and disappear. Every rupee of that 5% is doing something real — protecting your orders, processing payments securely, and putting your products in front of more buyers. Thriftverse only grows when you grow, so it's in our interest to make sure every seller on the platform succeeds. Sell freely, ship confidently, and keep what you earn.`,
  },
];

export function getBlogBySlug(slug: string): Blog | undefined {
  return blogs.find((b) => b.slug === slug);
}
