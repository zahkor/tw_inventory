function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Update spreadsheet').addItem('Import data from SWGOH.GG', 'importDatas').addToUi();
}

async function importDatas() {
    // applyConditionalFormatting();
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

    let rowRangeForTotalCounts: number = 6;
    Object.values(twBaseIdUnitEnum).forEach((unit) => {
        inventoryTab?.getRange(rowRangeForTotalCounts, 2).setValue(unitCounts[unit]);
        rowRangeForTotalCounts++;
    });

    Object.values(twBaseIdUnitWithOmicronEnum).forEach((unit) => {
        inventoryTab?.getRange(rowRangeForTotalCounts, 2).setValue(omicronUnitCounts[unit]);
        rowRangeForTotalCounts++;
    });

    let memberColumn: number = 3;
    for (const member of memberDetails) {
        inventoryTab?.getRange(3, memberColumn).setValue(member.name);
        let row = 6;
        Object.values(twBaseIdUnitEnum).forEach((baseUnit) => {
            let unit = member.units.baseUnits[baseUnit];
            if (unit == undefined) {
                inventoryTab?.getRange(row, memberColumn).setBackground('#FF0000');
            } else {
                inventoryTab?.getRange(row, memberColumn).setBackground('#00FF00'); // Green background
            }
            row++;
        });
        Object.values(twBaseIdUnitWithOmicronEnum).forEach((omicronUnit) => {
            let unit = member.units.memberOmicronUnits[omicronUnit];
            if (unit == undefined) {
                inventoryTab?.getRange(row, memberColumn).setBackground('#FF0000');
            } else {
                inventoryTab?.getRange(row, memberColumn).setBackground('#00FF00'); // Green background
            }
            row++;
        });
        memberColumn++;
    }
}
