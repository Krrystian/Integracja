import axios from "axios";


export async function getAll(token: string, tabela: string) {
  try
  {
    const response = await axios.get(`/api/data/${tabela}/getAll/${token}`);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function getEvents(token: string) {
  try{
  const response = await axios.get(`/api/data/getEvents/${token}`);
  if (response.status === 201 || response.status === 200) {
    return response.data;
  } else {
    return null;
  }
} catch (error) {
  return null;
}
}

export const downloadJSON = (data: any, tabela:any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tabela}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const filterData = (data: any, selectedWojewodztwa: string[], selectedLata: string[]) => {
    const temp = selectedWojewodztwa.map((wojewodztwo) => wojewodztwo.toUpperCase());
    const filteredRows = data.filter((row: any) => temp.includes(row.Nazwa));

    const filteredData = filteredRows.map((row: any) => {
        const filteredRow: any = { Kod: row.Kod, Nazwa: row.Nazwa };
        selectedLata.forEach((year) => {
            if (row[year]) {
                filteredRow[year] = row[year];
            }
        });
        const sortedRow: any = {};
        Object.keys(filteredRow).sort((a, b) => {
            if (a.startsWith('r') && b.startsWith('r')) {
                return parseInt(a.slice(1)) - parseInt(b.slice(1));
            }
            return a.localeCompare(b);
        }).forEach((key) => {
            sortedRow[key] = filteredRow[key];
        });

        return sortedRow;
    });

    return filteredData;
}
export const filterEvents = (period: string ,selectedEvent: string, setState: React.Dispatch<React.SetStateAction<any>>, lata: string[]) => {
  const periodArray = period.split(',');
  const lastValue = periodArray[periodArray.length - 1]
  const firstValue = periodArray[0]
  setState(() => {
    return {
      left: lata.indexOf(firstValue),
      right: lata.indexOf(lastValue),
    };
  });
}
