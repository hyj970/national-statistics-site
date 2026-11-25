// Japan in numbers — the figures this site shows, each with its source and year.
// All figures are rounded public statistics. Sources: Statistics Bureau of Japan,
// Ministry of Internal Affairs and Communications, IMF World Economic Outlook,
// World Bank, Japan National Tourism Organization, Ministry of Finance.

export const META = {
  country: "Japan",
  countryJa: "日本",
  updated: "26 November 2026",
  currency: "yen (¥)",
  note: "Figures are rounded. See the About page for full sources.",
};

export const INDICATORS = [
  { id: "population", label: "Population", value: "123.97m", delta: "−0.5% on 2023", year: "2024", source: "Statistics Bureau of Japan" },
  { id: "gdp", label: "GDP, nominal", value: "$4.03tn", delta: "4th largest economy", year: "2024", source: "IMF, World Economic Outlook" },
  { id: "gdp-per-capita", label: "GDP per person", value: "$32,500", delta: "nominal, 2024", year: "2024", source: "IMF, World Economic Outlook" },
  { id: "unemployment", label: "Unemployment rate", value: "2.5%", delta: "down 0.1 pts on 2023", year: "2024", source: "Statistics Bureau of Japan" },
  { id: "cpi", label: "Consumer prices", value: "+2.7%", delta: "annual average CPI", year: "2024", source: "Statistics Bureau of Japan" },
  { id: "life-expectancy", label: "Life expectancy", value: "84.0 yrs", delta: "women 87.1 · men 81.1", year: "2023", source: "World Bank" },
  { id: "fertility", label: "Fertility rate", value: "1.20", delta: "children per woman", year: "2024", source: "Ministry of Health, Labour and Welfare" },
  { id: "median-age", label: "Median age", value: "49.5 yrs", delta: "oldest median age in the G7", year: "2024", source: "United Nations" },
  { id: "debt", label: "Public debt", value: "236% of GDP", delta: "general government, gross", year: "2024", source: "IMF, World Economic Outlook" },
  { id: "tourists", label: "Visitor arrivals", value: "36.9m", delta: "record year", year: "2024", source: "Japan National Tourism Organization" },
  { id: "exports", label: "Goods exports", value: "$698bn", delta: "imports $733bn", year: "2024", source: "Ministry of Finance" },
  { id: "renewables", label: "Renewable electricity", value: "25%", delta: "share of generation", year: "2023", source: "Agency for Natural Resources and Energy" },
];

export const SERIES = {
  population: {
    title: "Total population",
    unit: "million people",
    source: "Statistics Bureau of Japan, Population Estimates",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [127.1, 126.9, 126.7, 126.4, 126.2, 126.1, 125.5, 124.9, 124.4, 124.0],
  },
  gdp: {
    title: "Nominal GDP",
    unit: "US$ trillion",
    source: "IMF, World Economic Outlook, October 2025",
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [5.05, 5.04, 5.01, 4.26, 4.21, 4.03],
  },
  unemployment: {
    title: "Unemployment rate",
    unit: "percent",
    source: "Statistics Bureau of Japan, Labour Force Survey",
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [2.4, 2.8, 2.8, 2.6, 2.6, 2.5],
  },
  cpi: {
    title: "Consumer price inflation",
    unit: "percent, annual average",
    source: "Statistics Bureau of Japan, Consumer Price Index",
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [0.5, 0.0, -0.2, 2.5, 3.3, 2.7],
  },
};

export const AGE_STRUCTURE = {
  title: "Age structure, 2024",
  unit: "share of population",
  source: "Statistics Bureau of Japan, Population Estimates 2024",
  groups: [
    { label: "0–14 years", value: 11.4 },
    { label: "15–64 years", value: 59.0 },
    { label: "65 years and over", value: 29.6 },
  ],
};

export const PREFECTURES = [
  { name: "Tokyo", population: 14.1, capital: "Shinjuku", density: 6427 },
  { name: "Kanagawa", population: 9.2, capital: "Yokohama", density: 3819 },
  { name: "Osaka", population: 8.8, capital: "Osaka", density: 4617 },
  { name: "Aichi", population: 7.5, capital: "Nagoya", density: 1448 },
  { name: "Saitama", population: 7.3, capital: "Saitama", density: 1933 },
  { name: "Chiba", population: 6.3, capital: "Chiba", density: 1217 },
  { name: "Hyogo", population: 5.4, capital: "Kobe", density: 637 },
  { name: "Hokkaido", population: 5.1, capital: "Sapporo", density: 62 },
  { name: "Fukuoka", population: 5.1, capital: "Fukuoka", density: 1025 },
  { name: "Shizuoka", population: 3.5, capital: "Shizuoka", density: 455 },
];

export const EXPORT_MIX = {
  title: "Goods exports by category, 2024",
  unit: "share of goods exports",
  source: "Ministry of Finance, Trade Statistics of Japan",
  items: [
    { label: "Transport equipment", value: 21 },
    { label: "Machinery", value: 19 },
    { label: "Electrical machinery", value: 17 },
    { label: "Chemicals", value: 11 },
    { label: "Manufactured goods", value: 10 },
    { label: "All other", value: 22 },
  ],
};

export const SOURCES = [
  { name: "Statistics Bureau of Japan", what: "Population Estimates, Labour Force Survey, Consumer Price Index", year: "2024" },
  { name: "IMF, World Economic Outlook", what: "Nominal GDP, GDP per person, general government gross debt", year: "October 2025" },
  { name: "World Bank", what: "Life expectancy at birth", year: "2023" },
  { name: "Ministry of Health, Labour and Welfare", what: "Total fertility rate", year: "2024" },
  { name: "United Nations, World Population Prospects", what: "Median age", year: "2024" },
  { name: "Japan National Tourism Organization", what: "Visitor arrivals", year: "2024" },
  { name: "Ministry of Finance, Trade Statistics", what: "Goods exports and imports, export mix", year: "2024" },
  { name: "Agency for Natural Resources and Energy", what: "Renewable share of electricity generation", year: "2023" },
];
