# dt162g_project_webservice

Skapad av Emma Forslund, emfo2102@student.miun.se, 2022

Detta repository innehåller filerna till en webbtjänst som är skapad med Node.js och express. CRUD(Create, Read, Update och Delete)-funktionalitet har skapats för varor, kategorier och mått. Det går att lägga till användare och logga in användare. 
Mongoose används för databas-anslutningen och NoSQL-databasen MongoDB för lagring. Databasens namn är shoppingList och de collections som finns är categories, items, units och users. 

## Använda API:et
Denna webbtjänst har inte publicerats, utan endast körts lokalt med URL:en http://127.0.0.1:3000/. 

## Beskrivning av API:et



![REST-api](https://user-images.githubusercontent.com/62517390/212562597-2f71377a-5e75-4a59-879f-a87ddd750d2a.png)


### Skapa användare 
Ett användare-objekt skapas med följande struktur:
``
{
 "email": "test@mail.se",  
 "password" : "password"
}
``

### Logga in
För att logga in används följande struktur:
``
{
"email": "test@mail.se", 
"password" : "password"
}
``

Följande returneras:
``
{
  "message": "Användare har loggat in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAbWFpbC5zZSIsImlhdCI6MTY3MzgxMDkwMywiZXhwIjoxNjczODE0NTAzfQ.TZWXzyJ6ae8M5WWscRLClxMOgp-nKA7nNXFTKMSyzSQ"
}
``

### Lägga till vara
För att lägga til en vara används/returneras följande struktur
``
{
 "name": "test",
 "category" : "testkategori",
 "unit" : "test-enhet",
 "quantity" : 10
}
``

### Lägga till kategori
För att lägga till en kategori används följande struktur:
``
{
"category_name" : "test-kategori"
}
``

### Lägga till en enhet
Följande struktur används för att lägga till en enhet:
``
{
"unit" : "test-enhet"
}
``

## Komma igång
1. Klona detta repo
2. Öppna en terminal med detta projekt och kör `` npm install ``
3. För att starta servern körs ``nodemon`` i terminalen. 
