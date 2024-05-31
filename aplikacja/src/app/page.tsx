"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import Navbar from "./components/Navbar";
import {
  downloadJSON,
  filterData,
  filterEvents,
  getAll,
  getEvents,
} from "./functions/functions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/app/components/ui/navigation-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { Button } from "@/app/components/ui/button";
import { ChevronsDownIcon, ChevronsUpDownIcon } from "lucide-react";
import { Checkbox } from "@/app/components/ui/checkbox";
import LineChart from "./components/LineChart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./components/ui/command";

export default function Home() {
  const router = useRouter();
  let token = "";
  if (global?.window !== undefined) {
    token = localStorage.getItem("token") || "";
  }
  const verifyToken = async (token: string) => {
    const url = `/api/auth/verify/${token}`;
    try {
      const response = await axios.get(url);
      if (response.data.status === 201 || response.data.status === 200) {
      } else {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    }
  };
  const wojewodztwa: string[] = [
    "Dolnoslaskie",
    "Kujawsko-pomorskie",
    "Lubelskie",
    "Lubuskie",
    "Lodzkie",
    "Malopolskie",
    "Mazowieckie",
    "Opolskie",
    "Podkarpackie",
    "Podlaskie",
    "Pomorskie",
    "Slaskie",
    "Swietokrzyskie",
    "Warminsko-mazurskie",
    "Wielkopolskie",
    "Zachodniopomorskie",
  ];
  const lata: string[] = Array.from(
    { length: 19 },
    (_, index) => `r${2004 + index}`
  );

  const [globalData, setGlobalData] = React.useState<any>(null); // dane globalne z bazy
  const [data, setData] = React.useState<any>(globalData); // dane do wyswietlenia
  const [dataDzietnosc, setDataDzietnosc] = React.useState<any>(globalData); // dane dzietnosci
  const [tabela, setTabela] = React.useState<string>("dzietnosc"); //nazwa obecnej tabeli
  const [selectedWojewodztwa, setSelectedWojewodztwa] =
    React.useState<string[]>(wojewodztwa); // wybrane wojewodztwa
  const [globalLata, setGlobalLata] = React.useState<string[]>(lata); // lata przefiltrowane z bazy
  const [selectedLata, setSelectedLata] = React.useState<string[]>(lata); // wybrane lata
  const [globalEvents, setGlobalEvents] = React.useState<any>(null); // wydarzenia globalne z bazy
  const [selectedEvent, setSelectedEvent] =
    React.useState<string>("Wybierz wydarzenie");
  const [open, setOpen] = React.useState<boolean>(false);
  const [eventBorder, setEventBorder] = React.useState<any>({
    left: -1,
    right: -1,
  });

  const getData = async () => {
    const temp = await getAll(token, tabela);
    const temp2 = await getEvents(token);

    setGlobalData(temp);
    setGlobalLata(lata);
    setGlobalEvents(temp2);

    if (tabela === "dzietnosc") setDataDzietnosc(temp);
    setData(temp);
    setSelectedWojewodztwa(wojewodztwa);
    setSelectedLata(lata);
    setSelectedEvent("Wybierz wydarzenie");
  };
  React.useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      router.push("/login");
    }
    getData();
  }, [tabela]);

  if (data === null) {
    return <div>Loading...</div>;
  }
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const columnCount = columns.length - 2;

  return (
    <div>
      <Navbar />
      <div className="py-4 px-8 flex justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button
                variant="secondary"
                className="hover:bg-green-800 hover:text-white duration-300 transition-all bg-green-500 min-w-[150px]"
                onClick={() => setTabela("dzietnosc")}
              >
                Dzietnosc
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button
                variant="secondary"
                className="hover:bg-green-800 hover:text-white duration-300 transition-all bg-green-500 min-w-[150px]"
                onClick={() => setTabela("pkb")}
              >
                PKB
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button
                variant="secondary"
                className="hover:bg-green-800 hover:text-white duration-300 transition-all bg-green-500 min-w-[150px]"
                onClick={() => setTabela("bezrobocie")}
              >
                Bezrobocie
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button
                variant="secondary"
                className="hover:bg-green-800 hover:text-white duration-300 transition-all bg-green-500 min-w-[150px]"
                onClick={() => setTabela("srednie_wynagrodzenie")}
              >
                Średnie wynagrodzenie
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button
                variant="secondary"
                className="hover:bg-green-800 hover:text-white duration-300 transition-all bg-green-500 min-w-[150px]"
                onClick={() => setTabela("dlugosc_zycia")}
              >
                Długość życia
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button
          className="absolute right-8 hover:bg-gray-600"
          onClick={() => downloadJSON(data, tabela)}
        >
          Eksportuj do JSON
        </Button>
      </div>
      <div className="flex gap-4 px-4 py-2">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary">
              Wybierz wojewodztwa
              <ChevronsDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className=" items-center">
            <DrawerHeader>
              <DrawerTitle className="text-center">Wojewodztwa</DrawerTitle>
              <DrawerDescription>Wybierz wojewodztwa</DrawerDescription>
            </DrawerHeader>
            <div className="grid grid-cols-2 w-[30%] gap-4">
              {wojewodztwa.map((wojewodztwo, index: any) => (
                <label
                  className="flex gap-4 cursor-pointer items-center justify-right"
                  key={index}
                >
                  <Checkbox
                    checked={selectedWojewodztwa.includes(wojewodztwo)}
                    onCheckedChange={() =>
                      setSelectedWojewodztwa((prev) => {
                        if (prev.includes(wojewodztwo)) {
                          return prev.filter((item) => item !== wojewodztwo);
                        }
                        return [...prev, wojewodztwo];
                      })
                    }
                  />
                  <h3>{wojewodztwo}</h3>
                </label>
              ))}
            </div>
            <DrawerFooter className="flex flex-row *:w-[150px]">
              <Button
                variant="secondary"
                onClick={() => setSelectedWojewodztwa(wojewodztwa)}
              >
                Zaznacz wszystkie
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedWojewodztwa([])}
              >
                Odznacz wszystkie
              </Button>
              <DrawerClose asChild>
                <Button
                  onClick={() =>
                    setData(() =>
                      filterData(globalData, selectedWojewodztwa, selectedLata)
                    )
                  }
                >
                  Filtruj
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary">
              Wybierz lata
              <ChevronsDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className=" items-center">
            <DrawerHeader>
              <DrawerTitle className="text-center">Lata</DrawerTitle>
              <DrawerDescription>Wybierz lata</DrawerDescription>
            </DrawerHeader>
            <div className="grid grid-cols-4 w-[30%] gap-4">
              {lata.map((rok, index: any) => (
                <label
                  className="flex gap-4 cursor-pointer items-center justify-right"
                  key={index}
                >
                  <Checkbox
                    checked={selectedLata.includes(rok)}
                    onCheckedChange={() => {
                      setSelectedLata((prev) => {
                        if (prev.includes(rok)) {
                          return prev.filter((item) => item !== rok);
                        }
                        return [...prev, rok];
                      });
                    }}
                  />
                  <h3>{rok.slice(1)}</h3>
                </label>
              ))}
            </div>
            <DrawerFooter className="flex flex-row *:w-[150px]">
              <Button variant="secondary" onClick={() => setSelectedLata(lata)}>
                Zaznacz wszystkie
              </Button>
              <Button variant="secondary" onClick={() => setSelectedLata([])}>
                Odznacz wszystkie
              </Button>
              <DrawerClose asChild>
                <Button
                  onClick={() => {
                    const sortedSelectedLata = [...selectedLata].sort(
                      (a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))
                    );

                    setData(() =>
                      filterData(
                        globalData,
                        selectedWojewodztwa,
                        sortedSelectedLata
                      )
                    );
                    setGlobalLata(sortedSelectedLata);
                    setSelectedEvent("Wybierz wydarzenie");
                    setEventBorder({ left: -1, right: -1 });
                  }}
                >
                  Filtruj
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              className="justify-between"
              role="combobox"
              variant="secondary"
            >
              <div className="flex-1 truncate">{selectedEvent}</div>
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Wyszukaj..." />
              <CommandList>
                <CommandEmpty>Brak wydarzenia.</CommandEmpty>
                {globalEvents &&
                  globalEvents.map((event: any) => {
                    return (
                      <CommandGroup key={event.Tytul} heading={event.Tytul}>
                        {event.events.map((item: any) => {
                          return (
                            <CommandItem
                              className="cursor-pointer"
                              key={item.Nazwa}
                              value={item.Nazwa}
                              onSelect={() => {
                                setOpen(false);
                                setSelectedEvent(item.Nazwa);
                                filterEvents(
                                  item.Przedzial,
                                  selectedEvent,
                                  setEventBorder,
                                  lata
                                );
                                setSelectedLata(lata);
                                setGlobalLata(lata);
                                setData(globalData);
                              }}
                            >
                              {item.Nazwa}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    );
                  })}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={3} className="border-r w-[150px]">
              Wojewodztwo
            </TableHead>
            <TableHead colSpan={columnCount} className="text-center">
              Lata
            </TableHead>
          </TableRow>
          <TableRow>
            {globalLata.map((rok, index: number) => (
              <TableHead key={index}>{rok.slice(1)}</TableHead>
            ))}
          </TableRow>
          <TableRow>
            <TableHead colSpan={19} className="text-center">
              {tabela === "dzietnosc"
                ? "Wspolczynnik dziecko-kobieta"
                : tabela === "pkb"
                ? "PLN"
                : tabela === "bezrobocie"
                ? "%"
                : tabela === "srednie_wynagrodzenie"
                ? "PLN"
                : tabela === "dlugosc_zycia"
                ? "Wiek"
                : "Dzietnosc"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row: any, index: string) => (
            <TableRow key={index}>
              <TableCell>{row.Nazwa}</TableCell>
              {columns.slice(2).map((column: string, index: number) => (
                <TableCell
                  key={index}
                  className={`
                ${
                  index === eventBorder.left
                    ? "border-l-2"
                    : index === eventBorder.right
                    ? "border-r-2"
                    : ""
                } ${
                    index >= eventBorder.left &&
                    index <= eventBorder.right &&
                    "bg-blue-200/80"
                  }
                
                border-blue-300`}
                >
                  {row[column]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-16 max-h-screen flex flex-col items-center justify-center">
        <LineChart
          data={data}
          labels={globalLata}
          dzietnosc={dataDzietnosc}
          tabela={tabela}
          eventBorders={eventBorder}
        />
      </div>
    </div>
  );
}
