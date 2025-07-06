// List of major Indian cities for autocomplete
export const indianCities = [
  // Major Metropolitan Cities
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  
  // State Capitals
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar',
  'Dhanbad', 'Jodhpur', 'Amritsar', 'Raipur', 'Allahabad', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Madurai', 'Guwahati', 'Chandigarh', 'Hubli-Dharwad', 'Mysore',
  
  // Popular Tourist Destinations
  'Goa', 'Shimla', 'Manali', 'Rishikesh', 'Haridwar', 'Mussoorie', 'Nainital', 'Darjeeling',
  'Ooty', 'Kodaikanal', 'Munnar', 'Alleppey', 'Kochi', 'Thiruvananthapuram', 'Varkala',
  'Hampi', 'Udaipur', 'Jodhpur', 'Pushkar', 'Mount Abu', 'Jaisalmer', 'Bikaner',
  'Pondicherry', 'Mahabalipuram', 'Kanyakumari', 'Rameswaram', 'Thanjavur',
  
  // Business Hubs
  'Noida', 'Gurugram', 'Gurgaon', 'Whitefield', 'Electronic City', 'Koramangala',
  'Indiranagar', 'HSR Layout', 'BTM Layout', 'Jayanagar', 'Malleshwaram', 'Rajajinagar',
  'Marathahalli', 'Sarjapur', 'Bellandur', 'Hebbal', 'Yeshwanthpur',
  
  // Emerging Cities
  'Kota', 'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur',
  'Panipat', 'Karnal', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Sirsa',
  'Bhiwani', 'Rewari', 'Palwal', 'Faridabad', 'Sonipat', 'Bahadurgarh',
  
  // Coastal Cities
  'Mangalore', 'Udupi', 'Karwar', 'Gokarna', 'Kumta', 'Honavar', 'Bhatkal',
  'Calicut', 'Kannur', 'Kasaragod', 'Kollam', 'Thrissur', 'Palakkad', 'Malappuram',
  'Kozhikode', 'Thalassery', 'Bekal', 'Payyanur', 'Nileshwar',
  
  // Hill Stations
  'Lonavala', 'Khandala', 'Mahabaleshwar', 'Panchgani', 'Matheran', 'Igatpuri',
  'Bhandardara', 'Lavasa', 'Karjat', 'Alibaug', 'Kashid', 'Murud', 'Harihareshwar',
  
  // Tech Cities
  'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha',
  'Palakkad', 'Malappuram', 'Kannur', 'Kasaragod', 'Pathanamthitta', 'Kottayam',
  'Idukki', 'Ernakulam', 'Wayanad',
  
  // Additional Popular Cities
  'Tirupati', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Kakinada', 'Eluru',
  'Anantapur', 'Kadapa', 'Chittoor', 'Ongole', 'Machilipatnam', 'Adoni', 'Tenali',
  'Proddatur', 'Hindupur', 'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram',
  
  // Rajasthan Cities
  'Ajmer', 'Alwar', 'Bharatpur', 'Bhilwara', 'Sikar', 'Pali', 'Tonk', 'Kishangarh',
  'Beawar', 'Hanumangarh', 'Gangapur City', 'Banswara', 'Dausa', 'Churu', 'Jhunjhunu',
  
  // Gujarat Cities
  'Surat', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand',
  'Navsari', 'Morbi', 'Mahesana', 'Bharuch', 'Vapi', 'Valsad', 'Palanpur', 'Veraval',
  
  // Maharashtra Cities
  'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli', 'Jalgaon', 'Akola',
  'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Ichalkaranji', 'Jalna',
  'Ambajogai', 'Bhusawal', 'Panvel', 'Badlapur', 'Ambernath', 'Ulhasnagar', 'Malegaon'
].sort();

export const filterCities = (query: string): string[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return indianCities.filter(city => 
    city.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 10); // Limit to 10 suggestions
};