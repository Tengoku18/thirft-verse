export type TourStepKey =
  | "home_search"
  | "home_browse"
  | "product_form"
  | "orders_list"
  | "earnings_overview";

export interface TourStep {
  key: TourStepKey;
  tabRoute:
    | "/(tabs)/home"
    | "/(tabs)/product"
    | "/(tabs)/orders"
    | "/(tabs)/earnings";
  title: string;
  description: string;
  tooltipPlacement: "below" | "above";
}

export const TOUR_STEPS: TourStep[] = [
  {
    key: "home_search",
    tabRoute: "/(tabs)/home",
    title: "Discover Items",
    description:
      "Search thousands of curated thrift finds from sellers across Nepal.",
    tooltipPlacement: "below",
  },
  {
    key: "home_browse",
    tabRoute: "/(tabs)/home",
    title: "Browse by Category",
    description:
      "Explore the marketplace by category to find exactly what you want.",
    tooltipPlacement: "above",
  },
  {
    key: "product_form",
    tabRoute: "/(tabs)/product",
    title: "List Your Items",
    description:
      "Add photos, set a price, and publish your item in under a minute.",
    tooltipPlacement: "below",
  },
  {
    key: "orders_list",
    tabRoute: "/(tabs)/orders",
    title: "Track Your Orders",
    description:
      "Monitor every order from pending to completed, all in one place.",
    tooltipPlacement: "below",
  },
  {
    key: "earnings_overview",
    tabRoute: "/(tabs)/earnings",
    title: "Get Paid",
    description:
      "See your confirmed balance and request a withdrawal to your eSewa wallet.",
    tooltipPlacement: "below",
  },
];
