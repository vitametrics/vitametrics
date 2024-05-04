db.createUser(
	{
		user: "vitametrics",
		pwd: "vitametrics",
		roles: [
			{
				role: "readWrite",
				db: "vitametrics"
			}
		]
	}
);
	
