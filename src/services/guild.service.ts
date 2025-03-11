function fetchGuildInformations(){
    const spreadSheet = SpreadsheetApp.getActive()
    const guildTab = spreadSheet.getSheetByName('Guild');
    const swgohURL = guildTab?.getRange(2, 1).getValue().replace('https://swgoh.gg/g/', '');
    const guildDatas = getGuildFromUrl(swgohURL);

    if(guildDatas){
         const guildName = guildDatas.data.name;
         guildTab?.getRange(4, 3).setValue(guildName);
         guildTab?.getRange(5, 3).setValue(new Date());
    }
    return guildDatas;
  }

  async function fetchGuildMembers(guildDatas){
    const memberRequests = new Array<any>;
    let memberRequestsResponse;
    for (const member of guildDatas.data.members) {
        if (member.ally_code) memberRequests.push({ url: 'http://swgoh.gg/api/player/' + member.ally_code, method: 'get' });
    }

    memberRequestsResponse = UrlFetchApp.fetchAll(memberRequests);

    return memberRequestsResponse.map((response) => {
        return JSON.parse(response);
    })
  }