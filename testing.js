import fs from "node:fs";
import { argv } from "node:process";

// const jRolePointsTable = [
// 	{ id: "1138015362416390204", points: 20 }, // rosso
// 	{ id: "1137408000462688397", points: 10 }, // arancione
// 	{ id: "1137407767368433715", points: 0 }, // giallo
// ];
// const cgRolePointsTable = [
// 	{ id: "1085101543679864862", points: 7000 }, // ministro
// 	{ id: "1109520111330676859", points: 6000 }, // senatore
// 	{ id: "1109520175713239110", points: 5000 }, // prefetto
// 	{ id: "1109520330034249778", points: 4000 }, // sottoprefetto
// 	{ id: "1109520466865041449", points: 3000 }, // procuratore
// 	{ id: "1109520512822034462", points: 2000 }, // segretario
// 	{ id: "1109520556119818250", points: 1000 }, // sottosegretario
// 	{ id: "1072494016081440838", points: 800 }, // principale
// 	{ id: "1062347912132165762", points: 700 }, // dirigente
// 	{ id: "1072426721837580339", points: 600 }, // coordinatore capo
// 	{ id: "1062347799091490998", points: 500 }, // coordinatore
// 	{ id: "1062347622255439942", points: 400 }, // sovrintendente capo
// 	{ id: "1062347431947288677", points: 300 }, // sovrintendente
// 	{ id: "1062347254142345217", points: 200 }, // assistente capo
// 	{ id: "1062347134122332200", points: 100 }, // assistente
// 	{ id: "956497551853510657", points: 70 }, // gran generale
// 	{ id: "956482376589017151", points: 60 }, // generale
// 	{ id: "958332483210997780", points: 50 }, // gran colonnello
// 	{ id: "962694733229072384", points: 40 }, // colonnello
// 	{ id: "1007289184236613724", points: 30 }, // gran comandante
// 	{ id: "1007289333998440568", points: 20 }, // comandate
// 	{ id: "1072250981888311337", points: 10 }, // tenente
// 	{ id: "1008665802716741733", points: 0 }, // membro
// ];
// const initialActivityPoints = 5;

// const serverId = argv[2] === "-real" ? process.env.comando_generale_id : process.env.jacopo2199o_id;
// const rolePointsTable = argv[2] === "-real" ? cgRolePointsTable : jRolePointsTable;

/**
 * @param {import("discord.js").Client} client
*/
// export const myTest = async (client) => {
// 	const guild = client.guilds.resolve(serverId);
// 	const membersCollection = await guild.members.fetch();
// 	const membersActivityPoints = (await guild.members.fetch())
// 		.filter(member => member.user.id !== "1149977789496311888") // id del bot "comando generale"
// 		.map(member => {
// 			return {
// 				"id": member.id,
// 				"name": member.displayName,
// 				"points": null,
// 				"roleId": null
// 			};
// 		});
// 	// const guilds = await client.guilds.fetch();
// 	// guilds.forEach(guild => console.log(guild.id, guild.name));
// 	// const roles = (await guild.roles.fetch())
// 	// 	.map(role => {
// 	// 		return {
// 	// 			"id": role.id,
// 	// 			"name": role.name
// 	// 		};
// 	// 	});


// 	membersCollection.forEach(member => {
// 		const memberActivityPoints = membersActivityPoints.find(memberActivityPoint => memberActivityPoint.id === member.id);
// 		if (memberActivityPoints) {
// 			member.roles.cache.forEach(role => {
// 				const rolePointTable = rolePointsTable.find(rolePointTable => rolePointTable.id === role.id);
// 				if (rolePointTable) {
// 					if (rolePointTable.points > memberActivityPoints.points) {
// 						memberActivityPoints.points = rolePointTable.points + initialActivityPoints;
// 						memberActivityPoints.roleId = rolePointTable.id;
// 					}
// 				}
// 			});
// 		}
// 	});

// 	fs.writeFileSync("members-activity-points.json", JSON.stringify(membersActivityPoints, null, 4), { flag: "w" }, err => {
// 		if (err) throw err;
// 	});


// 	const tickCycle = (guild, membersActivityPoints) => {
// 		membersActivityPoints.forEach(memberActivityPoints => {
// 			subtractPoints(memberActivityPoints, 1);
// 			updateMemberRole(guild, memberActivityPoints);
// 		});
// 	};

// 	const subtractPoints = (memberActivityPoints, pointsToSubtract) => {
// 		if (memberActivityPoints.points > 0) memberActivityPoints.points -= pointsToSubtract;
// 	};

// 	const updateMemberRole = (guild, memberActivityPoints) => {
// 		const guildMember = guild.members.cache.find(guildMember => guildMember.id === memberActivityPoints.id);
// 		const rolePointTableIndex = rolePointsTable.findIndex(rolePointTable => rolePointTable.id === memberActivityPoints.roleId);
// 		const nextRole = rolePointsTable[rolePointTableIndex - 1];
// 		const actualRole = rolePointsTable[rolePointTableIndex];
// 		const previousRole = rolePointsTable[rolePointTableIndex + 1];
// 		if (previousRole) {
// 			if (memberActivityPoints.points < actualRole.points) {
// 				// guildMember.roles.remove(actualRole.id);
// 				// guildMember.roles.add(previousRole.id);
// 				memberActivityPoints.roleId = previousRole.id;
// 				const message = `<@${memberActivityPoints.id}> downgraded to <@&${previousRole.id}>`;
// 				client.channels.cache.get("1100786695613456455").send({ content: message, flags: [4096] });
// 			}
// 		}
// 		if (nextRole) {
// 			if (memberActivityPoints.points >= nextRole.points) {
// 				// guildMember.roles.remove(actualRole.id);
// 				// guildMember.roles.add(nextRole.id);
// 				memberActivityPoints.roleId = nextRole.id;
// 				const message = `<@${memberActivityPoints.id}> promoted to <@&${nextRole.id}>`;
// 				client.channels.cache.get("1100786695613456455").send({ content: message, flags: [4096] });
// 			}
// 		}
// 	};

// 	const hourMilliseconds = 1000 * 60 * 60;
// 	tickCycle(guild, membersActivityPoints);
// 	setInterval(tickCycle, 2000, guild, membersActivityPoints); // ricorda di aggiornarlo ogni giorno * 60 * 60
// };


// const intervalId = setInterval(tickCycle, 4000, guild, membersActivityPoints, 1); // ricorda di aggiornarlo ogni giorno * 60 * 60
// clearInterval(intervalId);