import Datastore from "nedb";

const db = new Datastore({
	filename: "database.db",
	autoload: true
});

export { db };