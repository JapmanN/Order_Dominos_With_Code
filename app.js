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
});