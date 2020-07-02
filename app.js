// ================
// REQUIRE PACKAGES
// ================
var pizzapi = require("dominos");
require('dotenv').config();

// ===============================================================
// FIND ID OF CLOSEST STORE TO ME USING MY POSTAL CODE and SAVE IT
// ===============================================================
pizzapi.Util.findNearbyStores(process.env.POSTAL_CODE,'Carryout', function(storeData){
	var Closest_Store = new pizzapi.Store({
		ID: storeData.result.Stores[0].StoreID
	});
	
	// GET ALL OF THE PRODUCTS IN THE DOMINOS MENU (so I can select what I want to eat)
	Closest_Store.getMenu(function(storeMenu) {
		console.log(storeMenu.menuData.result.Products);
	});
	
	var myAddress = new pizzapi.Address(process.env.MY_ADDRESS);
	
	// CREATE AN OBJECT WITH MY PERSONAL INFORMATION TO SEND TO DOMINOS WHEN I ORDER THE PIZZA
	var japman = new pizzapi.Customer({
		address: myAddress,
		firstName: 'Japman',
		lastName: 'Nagra',
		phone: process.env.PHONE,
		email: 'japmannagra20@gmail.com'
	});
});