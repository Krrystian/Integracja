# Zestawienie danych na temat współczynnika dzietności z danymi gospodarczymi, politycznymi i historycznymi w latach 2004-2022.
## Informacje ogólne
Projekt został wykonany jako projekt zaliczeniowy na przedmioty: Integrajca Systemów, Programowanie aplikacji w chmurze. Dane zostały pobrane z baz danych GUS.

## Instalacja (bez dockera)
- Przejść do folderu /mysql.
- Zaimportować plik init.sql do bazy danych MySQL.
- Przejść do folderu /aplikacja.
- Wywołać następująco
  -  ``` npm install ```
  -  ``` npx prisma db pull```
  -  ``` npx prisma db generate ```
  -  ``` npm run dev ```
- W przeglądarce ``` localhost:3000 ```

## Instalacja (docker)
- W folderze głównym ``` docker-compose up --build ```
- W przeglądarce ``` localhost:3000 ```

## Wymagania (zalecane)
- Node v21.5
- MySQL v8.0
- Docker (wraz z docker-compose)
- Safari lub Google Chrome
