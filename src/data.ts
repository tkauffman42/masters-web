import type { Golfer, PoolEntry } from "./types";

export const sampleGolfers: Golfer[] = [
  { id: 1, name: "Scottie Scheffler", country: "USA", worldRanking: 1, score: -12, today: -4, thru: "F", position: "1" },
  { id: 2, name: "Rory McIlroy", country: "NIR", worldRanking: 3, score: -10, today: -3, thru: "F", position: "2" },
  { id: 3, name: "Jon Rahm", country: "ESP", worldRanking: 5, score: -8, today: -2, thru: "16", position: "3" },
  { id: 4, name: "Brooks Koepka", country: "USA", worldRanking: 8, score: -7, today: -1, thru: "F", position: "T4" },
  { id: 5, name: "Collin Morikawa", country: "USA", worldRanking: 4, score: -7, today: -3, thru: "F", position: "T4" },
  { id: 6, name: "Ludvig Åberg", country: "SWE", worldRanking: 6, score: -6, today: -2, thru: "15", position: "6" },
  { id: 7, name: "Xander Schauffele", country: "USA", worldRanking: 2, score: -5, today: 0, thru: "F", position: "7" },
  { id: 8, name: "Viktor Hovland", country: "NOR", worldRanking: 12, score: -4, today: -1, thru: "F", position: "8" },
  { id: 9, name: "Patrick Cantlay", country: "USA", worldRanking: 9, score: -3, today: 1, thru: "F", position: "T9" },
  { id: 10, name: "Bryson DeChambeau", country: "USA", worldRanking: 10, score: -3, today: -2, thru: "14", position: "T9" },
  { id: 11, name: "Tommy Fleetwood", country: "ENG", worldRanking: 11, score: -2, today: 0, thru: "F", position: "11" },
  { id: 12, name: "Hideki Matsuyama", country: "JPN", worldRanking: 7, score: -1, today: 1, thru: "F", position: "12" },
  { id: 13, name: "Tony Finau", country: "USA", worldRanking: 15, score: 0, today: 2, thru: "F", position: "13" },
  { id: 14, name: "Shane Lowry", country: "IRL", worldRanking: 14, score: 1, today: 0, thru: "F", position: "14" },
  { id: 15, name: "Dustin Johnson", country: "USA", worldRanking: 20, score: 2, today: 1, thru: "F", position: "15" },
  { id: 16, name: "Cameron Smith", country: "AUS", worldRanking: 18, score: 3, today: 2, thru: "F", position: "16" },
];

export const samplePoolEntries: PoolEntry[] = [
  {
    id: 1,
    name: "Mike Thompson",
    golfers: [sampleGolfers[0], sampleGolfers[2], sampleGolfers[6], sampleGolfers[10]],
    totalPoints: 145,
  },
  {
    id: 2,
    name: "Sarah Chen",
    golfers: [sampleGolfers[1], sampleGolfers[4], sampleGolfers[7], sampleGolfers[11]],
    totalPoints: 132,
  },
  {
    id: 3,
    name: "Jake Wilson",
    golfers: [sampleGolfers[3], sampleGolfers[5], sampleGolfers[8], sampleGolfers[12]],
    totalPoints: 118,
  },
  {
    id: 4,
    name: "Emily Davis",
    golfers: [sampleGolfers[0], sampleGolfers[1], sampleGolfers[9], sampleGolfers[13]],
    totalPoints: 155,
  },
  {
    id: 5,
    name: "Chris Martinez",
    golfers: [sampleGolfers[2], sampleGolfers[6], sampleGolfers[11], sampleGolfers[14]],
    totalPoints: 98,
  },
];
