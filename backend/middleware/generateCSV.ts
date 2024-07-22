function generateCSV(data: { [date: string]: { [dataType: string]: any[] } }, dataTypes: string[], useDailyData: boolean): string {
    const headers = ['Date', 'Time', ...dataTypes];
    const rows = [headers.join(',')];
  
    for (const [date, dateData] of Object.entries(data)) {
      if (useDailyData) {
        const row = [date, ''];
        for (const dataType of dataTypes) {
          row.push(dateData[dataType]?.[0]?.value || '');
        }
        rows.push(row.join(','));
      } else {
        const timeEntries = dateData[dataTypes[0]] || [];
        for (const entry of timeEntries) {
          const row = [date, entry.timestamp.split(' ')[1]];
          for (const dataType of dataTypes) {
            const typeData = dateData[dataType] || [];
            const matchingEntry = typeData.find(e => e.timestamp === entry.timestamp);
            row.push(matchingEntry?.value || '');
          }
          rows.push(row.join(','));
        }
      }
    }
  
    return rows.join('\n');
  }

  export default generateCSV;