db.createUser(
	{
		user: "physiobit",
		pwd: "physiobit",
		roles: [
			{
				role: "readWrite",
				db: "physiobit"
			}
		]
	}
);
	
