// Locations list containing only states, districts, and tehsils that have demo data.
// Demo geography: Madhya Pradesh throughout.

export const LOCATIONS_DATA = [
  {
    state: 'Madhya Pradesh',
    districts: [
      {
        district: 'Bhopal',
        tehsils: [
          {
            tehsil: 'Huzur',
            sroOffice: 'Huzur Sub-Registrar Office',
            villages: ['Acharpura', 'Barkheda Bondar', 'Bilkhiriya Kalan', 'Bhauri'],
          },
          {
            tehsil: 'Berasia',
            sroOffice: 'Berasia Sub-Registrar Office',
            villages: ['Nazirabad', 'Lalariya', 'Harrakheda', 'Gunga'],
          },
          {
            tehsil: 'Kolar',
            sroOffice: 'Kolar Sub-Registrar Office',
            villages: ['Amrabad Kalan', 'Deepdi', 'Pipaliya Rani', 'Samarda'],
          },
        ],
      },
      {
        district: 'Indore',
        tehsils: [
          {
            tehsil: 'Sanwer',
            sroOffice: 'Sanwer Sub-Registrar Office',
            villages: ['Ajnod', 'Alwasa', 'Dharmat', 'Kankariya Pal'],
          },
          {
            tehsil: 'Depalpur',
            sroOffice: 'Depalpur Sub-Registrar Office',
            villages: ['Betma Khurd', 'Ghatabillod', 'Machal', 'Banedia'],
          },
          {
            tehsil: 'Mhow',
            sroOffice: 'Mhow Sub-Registrar Office',
            villages: ['Badgonda', 'Choral', 'Datoda', 'Harsola'],
          },
        ],
      },
      {
        district: 'Jabalpur',
        tehsils: [
          {
            tehsil: 'Patan',
            sroOffice: 'Patan Sub-Registrar Office',
            villages: ['Belkheda', 'Shahpura', 'Katangi', 'Majholi'],
          },
          {
            tehsil: 'Sihora',
            sroOffice: 'Sihora Sub-Registrar Office',
            villages: ['Gosalpur', 'Agariya', 'Khitola', 'Darshani'],
          },
          {
            tehsil: 'Panagar',
            sroOffice: 'Panagar Sub-Registrar Office',
            villages: ['Panagar Rural', 'Umarariya', 'Baghraji', 'Padwar'],
          },
        ],
      },
      {
        district: 'Gwalior',
        tehsils: [
          {
            tehsil: 'Gwalior',
            sroOffice: 'Gwalior Sub-Registrar Office',
            villages: ['Morar', 'Hastinapur', 'Maharajpura', 'Baraua'],
          },
          {
            tehsil: 'Dabra',
            sroOffice: 'Dabra Sub-Registrar Office',
            villages: ['Beru', 'Deora', 'Simiriya', 'Chutarpura'],
          },
          {
            tehsil: 'Bhitarwar',
            sroOffice: 'Bhitarwar Sub-Registrar Office',
            villages: ['Bagwai', 'Bajna', 'Bamor', 'Pawaya'],
          },
        ],
      },
      {
        district: 'Ujjain',
        tehsils: [
          {
            tehsil: 'Ujjain',
            sroOffice: 'Ujjain Sub-Registrar Office',
            villages: ['Tajpur', 'Lekoda', 'Chandesari', 'Narwar'],
          },
          {
            tehsil: 'Badnagar',
            sroOffice: 'Badnagar Sub-Registrar Office',
            villages: ['Jahangirpur', 'Runija', 'Ingoria', 'Maulabad'],
          },
          {
            tehsil: 'Mahidpur',
            sroOffice: 'Mahidpur Sub-Registrar Office',
            villages: ['Jharda', 'Baijnath', 'Baloda', 'Indokh'],
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

export const getSROOffices = () => {
  const offices = [];
  LOCATIONS_DATA.forEach((s) => {
    s.districts.forEach((d) => {
      d.tehsils.forEach((t) => {
        if (t.sroOffice) offices.push(t.sroOffice);
      });
    });
  });
  return offices;
};

export const getSROOfficesByDistrict = (districtName) => {
  for (const s of LOCATIONS_DATA) {
    const dist = s.districts.find((d) => d.district === districtName);
    if (dist) {
      return dist.tehsils.map((t) => t.sroOffice).filter(Boolean);
    }
  }
  return [];
};
