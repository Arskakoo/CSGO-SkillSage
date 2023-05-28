var valitutAseet = [];

function ehdotaAsetta(rahaMaara, puoli) {
  fetch('items.json')
    .then(response => response.json())
    .then(data => {
      var ehdotetutAseet = [];

      // Käy läpi JSON-tiedoston aseet
      for (var avain in data) {
        if (data.hasOwnProperty(avain)) {
          var ase = data[avain];

          // Tarkista aseen saatavuus valitulla puolella ja hinta
          if (ase.hinta <= rahaMaara && (ase.puoli === puoli || ase.puoli === "bothteam")) {
            ehdotetutAseet.push(ase);
          }
        }
      }

      // Suodata ehdotetut aseet rahasumman perusteella
      ehdotetutAseet = ehdotetutAseet.filter(function (ase) {
        return ase.hinta <= rahaMaara;
      });

      // Järjestä ehdotetut aseet luokan perusteella
      ehdotetutAseet.sort(function (a, b) {
        var luokkaA = a.luokka.toUpperCase();
        var luokkaB = b.luokka.toUpperCase();
        var luokkaJarjestys = {
          'PISTOL': 1,
          'SMG': 2,
          'HEAVY': 3,
          'RIFLE': 4,
          'EQUIPMENT': 5,
          'GRENADE': 6
        };

        // Tarkista luokan järjestys ja palauta vastaava järjestysluku
        if (luokkaJarjestys[luokkaA] < luokkaJarjestys[luokkaB]) {
          return -1;
        }
        if (luokkaJarjestys[luokkaA] > luokkaJarjestys[luokkaB]) {
          return 1;
        }

        return 0;
      });

      // Näytä ehdotetut aseet HTML:ssä
      var tiedotElementti = document.getElementById('ehdotetut-tiedot');
      tiedotElementti.innerHTML = '';

      if (ehdotetutAseet.length > 0) {
        for (var i = 0; i < ehdotetutAseet.length; i++) {
          var ase = ehdotetutAseet[i];

          var nimiElementti = document.createElement('h1');
          nimiElementti.textContent = ase.nimi;

          var hintaElementti = document.createElement('h2');
          hintaElementti.textContent = 'Price: ' + '$' + ase.hinta;

          var puoliElementti = document.createElement('p');
          puoliElementti.textContent = 'Team: ' + ase.puoli;

          var luokkaElementti = document.createElement('p');
          luokkaElementti.textContent = 'Class: ' + ase.luokka;

          // Luo kuva-elementti ja aseta sen lähde (src) aseen kuvalle
          var kuvaElementti = document.createElement('img');
          kuvaElementti.src = ase.kuva;
          kuvaElementti.style.maxWidth = '200px'; // Määritä kuvan enimmäisleveys tarvittaessa

          var aseElementti = document.createElement('div');
          aseElementti.appendChild(kuvaElementti);
          aseElementti.appendChild(nimiElementti);
          aseElementti.appendChild(hintaElementti);
          // aseElementti.appendChild(puoliElementti);
          // aseElementti.appendChild(luokkaElementti);

          var nappiElementti = document.createElement('button');
          nappiElementti.textContent = 'Choose';
          nappiElementti.addEventListener('click', (function (valittuAse) {
            return function () {
              valitseAse(valittuAse);
            };
          })(ase));

          aseElementti.appendChild(nappiElementti);

          // ...

          tiedotElementti.appendChild(aseElementti);
        }
      } else {
        tiedotElementti.textContent = 'No suggestions';
        naytaTuotteenHinta();
      }
    })
    .catch(error => console.error('Virhe:', error));
}

function paivitaValitutAseet() {
  var valitutElementti = document.getElementById('valitutAseet');
  valitutElementti.innerHTML = '';

  if (valitutAseet.length > 0) {
    var kokonaishinta = 0;

    for (var i = 0; i < valitutAseet.length; i++) {
      var ase = valitutAseet[i];

      var nimiElementti = document.createElement('p');
      nimiElementti.textContent = 'Name: ' + ase.nimi;

      var hintaElementti = document.createElement('p');
      hintaElementti.textContent = 'Price: $' + ase.hinta;

      var hrElementti = document.createElement('hr');

      valitutElementti.appendChild(nimiElementti);
      valitutElementti.appendChild(hintaElementti);
      valitutElementti.appendChild(hrElementti);

      kokonaishinta += ase.hinta;
    }

    var kokonaishintaElementti = document.createElement('h3');
    kokonaishintaElementti.textContent = 'Total price: $' + kokonaishinta;
    valitutElementti.appendChild(kokonaishintaElementti);
  } else {
    valitutElementti.textContent = 'No selected weapons';
  }
}

function paivitaEhdotus() {
  var rahaMaara = parseFloat(document.getElementById('rahaMaara').value);
  var puoli = document.getElementById('puoli').value;

  valittuRahasumma = rahaMaara;
  ehdotaAsetta(rahaMaara, puoli);
  paivitaValitutAseet(); // Päivitä myös valitut aseet näytölle
}

function valitseAse(ase) {
  // Tarkista, onko ase jo valittujen joukossa
  var indeksi = valitutAseet.findIndex(function (valittuAse) {
    return valittuAse.nimi === ase.nimi;
  });

  if (indeksi === -1) {
    // Aseta valittu ase valittujen aseiden taulukkoon
    valitutAseet.push(ase);
  } else {
    // Poista valittu ase valittujen aseiden taulukosta
    valitutAseet.splice(indeksi, 1);
  }

  // Päivitä valitut aseet näytölle
  paivitaValitutAseet();
}
