function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Update spreadsheet').addItem('Import data from SWGOH.GG', 'importDatas').addToUi();
}

async function importDatas() {
    // Fetch guild information once and avoid await unnecessary calls
    const guildDatas = fetchGuildInformations();
    const guildMembers = await fetchGuildMembers(guildDatas);

    // Initialize unit counts dynamically from enums
    const unitCounts = Object.fromEntries(Object.values(twBaseIdUnitEnum).map((unit) => [unit, 0]));
    const omicronUnitCounts = Object.fromEntries(Object.values(twBaseIdUnitWithOmicronEnum).map((unit) => [unit, 0]));

    // Store detailed breakdown per member
    const memberDetails: any[] = [];

    // Loop through guild members and track unit counts
    for (const member of guildMembers) {
        const { twUnitsWOOmicrons, twUnitsWOmicrons } = fetchInventory(member);

        const memberUnitCounts = { name: member.data.name, units: {} };
        const memberOmicronCounts = { name: member.data.name, units: {} };

        // Increment counts based on unit type
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

        // Add detailed data for the member
        memberDetails.push({
            name: memberUnitCounts.name,
            units: { baseUnits: { ...memberUnitCounts.units }, memberOmicronUnits: memberOmicronCounts.units }
        });
    }

    const spreadSheet = SpreadsheetApp.getActive();
    const inventoryTab = spreadSheet.getSheetByName('Inventory');

    let rowRangeForTotalCounts: number = 6;

    // Write total unit counts for both base units and omicron units at once
    const totalUnitCounts = [
        ...Object.values(twBaseIdUnitEnum).map((unit) => unitCounts[unit]),
        ...Object.values(twBaseIdUnitWithOmicronEnum).map((unit) => omicronUnitCounts[unit])
    ];

    inventoryTab?.getRange(rowRangeForTotalCounts, 2, totalUnitCounts.length, 1).setValues(totalUnitCounts.map((count) => [count]));

    let memberColumn: number = 3;
    const backgroundColors: string[][] = []; // 2D array to store background colors for batch update

    // Loop through members and populate their data
    for (const member of memberDetails) {
        inventoryTab?.getRange(3, memberColumn).setValue(member.name);

        let row = 6;
        const memberUnitCounts = member.units.baseUnits;
        const memberOmicronCounts = member.units.memberOmicronUnits;

        const rowData: string[] = []; // Collect the values for batch update

        // Check and set the background for base units in one go
        Object.values(twBaseIdUnitEnum).forEach((baseUnit) => {
            let unit = memberUnitCounts[baseUnit];
            rowData.push(unit === undefined ? '#FF0000' : '#00FF00');
            row++;
        });

        // Check and set the background for omicron units in one go
        Object.values(twBaseIdUnitWithOmicronEnum).forEach((omicronUnit) => {
            let unit = memberOmicronCounts[omicronUnit];
            rowData.push(unit === undefined ? '#FF0000' : '#00FF00');
            row++;
        });

        backgroundColors.push(rowData);
        memberColumn++;
    }

    // Batch set the background colors for the whole sheet at once
    const transposedBackgroundColors = backgroundColors[0].map((_, colIndex) => backgroundColors.map((row) => row[colIndex]));

    inventoryTab?.getRange(6, 3, transposedBackgroundColors.length, transposedBackgroundColors[0].length).setBackgrounds(transposedBackgroundColors);
}

