module.exports = {
	isAdmin: function(req, res, next) {
		if(req.session.role == 'admin')
			next();
		else
			res.redirect('/dashboard/' + req.session.username);
	},
	canEdit: function(req, res, next) {
		var characterID = req.params.characterID || req.body.characterID;
		characters.findCharacterById(characterID, function(err, character) {
			if(character.userID == req.session._id)
				next();
			else
				res.redirect('/');
		});
	}
}