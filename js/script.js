'use strict';

/** global */
var tableSelector = document.querySelector('.table'); // globalus lenteles selektorius

/**
 * Sugeneruoja HTML lentelę į kurią vėliau generuojamos šaškės
 * @function generate_table
 * @param {number} size - lentelės dydis, pvz. 8x8
 * @returns {array} lentelės duomenų masyvą
 */
function generate_table(size) {

    let alphabet = 'abcdefghijklmnopqrstuvwxyz',
        lentele = [];

    for(let i = 0; i < size; i++) { // Einame per eilutes
      let row = document.createElement('div'),
          rowNumber = size - i, // eilutes numeris pradeda skaiciuotis nuo apacios
          yLyginis = true;

          row.classList.add('row');

          lentele.push([]);

          if(i % 2) { yLyginis = false } // Jei lieka liekana tai nelyginis

      for(let a = 0; a < size; a++) { // Einame per stulpelius
         let col = document.createElement('div'),
             colLetterElement = document.createElement('span'),
             colLetter = alphabet[a],
             colID = colLetter + rowNumber, // pvz. a1, c6
             xLyginis = true,
             stulpelis = {};

             col.id = colID; // Priskiriame stulpeliui ID
             col.classList.add('col');

        if(a % 2) { xLyginis = false; } // Jei lieka liekana tai nelyginis

        if((yLyginis == true && xLyginis == true) ||
           (yLyginis == false && xLyginis == false)) {
          col.classList.add('col-white');
          stulpelis.type = 'white';
        }
        else if((yLyginis == true && xLyginis == false) ||
                (yLyginis == false && xLyginis == true )) {

          col.classList.add('col-black');
          stulpelis.type = 'black';

          col.addEventListener('click',column_click); // uždedame click įvykį ant visų juodų langelių (ant baltų nededame, nes ten eiti negalime), iškviečiame column_click funkcija, kuri atsakinga už tai kas vyksta paspaudus ant stulpelio
        }

        stulpelis.id = colID;
        stulpelis.x = a;
        stulpelis.y = i;

        lentele[i].push(stulpelis);

        colLetterElement.innerHTML = colID;
        col.appendChild(colLetterElement);
        row.appendChild(col);
      }

      tableSelector.appendChild(row);

    }

    return lentele;
}


/**
 * Valdo procesus, kurie įvyksta paspaudus ant lentelės stulpelio
 * @function column_click
 */
function column_click() {

    let activeColumns = tableSelector.querySelectorAll('.col-active'),
        checker = find_checker_by_id(this.id);

    if(!this.classList.contains('col-active')
        && this.classList.contains('col-filled')) { // Jei elementas neturi klasės active tai ją uždedame, ji suteikia stilių, jog šaškė pazymeta. Taip pat jei stulpelis turi klasę col-filled, vadinasi jis turi šaške ir stulpelį galime pažymėti, taip pat tada galime skaičiuoti galimus ėjimus.

        remove_possible_moves();
        this.classList.add('col-active');

        // remove_possible_moves();
        calculate_scope(checker.x,
                        checker.y,
                        checker.color,
                        checker.type);

    }

    if(this.classList.contains('col-possible')) { // Jei šaške turi šitą klasę, vadinasi galima čia ateiti
        let col = find_col_by_id(this.id);
        move_checker(col);
    }

    if(activeColumns.length > 0) { // jei randa pazymetas saskes
        activeColumns.forEach(function(element) { // vykdo ciklą
            element.classList.remove('col-active'); // nuima col active klases
        })
    }

}

/**
 * Ištrina galimų ėjimų atvaizdavimą iš HTML lentelės
 * @function remove_possible_moves
 */
function remove_possible_moves() {
    let possible = tableSelector.querySelectorAll('.col-possible');
    possible.forEach(function(el) {
        el.classList.remove('col-possible');
    });
}

/**
 * Suranda pažymėtą šaškę HTML lentelėje
 * @function find_active_checker
 * @returns {object} Gražina aktyvios šaškes DOM objektą
 */
function find_active_checker() {
    return tableSelector.querySelector('.col-active');
}

/**
 * Perstumia šaškę į naują poziciją
 * @function move_checker
 * @param {object} col - stulpelio objektas į kurį perkelsime šaškę
 */
function move_checker(col) {

    let activeChecker = find_active_checker(),
        img = activeChecker.querySelector('img'),
        columToMove = tableSelector.querySelector('#' + col.id),
        checker = find_checker_by_id(activeChecker.id);

        // console.log(checkers);

    for(let i = 0; i < checkers.length; i++) {
        if(checkers[i].id == checker.id) {
            // console.log(checkers[y][x]);
            checkers[i].id = col.id;
            checkers[i].x = col.x;
            checkers[i].y = col.y;
        }
    }

    activeChecker.querySelector('img').remove();
    activeChecker.classList.remove('col-filled');
    activeChecker.classList.remove('col-active');

    remove_possible_moves();
    columToMove.classList.add('col-filled');
    columToMove.appendChild(img);

}


function calc_scope(checkerX, checkerY, checkerColor, checkerType) {

    for(let y = checkerY - 1; y < checkerY + 2; y++) {
        for(let x = checkerX - 1; x < checkerX + 2; x++) {

            let col = find_col_by_coordinates(x, y),
                isChecker = find_checker_by_coordinates(x, y);
                // console.log(isChecker);
                // console.log(isChecker.color);
                // console.log(checkerColor);
                if( col !== null && // langelis egzistuoja ir nėra baltas
                    col.type !== 'white') {

                        possible.push(col);

                        console.log(col); // TODO: jei šaškė neegzistuoja ir langelis laisvas irgi reikia tikrinti ir dėti į galimus possibility
                        if(isChecker !== null && // šaškė egzistuoja
                           isChecker.color !== checkerColor) { // šaškės spalva ne tokia pati
                               // possible.push(isChecker);
                               calc_scope(isChecker.x,
                                          isChecker.y,
                                          isChecker.color,
                                          isChecker.type);
                        }
                        else {
                            return false;
                        }
                        // calc_scope( isChecker.x,
                        //             isChecker.y,
                        //             isChecker.color,
                        //             isChecker.type);

                }

            }

    }


    }



/**
 * Paskaičiuoja galimus šaškės ejimus pagal duotos šaškes koordinates, spalvą ir tipą
 * @function calc_scope
 * @param {number} checkerX - šaškės x koordinatė
 * @param {number} checkerY - šaškės y koordinatė
 * @param {string} checkerColor - šaškės spalva, pagal tai ieškoma ar yra šalia priešininkų white|black
 * @param {string} checkerType - šaškės tipas, gali būti default|queen
 */
function calculate_scope(checkerX, checkerY, checkerColor, checkerType) {
    /* patikriname aplinkui 6 langelius, jei langelis yra netuscias ir priesininko, tikriname toliau ir jei randame laisva langeli rodome, jog galime kirsti. */

    // let cross = false; // galimas kirtimas?

    for(let y = checkerY - 1; y < checkerY + 2; y++) {
        for(let x = checkerX - 1; x < checkerX + 2; x++) {

            let col = find_col_by_coordinates(x, y),
                isChecker = find_checker_by_coordinates(x, y);
                // console.log(isChecker);

            if(col !== null && col.type !== 'white') { // langelis egzistuoja ir nėra baltas
                if(isChecker === null) { // langelis laisvas, juodas tik į apačią, baltas tik į viršų

                    if( checkerColor === 'white' &&
                        checkerY > y) { // jei baltas tai gali eiti tik į viršų
                            show_possible_move(col);
                    }
                    else if(    checkerColor === 'black' &&
                                checkerY < y) {  // jei juodas tik į apačią
                            show_possible_move(col);
                    }

                }
                else {

                    if( isChecker.color !== checkerColor) { // gali būti potencialus kirtimas, nes nevienodos spalvos, tikriname toliau
                        // possible.push(isChecker);
                        alert('radau priesininką, gali buti kirtimas');
                        // calculate_scope(isChecker.x, isChecker.y, isChecker.color, isChecker.type);
                    } else {
                        // return false;
                    }
                    // console.log(col);
                    // calculate_scope(checker);
                    // langelis nelaisvas, tikriname ar galimas kirtimas (jei kirtimas galimas galime kirsti ir zemyn)

                }
            }

            // console.log(isChecker);

        }
    }

    // return cross;
}

/**
 * Suranda pažymėta šaške HTML lentelėje
 * @function show_possible_move
 * @param {object} column - stulpelio objektas
 */
function show_possible_move (column) {
    tableSelector.querySelector('#' + column.id).classList.add('col-possible');
}

/**
 * Suranda stulpelį iš stulpelio masyvo pagal jo ID
 * @function find_col_by_id
 * @param {string} id - stulpelio ID
 * @returns {object} Gražina stulpelio duomenis
 */
function find_col_by_id(id) {
    let col = null;

    for(let i = 0; i < table.length; i++) {
        for(let a = 0; a < table[i].length; a++) {
            if(table[i][a].id == id) {
                col = table[i][a];
            }
        }
    }

    return col;
}

/**
 * Suranda stulpelį iš stulpelio masyvo pagal jo x ir y koordinates
 * @function find_col_by_coordinates
 * @param {number} x
 * @param {number} y
 * @returns {object} Gražina stulpelio duomenis
 */
function find_col_by_coordinates(x, y) {
    let col = null;

    for(let i = 0; i < table.length; i++) {
        for(let a = 0; a < table[i].length; a++) {
            if(table[i][a].x == x && table[i][a].y == y) {
                col = table[i][a];
            }
        }
    }

    return col;

}

/**
 * Suranda šaškę iš šaškių masyvo pagal šaškės koordinates
 * @function find_checker_by_coordinates
 * @param {number} x
 * @param {number} y
 * @returns {object} Gražina šaškės duomenis
 */
function find_checker_by_coordinates(x, y) {
    let checker = null;

    for(let i = 0; i < checkers.length; i++) {
        if(checkers[i].x == x && checkers[i].y == y) {
            checker = checkers[i];
        }
    }

    return checker;
}


/**
 * Suranda šaškę iš šaškių masyvo pagal jos ID
 * @function find_checker_by_id
 * @param {string} id
 * @returns {object} Gražina šaškės duomenis
 */
function find_checker_by_id(id) {
    let checker = null;

    for(let i = 0; i < checkers.length; i++) {
        if(checkers[i].id == id) {
            checker = checkers[i];
        }
    }

    return checker;
}

/**
 * Suranda šaškę iš šaškių masyvo pagal jos ID
 * @function generate_checkers
 * @param {string} table - lentelės masyvas
 * @param {string} size - kiek šaškių atspausdinti, pvz. 12 reiškia, jog bus atspausdinta 12 baltų ir juodų
 * @returns {array} Šaškių masyvas
 */
function generate_checkers(table, size) {
    let black_checkers = [], // tik tam, jog zinoti kiek juodu šaškių sukurta
        white_checkers = [], // tik tam, jog zinoti kiek baltų šaškių sukurta
        checkers = []; // šaškių masyvas bendras, kurį grąžina funkcija

    // Spausdiname juodas šaškes nuo viršaus su įprastu ciklu, kai visos atspausdintos ciklas stabdomas
    for(let y = 0; y < table.length; y++) {
        for(let x = 0; x < table[y].length; x++) {
            if(black_checkers.length >= size) { break; } // Jei visos šaškės atspausdintos stabdome ciklą
            if(table[y][x].type == 'black') { // Jei langelis juodas, tai spausdiname šaškę ant jo ir dedame į masyvą šaškės objektą
                let checker = create_checker(table[y][x].id, 'black', x, y);
                black_checkers.push(checker); // kad zinoti kiek juodu saskiu ideta
                checkers.push(checker);
            }
        }
    }

    // console.log(checkers.length);

    // Spausdiname baltas šaškes nuo apačios su apverstu ciklu, kai visos atspausdintos ciklas stabdomas
    for(let y = table.length-1; y >= 0; y--) {
        for(let x = table.length-1; x >= 0; x--) {
            if(white_checkers.length >= size) { break; } // Jei visos šaškės atspausdintos stabdome ciklą
            if(table[y][x].type == 'black') { // Jei langelis juodas, tai spausdiname šaškę ant jo ir dedame į masyvą šaškės objektą
                let checker = create_checker(table[y][x].id, 'white', x, y);
                white_checkers.push(checker); // kad zinoti kiek baltu saskiu ideta
                checkers.push(checker);
            }
        }
    }

    return checkers;
}

/**
 * Sukuria šaškę lentelėje pagal duota langelio ID ir gražiną šaškės objektą
 * @function create_checker
 * @param {string} id
 * @param {string} color - spalva white|black
 * @param {number} x
 * @param {number} y
 * @returns {object}
 */
function create_checker(id, color, x, y) {

    let checker = document.createElement('img'),
        col = tableSelector.querySelector('#' + id);

    checker.className = 'checker';
    checker.src = "img/" + color + '-checker.png';

    col.classList.add('col-filled');
    col.appendChild(checker);

    return {
        id: id,
        color: color,
        type: 'default', // or queen
        x: x,
        y: y
    }
}

var table = generate_table(8),
    checkers = generate_checkers(table, 12),
    possible = [];

// Pavyzdys, start_program funkcijos
// start_program({
//     table: 8,
//     checkers: 12,
//     history: true,
//     time: true
// });


// console.log(checkers);
