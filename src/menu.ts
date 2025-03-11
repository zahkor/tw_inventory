function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Update spreadsheets').addItem('Import data from SWGOH.GG', 'importDatas').addToUi();
}

async function importDatas() {
    const guildDatas = fetchGuildInformations();
    const guildMembers = await fetchGuildMembers(guildDatas);
    let reyCount: number = 0;
    let ashokaCount: number = 0;
    let lordVaderCount: number = 0;
    let jMLCount: number = 0;
    let jMKCount: number = 0;
    let leiaCount: number = 0;
    let sLKRCount: number = 0;
    let jabbaCount: number = 0;
    let sEECount: number = 0;
    let gasCount: number = 0;
    let aphraCount: number = 0;
    let thirdSisterCount: number = 0;
    let starkillerCount: number = 0;
    let malgusCount: number = 0;

    let oPoggleCount: number = 0;
    let oPhasmaCount: number = 0;
    let oDroidekaCount: number = 0;
    let darkTrooperMoffGideonCount: number = 0;
    let oMaraJadeCount: number = 0;
    let trenchCount: number = 0;
    let kelleranbeqCount: number = 0;
    let maceCount: number = 0;
    let oHeraCount: number = 0;
    for (const member of guildMembers) {
        const { twUnitsWOOmicrons, twUnitsWOmicrons } = fetchInventory(member);
        twUnitsWOOmicrons.forEach((unit) => {
            switch (unit) {
                case twBaseIdUnitEnum.APHRA:
                    aphraCount++;
                    break;
                case twBaseIdUnitEnum.ASHKODA:
                    ashokaCount++;
                    break;
                case twBaseIdUnitEnum.GAS:
                    gasCount++;
                    break;
                case twBaseIdUnitEnum.JABBA:
                    jabbaCount++;
                    break;
                case twBaseIdUnitEnum.JMK:
                    jMKCount++;
                    break;
                case twBaseIdUnitEnum.JML:
                    jMLCount++;
                    break;
                case twBaseIdUnitEnum.LEIA:
                    leiaCount++;
                    break;
                case twBaseIdUnitEnum.LV:
                    lordVaderCount++;
                    break;
                case twBaseIdUnitEnum.MALGUS:
                    malgusCount++;
                    break;
                case twBaseIdUnitEnum.REY:
                    reyCount++;
                    break;
                case twBaseIdUnitEnum.SEE:
                    sEECount++;
                    break;
                case twBaseIdUnitEnum.SK:
                    starkillerCount++;
                    break;
                case twBaseIdUnitEnum.SLK:
                    sLKRCount++;
                    break;
                case twBaseIdUnitEnum.THIRDSISTER:
                    thirdSisterCount++;
                    break;
            }
        });
        twUnitsWOmicrons.forEach((unit) => {
            switch (unit) {
                case twBaseIdUnitWithOmicronEnum.DARKTROOPERMOFFGIDEON:
                    darkTrooperMoffGideonCount++;
                    break;
                case twBaseIdUnitWithOmicronEnum.DROIDEKA:
                    oDroidekaCount++;
                    break;
                case twBaseIdUnitWithOmicronEnum.HERASYNDULLA:
                    oHeraCount++;
                    break;
                case twBaseIdUnitWithOmicronEnum.KELLERANBEQ:
                    kelleranbeqCount++;
                    break;
                case twBaseIdUnitWithOmicronEnum.MACEWINDU:
                    maceCount++;
                    break;
                case twBaseIdUnitWithOmicronEnum.MARAJADE:
                    oMaraJadeCount++;
                    break;
                case twBaseIdUnitWithOmicronEnum.PHASMA:
                    oPhasmaCount++;
                    break;
                case twBaseIdUnitWithOmicronEnum.POGGLE:
                    oPoggleCount++;
                    break;
                case twBaseIdUnitWithOmicronEnum.TRENCH:
                    trenchCount++;
                    break;
            }
        });
        const spreadSheet = SpreadsheetApp.getActive();
        const inventoryTab = spreadSheet.getSheetByName('Inventory');
        inventoryTab?.getRange(6, 2).setValue(reyCount);
        inventoryTab?.getRange(7, 2).setValue(sLKRCount);
        inventoryTab?.getRange(8, 2).setValue(jMLCount);
        inventoryTab?.getRange(9, 2).setValue(jMKCount);
        inventoryTab?.getRange(10, 2).setValue(leiaCount);
        inventoryTab?.getRange(11, 2).setValue(jabbaCount);
        inventoryTab?.getRange(12, 2).setValue(sEECount);
        inventoryTab?.getRange(13, 2).setValue(ashokaCount);
        inventoryTab?.getRange(14, 2).setValue(lordVaderCount);
        inventoryTab?.getRange(15, 2).setValue(gasCount);
        inventoryTab?.getRange(16, 2).setValue(oPoggleCount);
        inventoryTab?.getRange(17, 2).setValue(oPhasmaCount);
        inventoryTab?.getRange(18, 2).setValue(oDroidekaCount);
        inventoryTab?.getRange(19, 2).setValue(darkTrooperMoffGideonCount);
        inventoryTab?.getRange(20, 2).setValue(aphraCount);
        inventoryTab?.getRange(21, 2).setValue(thirdSisterCount);
        inventoryTab?.getRange(22, 2).setValue(starkillerCount);
        inventoryTab?.getRange(23, 2).setValue(oMaraJadeCount);
        inventoryTab?.getRange(24, 2).setValue(trenchCount);
        inventoryTab?.getRange(25, 2).setValue(null);
        inventoryTab?.getRange(26, 2).setValue(oHeraCount);
        inventoryTab?.getRange(27, 2).setValue(malgusCount);
    }
}
