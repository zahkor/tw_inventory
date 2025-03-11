function getGuildFromUrl(swgohURL) {
    const guildInitialResponse = UrlFetchApp.fetch('http://swgoh.gg/api/guild-profile/' + swgohURL);
    if (guildInitialResponse.getResponseCode() >= 200 && guildInitialResponse.getResponseCode() <= 299) {
        const json = guildInitialResponse.getContentText();
        return JSON.parse(json);
    }
    else {
        Logger.log('Response code not between 200 and 299 - Guild');
    }
}