function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Update spreadsheets').addItem('Import data from SWGOH.GG', 'importDatas').addToUi();
}

async function importDatas() {
    const guildDatas = fetchGuildInformations();
    const guildMembers = await fetchGuildMembers(guildDatas);

    // Initialize count object dynamically from enums
    const unitCounts = Object.fromEntries(Object.values(twBaseIdUnitEnum).map((unit) => [unit, 0]));
    const omicronUnitCounts = Object.fromEntries(Object.values(twBaseIdUnitWithOmicronEnum).map((unit) => [unit, 0]));

    // Store detailed breakdown per member
    const memberDetails: any[] = [];

    for (const member of guildMembers) {
        const { twUnitsWOOmicrons, twUnitsWOmicrons } = fetchInventory(member);

        const memberUnitCounts = { name: member.data.name, units: {} };
        const memberOmicronCounts = { name: member.data.name, units: {} };

        twUnitsWOOmicrons.forEach((unit) => {
            if (unit in unitCounts) {
                unitCounts[unit]++;
                memberUnitCounts.units[unit] = (memberUnitCounts.units[unit] || 0) + 1;
            }
        });

        twUnitsWOmicrons.forEach((unit) => {
            if (unit in omicronUnitCounts) {
                omicronUnitCounts[unit]++;
                memberOmicronCounts.units[unit] = (memberOmicronCounts.units[unit] || 0) + 1;
            }
        });

        memberDetails.push({
            name: memberUnitCounts.name,
            units: { baseUnits: { ...memberUnitCounts.units }, memberOmicronUnits: memberOmicronCounts.units }
        });
    }

    const spreadSheet = SpreadsheetApp.getActive();
    const inventoryTab = spreadSheet.getSheetByName('Inventory');
    let rowRange: number = 6;
    console.log('unitCounts', unitCounts);
    console.log('unitCounts', omicronUnitCounts);
    console.log('unitCounts', memberDetails);
    Object.values(twBaseIdUnitEnum).forEach((unit) => {
        inventoryTab?.getRange(rowRange, 2).setValue(unitCounts[unit]);
        rowRange++;
    });

    Object.values(twBaseIdUnitWithOmicronEnum).forEach((unit) => {
        inventoryTab?.getRange(rowRange, 2).setValue(omicronUnitCounts[unit]);
        rowRange++;
    });

    let memberColumn: number = 3;
    for (const member of memberDetails) {
        inventoryTab?.getRange(3, memberColumn).setValue(member.name);
        memberColumn++;
    }
}
