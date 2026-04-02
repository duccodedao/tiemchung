export interface Vaccine {
  id: string;
  name: string;
  disease: string;
  dose: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  description: string;
}

export interface Child {
  id: string;
  name: string;
  birthDate: string; // ISO string
}

export const VACCINATION_SCHEDULE: Vaccine[] = [
  {
    id: 'hepb-nb',
    name: 'Viêm gan B sơ sinh',
    disease: 'Viêm gan B',
    dose: 'Mũi sơ sinh',
    minAgeMonths: 0,
    maxAgeMonths: 0.03, // 24 hours
    description: 'Tiêm trong vòng 24 giờ đầu sau sinh'
  },
  {
    id: 'bcg',
    name: 'Lao (BCG)',
    disease: 'Lao',
    dose: 'Mũi duy nhất',
    minAgeMonths: 0,
    maxAgeMonths: 1,
    description: 'Tiêm càng sớm càng tốt sau khi sinh'
  },
  {
    id: '5in1-1',
    name: 'Vắc xin phối hợp (5 trong 1)',
    disease: 'Bạch hầu, Ho gà, Uốn ván, Viêm gan B, Hib',
    dose: 'Mũi 1',
    minAgeMonths: 2,
    maxAgeMonths: 2.9,
    description: 'Bạch hầu - Ho gà - Uốn ván - Viêm gan B - Hib mũi 1'
  },
  {
    id: 'opv-1',
    name: 'Bại liệt uống (OPV)',
    disease: 'Bại liệt',
    dose: 'Lần 1',
    minAgeMonths: 2,
    maxAgeMonths: 2.9,
    description: 'Uống liều thứ 1'
  },
  {
    id: '5in1-2',
    name: 'Vắc xin phối hợp (5 trong 1)',
    disease: 'Bạch hầu, Ho gà, Uốn ván, Viêm gan B, Hib',
    dose: 'Mũi 2',
    minAgeMonths: 3,
    maxAgeMonths: 3.9,
    description: 'Bạch hầu - Ho gà - Uốn ván - Viêm gan B - Hib mũi 2'
  },
  {
    id: 'opv-2',
    name: 'Bại liệt uống (OPV)',
    disease: 'Bại liệt',
    dose: 'Lần 2',
    minAgeMonths: 3,
    maxAgeMonths: 3.9,
    description: 'Uống liều thứ 2'
  },
  {
    id: '5in1-3',
    name: 'Vắc xin phối hợp (5 trong 1)',
    disease: 'Bạch hầu, Ho gà, Uốn ván, Viêm gan B, Hib',
    dose: 'Mũi 3',
    minAgeMonths: 4,
    maxAgeMonths: 4.9,
    description: 'Bạch hầu - Ho gà - Uốn ván - Viêm gan B - Hib mũi 3'
  },
  {
    id: 'opv-3',
    name: 'Bại liệt uống (OPV)',
    disease: 'Bại liệt',
    dose: 'Lần 3',
    minAgeMonths: 4,
    maxAgeMonths: 4.9,
    description: 'Uống liều thứ 3'
  },
  {
    id: 'ipv',
    name: 'Bại liệt tiêm (IPV)',
    disease: 'Bại liệt',
    dose: 'Mũi 1',
    minAgeMonths: 5,
    maxAgeMonths: 5.9,
    description: 'Tiêm liều thứ 1'
  },
  {
    id: 'measles-1',
    name: 'Sởi',
    disease: 'Sởi',
    dose: 'Mũi 1',
    minAgeMonths: 9,
    maxAgeMonths: 11.9,
    description: 'Tiêm mũi thứ 1'
  },
  {
    id: 'je-1',
    name: 'Viêm não Nhật Bản',
    disease: 'Viêm não Nhật Bản',
    dose: 'Mũi 1',
    minAgeMonths: 12,
    maxAgeMonths: 15,
    description: 'Tiêm mũi thứ 1'
  },
  {
    id: 'je-2',
    name: 'Viêm não Nhật Bản',
    disease: 'Viêm não Nhật Bản',
    dose: 'Mũi 2',
    minAgeMonths: 12.25, // 1-2 weeks after dose 1
    maxAgeMonths: 15.5,
    description: 'Tiêm mũi thứ 2 (sau mũi 1 từ 1-2 tuần)'
  },
  {
    id: 'mr',
    name: 'Sởi - Rubella (MR)',
    disease: 'Sởi, Rubella',
    dose: 'Mũi nhắc lại',
    minAgeMonths: 18,
    maxAgeMonths: 23.9,
    description: 'Tiêm nhắc lại Sởi - Rubella'
  },
  {
    id: 'dpt-booster',
    name: 'Bạch hầu - Ho gà - Uốn ván (DPT)',
    disease: 'Bạch hầu, Ho gà, Uốn ván',
    dose: 'Mũi 4',
    minAgeMonths: 18,
    maxAgeMonths: 23.9,
    description: 'Tiêm nhắc lại DPT mũi 4'
  },
  {
    id: 'je-3',
    name: 'Viêm não Nhật Bản',
    disease: 'Viêm não Nhật Bản',
    dose: 'Mũi 3',
    minAgeMonths: 24,
    maxAgeMonths: 60,
    description: 'Tiêm nhắc lại (sau mũi 2 khoảng 1 năm)'
  }
];
