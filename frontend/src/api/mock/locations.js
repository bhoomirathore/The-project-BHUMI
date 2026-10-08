// Locations list containing only states, districts, and tehsils that have demo data.
// Demo geography: Uttar Pradesh / Lucknow throughout (Assumption A4).

export const LOCATIONS_DATA = [
  {
    state: 'Uttar Pradesh',
    districts: [
      {
        district: 'Lucknow',
        tehsils: [
          {
            tehsil: 'Lucknow Sadar',
            sroOffice: 'Lucknow Sadar Sub-Registrar Office',
            villages: ['Rampur', 'Shyampur', 'Kalli Pashchim', 'Gosainganj'],
          },
          {
            tehsil: 'Bakshi Ka Talab',
            sroOffice: 'Bakshi Ka Talab Sub-Registrar Office',
            villages: ['Barauna', 'Mandiaon', 'Asthi', 'Kathwara'],
          },
          {
            tehsil: 'Mohanlalganj',
            sroOffice: 'Mohanlalganj Sub-Registrar Office',
            villages: ['Nagram', 'Sisendi', 'Khujahi', 'Jabirela'],
          },
        ],
      },
    ],
  },
];

export const getStates = () => LOCATIONS_DATA.map((l) => l.state);

export const getDistricts = (stateName) => {
  const stateObj = LOCATIONS_DATA.find((l) => l.state === stateName);
  return stateObj ? stateObj.districts.map((d) => d.district) : [];
};

export const getTehsils = (stateName, districtName) => {
  const stateObj = LOCATIONS_DATA.find((l) => l.state === stateName);
  if (!stateObj) return [];
  const distObj = stateObj.districts.find((d) => d.district === districtName);
  return distObj ? distObj.tehsils.map((t) => t.tehsil) : [];
};

export const getSROOffices = () => [
  'Lucknow Sadar Sub-Registrar Office',
  'Bakshi Ka Talab Sub-Registrar Office',
  'Mohanlalganj Sub-Registrar Office',
];
