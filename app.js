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
	
	// CREATE AN OBJECT OF THE ORDER WITH MY INFO, THE STORE I'M ORDERING FROM, AND THE DELIVERY METHOD
	var order = new pizzapi.Order({
		customer: japman,
		storeID: Closest_Store.ID,
		deliveryMethod: 'Carryout' // or 'Delivery'
	});
	
	// ADD A 12-INCH PAN PIZZA AND A 20oz COKE TO MY ORDER
	order.addItem(
		new pizzapi.Item({
			code: 'P12IPAZA',
			options: [],
			quantity: 1
		}),
		
		new pizzapi.Item({
			code: '20BCOKE',
			options: [],
			quantity: 1
		})
	);
	
	// VALIDATE MY ORDER (check the accuracy of it)
	order.validate(function(result) {
		console.log("Order Validated");
	});
	
	// PRINT THE PRICE OF MY ORDER
	order.price(function(price) {
		console.log("The price of my order is: $" + price.result.Order.Amounts.Payment);
	});
	
	// ADD MY CARD NUMBER
	var cardNumber = process.env.CARD_NUMBER;
	
	// GIVE REMAINING CARD INFO TO COMPLETE TRANSACTION
	var cardInfo = new order.PaymentObject();
	cardInfo.Amount = order.Amounts.Customer;
	cardInfo.Number = cardNumber;
	cardInfo.CardType = order.validateCC(cardNumber);
	cardInfo.Expiration = process.env.CARD_EXPIRATION;
	cardInfo.SecurityCode = process.env.CARD_SECURITY_CODE;
	cardInfo.PostalCode = process.env.POSTAL_CODE; // Billing Zipcode
	order.Payments.push(cardInfo);
	
	// PLACE MY ORDER
	order.place(function(order) {
		console.log("Order placed!");
	});
});