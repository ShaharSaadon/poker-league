// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:

import { Game } from './definitions';

// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const players = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Amir Levy',
    email: 'evil@rabbit.com',
    image_url: '/players/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Yovel Sade',
    email: 'delba@oliveira.com',
    image_url: '/players/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Oshri Cohen',
    email: 'lee@robinson.com',
    image_url: '/players/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Ben Saadon',
    email: 'michael@novotny.com',
    image_url: '/players/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Ben Doda',
    email: 'amy@burns.com',
    image_url: '/players/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Shahar Saadon',
    email: 'balazs@orban.com',
    image_url: '/players/balazs-orban.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Noy Yehuda',
    email: 'balazs@orban.com',
    image_url: '/players/balazs-orban.png',
  },
];

const games = [
  {
    player_ids: [
      'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
      '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    ], // Example player IDs
    date: '2023-12-01',
  },
  {
    player_ids: [
      '76d65c26-f784-44a2-ac19-586678f7c2f2',
      '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    ],
    date: '2023-12-02',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

export { users, players, games, revenue };
