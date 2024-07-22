function generateCSV(data: { [date: string]: { [dataType: string]: any}}, dataTypes: string[], useDailyData: boolean ) {
    const headers = ['Date', 'Time', ...dataTypes];
    const rows = [];

    for (const [date, dateData] of Object.entries(data)) {
        if (useDailyData) {
            const row = [date, ''];
            for (const dataType of dataTypes) {
                row.push(dateData[dataType]?.[0]?.value || '');
            }
            row.push(row.join(','));
        } else {
            const timeEntries = dateData[dataTypes[0]] || [];
            for (const entry of timeEntries) {
                const row = [date, entry.timestamp.split(' ')[1]];
                for (const dataType of dataTypes) {
                    const typeData = dateData[dataType] || [];
                    const matchingEntry = typeData.find((e: { timestamp: any; }) => e.timestamp === entry.timestamp);
                    row.push(matchingEntry?.value || '');
                }
                rows.push(row.join(','));
            }
        }
    }

    return [headers.join(','), ...rows].join('\n');
}

export default generateCSV;