// Formulas and names taken from the HERO System 5th Edition, Revised pages 32-41
$(document).ready(function() {
	// Costs reflect the number of character points it takes to increase the value of the charactieristic by 1 point.
	// When the characteristic is decremented, those points are added back to the pool.
	var base = 10,
		STR,
		STRcost = 1,
		DEXcost = 3,
		INTcost = 1,
		CONcost = 2,
		EGOcost = 2,
		BODYcost = 2,
		PREcost = 1,
		COMcost = 0.5;


	// Do math and update things when STR changes
	$("#STRmod").change(function() {
		STR = $(this).val();

		// TODO: calculate throwing distance
		// TODO: calculate leap
		// TODO: calculate any figured characteristics based on STR

		// Calculate the Characteristic roll
		var STRroll;
		if(STR >= 0) {
			STRroll = Math.round(9 + (STR / 5));
		} else {
			STRroll = Math.round(9 - (STR / 5));
		}

		// Casual STR
		var casualSTR = STR/2;	// Half STR

		// LIFT
		// Found the forumla here: http://en.wikipedia.org/wiki/Talk%3AHero_System#Math_Section
		// Max LIFT = 25 kg * 2^(STR/5); the inverse (or log) would therefore be STR = 5 * log2(weight/25 kg)
		var n = STR/5
		var lift = Math.round((25)*Math.pow(2, n));

		// d6 of HTH damage
		var dSix;
		if( STR % 5 == 0 || STR % 5 <= 2) {
			dSix = Math.round(STR/5);
		} else {
			dSix = Math.floor(STR/5) + "&frac12;";
		}


		console.log(
			"Roll: " + STRroll + "\n", 
			"Casual STR: " + casualSTR + "\n", 
			"Lift: " + lift + "kg\n", 
			"d6 of HTH: " + dSix + "d6\n");

		// Calculate the cost of the the Characteristic
		var STRtotal;
		STRtotal = (STR - base) * STRcost;
	});

	// Do math and update things when DEX changes
	$("#DEXmod").change(function() {

		// TODO: calculate roll
		// TODO: calculate cost
		// TODO: calculate CV (DEX/3)
		// TODO: calculate SPD

	});

	// Do math and update things when CON changes
	$("#CONmod").change(function() {
		// TODO: calculate roll
		// TODO: calculate cost
		// TODO: calculate figured characteristics (ED, REC, END and STUN)
	});

	// Do math and update things when BODY changes
	$("#BODYmod").change(function() {
		// TODO: calculate roll
		// TODO: calculate cost
		// TODO: calculate figured characteristics (STUN)
	});

	// Do math and update things when INT changes
	$("#INTmod").change(function() {
		// TODO: calculate roll
		// TODO: calculate cost
	});

	

	// Do math and update things when EGO changes
	$("#EGOmod").change(function() {
		// TODO: calculate roll
		// TODO: calculate cost
		// TODO: calculate ECV
	});

	

	// Do math and update things when PRE changes
	$("#PREmod").change(function() {
		// TODO: calculate roll
		// TODO: calculate cost
		// TODO: calculate PRE attack
	});

	// Do math and update things when COM changes
	$("#COMmod").change(function() {
		// TODO: calculate roll
		// TODO: calculate cost of positive and negative COM

	});

	// TODO: do figured characteristics calculations
});