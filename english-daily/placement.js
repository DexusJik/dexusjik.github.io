/*
 * placement.js - test de nivel inicial (20 preguntas, un solo intento).
 *
 * Load order: sentences.js, placement.js, game.js
 *
 * Cada pregunta esta escrita a mano porque los distractores son la parte
 * dificil. Una opcion sacada al azar de las 365 oraciones no sirve de nada:
 * puede no tener relacion con la pregunta. Aqui las dos opciones incorrectas
 * son trampas reales de gramatica o de lexico.
 *
 *   lv   - nivel de la oracion (2..5)
 *   pts  - puntaje al acertar. Las bandas altas valen mas, de modo que
 *          adivinar al principio no compensa saber al final.
 *   dir  - 'en' muestra la oracion en ingles y pide la traduccion
 *          'es' muestra la traduccion y pide el ingles
 *   q    - el enunciado, en el idioma de dir
 *   a    - la respuesta correcta
 *   w    - las dos opciones incorrectas
 *   why  - por que las otras dos estan mal; se muestra al responder
 */
window.PLACEMENT_ITEMS = [

    /* ---------------- BANDA 2 - A2 - 1 punto ---------------- */
    {
        lv: 2, pts: 1, dir: 'en',
        q: 'I go to the gym every Monday.',
        a: 'Voy al gimnasio todos los lunes.',
        w: ['Voy al gimnasio todos los días.', 'Iré al gimnasio todos los lunes.'],
        why: '"every Monday" es "todos los lunes", no "todos los días". Y el presente "I go" no es "iré", que sería futuro.'
    },
    {
        lv: 2, pts: 1, dir: 'en',
        q: 'She does not work here anymore.',
        a: 'Ella ya no trabaja aquí.',
        w: ['Ella no trabaja aquí todavía.', 'Ella trabaja aquí ahora.'],
        why: '"anymore" significa que antes sí y ahora no: "ya no". "Todavía" es "not yet", justo lo contrario, y "ahora" no dice nada sobre el pasado.'
    },
    {
        lv: 2, pts: 1, dir: 'en',
        q: 'There are three people in the room.',
        a: 'Hay tres personas en la habitación.',
        w: ['Están tres personas en la habitación.', 'Hay tres personas de la habitación.'],
        why: 'Para existir se usa "hay". "Están" exige que ya sabemos quiénes son; sirve para localizarlos, no para contar.'
    },
    {
        lv: 2, pts: 1, dir: 'en',
        q: 'I was tired because I worked all night.',
        a: 'Estaba cansado porque trabajé toda la noche.',
        w: ['Estaba cansado porque he trabajado toda la noche.', 'Estaba cansado porque trabajo toda la noche.'],
        why: 'Un hecho puntual de una vez se cuenta en pasado simple: "trabajé". El presente de hábito sería "trabajo" y el pretérito perfecto "he trabajado" implica que sigue en curso.'
    },
    {
        lv: 2, pts: 1, dir: 'es',
        q: 'Va a estudiar medicina.',
        a: 'She is going to study medicine.',
        w: ['She goes to study medicine.', 'She is study medicine.'],
        why: '"Ir a" más infinitivo es futuro: "going to". El presente simple "goes" sería una costumbre, y "is study" no existe.'
    },

    /* ---------------- BANDA 3 - B1 - 2 puntos ---------------- */
    {
        lv: 3, pts: 2, dir: 'en',
        q: 'I have known her for ten years.',
        a: 'La conozco hace diez años.',
        w: ['La conocí hace diez años.', 'La conozco desde diez años.'],
        why: 'Un estado que sigue vigente va en presente: "conozco". El pasado simple "conocí" sugiere que ya no. Y se dice "hace diez años", no "desde diez años".'
    },
    {
        lv: 3, pts: 2, dir: 'en',
        q: 'If I had known, I would have told you.',
        a: 'Si lo hubiera sabido, te lo habría dicho.',
        w: ['Si lo sabía, te lo decía.', 'Si lo sabría, te lo habría dicho.'],
        why: 'Es un condicional tipo 3: las dos partes van en condicional. Mezclar "sabría" en la condición con "habría dicho" en la consecuencia es el error típico.'
    },
    {
        lv: 3, pts: 2, dir: 'en',
        q: 'The report was written by the committee.',
        a: 'El informe fue escrito por el comité.',
        w: ['El informe escribió el comité.', 'El informe es escrito por el comité.'],
        why: 'Voz pasiva en pasado: "fue escrito". En activo se invierten los papeles: el informe no escribe, el comité escribe. Y "es escrito" sería pasiva en presente.'
    },
    {
        lv: 3, pts: 2, dir: 'en',
        q: 'She suggested meeting earlier.',
        a: 'Sugirió que nos reuniéramos antes.',
        w: ['Sugirió que nos reunimos antes.', 'Sugirió si nos reuníamos antes.'],
        why: '"Sugerir" dispara el subjuntivo: "que nos reuniéramos". El indicativo "reunimos" es incorrecto aquí, y "si" no introduce una oración como esa.'
    },
    {
        lv: 3, pts: 2, dir: 'en',
        q: 'Not only did he arrive late, but he also left early.',
        a: 'No solo llegó tarde, sino que además se fue temprano.',
        w: ['No solo llegó tarde, pero se fue temprano.', 'No solamente llegó tarde, sino también se fue temprano.'],
        why: '"Not only... but also" se traduce con "no solo... sino (que) también". Con "pero" queda agramatical.'
    },

    /* ---------------- BANDA 4 - B2 - 3 puntos ---------------- */
    {
        lv: 4, pts: 3, dir: 'en',
        q: 'Were I to invest now, I might see returns.',
        a: 'Si invirtiera ahora, podría ver rendimientos.',
        w: ['Si invierto ahora, podría ver rendimientos.', 'Si invirtiera ahora, veré rendimientos.'],
        why: '"Were I to" es hipotético: pide condicional en las dos partes ("invirtiera", "podría"). El indicativo "invierto" rompe la estructura, y el futuro "veré" también.'
    },
    {
        lv: 4, pts: 3, dir: 'en',
        q: 'The findings remain under consideration.',
        a: 'Los hallazgos siguen en estudio.',
        w: ['Los hallazgos siguen considerando.', 'Los hallazgos permanecen bajo consideración.'],
        why: '"Remain under consideration" no es "estar considerando": quienes deciden son las personas, no los hallazgos. La versión literal existe, pero suena traducida.'
    },
    {
        lv: 4, pts: 3, dir: 'en',
        q: 'Had the deadline not moved, we would have delivered.',
        a: 'Si la fecha límite no se hubiera movido, habríamos entregado.',
        w: ['Si la fecha límite no se movió, habríamos entregado.', 'Si la fecha límite no se moviera, habríamos entregado.'],
        why: 'La inversión empieza en pasado: "no se hubiera movido". Un simple "no se movió" afirma que en realidad no se movió, que es justo lo contrario de la hipótesis.'
    },
    {
        lv: 4, pts: 3, dir: 'en',
        q: 'She has a gift for defusing tense situations.',
        a: 'Tiene talento para desarmar situaciones tensas.',
        w: ['Tiene un regalo para situaciones que desarman.', 'Es buena desarmando situaciones tensas.', 'Tiene talento para destruir situaciones.'],
        why: '"A gift for" es "tener talento para", no "tener un regalo para". Y "defusing" es "desarmar": en inglés "un arma" y "una situación" se desarman igual.'
    },
    {
        lv: 4, pts: 3, dir: 'en',
        q: 'On no account should you share this.',
        a: 'Bajo ninguna circunstancia debes compartir esto.',
        w: ['En ninguna cuenta debes compartir esto.', 'De ninguna manera puedes compartir esto.'],
        why: '"On no account" no se traduce literalmente como "en ninguna cuenta". Y el original obliga a "debes", no a "puedes".'
    },

    /* ---------------- BANDA 5 - C1 - 4 puntos ---------------- */
    {
        lv: 5, pts: 4, dir: 'en',
        q: 'The claim, though popular, lacks empirical support.',
        a: 'La afirmación, aunque popular, carece de respaldo empírico.',
        w: ['La afirmación, aunque popular, tiene falta de apoyo empírico.', 'La afirmación, siendo popular, carece de respaldo empírico.'],
        why: '"Though" va con "aunque" en indicativo. Y "carece de" es la forma natural: "tiene falta de" es un calco del inglés.'
    },
    {
        lv: 5, pts: 4, dir: 'en',
        q: 'Rarely have I encountered such opacity.',
        a: 'Rara vez he encontrado tanta opacidad.',
        w: ['Raramente encontré tanta opacidad.', 'Pocas veces he encontrado tanta opacidad.'],
        why: 'La negación invertida ("Rarely have I") exige presente perfecto: "he encontrado". Y el adverbio se coloca antes del verbo, no detrás.'
    },
    {
        lv: 5, pts: 4, dir: 'es',
        q: 'Que los datos estuvieran incompletos debilitó todo el modelo.',
        a: 'That the data were incomplete undermined the entire model.',
        w: ['Because the data were incomplete, the entire model was undermined.',
          'That the data were incomplete undermined the whole model.'],
        why: 'El "that" que abre una oración completiva se traduce con "that" más sujeto y verbo, no con "because". Y "entire" es "todo" o "entero", no "whole".'
    },
    {
        lv: 5, pts: 4, dir: 'en',
        q: 'She is quick to point out that correlation is not causation.',
        a: 'No tarda en señalar que la correlación no es causalidad.',
        w: ['Está segura de señalar que la correlación no es causal.', 'Rápidamente señaló que la correlación no es causalidad.'],
        why: '"Is quick to" significa "no tarda en", no "está segura de". Y "causation" es "causalidad", no "causa".'
    },
    {
        lv: 5, pts: 4, dir: 'en',
        q: 'Notwithstanding the objections, the ruling stands.',
        a: 'Pese a las objeciones, la resolución se mantiene.',
        w: ['Sin tener en cuenta las objeciones, la resolución está en pie.',
          'A pesar de las objeciones, el fallo sigue en pie.'],
        why: '"Notwithstanding" es una preposición culta: "pese a", no una locución verbal. Y "ruling" aquí es "resolución" o "fallo", no "regla".'
    }
];
