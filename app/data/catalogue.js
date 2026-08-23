// [name, category, cohorts, intensity, hours, costINR, value, timeSlot]
// cohorts: SOLO COUPLE FRIENDS KIDS TEENS MULTIGEN  (two "anchor" rows per destination carry all six)
// timeSlot: M = morning, A = afternoon, E = evening

export const DESTINATIONS = [
  "Goa",
  "Jaipur",
  "Udaipur",
  "Kerala (Munnar & Alleppey)",
  "Leh–Ladakh",
  "Andaman Islands",
  "Rishikesh",
  "Bali, Indonesia",
  "Singapore",
  "Dubai, UAE",
];

const ALL = "SOLO COUPLE FRIENDS KIDS TEENS MULTIGEN";

export const CATALOGUE = {
  Goa: [
    ["Sunset cruise on the Mandovi", "Scenic", ALL, "Low", 2, 900, 88, "E"],
    ["Basilica of Bom Jesus and Old Goa churches", "Heritage", ALL, "Low", 2.5, 200, 82, "M"],

    ["Fontainhas Latin quarter walk", "Heritage", "SOLO", "Low", 2, 300, 86, "M"],
    ["Divar Island cycling loop", "Outdoors", "SOLO", "Moderate", 3, 700, 84, "M"],
    ["Morning fish market at Panjim", "Food", "SOLO", "Low", 1.5, 300, 76, "M"],

    ["Private beach shack dinner at Ashwem", "Dining", "COUPLE", "Low", 2, 2500, 90, "E"],
    ["Backwater kayaking at Palolem", "Adventure", "COUPLE", "Moderate", 2.5, 1400, 87, "M"],
    ["Chapora Fort at sunset", "Scenic", "COUPLE SOLO", "Low", 1.5, 0, 84, "E"],
    ["Ayurvedic couples massage, Candolim", "Wellness", "COUPLE", "Low", 1.5, 3000, 78, "A"],

    ["Grand Island snorkelling boat", "Adventure", "FRIENDS", "Moderate", 5, 2800, 92, "M"],
    ["Baga strip bar hop", "Nightlife", "FRIENDS", "Low", 3.5, 2500, 80, "E"],
    ["Saturday Night Market, Arpora", "Nightlife", "FRIENDS TEENS", "Low", 3, 1200, 78, "E"],
    ["Casino night on the Mandovi", "Nightlife", "FRIENDS", "Low", 4, 4000, 74, "E"],

    ["Splashdown water park, Anjuna", "Attraction", "KIDS", "Moderate", 4, 1500, 90, "M"],
    ["Dolphin spotting from Sinquerim", "Outdoors", "KIDS MULTIGEN", "Low", 2, 800, 84, "M"],
    ["Butterfly conservatory, Ponda", "Outdoors", "KIDS", "Low", 1.5, 400, 72, "A"],

    ["Dudhsagar Falls jeep trail", "Adventure", "TEENS FRIENDS", "High", 6, 3200, 91, "M"],
    ["Parasailing at Calangute", "Adventure", "TEENS FRIENDS", "Moderate", 1.5, 1500, 79, "A"],

    ["Spice plantation tour with Goan lunch", "Food", "MULTIGEN KIDS", "Low", 3, 1100, 83, "A"],
    ["Mangeshi Temple and Ponda heritage drive", "Heritage", "MULTIGEN", "Low", 3, 800, 76, "M"],
  ],

  Jaipur: [
    ["Amber Fort and Sheesh Mahal", "Heritage", ALL, "Moderate", 3.5, 600, 92, "M"],
    ["Hawa Mahal facade and rooftop chai", "Heritage", ALL, "Low", 1.5, 250, 78, "M"],

    ["Galtaji temple complex", "Heritage", "SOLO", "Moderate", 2, 100, 82, "M"],
    ["Blue-pottery studio visit, Sanganer", "Learning", "SOLO", "Low", 2.5, 1200, 76, "A"],
    ["Masala Chowk street food circuit", "Food", "SOLO TEENS", "Low", 2, 500, 84, "E"],

    ["Hot air balloon over Amer", "Adventure", "COUPLE", "Low", 3, 12000, 94, "M"],
    ["Nahargarh Fort at sunset", "Scenic", "COUPLE SOLO", "Low", 2, 300, 88, "E"],
    ["Rajasthani thali at a heritage haveli", "Dining", "COUPLE", "Low", 2, 1400, 82, "E"],
    ["Jal Mahal lakeside evening walk", "Scenic", "COUPLE", "Low", 1, 0, 74, "E"],

    ["Quad biking in the Aravalli foothills", "Adventure", "FRIENDS TEENS", "High", 3, 2200, 85, "M"],
    ["Rooftop bars near Civil Lines", "Nightlife", "FRIENDS", "Low", 3, 2500, 76, "E"],
    ["Johari Bazaar bargaining run", "Shopping", "FRIENDS SOLO", "Low", 2.5, 1500, 73, "A"],

    ["Chokhi Dhani village evening", "Culture", "KIDS MULTIGEN", "Low", 4, 1200, 88, "E"],
    ["Jantar Mantar observatory", "Learning", "KIDS", "Low", 1.5, 300, 80, "M"],
    ["Jaipur Wax Museum at Nahargarh", "Attraction", "KIDS", "Low", 1.5, 700, 70, "A"],

    ["Raj Mandir cinema, a Bollywood release", "Entertainment", "TEENS", "Low", 3, 400, 78, "E"],
    ["Street-art and photo walk in the Walled City", "Culture", "TEENS SOLO", "Low", 2.5, 300, 76, "M"],

    ["City Palace and the royal apartments", "Heritage", "MULTIGEN", "Low", 2.5, 800, 86, "M"],
    ["Albert Hall Museum", "Learning", "MULTIGEN KIDS", "Low", 1.5, 300, 72, "A"],
    ["Central Park morning walk", "Outdoors", "MULTIGEN", "Low", 1.5, 0, 68, "M"],
  ],

  Udaipur: [
    ["Sunset boat ride on Lake Pichola", "Scenic", ALL, "Low", 1.5, 1200, 92, "E"],
    ["City Palace and Crystal Gallery", "Heritage", ALL, "Low", 3, 900, 86, "M"],

    ["Jagdish Temple morning aarti", "Heritage", "SOLO", "Low", 1, 0, 78, "M"],
    ["Miniature painting workshop", "Learning", "SOLO", "Low", 3, 1800, 82, "A"],
    ["Badi Lake sunrise", "Scenic", "SOLO COUPLE", "Low", 1.5, 300, 80, "M"],

    ["Jag Mandir island lunch", "Dining", "COUPLE", "Low", 2.5, 3000, 90, "A"],
    ["Ambrai Ghat dinner facing the palace", "Dining", "COUPLE", "Low", 2, 2500, 88, "E"],
    ["Hot air balloon over the lakes", "Adventure", "COUPLE", "Low", 3, 14000, 91, "M"],
    ["Sajjangarh Monsoon Palace viewpoint", "Scenic", "COUPLE SOLO", "Low", 2, 500, 84, "E"],

    ["Zip-lining at Kumbhalgarh", "Adventure", "FRIENDS TEENS", "High", 6, 3500, 86, "M"],
    ["Cycling around Fateh Sagar Lake", "Outdoors", "FRIENDS TEENS", "Moderate", 2, 400, 80, "M"],
    ["Rooftop cafe crawl in Lal Ghat", "Food", "FRIENDS SOLO", "Low", 3, 1200, 76, "E"],

    ["Shilpgram crafts village", "Culture", "KIDS MULTIGEN", "Low", 2.5, 300, 80, "A"],
    ["Vintage and Classic Car Museum", "Learning", "KIDS MULTIGEN", "Low", 1.5, 400, 76, "A"],
    ["Gulab Bagh toy train and gardens", "Outdoors", "KIDS", "Low", 2, 200, 72, "M"],

    ["Bagore Ki Haveli folk dance and puppet show", "Culture", "TEENS KIDS MULTIGEN", "Low", 1.5, 400, 82, "E"],
    ["Boating at Fateh Sagar with island cafe", "Outdoors", "TEENS KIDS", "Low", 2, 600, 74, "A"],

    ["Saheliyon Ki Bari gardens", "Outdoors", "MULTIGEN", "Low", 1.5, 200, 76, "M"],
    ["Rajasthani cooking class", "Learning", "MULTIGEN COUPLE", "Low", 3, 2200, 78, "A"],
    ["Eklingji and Nagda temple drive", "Heritage", "MULTIGEN", "Low", 3, 900, 74, "M"],
  ],

  "Kerala (Munnar & Alleppey)": [
    ["Day cruise on the Alleppey backwaters", "Scenic", ALL, "Low", 8, 5000, 95, "M"],
    ["Tea plantation walk in Munnar", "Outdoors", ALL, "Moderate", 3, 600, 86, "M"],

    ["Kumarakom bird sanctuary at first light", "Outdoors", "SOLO", "Moderate", 2.5, 600, 84, "M"],
    ["Toddy shop lunch, Kerala style", "Food", "SOLO", "Low", 1.5, 600, 78, "A"],
    ["Kathakali performance with make-up session", "Culture", "SOLO MULTIGEN", "Low", 1.5, 500, 82, "E"],

    ["Top Station viewpoint at dawn", "Scenic", "COUPLE SOLO", "Low", 3, 1200, 88, "M"],
    ["Canoe through the narrow canals", "Outdoors", "COUPLE", "Low", 2, 900, 86, "M"],
    ["Candlelit dinner on a Marari beach deck", "Dining", "COUPLE", "Low", 2, 2200, 84, "E"],
    ["Ayurvedic couples treatment", "Wellness", "COUPLE", "Low", 1.5, 2500, 80, "A"],

    ["Paragliding at Vagamon", "Adventure", "FRIENDS TEENS", "High", 4, 3500, 88, "M"],
    ["Bamboo rafting at Periyar", "Adventure", "FRIENDS TEENS", "Moderate", 5, 2500, 84, "M"],
    ["Cycling Munnar's back roads", "Adventure", "FRIENDS", "High", 3, 1000, 82, "M"],

    ["Eravikulam National Park", "Outdoors", "KIDS MULTIGEN", "Moderate", 3.5, 800, 86, "M"],
    ["Mattupetty Dam boating", "Outdoors", "KIDS", "Low", 2, 700, 78, "A"],
    ["Tea Museum, Munnar", "Learning", "KIDS MULTIGEN", "Low", 1.5, 300, 72, "A"],

    ["Trek to Meesapulimala", "Adventure", "TEENS FRIENDS", "High", 6, 2000, 85, "M"],
    ["Kalaripayattu martial arts demonstration", "Culture", "TEENS KIDS", "Low", 1.5, 500, 78, "E"],

    ["Spice garden tour with tasting", "Learning", "MULTIGEN", "Low", 2, 500, 80, "A"],
    ["Marari Beach easy-access afternoon", "Outdoors", "MULTIGEN KIDS", "Low", 3, 200, 76, "A"],
    ["Kerala sadya lunch on a banana leaf", "Dining", "MULTIGEN", "Low", 1.5, 700, 74, "A"],
  ],

  "Leh–Ladakh": [
    ["Pangong Tso day trip", "Scenic", ALL, "Moderate", 10, 6000, 94, "M"],
    ["Dawn prayers at Thiksey Monastery", "Culture", ALL, "Low", 2.5, 100, 88, "M"],

    ["Acclimatisation walk through old Leh", "Outdoors", "SOLO", "Low", 2, 0, 78, "A"],
    ["Ladakhi cooking session with a homestay family", "Learning", "SOLO", "Low", 3, 1500, 82, "A"],
    ["Hemis Monastery", "Culture", "SOLO MULTIGEN", "Low", 3, 300, 80, "M"],

    ["Stargazing from a Hunder desert camp", "Outdoors", "COUPLE FRIENDS", "Low", 2, 500, 90, "E"],
    ["Nubra Valley dunes and Diskit Monastery", "Scenic", "COUPLE MULTIGEN", "Moderate", 9, 5500, 89, "M"],
    ["Shanti Stupa at sunset", "Scenic", "COUPLE SOLO", "Low", 1.5, 0, 86, "E"],
    ["Candlelit Ladakhi dinner in a Leh courtyard", "Dining", "COUPLE", "Low", 2, 1200, 76, "E"],

    ["Zanskar river rafting", "Adventure", "FRIENDS TEENS", "High", 4, 3000, 90, "M"],
    ["Mountain biking down Khardung La", "Adventure", "FRIENDS TEENS", "High", 5, 4500, 88, "M"],
    ["Motorbike run to Tso Moriri", "Adventure", "FRIENDS", "High", 9.5, 5000, 85, "M"],

    ["Magnetic Hill and Sangam confluence", "Scenic", "KIDS MULTIGEN", "Low", 3, 1500, 80, "A"],
    ["Hall of Fame war museum", "Learning", "KIDS MULTIGEN", "Low", 1.5, 100, 76, "A"],
    ["Yak and pony meadow at Nubra", "Outdoors", "KIDS", "Low", 1.5, 600, 72, "A"],

    ["Khardung La pass drive", "Scenic", "TEENS FRIENDS", "Moderate", 5, 4000, 84, "M"],
    ["Archery and Ladakhi games at a village fair", "Culture", "TEENS KIDS", "Moderate", 2, 400, 70, "A"],

    ["Shey and Stok Palace museums", "Heritage", "MULTIGEN", "Low", 3, 500, 78, "M"],
    ["Leh Main Bazaar and Tibetan market", "Shopping", "MULTIGEN", "Low", 2, 1200, 74, "A"],
    ["Thukpa lunch at a Leh garden restaurant", "Dining", "MULTIGEN", "Low", 1.5, 600, 70, "A"],
  ],

  "Andaman Islands": [
    ["Radhanagar Beach, Havelock", "Outdoors", ALL, "Low", 4, 300, 93, "A"],
    ["Cellular Jail light and sound show", "Heritage", ALL, "Low", 1.5, 300, 84, "E"],

    ["Ross Island ruins", "Heritage", "SOLO MULTIGEN", "Low", 3, 1000, 80, "M"],
    ["Natural Bridge at low tide, Neil Island", "Scenic", "SOLO COUPLE", "Moderate", 2, 300, 78, "M"],
    ["Samudrika Naval Marine Museum", "Learning", "SOLO KIDS", "Low", 1.5, 100, 70, "A"],

    ["Kayaking through the mangroves at dusk", "Adventure", "COUPLE", "Moderate", 3, 2500, 90, "E"],
    ["Sunset at Chidiya Tapu", "Scenic", "COUPLE SOLO", "Low", 2, 500, 86, "E"],
    ["Bharatpur Beach, Neil Island", "Outdoors", "COUPLE KIDS", "Low", 3.5, 400, 84, "A"],
    ["Grilled seafood dinner at Havelock", "Dining", "COUPLE MULTIGEN", "Low", 1.5, 1200, 80, "E"],

    ["Scuba diving at Elephant Beach", "Adventure", "FRIENDS TEENS", "Moderate", 5, 4500, 92, "M"],
    ["Game fishing charter", "Adventure", "FRIENDS", "Moderate", 5, 5000, 78, "M"],
    ["Jet ski and banana boat at Corbyn's Cove", "Adventure", "FRIENDS TEENS", "Moderate", 1.5, 1500, 76, "A"],

    ["Glass-bottom boat over the reef", "Outdoors", "KIDS MULTIGEN", "Low", 2, 1200, 86, "M"],
    ["Snorkelling at Nemo Reef", "Adventure", "KIDS TEENS", "Low", 2.5, 1800, 84, "M"],
    ["Science Centre, Port Blair", "Learning", "KIDS", "Low", 1.5, 100, 68, "A"],

    ["Sea walk at North Bay", "Adventure", "TEENS FRIENDS", "Moderate", 3, 3500, 88, "M"],
    ["Baratang limestone caves", "Outdoors", "TEENS SOLO", "Moderate", 8, 3000, 80, "M"],

    ["Corbyn's Cove easy beach afternoon", "Outdoors", "MULTIGEN", "Low", 2.5, 200, 74, "A"],
    ["Chatham Saw Mill heritage tour", "Heritage", "MULTIGEN", "Low", 2, 200, 70, "M"],
    ["Sound and light show at Ross Island", "Culture", "MULTIGEN", "Low", 1.5, 500, 76, "E"],
  ],

  Rishikesh: [
    ["Ganga aarti at Parmarth Niketan", "Culture", ALL, "Low", 1.5, 0, 92, "E"],
    ["Laxman Jhula and Ram Jhula walk", "Outdoors", ALL, "Low", 2, 0, 78, "A"],

    ["Morning yoga at a riverside ashram", "Wellness", "SOLO", "Low", 2, 500, 88, "M"],
    ["Meditation at Vashishta Gufa", "Wellness", "SOLO", "Low", 2.5, 200, 84, "M"],
    ["The Beatles Ashram murals", "Culture", "SOLO TEENS", "Low", 2, 300, 82, "A"],

    ["Sunrise trek to Kunjapuri Temple", "Adventure", "COUPLE FRIENDS", "High", 4, 800, 86, "M"],
    ["Neer Garh waterfall hike", "Outdoors", "COUPLE KIDS", "Moderate", 3, 400, 82, "M"],
    ["Riverside candlelight dinner at Tapovan", "Dining", "COUPLE", "Low", 2, 1600, 80, "E"],
    ["Ayurvedic couples massage and steam", "Wellness", "COUPLE", "Low", 1.5, 1800, 78, "A"],

    ["White-water rafting, Shivpuri to Rishikesh", "Adventure", "FRIENDS TEENS", "High", 4, 1500, 93, "M"],
    ["Bungee jumping at Mohan Chatti", "Adventure", "FRIENDS TEENS", "High", 3, 3700, 88, "M"],
    ["Riverside camping and bonfire", "Outdoors", "FRIENDS", "Low", 4, 2000, 84, "E"],
    ["Cliff jumping and body surfing", "Adventure", "FRIENDS TEENS", "High", 2, 1000, 76, "A"],

    ["Rajaji National Park safari", "Outdoors", "KIDS MULTIGEN", "Low", 4, 2500, 84, "M"],
    ["Ganga beach picnic at Shivpuri", "Outdoors", "KIDS", "Low", 2.5, 300, 72, "A"],

    ["Giant swing and zipline over the gorge", "Adventure", "TEENS FRIENDS", "High", 2, 3000, 86, "A"],
    ["Cafe hopping in Tapovan", "Food", "TEENS SOLO", "Low", 2.5, 700, 74, "A"],

    ["Triveni Ghat evening aarti with seating", "Culture", "MULTIGEN", "Low", 1.5, 0, 80, "E"],
    ["Bharat Mandir and old town walk", "Heritage", "MULTIGEN", "Low", 2, 100, 72, "M"],
    ["Satsang and kirtan evening", "Culture", "MULTIGEN", "Low", 1.5, 0, 70, "E"],
  ],

  "Bali, Indonesia": [
    ["Kecak fire dance at Uluwatu Temple", "Culture", ALL, "Low", 2.5, 1500, 92, "E"],
    ["Tegallalang rice terraces", "Scenic", ALL, "Low", 3, 2000, 86, "M"],

    ["Tirta Empul purification ritual", "Culture", "SOLO", "Low", 2.5, 700, 86, "M"],
    ["Campuhan Ridge walk at dawn", "Outdoors", "SOLO", "Moderate", 2, 0, 80, "M"],
    ["Balinese cooking class in Ubud", "Learning", "SOLO MULTIGEN", "Low", 4, 3000, 84, "M"],

    ["Sunrise trek up Mount Batur", "Adventure", "COUPLE FRIENDS", "High", 7, 4500, 91, "M"],
    ["Seafood dinner on Jimbaran Bay", "Dining", "COUPLE", "Low", 2, 3000, 90, "E"],
    ["Balinese spa afternoon in Ubud", "Wellness", "COUPLE", "Low", 3, 2800, 84, "A"],
    ["Floating breakfast and villa pool morning", "Leisure", "COUPLE", "Low", 2, 2000, 76, "M"],

    ["Nusa Penida day trip", "Adventure", "FRIENDS TEENS", "High", 10, 6000, 90, "M"],
    ["Seminyak beach club sunset", "Nightlife", "FRIENDS", "Low", 4, 4000, 82, "E"],
    ["Canggu bar crawl", "Nightlife", "FRIENDS", "Low", 3.5, 2500, 74, "E"],

    ["Waterbom Bali", "Attraction", "KIDS TEENS", "Moderate", 5, 4000, 90, "M"],
    ["Bali Safari and Marine Park", "Attraction", "KIDS MULTIGEN", "Low", 5, 3500, 86, "M"],
    ["Sacred Monkey Forest Sanctuary", "Outdoors", "KIDS", "Low", 2, 800, 78, "A"],

    ["Beginner surf lesson at Kuta", "Adventure", "TEENS FRIENDS", "Moderate", 2.5, 2500, 86, "M"],
    ["Snorkelling at Blue Lagoon, Padangbai", "Adventure", "TEENS KIDS", "Moderate", 4, 3200, 82, "M"],

    ["Tanah Lot temple at sunset", "Culture", "MULTIGEN", "Low", 2.5, 1200, 84, "E"],
    ["Tegenungan waterfall viewing deck", "Outdoors", "MULTIGEN KIDS", "Low", 2.5, 600, 74, "A"],
    ["Ubud Palace and art market", "Culture", "MULTIGEN", "Low", 2, 500, 72, "A"],
  ],

  Singapore: [
    ["Gardens by the Bay and the Supertree show", "Attraction", ALL, "Low", 3.5, 2400, 92, "E"],
    ["Hawker lunch at Maxwell Food Centre", "Food", ALL, "Low", 1.5, 500, 82, "A"],

    ["Little India and Kampong Glam walk", "Culture", "SOLO", "Moderate", 3, 300, 84, "M"],
    ["National Gallery Singapore", "Learning", "SOLO", "Low", 2.5, 1200, 78, "A"],
    ["Tiong Bahru bookshops and cafes", "Leisure", "SOLO", "Low", 2.5, 900, 74, "A"],

    ["Marina Bay Sands SkyPark at dusk", "Scenic", "COUPLE", "Low", 1.5, 1800, 88, "E"],
    ["Singapore River dinner cruise", "Dining", "COUPLE", "Low", 2, 3000, 84, "E"],
    ["Southern Ridges canopy walk", "Outdoors", "COUPLE SOLO", "Moderate", 3, 0, 80, "M"],
    ["Cocktails on a Chinatown rooftop", "Nightlife", "COUPLE FRIENDS", "Low", 2.5, 2800, 76, "E"],

    ["Sentosa beach and Skyline luge", "Adventure", "FRIENDS TEENS", "Moderate", 4, 2200, 84, "A"],
    ["Clarke Quay riverside evening", "Nightlife", "FRIENDS", "Low", 3, 2500, 80, "E"],
    ["Karting at HyperDrive, Sentosa", "Entertainment", "FRIENDS TEENS", "Moderate", 1.5, 1800, 76, "A"],

    ["Universal Studios Sentosa", "Attraction", "KIDS TEENS", "Moderate", 8, 5500, 94, "M"],
    ["Singapore Zoo and River Wonders", "Attraction", "KIDS MULTIGEN", "Moderate", 5, 3500, 90, "M"],
    ["S.E.A. Aquarium", "Attraction", "KIDS MULTIGEN", "Low", 3, 2600, 86, "A"],
    ["Jewel Changi and the Rain Vortex", "Attraction", "KIDS MULTIGEN", "Low", 2.5, 800, 80, "A"],

    ["Adventure Cove Waterpark", "Attraction", "TEENS KIDS", "Moderate", 5, 3800, 88, "M"],
    ["ArtScience Museum", "Learning", "TEENS SOLO", "Low", 2.5, 1600, 78, "A"],

    ["Night Safari tram and trails", "Attraction", "MULTIGEN KIDS", "Low", 3.5, 4200, 86, "E"],
    ["Singapore Botanic Gardens morning", "Outdoors", "MULTIGEN", "Low", 2, 0, 76, "M"],
    ["Singapore Flyer", "Scenic", "MULTIGEN", "Low", 1, 2200, 72, "E"],
  ],

  "Dubai, UAE": [
    ["Burj Khalifa, At the Top", "Scenic", ALL, "Low", 2, 4200, 92, "E"],
    ["Old Dubai souks and an abra crossing", "Culture", ALL, "Low", 3, 400, 84, "M"],

    ["Al Fahidi historic district and coffee museum", "Heritage", "SOLO", "Low", 2, 200, 80, "M"],
    ["Alserkal Avenue gallery quarter", "Culture", "SOLO", "Low", 2.5, 300, 78, "A"],
    ["Deira spice and gold souk food walk", "Food", "SOLO", "Low", 2, 800, 76, "A"],

    ["Hot air balloon over the desert", "Adventure", "COUPLE", "Low", 4, 9000, 90, "M"],
    ["Dubai Marina yacht cruise", "Scenic", "COUPLE", "Low", 2.5, 5000, 88, "E"],
    ["Rooftop dinner overlooking the Marina", "Dining", "COUPLE", "Low", 2, 6000, 84, "E"],
    ["La Mer beach afternoon", "Outdoors", "COUPLE KIDS", "Low", 3, 500, 74, "A"],

    ["Red dune desert safari with dinner", "Adventure", "FRIENDS TEENS", "Moderate", 6, 4500, 91, "A"],
    ["Skydive Dubai over the Palm", "Adventure", "FRIENDS", "High", 3, 45000, 86, "M"],
    ["Dune buggy ride at Al Faya", "Adventure", "FRIENDS TEENS", "High", 3, 6000, 84, "M"],

    ["Aquaventure Waterpark, Atlantis", "Attraction", "KIDS TEENS", "Moderate", 6, 6500, 92, "M"],
    ["Ski Dubai snow park", "Attraction", "KIDS TEENS", "Moderate", 3, 4000, 84, "A"],
    ["Dubai Aquarium and Underwater Zoo", "Attraction", "KIDS MULTIGEN", "Low", 2, 2400, 82, "A"],
    ["Green Planet indoor rainforest", "Attraction", "KIDS", "Low", 2, 2200, 74, "A"],

    ["Museum of the Future", "Learning", "TEENS SOLO", "Low", 2.5, 3600, 88, "M"],
    ["IMG Worlds of Adventure", "Attraction", "TEENS KIDS", "Moderate", 6, 6000, 86, "M"],

    ["Global Village", "Attraction", "MULTIGEN KIDS", "Low", 4, 800, 82, "E"],
    ["Dubai Mall and the Fountain show", "Shopping", "MULTIGEN", "Low", 3, 2000, 80, "E"],
    ["Dubai Frame", "Scenic", "MULTIGEN KIDS", "Low", 1.5, 1200, 78, "A"],
  ],
};

export const COHORT_TAGS = {
  "SOLO-EXPLORER": ["SOLO"],
  "COUPLE-ROMANTIC": ["COUPLE"],
  "FRIENDS-GROUP": ["FRIENDS"],
  "FAMILY-YOUNGKIDS": ["KIDS"],
  "FAMILY-TEENS": ["TEENS"],
  "FAMILY-MIXED": ["KIDS", "TEENS"],
  MULTIGEN: ["MULTIGEN"],
};
