import WebSocket from "ws";

const PORTS = {
  miami: {
    name: "Miami",
    center: [25.7748, -80.2022],
    aisBox: [[25.835, -80.208], [25.603, -79.879]],
    openWatersBox: [25.603, -80.208, 25.835, -79.879]
  },
  singapore: {
    name: "Singapore",
    center: [1.28, 103.85],
    aisBox: [[1.48, 103.60], [1.12, 104.08]],
    openWatersBox: [1.12, 103.60, 1.48, 104.08]
  },
  rotterdam: {
    name: "Rotterdam",
    center: [51.95, 4.10],
    aisBox: [[52.12, 3.80], [51.78, 4.55]],
    openWatersBox: [51.78, 3.80, 52.12, 4.55]
  },
  shanghai: {
    name: "Shanghai",
    center: [31.20, 121.55],
    aisBox: [[31.65, 121.00], [30.75, 122.20]],
    openWatersBox: [30.75, 121.00, 31.65, 122.20]
  },
  jebelali: {
    name: "Jebel Ali",
    center: [25.05, 55.05],
    aisBox: [[25.45, 54.75], [24.75, 55.45]],
    openWatersBox: [24.75, 54.75, 25.45, 55.45]
  },
  losangeles: {
    name: "Los Angeles / Long Beach",
    center: [33.73, -118.26],
    aisBox: [[34.10, -118.60], [33.40, -117.90]],
    openWatersBox: [33.40, -118.60, 34.10, -117.90]
  },
  newyork: {
    name: "New York / New Jersey",
    center: [40.67, -74.02],
    aisBox: [[40.85, -74.30], [40.45, -73.75]],
    openWatersBox: [40.45, -74.30, 40.85, -73.75]
  },
  savannah: {
    name: "Savannah",
    center: [32.08, -81.09],
    aisBox: [[32.35, -81.35], [31.85, -80.80]],
    openWatersBox: [31.85, -81.35, 32.35, -80.80]
  },
  houston: {
    name: "Houston",
    center: [29.73, -95.27],
    aisBox: [[30.05, -95.55], [29.40, -94.95]],
    openWatersBox: [29.40, -95.55, 30.05, -94.95]
  },
  portsaid: {
    name: "Port Said / Suez",
    center: [31.26, 32.30],
    aisBox: [[31.55, 32.00], [30.90, 32.70]],
    openWatersBox: [30.90, 32.00, 31.55, 32.70]
  },
  colombo: {
    name: "Colombo",
    center: [6.93, 79.84],
    aisBox: [[7.15, 79.60], [6.70, 80.10]],
    openWatersBox: [6.70, 79.60, 7.15, 80.10]
  },
  busan: {
    name: "Busan",
    center: [35.10, 129.04],
    aisBox: [[35.40, 128.75], [34.80, 129.40]],
    openWatersBox: [34.80, 128.75, 35.40, 129.40]
  },
  cnsha: {
    name: "Shanghai",
    center: [31.23, 121.47],
    aisBox: [[31.51, 121.09], [30.95, 121.85]],
    openWatersBox: [30.95, 121.09, 31.51, 121.85]
  },
  cnngb: {
    name: "Ningbo-Zhoushan",
    center: [29.87, 121.54],
    aisBox: [[30.150000000000002, 121.16000000000001], [29.59, 121.92]],
    openWatersBox: [29.59, 121.16000000000001, 30.150000000000002, 121.92]
  },
  cnszx: {
    name: "Shenzhen (Yantian)",
    center: [22.58, 114.3],
    aisBox: [[22.86, 113.92], [22.299999999999997, 114.67999999999999]],
    openWatersBox: [22.299999999999997, 113.92, 22.86, 114.67999999999999]
  },
  cnhkg: {
    name: "Hong Kong",
    center: [22.32, 114.16],
    aisBox: [[22.6, 113.78], [22.04, 114.53999999999999]],
    openWatersBox: [22.04, 113.78, 22.6, 114.53999999999999]
  },
  cntao: {
    name: "Qingdao",
    center: [36.07, 120.32],
    aisBox: [[36.35, 119.94], [35.79, 120.69999999999999]],
    openWatersBox: [35.79, 119.94, 36.35, 120.69999999999999]
  },
  cntsn: {
    name: "Tianjin",
    center: [39.02, 117.72],
    aisBox: [[39.300000000000004, 117.34], [38.74, 118.1]],
    openWatersBox: [38.74, 117.34, 39.300000000000004, 118.1]
  },
  krpus: {
    name: "Busan",
    center: [35.1, 129.04],
    aisBox: [[35.38, 128.66], [34.82, 129.42]],
    openWatersBox: [34.82, 128.66, 35.38, 129.42]
  },
  jptyo: {
    name: "Tokyo",
    center: [35.62, 139.69],
    aisBox: [[35.9, 139.31], [35.339999999999996, 140.07]],
    openWatersBox: [35.339999999999996, 139.31, 35.9, 140.07]
  },
  jpyok: {
    name: "Yokohama",
    center: [35.44, 139.65],
    aisBox: [[35.72, 139.27], [35.16, 140.03]],
    openWatersBox: [35.16, 139.27, 35.72, 140.03]
  },
  jpukb: {
    name: "Kobe",
    center: [34.69, 135.2],
    aisBox: [[34.97, 134.82], [34.41, 135.57999999999998]],
    openWatersBox: [34.41, 134.82, 34.97, 135.57999999999998]
  },
  twtxg: {
    name: "Kaohsiung",
    center: [22.61, 120.28],
    aisBox: [[22.89, 119.9], [22.33, 120.66]],
    openWatersBox: [22.33, 119.9, 22.89, 120.66]
  },
  twkel: {
    name: "Keelung",
    center: [25.15, 121.74],
    aisBox: [[25.43, 121.36], [24.869999999999997, 122.11999999999999]],
    openWatersBox: [24.869999999999997, 121.36, 25.43, 122.11999999999999]
  },
  sgsin: {
    name: "Singapore",
    center: [1.26, 103.84],
    aisBox: [[1.54, 103.46000000000001], [0.98, 104.22]],
    openWatersBox: [0.98, 103.46000000000001, 1.54, 104.22]
  },
  mypkg: {
    name: "Port Klang",
    center: [3.0, 101.39],
    aisBox: [[3.2800000000000002, 101.01], [2.7199999999999998, 101.77]],
    openWatersBox: [2.7199999999999998, 101.01, 3.2800000000000002, 101.77]
  },
  mytpp: {
    name: "Tanjung Pelepas",
    center: [1.36, 103.55],
    aisBox: [[1.6400000000000001, 103.17], [1.08, 103.92999999999999]],
    openWatersBox: [1.08, 103.17, 1.6400000000000001, 103.92999999999999]
  },
  thlch: {
    name: "Laem Chabang",
    center: [13.08, 100.88],
    aisBox: [[13.36, 100.5], [12.8, 101.25999999999999]],
    openWatersBox: [12.8, 100.5, 13.36, 101.25999999999999]
  },
  vnsgn: {
    name: "Ho Chi Minh City (Cat Lai)",
    center: [10.77, 106.75],
    aisBox: [[11.049999999999999, 106.37], [10.49, 107.13]],
    openWatersBox: [10.49, 106.37, 11.049999999999999, 107.13]
  },
  vnhph: {
    name: "Haiphong",
    center: [20.86, 106.68],
    aisBox: [[21.14, 106.30000000000001], [20.58, 107.06]],
    openWatersBox: [20.58, 106.30000000000001, 21.14, 107.06]
  },
  idjkt: {
    name: "Jakarta (Tanjung Priok)",
    center: [-6.1, 106.88],
    aisBox: [[-5.819999999999999, 106.5], [-6.38, 107.25999999999999]],
    openWatersBox: [-6.38, 106.5, -5.819999999999999, 107.25999999999999]
  },
  phmnl: {
    name: "Manila",
    center: [14.6, 120.97],
    aisBox: [[14.879999999999999, 120.59], [14.32, 121.35]],
    openWatersBox: [14.32, 120.59, 14.879999999999999, 121.35]
  },
  khkos: {
    name: "Sihanoukville",
    center: [10.63, 103.5],
    aisBox: [[10.91, 103.12], [10.350000000000001, 103.88]],
    openWatersBox: [10.350000000000001, 103.12, 10.91, 103.88]
  },
  lkcmb: {
    name: "Colombo",
    center: [6.93, 79.84],
    aisBox: [[7.21, 79.46000000000001], [6.6499999999999995, 80.22]],
    openWatersBox: [6.6499999999999995, 79.46000000000001, 7.21, 80.22]
  },
  innsa: {
    name: "Nhava Sheva (Mumbai)",
    center: [18.95, 72.95],
    aisBox: [[19.23, 72.57000000000001], [18.669999999999998, 73.33]],
    openWatersBox: [18.669999999999998, 72.57000000000001, 19.23, 73.33]
  },
  inmaa: {
    name: "Chennai",
    center: [13.08, 80.29],
    aisBox: [[13.36, 79.91000000000001], [12.8, 80.67]],
    openWatersBox: [12.8, 79.91000000000001, 13.36, 80.67]
  },
  pkkhi: {
    name: "Karachi",
    center: [24.86, 66.97],
    aisBox: [[25.14, 66.59], [24.58, 67.35]],
    openWatersBox: [24.58, 66.59, 25.14, 67.35]
  },
  bdcgp: {
    name: "Chittagong",
    center: [22.31, 91.79],
    aisBox: [[22.59, 91.41000000000001], [22.029999999999998, 92.17]],
    openWatersBox: [22.029999999999998, 91.41000000000001, 22.59, 92.17]
  },
  aejea: {
    name: "Jebel Ali",
    center: [25.01, 55.06],
    aisBox: [[25.290000000000003, 54.68], [24.73, 55.440000000000005]],
    openWatersBox: [24.73, 54.68, 25.290000000000003, 55.440000000000005]
  },
  sajed: {
    name: "Jeddah",
    center: [21.49, 39.19],
    aisBox: [[21.77, 38.809999999999995], [21.209999999999997, 39.57]],
    openWatersBox: [21.209999999999997, 38.809999999999995, 21.77, 39.57]
  },
  sadmm: {
    name: "Dammam",
    center: [26.43, 50.1],
    aisBox: [[26.71, 49.72], [26.15, 50.480000000000004]],
    openWatersBox: [26.15, 49.72, 26.71, 50.480000000000004]
  },
  qahmd: {
    name: "Hamad",
    center: [25.0, 51.6],
    aisBox: [[25.28, 51.22], [24.72, 51.980000000000004]],
    openWatersBox: [24.72, 51.22, 25.28, 51.980000000000004]
  },
  bhkbs: {
    name: "Khalifa Bin Salman",
    center: [26.2, 50.63],
    aisBox: [[26.48, 50.25], [25.919999999999998, 51.010000000000005]],
    openWatersBox: [25.919999999999998, 50.25, 26.48, 51.010000000000005]
  },
  omsll: {
    name: "Salalah",
    center: [16.94, 53.98],
    aisBox: [[17.220000000000002, 53.599999999999994], [16.66, 54.36]],
    openWatersBox: [16.66, 53.599999999999994, 17.220000000000002, 54.36]
  },
  yeade: {
    name: "Aden",
    center: [12.79, 45.03],
    aisBox: [[13.069999999999999, 44.65], [12.51, 45.410000000000004]],
    openWatersBox: [12.51, 44.65, 13.069999999999999, 45.410000000000004]
  },
  irbnd: {
    name: "Bandar Abbas",
    center: [27.19, 56.27],
    aisBox: [[27.470000000000002, 55.89], [26.91, 56.650000000000006]],
    openWatersBox: [26.91, 55.89, 27.470000000000002, 56.650000000000006]
  },
  nlrtm: {
    name: "Rotterdam",
    center: [51.95, 4.14],
    aisBox: [[52.230000000000004, 3.76], [51.67, 4.52]],
    openWatersBox: [51.67, 3.76, 52.230000000000004, 4.52]
  },
  beanr: {
    name: "Antwerp",
    center: [51.26, 4.4],
    aisBox: [[51.54, 4.0200000000000005], [50.98, 4.78]],
    openWatersBox: [50.98, 4.0200000000000005, 51.54, 4.78]
  },
  deham: {
    name: "Hamburg",
    center: [53.54, 9.98],
    aisBox: [[53.82, 9.6], [53.26, 10.360000000000001]],
    openWatersBox: [53.26, 9.6, 53.82, 10.360000000000001]
  },
  debrv: {
    name: "Bremerhaven",
    center: [53.57, 8.57],
    aisBox: [[53.85, 8.19], [53.29, 8.950000000000001]],
    openWatersBox: [53.29, 8.19, 53.85, 8.950000000000001]
  },
  frleh: {
    name: "Le Havre",
    center: [49.49, 0.11],
    aisBox: [[49.77, -0.27], [49.21, 0.49]],
    openWatersBox: [49.21, -0.27, 49.77, 0.49]
  },
  esvlc: {
    name: "Valencia",
    center: [39.45, -0.32],
    aisBox: [[39.730000000000004, -0.7], [39.17, 0.06]],
    openWatersBox: [39.17, -0.7, 39.730000000000004, 0.06]
  },
  esbcn: {
    name: "Barcelona",
    center: [41.35, 2.17],
    aisBox: [[41.63, 1.79], [41.07, 2.55]],
    openWatersBox: [41.07, 1.79, 41.63, 2.55]
  },
  esalg: {
    name: "Algeciras",
    center: [36.13, -5.45],
    aisBox: [[36.410000000000004, -5.83], [35.85, -5.07]],
    openWatersBox: [35.85, -5.83, 36.410000000000004, -5.07]
  },
  itgoa: {
    name: "Genoa",
    center: [44.41, 8.93],
    aisBox: [[44.69, 8.549999999999999], [44.129999999999995, 9.31]],
    openWatersBox: [44.129999999999995, 8.549999999999999, 44.69, 9.31]
  },
  grpir: {
    name: "Piraeus",
    center: [37.94, 23.64],
    aisBox: [[38.22, 23.26], [37.66, 24.02]],
    openWatersBox: [37.66, 23.26, 38.22, 24.02]
  },
  segvx: {
    name: "Gothenburg",
    center: [57.71, 11.97],
    aisBox: [[57.99, 11.59], [57.43, 12.350000000000001]],
    openWatersBox: [57.43, 11.59, 57.99, 12.350000000000001]
  },
  gbfxt: {
    name: "Felixstowe",
    center: [51.95, 1.35],
    aisBox: [[52.230000000000004, 0.9700000000000001], [51.67, 1.73]],
    openWatersBox: [51.67, 0.9700000000000001, 52.230000000000004, 1.73]
  },
  gbsou: {
    name: "Southampton",
    center: [50.9, -1.4],
    aisBox: [[51.18, -1.7799999999999998], [50.62, -1.02]],
    openWatersBox: [50.62, -1.7799999999999998, 51.18, -1.02]
  },
  plgdn: {
    name: "Gdansk",
    center: [54.4, 18.66],
    aisBox: [[54.68, 18.28], [54.12, 19.04]],
    openWatersBox: [54.12, 18.28, 54.68, 19.04]
  },
  rocnd: {
    name: "Constanta",
    center: [44.17, 28.66],
    aisBox: [[44.45, 28.28], [43.89, 29.04]],
    openWatersBox: [43.89, 28.28, 44.45, 29.04]
  },
  egaly: {
    name: "Alexandria",
    center: [31.2, 29.92],
    aisBox: [[31.48, 29.540000000000003], [30.919999999999998, 30.3]],
    openWatersBox: [30.919999999999998, 29.540000000000003, 31.48, 30.3]
  },
  egpsd: {
    name: "Port Said",
    center: [31.26, 32.3],
    aisBox: [[31.540000000000003, 31.919999999999998], [30.98, 32.68]],
    openWatersBox: [30.98, 31.919999999999998, 31.540000000000003, 32.68]
  },
  egdam: {
    name: "Damietta",
    center: [31.42, 31.81],
    aisBox: [[31.700000000000003, 31.43], [31.14, 32.19]],
    openWatersBox: [31.14, 31.43, 31.700000000000003, 32.19]
  },
  zadur: {
    name: "Durban",
    center: [-29.87, 31.05],
    aisBox: [[-29.59, 30.67], [-30.150000000000002, 31.43]],
    openWatersBox: [-30.150000000000002, 30.67, -29.59, 31.43]
  },
  zacpt: {
    name: "Cape Town",
    center: [-33.9, 18.42],
    aisBox: [[-33.62, 18.040000000000003], [-34.18, 18.8]],
    openWatersBox: [-34.18, 18.040000000000003, -33.62, 18.8]
  },
  ngapp: {
    name: "Lagos (Apapa)",
    center: [6.44, 3.37],
    aisBox: [[6.720000000000001, 2.99], [6.16, 3.75]],
    openWatersBox: [6.16, 2.99, 6.720000000000001, 3.75]
  },
  ghtem: {
    name: "Tema",
    center: [5.63, -0.01],
    aisBox: [[5.91, -0.39], [5.35, 0.37]],
    openWatersBox: [5.35, -0.39, 5.91, 0.37]
  },
  macas: {
    name: "Casablanca",
    center: [33.61, -7.6],
    aisBox: [[33.89, -7.9799999999999995], [33.33, -7.22]],
    openWatersBox: [33.33, -7.9799999999999995, 33.89, -7.22]
  },
  dzalg: {
    name: "Algiers",
    center: [36.75, 3.06],
    aisBox: [[37.03, 2.68], [36.47, 3.44]],
    openWatersBox: [36.47, 2.68, 37.03, 3.44]
  },
  kemba: {
    name: "Mombasa",
    center: [-4.05, 39.67],
    aisBox: [[-3.7699999999999996, 39.29], [-4.33, 40.050000000000004]],
    openWatersBox: [-4.33, 39.29, -3.7699999999999996, 40.050000000000004]
  },
  djjib: {
    name: "Djibouti",
    center: [11.59, 43.15],
    aisBox: [[11.87, 42.769999999999996], [11.31, 43.53]],
    openWatersBox: [11.31, 42.769999999999996, 11.87, 43.53]
  },
  uslax: {
    name: "Los Angeles / Long Beach",
    center: [33.73, -118.26],
    aisBox: [[34.01, -118.64], [33.449999999999996, -117.88000000000001]],
    openWatersBox: [33.449999999999996, -118.64, 34.01, -117.88000000000001]
  },
  usoak: {
    name: "Oakland",
    center: [37.8, -122.32],
    aisBox: [[38.08, -122.69999999999999], [37.519999999999996, -121.94]],
    openWatersBox: [37.519999999999996, -122.69999999999999, 38.08, -121.94]
  },
  ussea: {
    name: "Seattle / Tacoma",
    center: [47.26, -122.44],
    aisBox: [[47.54, -122.82], [46.98, -122.06]],
    openWatersBox: [46.98, -122.82, 47.54, -122.06]
  },
  ussav: {
    name: "Savannah",
    center: [32.08, -81.09],
    aisBox: [[32.36, -81.47], [31.799999999999997, -80.71000000000001]],
    openWatersBox: [31.799999999999997, -81.47, 32.36, -80.71000000000001]
  },
  usnyc: {
    name: "New York / New Jersey",
    center: [40.67, -74.02],
    aisBox: [[40.95, -74.39999999999999], [40.39, -73.64]],
    openWatersBox: [40.39, -74.39999999999999, 40.95, -73.64]
  },
  usorf: {
    name: "Norfolk",
    center: [36.9, -76.32],
    aisBox: [[37.18, -76.69999999999999], [36.62, -75.94]],
    openWatersBox: [36.62, -76.69999999999999, 37.18, -75.94]
  },
  uschs: {
    name: "Charleston",
    center: [32.78, -79.93],
    aisBox: [[33.06, -80.31], [32.5, -79.55000000000001]],
    openWatersBox: [32.5, -80.31, 33.06, -79.55000000000001]
  },
  usmia: {
    name: "Miami",
    center: [25.77, -80.2],
    aisBox: [[26.05, -80.58], [25.49, -79.82000000000001]],
    openWatersBox: [25.49, -80.58, 26.05, -79.82000000000001]
  },
  ushou: {
    name: "Houston",
    center: [29.73, -95.27],
    aisBox: [[30.01, -95.64999999999999], [29.45, -94.89]],
    openWatersBox: [29.45, -95.64999999999999, 30.01, -94.89]
  },
  brssz: {
    name: "Santos",
    center: [-23.96, -46.33],
    aisBox: [[-23.68, -46.71], [-24.240000000000002, -45.949999999999996]],
    openWatersBox: [-24.240000000000002, -46.71, -23.68, -45.949999999999996]
  },
  arbue: {
    name: "Buenos Aires",
    center: [-34.6, -58.37],
    aisBox: [[-34.32, -58.75], [-34.88, -57.989999999999995]],
    openWatersBox: [-34.88, -58.75, -34.32, -57.989999999999995]
  },
  pecll: {
    name: "Callao",
    center: [-12.05, -77.15],
    aisBox: [[-11.770000000000001, -77.53], [-12.33, -76.77000000000001]],
    openWatersBox: [-12.33, -77.53, -11.770000000000001, -76.77000000000001]
  },
  clsai: {
    name: "San Antonio",
    center: [-33.58, -71.61],
    aisBox: [[-33.3, -71.99], [-33.86, -71.23]],
    openWatersBox: [-33.86, -71.99, -33.3, -71.23]
  },
  ecgye: {
    name: "Guayaquil",
    center: [-2.27, -79.88],
    aisBox: [[-1.99, -80.25999999999999], [-2.55, -79.5]],
    openWatersBox: [-2.55, -80.25999999999999, -1.99, -79.5]
  },
  cobun: {
    name: "Buenaventura",
    center: [3.88, -77.07],
    aisBox: [[4.16, -77.44999999999999], [3.5999999999999996, -76.69]],
    openWatersBox: [3.5999999999999996, -77.44999999999999, 4.16, -76.69]
  },
  pablb: {
    name: "Balboa",
    center: [8.95, -79.57],
    aisBox: [[9.229999999999999, -79.94999999999999], [8.67, -79.19]],
    openWatersBox: [8.67, -79.94999999999999, 9.229999999999999, -79.19]
  },
  pactn: {
    name: "Colon (Cristobal)",
    center: [9.35, -79.9],
    aisBox: [[9.629999999999999, -80.28], [9.07, -79.52000000000001]],
    openWatersBox: [9.07, -80.28, 9.629999999999999, -79.52000000000001]
  },
  coctg: {
    name: "Cartagena",
    center: [10.41, -75.55],
    aisBox: [[10.69, -75.92999999999999], [10.13, -75.17]],
    openWatersBox: [10.13, -75.92999999999999, 10.69, -75.17]
  },
  jmkin: {
    name: "Kingston",
    center: [17.97, -76.79],
    aisBox: [[18.25, -77.17], [17.689999999999998, -76.41000000000001]],
    openWatersBox: [17.689999999999998, -77.17, 18.25, -76.41000000000001]
  },
  mxver: {
    name: "Veracruz",
    center: [19.2, -96.13],
    aisBox: [[19.48, -96.50999999999999], [18.919999999999998, -95.75]],
    openWatersBox: [18.919999999999998, -96.50999999999999, 19.48, -95.75]
  },
  ausyd: {
    name: "Sydney",
    center: [-33.87, 151.2],
    aisBox: [[-33.589999999999996, 150.82], [-34.15, 151.57999999999998]],
    openWatersBox: [-34.15, 150.82, -33.589999999999996, 151.57999999999998]
  },
  aumel: {
    name: "Melbourne",
    center: [-37.84, 144.91],
    aisBox: [[-37.56, 144.53], [-38.120000000000005, 145.29]],
    openWatersBox: [-38.120000000000005, 144.53, -37.56, 145.29]
  },
  aufre: {
    name: "Fremantle",
    center: [-32.06, 115.74],
    aisBox: [[-31.78, 115.36], [-32.34, 116.11999999999999]],
    openWatersBox: [-32.34, 115.36, -31.78, 116.11999999999999]
  },
  nzakl: {
    name: "Auckland",
    center: [-36.85, 174.77],
    aisBox: [[-36.57, 174.39000000000001], [-37.13, 175.15]],
    openWatersBox: [-37.13, 174.39000000000001, -36.57, 175.15]
  }
};

// AIS ShipType -> category (same buckets MarineTraffic-style maps use)
export function classifyShip(shipType) {
  const t = Number(shipType);
  if (!Number.isFinite(t) || t === 0) return "UNKNOWN";
  if (t >= 30 && t <= 39) return "FISHING";
  if (t >= 40 && t <= 49) return "HIGH_SPEED";
  if (t >= 60 && t <= 69) return "PASSENGER";
  if (t >= 70 && t <= 79) return "CARGO";
  if (t >= 80 && t <= 89) return "TANKER";
  if (t >= 50 && t <= 59) return "OTHER";   // SAR / military / pilot / law enforcement
  if (t >= 90 && t <= 99) return "OTHER";
  return "OTHER";
}

function makeStats(provider) {
  return {
    provider,
    status: "connecting",
    messages: 0,
    rawMessages: 0,
    firstRaw: null,
    positionMessages: 0,
    staticMessages: 0,
    uniqueVessels: 0,
    vessels: new Map(),
    staticData: new Map(),
    staticDebug: null,
    errors: [],
    startedAt: new Date().toISOString(),
    endedAt: null
  };
}

function getMmsi(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return /^\d{7,9}$/.test(s) ? s : null;
}

function addVessel(stats, mmsiValue, name, latValue, lonValue, speedValue, headingValue) {
  const mmsi = getMmsi(mmsiValue);
  if (!mmsi) return;

  const lat = Number(latValue);
  const lon = Number(lonValue);
  const hasPosition = Number.isFinite(lat) && Number.isFinite(lon)
    && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;

  stats.messages += 1;
  if (hasPosition) stats.positionMessages += 1;

  const previous = stats.vessels.get(mmsi) || {
    mmsi,
    name: "Unknown vessel",
    lat: null,
    lon: null,
    speed: null,
    heading: null,
    updates: 0,
    firstSeen: new Date().toISOString(),
    lastSeen: null
  };

  previous.name = (name && String(name).trim()) || previous.name;
  if (hasPosition) {
    previous.lat = lat;
    previous.lon = lon;
  }
  const speed = Number(speedValue);
  if (Number.isFinite(speed)) previous.speed = speed;
  const heading = Number(headingValue);
  if (Number.isFinite(heading) && heading >= 0 && heading <= 360) previous.heading = heading;
  previous.updates += 1;
  previous.lastSeen = new Date().toISOString();

  stats.vessels.set(mmsi, previous);
  stats.uniqueVessels = stats.vessels.size;
}

function addStatic(stats, mmsiValue, fields) {
  const mmsi = getMmsi(mmsiValue);
  if (!mmsi) return;
  const prev = stats.staticData.get(mmsi) || {
    mmsi, name: null, shipType: null, shipTypeText: null,
    destination: null, draught: null, length_m: null, beam_m: null
  };
  for (const [k, v] of Object.entries(fields)) {
    if (v !== null && v !== undefined && v !== "") prev[k] = v;
  }
  prev.shipClass = classifyShip(prev.shipType);
  stats.staticData.set(mmsi, prev);
}

function consumeAisStream(stats, raw) {
  let event;
  try {
    event = JSON.parse(raw.toString());
  } catch {
    return;
  }

  if (!event || event.MessageType === "SubscriptionConfirmation") return;

  // static data messages: ship type, dimensions, destination
  if (event.MessageType === "ShipStaticData") {
    const meta = event.MetaData || {};
    const msg = event.Message || {};
    const r = msg.ShipStaticData || {};
    const dim = r.Dimension || {};
    const length = (Number(dim.A) || 0) + (Number(dim.B) || 0);
    const beam = (Number(dim.C) || 0) + (Number(dim.D) || 0);
    if (!stats.staticDebug) {
      stats.staticDebug = {
        messageKeys: Object.keys(r),
        metaKeys: Object.keys(meta),
        sample: JSON.stringify({ meta, r }).slice(0, 800)
      };
    }
    addStatic(stats, meta.MMSI ?? r.UserID, {
      name: (r.Name || r.ShipName || meta.ShipName || "").trim() || null,
      shipType: r.Type ?? r.ShipType ?? meta.ShipType ?? null,
      shipTypeText: r.ShipTypeText || meta.ShipTypeText || null,
      destination: (r.Destination || "").trim() || null,
      draught: r.MaximumStaticDraught ?? r.MaximumDraught ?? null,
      length_m: length > 0 ? length : null,
      beam_m: beam > 0 ? beam : null
    });
    return;
  }

  if (event.MessageType !== "PositionReport"
      && event.MessageType !== "ExtendedClassBPositionReport"
      && event.MessageType !== "StandardClassBPositionReport") return;

  const meta = event.MetaData || {};
  const message = event.Message || {};
  const report = message.PositionReport
    || message.ExtendedClassBPositionReport
    || message.StandardClassBPositionReport
    || {};

  addVessel(
    stats,
    meta.MMSI ?? report.UserID,
    meta.ShipName,
    meta.Latitude ?? meta.latitude ?? report.Latitude,
    meta.Longitude ?? meta.longitude ?? report.Longitude,
    report.Sog,
    report.Cog ?? report.TrueHeading
  );
}

function consumeOpenWaters(stats, raw) {
  let event;
  try {
    event = JSON.parse(raw.toString());
  } catch {
    return;
  }

  if (!event || event.type !== "event") return;

  if (!stats.staticDebug) {
    stats.staticDebug = {
      eventKeys: Object.keys(event),
      sample: JSON.stringify(event).slice(0, 800)
    };
  }

  // Open Waters: for AIS message type 5 (ShipStaticData) the decoded fields
  // live inside "message" (Name / Type / MaximumStaticDraught, same naming as AISStream)
  const m = (event.message && typeof event.message === "object") ? event.message : {};
  if (event.msg_type === 5 && !stats.staticDebug.owMsg5Keys) {
    stats.staticDebug.owMsg5Keys = Object.keys(m);
    stats.staticDebug.owMsg5Sample = JSON.stringify(m).slice(0, 500);
  }
  // nav data lives in "message" for position reports — capture keys once for diagnosis
  if ([1,2,3,18,19].includes(Number(event.msg_type)) && !stats.staticDebug.owPosKeys) {
    stats.staticDebug.owPosKeys = Object.keys(m);
    stats.staticDebug.owPosSample = JSON.stringify(m).slice(0, 400);
  }

  const sog = event.sog ?? event.speed ?? m.Sog ?? m.sog ?? m.SOG ?? m.SpeedOverGround ?? null;
  const cog = event.cog ?? event.heading ?? m.Cog ?? m.cog ?? m.COG ?? m.CourseOverGround ?? null;

  addStatic(stats, event.mmsi, {
    name: event.name || event.ship_name || event.vessel_name || m.Name || m.ShipName || null,
    shipType: event.ship_type ?? event.shipType ?? m.Type ?? m.ShipType ?? null,
    shipTypeText: event.ship_type_text || event.shipTypeText || null,
    destination: (m.Destination || "").trim() || null,
    draught: m.MaximumStaticDraught ?? m.MaximumDraught ?? null
  });

  addVessel(
    stats,
    event.mmsi,
    event.name || event.ship_name || event.vessel_name,
    event.lat,
    event.lon,
    sog,
    cog
  );
}

function summarize(stats, durationSec) {
  const vessels = [...stats.vessels.values()];
  const elapsed = Math.max(1, durationSec);

  // join static data onto vessel records (same MMSI)
  const withType = vessels.map(v => {
    const s = stats.staticData.get(v.mmsi);
    return s ? { ...v, ...s, name: v.name !== "Unknown vessel" ? v.name : (s.name || v.name) } : v;
  });

  return {
    provider: stats.provider,
    status: stats.status,
    messages: stats.messages,
    positionMessages: stats.positionMessages,
    staticMessages: stats.staticData.size,
    rawMessages: stats.rawMessages,
    firstRaw: stats.firstRaw,
    uniqueVessels: stats.uniqueVessels,
    vesselsWithType: withType.filter(v => v.shipClass && v.shipClass !== "UNKNOWN").length,
    messagesPerSecond: Number((stats.messages / elapsed).toFixed(2)),
    vesselsPerMinute: Number((stats.uniqueVessels / elapsed * 60).toFixed(2)),
    errors: stats.errors,
    startedAt: stats.startedAt,
    endedAt: stats.endedAt,
    vessels: withType.slice(0, 1000),
    staticData: [...stats.staticData.values()].slice(0, 3000),
    staticDebug: stats.staticDebug
  };
}

function runProvider({ provider, url, subscribe, apiKey, durationSec, consume }) {
  return new Promise((resolve) => {
    const stats = makeStats(provider);
    let socket;
    let finished = false;
    let durationTimer;
    let connectTimer;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(durationTimer);
      clearTimeout(connectTimer);
      stats.endedAt = new Date().toISOString();
      try {
        if (socket && socket.readyState === WebSocket.OPEN) socket.close(1000, "Benchmark complete");
        else if (socket && socket.readyState === WebSocket.CONNECTING) socket.terminate();
      } catch {}
      if (stats.status === "connecting") stats.status = "no_connection";
      resolve(summarize(stats, durationSec));
    };

    try {
      socket = new WebSocket(url, {
        perMessageDeflate: provider === "AISStream"
      });

      connectTimer = setTimeout(() => {
        stats.errors.push("Connection timed out after 10 seconds.");
        stats.status = "connection_timeout";
        finish();
      }, 10000);

      socket.on("open", () => {
        clearTimeout(connectTimer);
        try {
          socket.send(JSON.stringify(subscribe(apiKey)));
          stats.status = "receiving";
          durationTimer = setTimeout(finish, durationSec * 1000);
        } catch (err) {
          stats.errors.push(err.message || "Subscription failed.");
          stats.status = "subscription_error";
          finish();
        }
      });

      socket.on("message", (data) => {
        if (finished) return;
        stats.rawMessages += 1;
        if (!stats.firstRaw) {
          try { stats.firstRaw = data.toString().slice(0, 300); } catch {}
        }
        try {
          consume(stats, data);
        } catch (err) {
          if (stats.errors.length < 5) stats.errors.push(err.message || "Message parsing error.");
        }
      });

      socket.on("error", (err) => {
        if (stats.errors.length < 5) stats.errors.push(err.message || "WebSocket error.");
        if (stats.status === "connecting") stats.status = "connection_error";
      });

      socket.on("close", (code, reason) => {
        if (finished) return;
        if (stats.status === "receiving") stats.status = "disconnected";
        const detail = reason?.toString();
        if (code !== 1000 && stats.errors.length < 5) {
          stats.errors.push(`Socket closed: ${code}${detail ? ` (${detail})` : ""}`);
        }
        finish();
      });
    } catch (err) {
      stats.status = "connection_error";
      stats.errors.push(err.message || "Could not create WebSocket.");
      finish();
    }
  });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const body = req.body || {};
  const portKey = String(body.port || "miami").toLowerCase();
  const durationSec = Number(body.durationSec || 60);

  if (!PORTS[portKey]) {
    return res.status(400).json({ error: "Unknown port. Choose one of the listed ports." });
  }
  if (![60, 120].includes(durationSec)) {
    return res.status(400).json({ error: "durationSec must be 60 or 120." });
  }

  const port = PORTS[portKey];
  const tasks = [];

  if (process.env.AISSTREAM_API_KEY) {
    tasks.push(runProvider({
      provider: "AISStream",
      url: "wss://stream.aisstream.io/v0/stream",
      apiKey: process.env.AISSTREAM_API_KEY,
      durationSec,
      subscribe: (apiKey) => ({
        APIKey: apiKey,
        BoundingBoxes: [port.aisBox],
        FilterMessageTypes: [
          "PositionReport",
          "ExtendedClassBPositionReport",
          "StandardClassBPositionReport",
          "ShipStaticData"
        ]
      }),
      consume: consumeAisStream
    }));
  } else {
    tasks.push(Promise.resolve({
      provider: "AISStream",
      status: "not_configured",
      messages: 0,
      positionMessages: 0,
      staticMessages: 0,
      uniqueVessels: 0,
      vesselsWithType: 0,
      messagesPerSecond: 0,
      vesselsPerMinute: 0,
      errors: ["Set AISSTREAM_API_KEY in Vercel Environment Variables."],
      vessels: [],
      staticData: []
    }));
  }

  tasks.push(runProvider({
    provider: "Open Waters",
    url: "wss://ais.openwaters.io/v1/stream",
    durationSec,
    subscribe: () => ({
      type: "subscribe",
      bbox: [port.openWatersBox]
    }),
    consume: consumeOpenWaters
  }));

  const results = await Promise.all(tasks);

  return res.status(200).json({
    success: true,
    port: port.name,
    portKey,
    center: port.center,
    durationSec,
    generatedAt: new Date().toISOString(),
    results
  });
}
