// World major seaports dataset (curated for the Phase 1 mockup).
//
// PURPOSE: Port Exposure geographic screening in Step 3.
// SOURCE: approximate coordinates of major container / bulk ports, hand-curated
// from public knowledge. Accuracy is sufficient for distance-based screening
// (tens of km) but NOT for berth-level analysis.
//
// REPLACE WITH: a full port registry (e.g. UN/LOCODE, World Port Index, or
// PortWatch port list) once licensed/available — see roadmap Step 4+.

export const WORLD_PORTS = [
  // East Asia
  { id: "CNSHA", name: "Shanghai", country: "China", lat: 31.23, lon: 121.47 },
  { id: "CNNGB", name: "Ningbo-Zhoushan", country: "China", lat: 29.87, lon: 121.54 },
  { id: "CNSZX", name: "Shenzhen (Yantian)", country: "China", lat: 22.58, lon: 114.30 },
  { id: "CNHKG", name: "Hong Kong", country: "China", lat: 22.32, lon: 114.16 },
  { id: "CNTAO", name: "Qingdao", country: "China", lat: 36.07, lon: 120.32 },
  { id: "CNTSN", name: "Tianjin", country: "China", lat: 39.02, lon: 117.72 },
  { id: "KRPUS", name: "Busan", country: "South Korea", lat: 35.10, lon: 129.04 },
  { id: "JPTYO", name: "Tokyo", country: "Japan", lat: 35.62, lon: 139.69 },
  { id: "JPYOK", name: "Yokohama", country: "Japan", lat: 35.44, lon: 139.65 },
  { id: "JPUKB", name: "Kobe", country: "Japan", lat: 34.69, lon: 135.20 },
  { id: "TWTXG", name: "Kaohsiung", country: "Taiwan", lat: 22.61, lon: 120.28 },
  { id: "TWKEL", name: "Keelung", country: "Taiwan", lat: 25.15, lon: 121.74 },
  // Southeast Asia
  { id: "SGSIN", name: "Singapore", country: "Singapore", lat: 1.26, lon: 103.84 },
  { id: "MYPKG", name: "Port Klang", country: "Malaysia", lat: 3.00, lon: 101.39 },
  { id: "MYTPP", name: "Tanjung Pelepas", country: "Malaysia", lat: 1.36, lon: 103.55 },
  { id: "THLCH", name: "Laem Chabang", country: "Thailand", lat: 13.08, lon: 100.88 },
  { id: "VNSGN", name: "Ho Chi Minh City (Cat Lai)", country: "Vietnam", lat: 10.77, lon: 106.75 },
  { id: "VNHPH", name: "Haiphong", country: "Vietnam", lat: 20.86, lon: 106.68 },
  { id: "IDJKT", name: "Jakarta (Tanjung Priok)", country: "Indonesia", lat: -6.10, lon: 106.88 },
  { id: "PHMNL", name: "Manila", country: "Philippines", lat: 14.60, lon: 120.97 },
  { id: "KHKOS", name: "Sihanoukville", country: "Cambodia", lat: 10.63, lon: 103.50 },
  // South Asia / Middle East
  { id: "LKCMB", name: "Colombo", country: "Sri Lanka", lat: 6.93, lon: 79.84 },
  { id: "INNSA", name: "Nhava Sheva (Mumbai)", country: "India", lat: 18.95, lon: 72.95 },
  { id: "INMAA", name: "Chennai", country: "India", lat: 13.08, lon: 80.29 },
  { id: "PKKHI", name: "Karachi", country: "Pakistan", lat: 24.86, lon: 66.97 },
  { id: "BDCGP", name: "Chittagong", country: "Bangladesh", lat: 22.31, lon: 91.79 },
  { id: "AEJEA", name: "Jebel Ali", country: "United Arab Emirates", lat: 25.01, lon: 55.06 },
  { id: "SAJED", name: "Jeddah", country: "Saudi Arabia", lat: 21.49, lon: 39.19 },
  { id: "SADMM", name: "Dammam", country: "Saudi Arabia", lat: 26.43, lon: 50.10 },
  { id: "QAHMD", name: "Hamad", country: "Qatar", lat: 25.00, lon: 51.60 },
  { id: "BHKBS", name: "Khalifa Bin Salman", country: "Bahrain", lat: 26.20, lon: 50.63 },
  { id: "OMSLL", name: "Salalah", country: "Oman", lat: 16.94, lon: 53.98 },
  { id: "YEADE", name: "Aden", country: "Yemen", lat: 12.79, lon: 45.03 },
  { id: "IRBND", name: "Bandar Abbas", country: "Iran", lat: 27.19, lon: 56.27 },
  // Europe
  { id: "NLRTM", name: "Rotterdam", country: "Netherlands", lat: 51.95, lon: 4.14 },
  { id: "BEANR", name: "Antwerp", country: "Belgium", lat: 51.26, lon: 4.40 },
  { id: "DEHAM", name: "Hamburg", country: "Germany", lat: 53.54, lon: 9.98 },
  { id: "DEBRV", name: "Bremerhaven", country: "Germany", lat: 53.57, lon: 8.57 },
  { id: "FRLEH", name: "Le Havre", country: "France", lat: 49.49, lon: 0.11 },
  { id: "ESVLC", name: "Valencia", country: "Spain", lat: 39.45, lon: -0.32 },
  { id: "ESBCN", name: "Barcelona", country: "Spain", lat: 41.35, lon: 2.17 },
  { id: "ESALG", name: "Algeciras", country: "Spain", lat: 36.13, lon: -5.45 },
  { id: "ITGOA", name: "Genoa", country: "Italy", lat: 44.41, lon: 8.93 },
  { id: "GRPIR", name: "Piraeus", country: "Greece", lat: 37.94, lon: 23.64 },
  { id: "SEGVX", name: "Gothenburg", country: "Sweden", lat: 57.71, lon: 11.97 },
  { id: "GBFXT", name: "Felixstowe", country: "United Kingdom", lat: 51.95, lon: 1.35 },
  { id: "GBSOU", name: "Southampton", country: "United Kingdom", lat: 50.90, lon: -1.40 },
  { id: "PLGDN", name: "Gdansk", country: "Poland", lat: 54.40, lon: 18.66 },
  { id: "ROCND", name: "Constanta", country: "Romania", lat: 44.17, lon: 28.66 },
  // Africa
  { id: "EGALY", name: "Alexandria", country: "Egypt", lat: 31.20, lon: 29.92 },
  { id: "EGPSD", name: "Port Said", country: "Egypt", lat: 31.26, lon: 32.30 },
  { id: "EGDAM", name: "Damietta", country: "Egypt", lat: 31.42, lon: 31.81 },
  { id: "ZADUR", name: "Durban", country: "South Africa", lat: -29.87, lon: 31.05 },
  { id: "ZACPT", name: "Cape Town", country: "South Africa", lat: -33.90, lon: 18.42 },
  { id: "NGAPP", name: "Lagos (Apapa)", country: "Nigeria", lat: 6.44, lon: 3.37 },
  { id: "GHTEM", name: "Tema", country: "Ghana", lat: 5.63, lon: -0.01 },
  { id: "MACAS", name: "Casablanca", country: "Morocco", lat: 33.61, lon: -7.60 },
  { id: "DZALG", name: "Algiers", country: "Algeria", lat: 36.75, lon: 3.06 },
  { id: "KEMBA", name: "Mombasa", country: "Kenya", lat: -4.05, lon: 39.67 },
  { id: "DJJIB", name: "Djibouti", country: "Djibouti", lat: 11.59, lon: 43.15 },
  // Americas
  { id: "USLAX", name: "Los Angeles / Long Beach", country: "United States", lat: 33.73, lon: -118.26 },
  { id: "USOAK", name: "Oakland", country: "United States", lat: 37.80, lon: -122.32 },
  { id: "USSEA", name: "Seattle / Tacoma", country: "United States", lat: 47.26, lon: -122.44 },
  { id: "USSAV", name: "Savannah", country: "United States", lat: 32.08, lon: -81.09 },
  { id: "USNYC", name: "New York / New Jersey", country: "United States", lat: 40.67, lon: -74.02 },
  { id: "USORF", name: "Norfolk", country: "United States", lat: 36.90, lon: -76.32 },
  { id: "USCHS", name: "Charleston", country: "United States", lat: 32.78, lon: -79.93 },
  { id: "USMIA", name: "Miami", country: "United States", lat: 25.77, lon: -80.20 },
  { id: "USHOU", name: "Houston", country: "United States", lat: 29.73, lon: -95.27 },
  { id: "BRSSZ", name: "Santos", country: "Brazil", lat: -23.96, lon: -46.33 },
  { id: "ARBUE", name: "Buenos Aires", country: "Argentina", lat: -34.60, lon: -58.37 },
  { id: "PECLL", name: "Callao", country: "Peru", lat: -12.05, lon: -77.15 },
  { id: "CLSAI", name: "San Antonio", country: "Chile", lat: -33.58, lon: -71.61 },
  { id: "ECGYE", name: "Guayaquil", country: "Ecuador", lat: -2.27, lon: -79.88 },
  { id: "COBUN", name: "Buenaventura", country: "Colombia", lat: 3.88, lon: -77.07 },
  { id: "PABLB", name: "Balboa", country: "Panama", lat: 8.95, lon: -79.57 },
  { id: "PACTN", name: "Colon (Cristobal)", country: "Panama", lat: 9.35, lon: -79.90 },
  { id: "COCTG", name: "Cartagena", country: "Colombia", lat: 10.41, lon: -75.55 },
  { id: "JMKIN", name: "Kingston", country: "Jamaica", lat: 17.97, lon: -76.79 },
  { id: "MXVER", name: "Veracruz", country: "Mexico", lat: 19.20, lon: -96.13 },
  // Oceania
  { id: "AUSYD", name: "Sydney", country: "Australia", lat: -33.87, lon: 151.20 },
  { id: "AUMEL", name: "Melbourne", country: "Australia", lat: -37.84, lon: 144.91 },
  { id: "AUFRE", name: "Fremantle", country: "Australia", lat: -32.06, lon: 115.74 },
  { id: "NZAKL", name: "Auckland", country: "New Zealand", lat: -36.85, lon: 174.77 }
];
