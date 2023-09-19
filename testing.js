import fs from "node:fs";

/**
 * @param {import("discord.js").Client} client
*/
export const myTest = async (client) => {
	// const guilds = await client.guilds.fetch();
	// guilds.forEach(guild => console.log(guild.id, guild.name));
	const guild = client.guilds.resolve(process.env.comando_generale_id);
	const membersActivityPoints = (await guild.members.fetch())
		.map(member => {
			return { "name": member.displayName, "points": 0 };
		});
	const membersCollection = await guild.members.fetch();

	const jacopoPointsTable = [
		{ id: "1138015362416390204", name: "ruolo rosso", points: 3 },
		{ id: "1137408000462688397", name: "ruolo arancione", points: 2 },
		{ id: "1137407767368433715", name: "ruolo giallo-verde", points: 1 },
	];
	const comandoGeneralePointsTable = [
		{ id: "1085101543679864862", points: 7000 }, // ministro
		{ id: "1109520111330676859", points: 6000 }, // senatore
		{ id: "1109520175713239110", points: 5000 }, // prefetto
		{ id: "1109520330034249778", points: 4000 }, // sottoprefetto
		{ id: "1109520466865041449", points: 3000 }, // procuratore
		{ id: "1109520512822034462", points: 2000 }, // segretario
		{ id: "1109520556119818250", points: 1000 }, // sottosegretario
		{ id: "1072494016081440838", points: 800 }, // principale
		{ id: "1062347912132165762", points: 700 }, // dirigente
		{ id: "1072426721837580339", points: 600 }, // coordinatore capo
		{ id: "1062347799091490998", points: 500 }, // coordinatore
		{ id: "1062347622255439942", points: 400 }, // sovrintendente capo
		{ id: "1062347431947288677", points: 300 }, // sovrintendente
		{ id: "1062347254142345217", points: 200 }, // assistente capo
		{ id: "1062347134122332200", points: 100 }, // assistente
		{ id: "956497551853510657", points: 70 }, // gran generale
		{ id: "956482376589017151", points: 60 }, // generale
		{ id: "958332483210997780", points: 50 }, // gran colonnello
		{ id: "962694733229072384", points: 40 }, // colonnello
		{ id: "1007289184236613724", points: 30 }, // gran comandante
		{ id: "1007289333998440568", points: 20 }, // comandate
		{ id: "1072250981888311337", points: 10 }, // tenente
		{ id: "1008665802716741733", points: 0 }, // membro
	];

	membersCollection.forEach(member => {
		const memberActivityPoints = membersActivityPoints.find(entry => entry.name === member.displayName);
		member.roles.cache.forEach(role => {
			if (memberActivityPoints) {
				if (guild.id === process.env.comando_generale_id) {
					const tableEntry = comandoGeneralePointsTable.find(pointTable => pointTable.id === role.id);
					if (tableEntry) {
						if (tableEntry.points > memberActivityPoints.points) {
							memberActivityPoints.points = tableEntry.points;
						}
					}
				} else if (guild.id === process.env.jacopo2199o_id) {
					const tableEntry = jacopoPointsTable.find(pointTable => pointTable.id === role.id);
					if (tableEntry) {
						if (tableEntry.points > memberActivityPoints.points) {
							memberActivityPoints.points = tableEntry.points;
						}
					}
				}
			}
		});
	});

	fs.writeFileSync("members-activity-points.json", JSON.stringify(membersActivityPoints, null, 4), { flag: "w" }, err => {
		if (err) throw err;
		console.log("saved");
	});
};