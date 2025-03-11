function fetchInventory(member) {
    const twUnitsWOOmicrons: string[] = member.units.filter((unit) => twBaseIdUnitList.includes(unit.data.base_id)).map((unit) => unit.data.base_id);
    const twUnitsWOmicrons: string[] = member.units
        .filter((unit) => twBaseIdUnitListWithOmicron.includes(unit.data.base_id) && unit.data.omicron_abilities.length >= 1)
        .map((unit) => unit.data.base_id);
    return { twUnitsWOOmicrons, twUnitsWOmicrons };
}
