export interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export const SCHOLARSHIP_QUESTIONS: Question[] = [
  // ==========================================
  // MATHEMATICS (30 Questions: IDs 1-30)
  // ==========================================
  {
    id: 1,
    subject: "Mathematics",
    question: "If a person sells an article for Rs. 350 and gains 25%, what was the cost price of the article?",
    options: ["Rs. 280", "Rs. 300", "Rs. 275", "Rs. 290"],
    answerIndex: 0
  },
  {
    id: 2,
    subject: "Mathematics",
    question: "The average of five consecutive odd numbers is 61. What is the difference between the highest and lowest numbers?",
    options: ["4", "6", "8", "10"],
    answerIndex: 2
  },
  {
    id: 3,
    subject: "Mathematics",
    question: "A sum of money doubles itself in 8 years at simple interest. In how many years will it triple itself?",
    options: ["12 years", "16 years", "20 years", "24 years"],
    answerIndex: 1
  },
  {
    id: 4,
    subject: "Mathematics",
    question: "Two numbers are in the ratio 3:4. If their LCM is 240, what is the smaller number?",
    options: ["60", "80", "50", "70"],
    answerIndex: 0
  },
  {
    id: 5,
    subject: "Mathematics",
    question: "If 15 men can complete a project in 6 days, how many days will 10 men take to complete the same work?",
    options: ["8 days", "9 days", "10 days", "12 days"],
    answerIndex: 1
  },
  {
    id: 6,
    subject: "Mathematics",
    question: "A train 150m long is running at a speed of 54 km/h. How much time will it take to cross a platform of length 250m?",
    options: ["20 seconds", "24 seconds", "26.6 seconds", "30 seconds"],
    answerIndex: 2
  },
  {
    id: 7,
    subject: "Mathematics",
    question: "What is the compound interest on Rs. 10,000 for 2 years at 10% per annum, compounded annually?",
    options: ["Rs. 2,000", "Rs. 2,100", "Rs. 2,200", "Rs. 2,050"],
    answerIndex: 1
  },
  {
    id: 8,
    subject: "Mathematics",
    question: "If log 2 = 0.3010 and log 3 = 0.4771, find the value of log 6.",
    options: ["0.7781", "0.1761", "0.6020", "0.9542"],
    answerIndex: 0
  },
  {
    id: 9,
    subject: "Mathematics",
    question: "Find the value of x if 2^(x+4) - 2^(x+2) = 3.",
    options: ["x = -2", "x = -1", "x = 0", "x = 1"],
    answerIndex: 0
  },
  {
    id: 10,
    subject: "Mathematics",
    question: "In an examination, 35% of total students failed in Hindi, 45% failed in English and 20% failed in both. What is the pass percentage in both subjects?",
    options: ["30%", "40%", "50%", "60%"],
    answerIndex: 1
  },
  {
    id: 11,
    subject: "Mathematics",
    question: "A card is drawn at random from a well-shuffled pack of 52 cards. What is the probability of getting a king or a queen?",
    options: ["1/13", "2/13", "3/13", "4/13"],
    answerIndex: 1
  },
  {
    id: 12,
    subject: "Mathematics",
    question: "The perimeter of a rectangular field is 480 meters and the ratio between its length and breadth is 5:3. What is the area?",
    options: ["13,500 sq m", "15,500 sq m", "12,500 sq m", "14,500 sq m"],
    answerIndex: 0
  },
  {
    id: 13,
    subject: "Mathematics",
    question: "Find the HCF of 2/3, 8/9, 64/81 and 10/27.",
    options: ["2/81", "2/27", "8/81", "10/81"],
    answerIndex: 0
  },
  {
    id: 14,
    subject: "Mathematics",
    question: "The sum of a two-digit number and the number obtained by reversing its digits is 121. The difference of the digits is 3. Find the number.",
    options: ["74", "85", "96", "74 or 47"],
    answerIndex: 3
  },
  {
    id: 15,
    subject: "Mathematics",
    question: "A vessel contains milk and water in the ratio 4:3. If 14 liters of water is added, the ratio becomes 4:5. Find the initial quantity of milk.",
    options: ["28 liters", "24 liters", "32 liters", "35 liters"],
    answerIndex: 0
  },
  {
    id: 16,
    subject: "Mathematics",
    question: "In what time can a cistern be filled by three pipes whose diameters are 1 cm, 2 cm, and 3 cm, running together, when the largest alone can fill it in 42 minutes? (The amount of water flowing in each pipe is proportional to the square of its diameter.)",
    options: ["24 minutes", "27 minutes", "30 minutes", "25 minutes"],
    answerIndex: 1
  },
  {
    id: 17,
    subject: "Mathematics",
    question: "If 10% of x is the same as 20% of y, then x:y is equal to:",
    options: ["2:1", "1:2", "5:1", "1:1"],
    answerIndex: 0
  },
  {
    id: 18,
    subject: "Mathematics",
    question: "A shopkeeper marks his goods 30% above the cost price and gives a discount of 10% to customers. What is his net gain percentage?",
    options: ["15%", "17%", "20%", "22%"],
    answerIndex: 1
  },
  {
    id: 19,
    subject: "Mathematics",
    question: "By how much is two-third of 57 less than three-fourth of 96?",
    options: ["34", "38", "40", "42"],
    answerIndex: 0
  },
  {
    id: 20,
    subject: "Mathematics",
    question: "The radius of a circular wheel is 1.75 m. How many revolutions will it make in traveling 11 km?",
    options: ["800", "900", "1000", "1200"],
    answerIndex: 2
  },
  {
    id: 21,
    subject: "Mathematics",
    question: "If standard deviation of a distribution is 8, what is its variance?",
    options: ["64", "16", "4", "2.82"],
    answerIndex: 0
  },
  {
    id: 22,
    subject: "Mathematics",
    question: "Find the value of (0.337 * 0.337 - 0.123 * 0.123) / (0.337 - 0.123).",
    options: ["0.214", "0.460", "0.337", "0.123"],
    answerIndex: 1
  },
  {
    id: 23,
    subject: "Mathematics",
    question: "The ratio of the ages of A and B at present is 4:3. After 6 years, A's age will be 26 years. What is the present age of B?",
    options: ["12 years", "15 years", "19.5 years", "21 years"],
    answerIndex: 1
  },
  {
    id: 24,
    subject: "Mathematics",
    question: "Solve for x: sqrt(3x + 1) + 1 = x.",
    options: ["5", "0", "5 or 0", "8"],
    answerIndex: 0
  },
  {
    id: 25,
    subject: "Mathematics",
    question: "A student has to secure 40% marks to pass. He gets 178 marks and fails by 22 marks. What are the maximum marks?",
    options: ["400", "500", "600", "800"],
    answerIndex: 1
  },
  {
    id: 26,
    subject: "Mathematics",
    question: "If a:b = 2:3 and b:c = 4:5, then a:b:c is:",
    options: ["8:12:15", "2:4:5", "6:9:15", "3:4:5"],
    answerIndex: 0
  },
  {
    id: 27,
    subject: "Mathematics",
    question: "Find the sum of all natural numbers between 1 and 100 which are divisible by 3.",
    options: ["1683", "1650", "1551", "1665"],
    answerIndex: 0
  },
  {
    id: 28,
    subject: "Mathematics",
    question: "The diagonal of a square is 8 cm. What is the length of its side?",
    options: ["4 cm", "4*sqrt(2) cm", "8*sqrt(2) cm", "6 cm"],
    answerIndex: 1
  },
  {
    id: 29,
    subject: "Mathematics",
    question: "A man can row 6 km/h in still water. If the speed of the current is 2 km/h, it takes him 3 hours to row to a place and back. How far is the place?",
    options: ["8 km", "10 km", "12 km", "16 km"],
    answerIndex: 0
  },
  {
    id: 30,
    subject: "Mathematics",
    question: "If x + 1/x = 5, then x^2 + 1/x^2 is equal to:",
    options: ["23", "25", "27", "29"],
    answerIndex: 0
  },

  // ==========================================
  // REASONING & APTITUDE (30 Questions: IDs 31-60)
  // ==========================================
  {
    id: 31,
    subject: "Reasoning & Aptitude",
    question: "If in a certain code language, 'ROSE' is written as 'TQUG', how is 'BISCUIT' written in that code?",
    options: ["DKUEWKV", "DKVEWKV", "DKUEWLU", "DKVEWLV"],
    answerIndex: 0
  },
  {
    id: 32,
    subject: "Reasoning & Aptitude",
    question: "Point A is 10 meters to the West of Point B. Point C is 15 meters to the South of Point B. In which direction is Point A with respect to Point C?",
    options: ["North-West", "North-East", "South-West", "South-East"],
    answerIndex: 0
  },
  {
    id: 33,
    subject: "Reasoning & Aptitude",
    question: "Introducing a girl, Vipin said, 'She is the daughter of the only sister of my father.' How is Vipin related to the girl?",
    options: ["Uncle", "Cousin", "Brother", "Father-in-law"],
    answerIndex: 1
  },
  {
    id: 34,
    subject: "Reasoning & Aptitude",
    question: "Complete the series: 3, 7, 15, 31, 63, ...",
    options: ["95", "111", "127", "143"],
    answerIndex: 2
  },
  {
    id: 35,
    subject: "Reasoning & Aptitude",
    question: "Which of the following is the odd one out?",
    options: ["Mercury", "Venus", "Earth", "Moon"],
    answerIndex: 3
  },
  {
    id: 36,
    subject: "Reasoning & Aptitude",
    question: "If '+' means '*', '*' means '-', '-' means '/' and '/' means '+', then what is the value of 8 + 4 / 9 - 3 * 1?",
    options: ["34", "32", "36", "40"],
    answerIndex: 0
  },
  {
    id: 37,
    subject: "Reasoning & Aptitude",
    question: "Arrange the words in a meaningful logical sequence: 1. Consultation, 2. Illness, 3. Doctor, 4. Treatment, 5. Recovery.",
    options: ["2, 3, 1, 4, 5", "2, 3, 4, 1, 5", "4, 3, 1, 2, 5", "5, 1, 2, 3, 4"],
    answerIndex: 0
  },
  {
    id: 38,
    subject: "Reasoning & Aptitude",
    question: "A is older than B but younger than C. D is younger than E but older than A. If C is younger than D, who is the oldest of all?",
    options: ["E", "C", "A", "B"],
    answerIndex: 0
  },
  {
    id: 39,
    subject: "Reasoning & Aptitude",
    question: "What will come in place of the question mark? Cup : Lip :: Bird : ?",
    options: ["Bush", "Grass", "Forest", "Beak"],
    answerIndex: 3
  },
  {
    id: 40,
    subject: "Reasoning & Aptitude",
    question: "If 1st January 2024 is a Monday, what day of the week will 1st January 2025 be?",
    options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
    answerIndex: 1
  },
  {
    id: 41,
    subject: "Reasoning & Aptitude",
    question: "In a row of boys, Srinath is 7th from the left and Venkat is 12th from the right. If they interchange their positions, Srinath becomes 22nd from the left. How many boys are there in the row?",
    options: ["33", "31", "32", "34"],
    answerIndex: 0
  },
  {
    id: 42,
    subject: "Reasoning & Aptitude",
    question: "A man faces South. He turns 135 degrees in the anti-clockwise direction and then 180 degrees in the clockwise direction. Which direction is he facing now?",
    options: ["South-West", "South-East", "North-East", "North-West"],
    answerIndex: 0
  },
  {
    id: 43,
    subject: "Reasoning & Aptitude",
    question: "Statements: All bags are pockets. All pockets are pouches. Conclusions: I. All bags are pouches. II. Some pouches are pockets.",
    options: ["Only conclusion I follows", "Only conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
    answerIndex: 2
  },
  {
    id: 44,
    subject: "Reasoning & Aptitude",
    question: "If C = 24 and EYE = 80, then find the value of KEY.",
    options: ["72", "81", "83", "85"],
    answerIndex: 1
  },
  {
    id: 45,
    subject: "Reasoning & Aptitude",
    question: "Find the missing term in the sequence: A, C, F, J, O, ?",
    options: ["T", "U", "V", "W"],
    answerIndex: 1
  },
  {
    id: 46,
    subject: "Reasoning & Aptitude",
    question: "How many triangles are there in a standard 5-pointed star?",
    options: ["5", "8", "10", "12"],
    answerIndex: 2
  },
  {
    id: 47,
    subject: "Reasoning & Aptitude",
    question: "At what angle are the hands of a clock inclined at 15 minutes past 5?",
    options: ["52.5 degrees", "67.5 degrees", "62.5 degrees", "90 degrees"],
    answerIndex: 1
  },
  {
    id: 48,
    subject: "Reasoning & Aptitude",
    question: "Choose the correct alternative: Melt : Liquid :: Freeze : ?",
    options: ["Ice", "Solid", "Condense", "Crystal"],
    answerIndex: 1
  },
  {
    id: 49,
    subject: "Reasoning & Aptitude",
    question: "Six persons A, B, C, D, E, and F are sitting in a circle facing the center. B is between F and C; A is between E and D; F is to the left of D. Who is between A and F?",
    options: ["D", "E", "C", "B"],
    answerIndex: 0
  },
  {
    id: 50,
    subject: "Reasoning & Aptitude",
    question: "If 'POND' is coded as '18-17-16-6', then how is 'HEAR' coded?",
    options: ["10-7-3-20", "10-6-4-20", "10-7-4-20", "9-7-3-20"],
    answerIndex: 0
  },
  {
    id: 51,
    subject: "Reasoning & Aptitude",
    question: "A cube painted red on all faces is cut into 27 small cubes of equal size. How many small cubes will have no face painted?",
    options: ["1", "2", "4", "8"],
    answerIndex: 0
  },
  {
    id: 52,
    subject: "Reasoning & Aptitude",
    question: "Find the odd number in the given sequence: 361, 529, 729, 841, 961.",
    options: ["729", "529", "361", "841"],
    answerIndex: 0
  },
  {
    id: 53,
    subject: "Reasoning & Aptitude",
    question: "If in a certain language, 'TIGER' is coded as 'GRZVT', how is 'LION' coded in that language?",
    options: ["ORLM", "OSLM", "OSKM", "ORKM"],
    answerIndex: 0
  },
  {
    id: 54,
    subject: "Reasoning & Aptitude",
    question: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
    options: ["Mother", "Sister", "Grandmother", "Aunt"],
    answerIndex: 0
  },
  {
    id: 55,
    subject: "Reasoning & Aptitude",
    question: "Which number replaces the question mark in: 12, 23, 34, 45, ?",
    options: ["56", "57", "58", "59"],
    answerIndex: 0
  },
  {
    id: 56,
    subject: "Reasoning & Aptitude",
    question: "If standard paper folding yields a pattern, matching it requires symmetrical inversion. What is the mirror image of 'EFFECTIVE'?",
    options: ["EVITCETTE", "EVITCEFFE (with letters reversed)", "EVITCETFE", "EVITCEFFE"],
    answerIndex: 1
  },
  {
    id: 57,
    subject: "Reasoning & Aptitude",
    question: "Which of the following diagrams indicates the best relation between Travelers, Train, and Bus?",
    options: ["Two intersecting circles inside a large one", "Three separate circles", "One large circle with travelers, intersecting train and bus", "Three intersecting circles in a line"],
    answerIndex: 2
  },
  {
    id: 58,
    subject: "Reasoning & Aptitude",
    question: "If white is called black, black is called red, red is called yellow, yellow is called green, what is the color of human blood?",
    options: ["Red", "Yellow", "Black", "Green"],
    answerIndex: 1
  },
  {
    id: 59,
    subject: "Reasoning & Aptitude",
    question: "In a class of 45 students, Rohan ranks 18th from the top. What is his rank from the bottom?",
    options: ["27th", "28th", "29th", "30th"],
    answerIndex: 1
  },
  {
    id: 60,
    subject: "Reasoning & Aptitude",
    question: "Find the next alphabet pair: AB, DE, GH, JK, ?",
    options: ["MN", "LM", "OP", "PQ"],
    answerIndex: 0
  },

  // ==========================================
  // GENERAL KNOWLEDGE (25 Questions: IDs 61-85)
  // ==========================================
  {
    id: 61,
    subject: "General Knowledge",
    question: "Who was the first Indian woman to win an Olympic medal?",
    options: ["Karnam Malleswari", "Saina Nehwal", "Mary Kom", "P.T. Usha"],
    answerIndex: 0
  },
  {
    id: 62,
    subject: "General Knowledge",
    question: "Which state in India is known as the 'Spices Garden of India'?",
    options: ["Kerala", "Karnataka", "Tamil Nadu", "Andhra Pradesh"],
    answerIndex: 0
  },
  {
    id: 63,
    subject: "General Knowledge",
    question: "Where is the headquarters of the International Court of Justice located?",
    options: ["Geneva", "The Hague", "New York", "Paris"],
    answerIndex: 1
  },
  {
    id: 64,
    subject: "General Knowledge",
    question: "Which is the largest fresh water lake in India?",
    options: ["Chilika Lake", "Wular Lake", "Dal Lake", "Loktak Lake"],
    answerIndex: 1
  },
  {
    id: 65,
    subject: "General Knowledge",
    question: "The Nobel Peace Prize is awarded in which city?",
    options: ["Stockholm", "Oslo", "Geneva", "Brussels"],
    answerIndex: 1
  },
  {
    id: 66,
    subject: "General Knowledge",
    question: "Which classical dance style originated in Tamil Nadu?",
    options: ["Kathakali", "Bharatanatyam", "Kuchipudi", "Odissi"],
    answerIndex: 1
  },
  {
    id: 67,
    subject: "General Knowledge",
    question: "Who wrote the famous book 'Discovery of India'?",
    options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Rabindranath Tagore", "Subhas Chandra Bose"],
    answerIndex: 0
  },
  {
    id: 68,
    subject: "General Knowledge",
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    answerIndex: 2
  },
  {
    id: 69,
    subject: "General Knowledge",
    question: "Which is the highest civilian award in India?",
    options: ["Padma Vibhushan", "Bharat Ratna", "Param Vir Chakra", "Gnanpith Award"],
    answerIndex: 1
  },
  {
    id: 70,
    subject: "General Knowledge",
    question: "Where is the head office of Reserve Bank of India located?",
    options: ["New Delhi", "Kolkata", "Mumbai", "Chennai"],
    answerIndex: 2
  },
  {
    id: 71,
    subject: "General Knowledge",
    question: "Who was the first female Prime Minister in the world?",
    options: ["Indira Gandhi", "Sirimavo Bandaranaike", "Margaret Thatcher", "Golda Meir"],
    answerIndex: 1
  },
  {
    id: 72,
    subject: "General Knowledge",
    question: "Which country is called the 'Land of White Elephants'?",
    options: ["Thailand", "Japan", "Kenya", "India"],
    answerIndex: 0
  },
  {
    id: 73,
    subject: "General Knowledge",
    question: "In which year did the Titanic sink?",
    options: ["1912", "1905", "1920", "1915"],
    answerIndex: 0
  },
  {
    id: 74,
    subject: "General Knowledge",
    question: "Which Indian monument was built by Shah Jahan in memory of his wife?",
    options: ["Taj Mahal", "Red Fort", "Qutub Minar", "Humayun's Tomb"],
    answerIndex: 0
  },
  {
    id: 75,
    subject: "General Knowledge",
    question: "Which gas is most abundant in the Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answerIndex: 2
  },
  {
    id: 76,
    subject: "General Knowledge",
    question: "Who is known as the 'Iron Man of India'?",
    options: ["Sardar Vallabhbhai Patel", "Lal Bahadur Shastri", "Bal Gangadhar Tilak", "Subhas Chandra Bose"],
    answerIndex: 0
  },
  {
    id: 77,
    subject: "General Knowledge",
    question: "What is the currency of Japan?",
    options: ["Yuan", "Yen", "Won", "Ringgit"],
    answerIndex: 1
  },
  {
    id: 78,
    subject: "General Knowledge",
    question: "Who designed the national flag of India?",
    options: ["Pingali Venkayya", "Rabindranath Tagore", "Bankim Chandra Chatterjee", "Mahatma Gandhi"],
    answerIndex: 0
  },
  {
    id: 79,
    subject: "General Knowledge",
    question: "Which is the smallest state of India by area?",
    options: ["Sikkim", "Goa", "Tripura", "Manipur"],
    answerIndex: 1
  },
  {
    id: 80,
    subject: "General Knowledge",
    question: "In which city is the world-famous monument 'Colosseum' situated?",
    options: ["Rome", "Athens", "Paris", "Cairo"],
    answerIndex: 0
  },
  {
    id: 81,
    subject: "General Knowledge",
    question: "Who was the author of the ancient text 'Arthashastra'?",
    options: ["Chanakya (Kautilya)", "Megasthenes", "Kalidasa", "Aryabhata"],
    answerIndex: 0
  },
  {
    id: 82,
    subject: "General Knowledge",
    question: "Which Indian festival celebrates the victory of Lord Rama over Ravana?",
    options: ["Dussehra", "Diwali", "Holi", "Rama Navami"],
    answerIndex: 0
  },
  {
    id: 83,
    subject: "General Knowledge",
    question: "Which is the longest river in the world?",
    options: ["Nile", "Amazon", "Yangtze", "Mississippi"],
    answerIndex: 0
  },
  {
    id: 84,
    subject: "General Knowledge",
    question: "In which state of India is the Gir National Park located?",
    options: ["Gujarat", "Rajasthan", "Madhya Pradesh", "Maharashtra"],
    answerIndex: 0
  },
  {
    id: 85,
    subject: "General Knowledge",
    question: "Who is the composer of the national song of India 'Vande Mataram'?",
    options: ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sri Aurobindo", "Sarojini Naidu"],
    answerIndex: 0
  },

  // ==========================================
  // CURRENT AFFAIRS (20 Questions: IDs 86-105)
  // ==========================================
  {
    id: 86,
    subject: "Current Affairs",
    question: "Which country hosted the G20 Summit in 2023?",
    options: ["India", "Indonesia", "Brazil", "South Africa"],
    answerIndex: 0
  },
  {
    id: 87,
    subject: "Current Affairs",
    question: "Who is the current Chief Justice of India (as of early 2026)?",
    options: ["Justice Sanjiv Khanna", "Justice D.Y. Chandrachud", "Justice U.U. Lalit", "Justice Sharad Arvind Bobde"],
    answerIndex: 0
  },
  {
    id: 88,
    subject: "Current Affairs",
    question: "ISRO launched which mission in 2023 to study the Sun?",
    options: ["Aditya-L1", "Chandrayaan-3", "Gaganyaan-1", "Mangalyaan-2"],
    answerIndex: 0
  },
  {
    id: 89,
    subject: "Current Affairs",
    question: "Which movie won the Best Picture award at the 96th Academy Awards (Oscars 2024)?",
    options: ["Oppenheimer", "Barbie", "Poor Things", "The Zone of Interest"],
    answerIndex: 0
  },
  {
    id: 90,
    subject: "Current Affairs",
    question: "The newly inaugurated Ram Mandir in Ayodhya is constructed in which architectural style?",
    options: ["Nagara Style", "Dravidian Style", "Vesara Style", "Indo-Islamic Style"],
    answerIndex: 0
  },
  {
    id: 91,
    subject: "Current Affairs",
    question: "Which country officially joined NATO as its 32nd member in March 2024?",
    options: ["Sweden", "Finland", "Ukraine", "Switzerland"],
    answerIndex: 0
  },
  {
    id: 92,
    subject: "Current Affairs",
    question: "Who won the Men's Singles title at the 2024 Australian Open?",
    options: ["Jannik Sinner", "Daniil Medvedev", "Novak Djokovic", "Rafael Nadal"],
    answerIndex: 0
  },
  {
    id: 93,
    subject: "Current Affairs",
    question: "What is the name of the indigenously developed navigation satellite system of India?",
    options: ["NavIC", "GAGAN", "IRNSS-2", "Bhuvan"],
    answerIndex: 0
  },
  {
    id: 94,
    subject: "Current Affairs",
    question: "Which state government launched the 'Lakhpati Didi' scheme to empower women self-help groups?",
    options: ["Uttarakhand", "Madhya Pradesh", "Rajasthan", "Uttar Pradesh"],
    answerIndex: 0
  },
  {
    id: 95,
    subject: "Current Affairs",
    question: "Who won the Nobel Prize in Literature in 2023?",
    options: ["Jon Fosse", "Annie Ernaux", "Abdulrazak Gurnah", "Louise Glück"],
    answerIndex: 0
  },
  {
    id: 96,
    subject: "Current Affairs",
    question: "What is India's rank in the World Press Freedom Index 2023?",
    options: ["161st", "150th", "142nd", "135th"],
    answerIndex: 0
  },
  {
    id: 97,
    subject: "Current Affairs",
    question: "Which Indian airport was ranked as the world's most punctual airport in 2023?",
    options: ["Kempegowda International Airport (Bengaluru)", "Indira Gandhi International Airport (Delhi)", "Chhatrapati Shivaji Maharaj International Airport (Mumbai)", "Rajiv Gandhi International Airport (Hyderabad)"],
    answerIndex: 0
  },
  {
    id: 98,
    subject: "Current Affairs",
    question: "Who was awarded the prestigious Dadasaheb Phalke Lifetime Achievement Award in late 2023?",
    options: ["Waheeda Rehman", "Asha Parekh", "Rajinikanth", "Amitabh Bachchan"],
    answerIndex: 0
  },
  {
    id: 99,
    subject: "Current Affairs",
    question: "Which team won the Ranji Trophy cricket tournament in 2023-2024?",
    options: ["Mumbai", "Vidarbha", "Saurashtra", "Madhya Pradesh"],
    answerIndex: 0
  },
  {
    id: 100,
    subject: "Current Affairs",
    question: "Who is the current President of the World Bank (as of 2025/2026)?",
    options: ["Ajay Banga", "David Malpass", "Kristalina Georgieva", "Jim Yong Kim"],
    answerIndex: 0
  },
  {
    id: 101,
    subject: "Current Affairs",
    question: "The 'Statue of Oneness' dedicated to Adi Shankaracharya was unveiled in which state?",
    options: ["Madhya Pradesh", "Gujarat", "Uttar Pradesh", "Karnataka"],
    answerIndex: 0
  },
  {
    id: 102,
    subject: "Current Affairs",
    question: "Which city is declared as India's first solar city?",
    options: ["Sanchi", "Indore", "Surat", "Pune"],
    answerIndex: 0
  },
  {
    id: 103,
    subject: "Current Affairs",
    question: "Which country has launched the world's first fourth-generation nuclear reactor?",
    options: ["China", "USA", "Russia", "France"],
    answerIndex: 0
  },
  {
    id: 104,
    subject: "Current Affairs",
    question: "Who has been appointed as the Chairman of the 16th Finance Commission of India?",
    options: ["Dr. Arvind Panagariya", "N.K. Singh", "Shaktikanta Das", "Dr. C. Rangarajan"],
    answerIndex: 0
  },
  {
    id: 105,
    subject: "Current Affairs",
    question: "Which state of India recently became the first to implement the Uniform Civil Code (UCC) post-independence?",
    options: ["Uttarakhand", "Goa", "Gujarat", "Assam"],
    answerIndex: 0
  },

  // ==========================================
  // SCIENCE (15 Questions: IDs 106-120)
  // ==========================================
  {
    id: 106,
    subject: "Science",
    question: "Which vitamin is synthesized in the skin when exposed to sunlight?",
    options: ["Vitamin D", "Vitamin A", "Vitamin C", "Vitamin E"],
    answerIndex: 0
  },
  {
    id: 107,
    subject: "Science",
    question: "What is the chemical name of common table salt?",
    options: ["Sodium Chloride", "Sodium Bicarbonate", "Sodium Carbonate", "Calcium Chloride"],
    answerIndex: 0
  },
  {
    id: 108,
    subject: "Science",
    question: "Which organelle is known as the powerhouse of the cell?",
    options: ["Mitochondria", "Ribosome", "Golgi Apparatus", "Nucleus"],
    answerIndex: 0
  },
  {
    id: 109,
    subject: "Science",
    question: "What is the speed of light in vacuum?",
    options: ["3 x 10^8 m/s", "3 x 10^6 m/s", "3 x 10^5 m/s", "3 x 10^10 m/s"],
    answerIndex: 0
  },
  {
    id: 110,
    subject: "Science",
    question: "Which gas is filled in electric bulbs to prolong the life of the filament?",
    options: ["Argon", "Oxygen", "Hydrogen", "Carbon Dioxide"],
    answerIndex: 0
  },
  {
    id: 111,
    subject: "Science",
    question: "What is the pH value of pure water?",
    options: ["7", "6", "8", "5.5"],
    answerIndex: 0
  },
  {
    id: 112,
    subject: "Science",
    question: "Which is the heaviest naturally occurring element?",
    options: ["Uranium", "Plutonium", "Lead", "Gold"],
    answerIndex: 0
  },
  {
    id: 113,
    subject: "Science",
    question: "What is the unit of electric resistance?",
    options: ["Ohm", "Volt", "Ampere", "Watt"],
    answerIndex: 0
  },
  {
    id: 114,
    subject: "Science",
    question: "Which non-metal remains liquid at room temperature?",
    options: ["Bromine", "Mercury", "Chlorine", "Phosphorus"],
    answerIndex: 0
  },
  {
    id: 115,
    subject: "Science",
    question: "Which blood group is known as the universal donor?",
    options: ["O negative", "AB positive", "A positive", "B negative"],
    answerIndex: 0
  },
  {
    id: 116,
    subject: "Science",
    question: "What is the main constituent of Liquefied Petroleum Gas (LPG)?",
    options: ["Butane", "Methane", "Ethane", "Propane"],
    answerIndex: 0
  },
  {
    id: 117,
    subject: "Science",
    question: "Which force holds the planets in their orbits around the Sun?",
    options: ["Gravitational Force", "Electromagnetic Force", "Nuclear Force", "Frictional Force"],
    answerIndex: 0
  },
  {
    id: 118,
    subject: "Science",
    question: "What is the hard outer layer of teeth called?",
    options: ["Enamel", "Dentin", "Cementum", "Pulp"],
    answerIndex: 0
  },
  {
    id: 119,
    subject: "Science",
    question: "Which element is used in the manufacturing of solar panels?",
    options: ["Silicon", "Carbon", "Germanium", "Copper"],
    answerIndex: 0
  },
  {
    id: 120,
    subject: "Science",
    question: "Which disease is caused by the deficiency of Vitamin C?",
    options: ["Scurvy", "Rickets", "Beriberi", "Night Blindness"],
    answerIndex: 0
  },

  // ==========================================
  // HISTORY (10 Questions: IDs 121-130)
  // ==========================================
  {
    id: 121,
    subject: "History",
    question: "Who was the founder of the Maurya Empire?",
    options: ["Chandragupta Maurya", "Ashoka", "Bindusara", "Ajatashatru"],
    answerIndex: 0
  },
  {
    id: 122,
    subject: "History",
    question: "In which year did the Battle of Plassey take place?",
    options: ["1757", "1764", "1526", "1857"],
    answerIndex: 0
  },
  {
    id: 123,
    subject: "History",
    question: "Who was the Mughal Emperor during the Revolt of 1857?",
    options: ["Bahadur Shah Zafar", "Shah Alam II", "Akbar II", "Farrukhsiyar"],
    answerIndex: 0
  },
  {
    id: 124,
    subject: "History",
    question: "Which governor-general abolished the practice of Sati in India?",
    options: ["Lord William Bentinck", "Lord Dalhousie", "Lord Canning", "Lord Cornwallis"],
    answerIndex: 0
  },
  {
    id: 125,
    subject: "History",
    question: "Where was the first session of the Indian National Congress held in 1885?",
    options: ["Bombay", "Calcutta", "Madras", "Delhi"],
    answerIndex: 0
  },
  {
    id: 126,
    subject: "History",
    question: "The famous Indus Valley Civilization site 'Harappa' is situated on the banks of which river?",
    options: ["Ravi", "Indus", "Sutlej", "Ghaggar"],
    answerIndex: 0
  },
  {
    id: 127,
    subject: "History",
    question: "Who was the spiritual leader and guru of Chhatrapati Shivaji Maharaj?",
    options: ["Samarth Ramdas", "Tukaram", "Eknath", "Jnaneswar"],
    answerIndex: 0
  },
  {
    id: 128,
    subject: "History",
    question: "In which year did Mahatma Gandhi start the Dandi March?",
    options: ["1930", "1920", "1942", "1919"],
    answerIndex: 0
  },
  {
    id: 129,
    subject: "History",
    question: "Who was the founder of the Brahmo Samaj?",
    options: ["Raja Ram Mohan Roy", "Swami Dayananda Saraswati", "Ishwar Chandra Vidyasagar", "Swami Vivekananda"],
    answerIndex: 0
  },
  {
    id: 130,
    subject: "History",
    question: "The Jallianwala Bagh massacre occurred in which city?",
    options: ["Amritsar", "Lahore", "Jalandhar", "Ludhiana"],
    answerIndex: 0
  },

  // ==========================================
  // GEOGRAPHY (10 Questions: IDs 131-140)
  // ==========================================
  {
    id: 131,
    subject: "Geography",
    question: "Which is the highest mountain peak in India?",
    options: ["Kanchenjunga", "K2 (Godwin Austen)", "Nanda Devi", "Anamudi"],
    answerIndex: 0
  },
  {
    id: 132,
    subject: "Geography",
    question: "Which river is known as the 'Sorrow of Bihar'?",
    options: ["Kosi", "Damodar", "Gandak", "Ghaghara"],
    answerIndex: 0
  },
  {
    id: 133,
    subject: "Geography",
    question: "Which imaginary line divides India into almost two equal parts?",
    options: ["Tropic of Cancer", "Equator", "Tropic of Capricorn", "Prime Meridian"],
    answerIndex: 0
  },
  {
    id: 134,
    subject: "Geography",
    question: "Which Indian state has the longest coastline?",
    options: ["Gujarat", "Andhra Pradesh", "Tamil Nadu", "Maharashtra"],
    answerIndex: 0
  },
  {
    id: 135,
    subject: "Geography",
    question: "Where is the Loktak Lake, the only floating lake in the world, situated?",
    options: ["Manipur", "Meghalaya", "Mizoram", "Assam"],
    answerIndex: 0
  },
  {
    id: 136,
    subject: "Geography",
    question: "Which planet is known as the Red Planet in our solar system?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    answerIndex: 0
  },
  {
    id: 137,
    subject: "Geography",
    question: "Which type of soil is most suitable for cotton cultivation in India?",
    options: ["Black Soil (Regur)", "Alluvial Soil", "Red Soil", "Laterite Soil"],
    answerIndex: 0
  },
  {
    id: 138,
    subject: "Geography",
    question: "Which channel separates the Andaman Islands from the Nicobar Islands?",
    options: ["Ten Degree Channel", "Nine Degree Channel", "Duncan Passage", "Eight Degree Channel"],
    answerIndex: 0
  },
  {
    id: 139,
    subject: "Geography",
    question: "Which is the largest cold desert in the world?",
    options: ["Antarctic Desert", "Gobi Desert", "Sahara Desert", "Atacama Desert"],
    answerIndex: 0
  },
  {
    id: 140,
    subject: "Geography",
    question: "Which Indian state is the largest producer of tea?",
    options: ["Assam", "West Bengal", "Tamil Nadu", "Kerala"],
    answerIndex: 0
  },

  // ==========================================
  // CONSTITUTION & CIVICS (10 Questions: IDs 141-150)
  // ==========================================
  {
    id: 141,
    subject: "Indian Constitution & Civics",
    question: "Who is known as the chief architect of the Constitution of India?",
    options: ["Dr. B.R. Ambedkar", "Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
    answerIndex: 0
  },
  {
    id: 142,
    subject: "Indian Constitution & Civics",
    question: "Fundamental Rights in the Indian Constitution are borrowed from which country's constitution?",
    options: ["United States (USA)", "United Kingdom (UK)", "Soviet Union (USSR)", "Ireland"],
    answerIndex: 0
  },
  {
    id: 143,
    subject: "Indian Constitution & Civics",
    question: "Which article of the Constitution of India guarantees the Right to Equality?",
    options: ["Article 14", "Article 19", "Article 21", "Article 32"],
    answerIndex: 0
  },
  {
    id: 144,
    subject: "Indian Constitution & Civics",
    question: "What is the minimum age required to become the President of India?",
    options: ["35 years", "30 years", "25 years", "40 years"],
    answerIndex: 0
  },
  {
    id: 145,
    subject: "Indian Constitution & Civics",
    question: "Which amendment is known as the 'Mini-Constitution' of India?",
    options: ["42nd Amendment", "44th Amendment", "73rd Amendment", "86th Amendment"],
    answerIndex: 0
  },
  {
    id: 146,
    subject: "Indian Constitution & Civics",
    question: "Who appoints the Governor of a state in India?",
    options: ["The President of India", "The Prime Minister of India", "The Chief Justice of India", "The Chief Minister of the State"],
    answerIndex: 0
  },
  {
    id: 147,
    subject: "Indian Constitution & Civics",
    question: "How many schedules are there in the Constitution of India at present?",
    options: ["12", "8", "10", "15"],
    answerIndex: 0
  },
  {
    id: 148,
    subject: "Indian Constitution & Civics",
    question: "The concept of 'Directive Principles of State Policy' (DPSP) is borrowed from which country?",
    options: ["Ireland", "Canada", "Australia", "USA"],
    answerIndex: 0
  },
  {
    id: 149,
    subject: "Indian Constitution & Civics",
    question: "Which organ of the government is responsible for making laws?",
    options: ["Legislature", "Executive", "Judiciary", "Press"],
    answerIndex: 0
  },
  {
    id: 150,
    subject: "Indian Constitution & Civics",
    question: "Which article of the Indian Constitution is called the 'Heart and Soul' of the Constitution by Dr. B.R. Ambedkar?",
    options: ["Article 32", "Article 21", "Article 14", "Article 19"],
    answerIndex: 0
  }
];
