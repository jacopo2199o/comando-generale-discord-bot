/**
 * impostazioni generali per il bot
 * @type {Object}
 * @property {number} backupInterval - intervallo di tempo (in millisecondi) per eseguire i backup
 * @property {number} hourCheckInterval - intervallo di tempo (in millisecondi) per controlli orari
 * @property {number} saveInterval - intervallo di tempo (in millisecondi) per salvare i dati
 * @property {number} messageExpirationTime - tempo (in millisecondi) prima che i messaggi scadano
 */
const generalSettings = {
  backupInterval: 2000 * 60, // 2 minuti
  hourCheckInterval: 1000 * 60, // 1 minuto
  saveInterval: 8000, // 8 secondi
  messageExpirationTime: 16000 // 16 secondi
};

export {
  generalSettings
};

