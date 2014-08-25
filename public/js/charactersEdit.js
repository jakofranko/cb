// Formulas and names taken from the HERO System 5th Edition, Revised pages 32-41
// TODO: keep the user from being able to submit if they've spent more than their base pool
$(document).ready(function() {
	// Costs reflect the number of character points it takes to increase the value of the charactieristic by 1 point.
	// When the characteristic is decremented, those points are added back to the pool.
	var base = 10,
		STR = $("#STRmod").val(),
		STRcost = 1,
		DEX = $("#DEXmod").val(),
		DEXcost = 3,
		INT = $("#INmod").val(),
		INTcost = 1,
		CON = $("#CONmod").val(),
		CONcost = 2,
		EGO = $("#EGOmod").val(),
		EGOcost = 2,
		BODY = $("#BODYmod").val(),
		BODYcost = 2,
		PRE = $("#PREmod").val(),
		PREcost = 1,
		COM = $("#COMmod").val(),
		COMcost = 0.5,
		PD = $("#PDbase").text(),
		PDmod = 0,
		PDcost = 1,
		ED = $("#EDbase").text(),
		EDmod = 0,
		EDcost = 1,
		SPD = $("#SPDbase").text(),
		SPDmod = 0,
		SPDcost = 10,
		REC = $("#RECbase").text(),
		RECmod = 0,
		RECcost = 2,
		END = $("#ENDbase").text(),
		ENDmod = 0,
		ENDcost = 0.5,
		STUN = $("#STUNbase").text(),
		STUNmod = 0,
		STUNcost = 1,
		Running = 6,
		RunCost = 2,
		Swimming = 2,
		SwimCost = 1,
		Leap = calculateLeap(STR),
		LeapCost = 1;

	function calculateRoll(characteristic) {
		if(characteristic >= 0) {
			return Math.round(9 + (characteristic / 5));
		} else {
			return Math.round(9 - (characteristic / 5));
		}
	}

	function calculateCost(characteristic, costMod) {
		var newCost = (characteristic - base) * costMod;
		return newCost;
	}

	function calculateFiguredCost(baseFigured, characteristic, costMod) {
		var newCost = (characteristic - baseFigured) * costMod;
		return newCost;
	}

	function calculateCOMCost(comeliness, comelinessCost) {
		var newCost = 0;
		if(comeliness < 0) {
			newCost = ((comeliness - base) * comelinessCost) + (-comeliness);
		} else {
			newCost =(comeliness - base) * comelinessCost;
		}
		return newCost;
	}

	function updateSpentPoints() {
		var pointsSpent = 0;
		$('.cost').each(function() {
			pointsSpent += Number($(this).text());
		});
		console.log($(this).text(),pointsSpent);
		$('#POINTSspent').text(pointsSpent);
		$('#pointsSpent').val(pointsSpent);
	}

	updateSpentPoints();
	// Primary Characteristics
	//--------------------------------------------------
	// Do math and update things when STR changes
	$("#STRmod").change(function() {
		

		STR = $(this).val();


		// Calculate the Characteristic roll
		var STRroll = calculateRoll(STR);


		// Casual STR
		var casualSTR = STR/2;	// Half STR


		// LIFT
		// Found the forumla here: http://en.wikipedia.org/wiki/Talk%3AHero_System#Math_Section
		// Max LIFT = 25 kg * 2^(STR/5); the inverse (or log) would therefore be STR = 5 * log2(weight/25 kg)
		var n = STR/5
		var lift = Math.round((25)*Math.pow(2, n));


		// d6 of HTH damage
		var HTHattack;
		if( STR % 5 == 0 || STR % 5 <= 2) {
			HTHattack = Math.round(STR/5);
		} else {
			HTHattack = Math.floor(STR/5) + 0.5;
		}


		// Calculate Leap, which is determined by strength and speed
		calculateLeap(STR);


		// Calculate PD, REC and STUN, all of which use STR
		calculatePD(STR);
		calculateREC(STR, CON);
		calculateSTUN(BODY, STR, CON);


		// Calculate the cost of the the Characteristic
		var STRtotal = calculateCost(STR, STRcost);


		// Update view with new data
		$("#STRroll").text("-" + STRroll);
		$("#STRcost").text(STRtotal);
		$("#LIFT").text(lift);
		$("#Lift").val(lift);
		$("#HTHattack").text(HTHattack);
		$("#HTH").val(HTHattack);
		
		updateSpentPoints();

		console.log(
			"Roll: " + STRroll + "\n", 
			"Casual STR: " + casualSTR + "\n", 
			"Lift: " + lift + "kg\n", 
			"d6 of HTH: " + HTHattack + "d6\n",
			"STR Cost: " + STRtotal);
	});



	// Do math and update things when DEX changes
	$("#DEXmod").change(function() {

		DEX = $(this).val();

		var DEXroll = calculateRoll(DEX);


		calculateCV(DEX);


		calculateSPD(DEX);

		var DEXtotal = calculateCost(DEX, DEXcost);

		
		// Update view with new data
		$("#DEXroll").text("-" + DEXroll);
		$("#DEXcost").text(DEXtotal);

		updateSpentPoints();

		console.log(
			"DEX Roll: " + DEXroll + "\n", 
			"DEX Cost: " + DEXtotal);
	});



	// Do math and update things when CON changes
	$("#CONmod").change(function() {
		CON = $(this).val();


		// Calculate the Characteristic roll
		var CONroll = calculateRoll(CON);


		// calculate ED, REC, END and STUN
		calculateED(CON);
		calculateREC(STR, CON);
		calculateEND(CON);
		calculateSTUN(BODY, STR, CON);


		// Calculate the cost of the the Characteristic
		var CONtotal = calculateCost(CON, CONcost);


		// Update view with new data
		$("#CONroll").text("-" + CONroll);
		$("#CONcost").text(CONtotal);

		updateSpentPoints();


		console.log(
			"CON Roll: " + CONroll + "\n", 
			"CON Cost: " + CONtotal);
	});


	
	// Do math and update things when BODY changes
	$("#BODYmod").change(function() {
		
		BODY = $(this).val();

		// Get the characteristic roll
		var BODYroll = calculateRoll(BODY);

		// Update STUN
		calculateSTUN(BODY, STR, CON);

		// Get the cost
		var BODYtotal = calculateCost(BODY, BODYcost);

		// Update view with new data
		$("#BODYroll").text("-" + BODYroll);
		$("#BODYcost").text(BODYtotal);

		updateSpentPoints();


		console.log(
			"BODY Roll: " + BODYroll + "\n", 
			"BODY Cost: " + BODYtotal);

	});

	
	
	// Do math and update things when INT changes
	$("#INTmod").change(function() {
		INT = $(this).val();


		var INTroll = calculateRoll(INT);


		var INTtotal = calculateCost(INT, INTcost);


		// Update view with new data
		$("#INTroll").text("-" + INTroll);
		$("#INTcost").text(INTtotal);

		updateSpentPoints();


		console.log(
			"INT Roll: " + INTroll + "\n", 
			"INT Cost: " + INTtotal);
	});

	
	
	// Do math and update things when EGO changes
	$("#EGOmod").change(function() {
		EGO = $(this).val();


		var EGOroll = calculateRoll(EGO);


		calculateECV(EGO);


		var EGOtotal = calculateCost(EGO, EGOcost);


		// Update view with new data
		$("#EGOroll").text("-" + EGOroll);
		$("#EGOcost").text(EGOtotal);

		updateSpentPoints();


		console.log(
			"EGO Roll: " + EGOroll + "\n", 
			"EGO Cost: " + EGOtotal);
	});

	

	// Do math and update things when PRE changes
	$("#PREmod").change(function() {
		PRE = $(this).val();


		var PREroll = calculateRoll(PRE);

		var PREattack;
		if( PRE % 5 == 0 || PRE % 5 <= 2) {
			PREattack = Math.round(PRE/5);
		} else {
			PREattack = Math.floor(PRE/5) + 0.5;
		}

		var PREtotal = calculateCost(PRE, PREcost);


		// Update view with new data
		$("#PREroll").text("-" + PREroll);
		$("#PREcost").text(PREtotal);
		$("#PREattack").text(PREattack);
		$("#PreAtt").val(PREattack);

		updateSpentPoints();


		console.log(
			"PRE Roll: " + PREroll + "\n", 
			"PRE Cost: " + PREtotal + "\n",
			"Presence Attack: " + PREattack + "d6");
	});

	

	// Do math and update things when COM changes
	$("#COMmod").change(function() {
		COM = $(this).val();


		var COMroll = calculateRoll(COM);

		
		var COMtotal = calculateCOMCost(COM, COMcost);


		// Update view with new data
		$("#COMroll").text("-" + COMroll);
		$("#COMcost").text(COMtotal);

		updateSpentPoints();

		
		console.log(
			"COM Roll: " + COMroll + "\n", 
			"COM Cost: " + COMtotal);

	});

	

	// Figured Characteristics
	//--------------------------------------------------

	$("#PDmod").change(function() {
		var PDsum = $(this).val();
		PDmod = Number(PDsum) - Number(PD);
		var PDtotal = calculateFiguredCost(PD, PDsum, PDcost);
		$("#PDcost").text(PDtotal);
		updateSpentPoints();
		console.log("PDtotal: " + PDtotal);
	});


	$("#EDmod").change(function() {
		var EDsum = $(this).val();
		EDmod = Number(EDsum) - Number(ED);
		var EDtotal = calculateFiguredCost(ED, EDsum, EDcost);
		$("#EDcost").text(EDtotal);
		updateSpentPoints();
		console.log("EDtotal: " + EDtotal);
	});


	$("#SPDmod").change(function() {
		var SPDsum = $(this).val();
		SPDmod = Number(SPDsum) - Number(SPD)
		var SPDtotal = calculateFiguredCost(SPD, SPDsum, SPDcost);
		$("#SPDcost").text(Math.round(SPDtotal));
		updateSpentPoints();
		console.log("SPDtotal: " + SPDtotal);
	});


	$("#RECmod").change(function() {
		var RECsum = $(this).val();
		RECmod = Number(RECsum) - Number(REC);
		var RECtotal = calculateFiguredCost(REC, RECsum, RECcost);
		$("#RECcost").text(Math.round(RECtotal));
		updateSpentPoints();
		console.log("RECtotal: " + RECtotal);
	});


	$("#ENDmod").change(function() {
		var ENDsum = $(this).val();
		ENDmod = Number(ENDsum) - Number(END);
		var ENDtotal = calculateFiguredCost(END, ENDsum, ENDcost);
		$("#ENDcost").text(ENDtotal);
		updateSpentPoints();
		console.log("ENDtotal: " + ENDtotal);
	});


	$("#STUNmod").change(function() {
		var STUNsum = $(this).val();
		STUNmod = Number(STUNsum) - Number(STUN);
		var STUNtotal = calculateFiguredCost(STUN, STUNsum, STUNcost);
		$("#STUNcost").text(Math.round(STUNtotal));
		updateSpentPoints();
		console.log("STUNtotal: " + STUNtotal);
	});


	
	function calculatePD(strength) {
		PD = Math.round(strength/5);
		$("#PDmod").val(PDmod + PD);
		$("#PDbase").text(PD);
		$("#PD").val(PD);
		console.log("PD: " + PD + "\n", "PDmod: " + PDmod);
	}


	function calculateED(constitution) {
		ED = Math.round(constitution/5);
		$("#EDmod").val(EDmod + ED);
		$("#EDbase").text(ED);
		$("#ED").val(ED);
		console.log("ED: " + ED + "\n", "EDmod: " + EDmod);
	}

	function calculateSPD(dexterity) {
		// SPD ALWAYS rounds down. Your speed only goes up when you breach the next integer
		SPD = 1 + (dexterity/10);
		$("#SPDmod").val((SPDmod + SPD).toFixed(1));
		$("#SPDbase").text(SPD);
		$("#SPD").val(SPD);
		console.log("SPD: " + SPD + "\n", "SPDmod: " + SPDmod);
	}


	function calculateREC(strength, constitution) {
		REC = Math.round((strength/5) + (constitution/5));
		$("#RECmod").val(RECmod + REC);
		$("#RECbase").text(REC);
		$("#REC").val(REC);
		console.log("REC: " + REC + "\n", "RECmod: " + RECmod);
	}

	
	function calculateEND(constitution) {
		END = Math.round(2 * constitution);
		$("#ENDmod").val(ENDmod + END);
		$("#ENDbase").text(END);
		$("#END").val(END);
		console.log("END: " + END);
	}


	function calculateSTUN(body, strength, constitution) {
		STUN = Number(body) + Math.round((strength/2)) + Math.round((constitution/2));
		$("#STUNmod").val(STUNmod + STUN);
		$("#STUNbase").text(STUN);
		$("#STUN").val(STUN);
		console.log("STUN: " + STUN);
	}



	// Extras
	//--------------------------------------------------
	function calculateLeap(strength) {
		var STRbonus;
		if(strength > 0 && strength % 5 > 2) {
			STRbonus = Math.floor(strength/5) + 0.5;
		} else if(strength > 0 && strength % 5 <= 2) {
			STRbonus = Math.floor(strength/5);
		} else {
			STRbonus = 0;
		}

		var RunningBonus = Running - 6;
		if(RunningBonus <=0) {
			RunningBonus = 0;
		}
		
		Leap = RunningBonus + STRbonus;

		$("#LEAPbase").text(Leap + "\"");
		$("#LEAP").val(Leap);

		console.log("Leap: " + Leap);
	}


	function calculateCV(dexterity) {
		CV = Math.round(dexterity/3);
		$("#CVbase").text(CV);
		$("#CV").val(CV);
		console.log("CV: " + dexterity);
	}


	function calculateECV(ego) {
		ECV = Math.round(ego/3);
		$("#ECVbase").text(ECV);
		$("#ECV").val(ECV);
		console.log("ECV: " + ECV);
	}

});