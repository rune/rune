//The native app only support strings for post message communication.
//To identify if received message is used by Rune, we are prefixing all of them with RUNE_MESSAGE_PREFIX. This allows to
//do the identification without having to JSON.parse data first.
const RUNE_MESSAGE_PREFIX = "RUNE_MSG;";
function stringifyRuneGameMessage(message) {
    return `${RUNE_MESSAGE_PREFIX}${JSON.stringify(message)}`;
}
function getRuneGameMessage(data, key) {
    if (!isRuneGameMessage(data)) {
        return null;
    }
    const message = parseRuneMessage(data);
    if (!message[key]) {
        throw new Error(`Wrong message received. Expected to find: ${key}, but the message was: ${JSON.stringify(message)}`);
    }
    return message[key];
}
function parseRuneMessage(msg) {
    return JSON.parse(msg.slice(RUNE_MESSAGE_PREFIX.length));
}
function isRuneGameMessage(data) {
    return typeof data === "string" && data.startsWith(RUNE_MESSAGE_PREFIX);
}

// getRuneGameEvent & stringifyRuneGameCommand are exported in index.ts and used by the clients to do external communication.
function getRuneGameEvent(data) {
    return getRuneGameMessage(data, "runeGameEvent");
}
function stringifyRuneGameCommand(data) {
    return stringifyRuneGameMessage({ runeGameCommand: data });
}

export { getRuneGameEvent, stringifyRuneGameCommand };
//# sourceMappingURL=index.js.map
