/*
 * placement.js - test de nivel inicial (30 preguntas, un solo intento).
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
        w: ['No solo llegó tarde, pero se fue temprano.', 'No solo llegó tarde, pero también se fue temprano.'],
        why: '"Not only... but also" se traduce con "no solo... sino (que) también". Ni "pero" ni "pero también" pueden sostener ese contraste.'
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
        w: ['Tiene un regalo para situaciones que desarman.', 'Tiene talento para destruir situaciones.'],
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
        w: ['Because the data were incomplete, the whole model was crumbling.',
          'That the data were incomplete undermined the whole model.'],
        why: 'El "that" que abre una oración completiva se traduce con "that" más sujeto y verbo; "because" convierte el sujeto en causa y cambia el sentido. Y "entire" es "todo" o "entero", no "whole".'
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
          'Sin tener en cuenta las objeciones, el fallo sigue en pie.'],
        why: '"Notwithstanding" es una preposición culta, "pese a"; "sin tener en cuenta" es una locución verbal y no equivale. Y "ruling" aquí es "resolución" o "fallo", no "regla".'
    },

    /* ---- ADICIONALES: 10 preguntas para afinar la medicion ---- */
    /* Banda 2: 1 | Banda 3: 4 | Banda 4: 3 | Banda 5: 2 */

    /* ---------------- BANDA 2 ---------------- */
    {
        lv: 2, pts: 1, dir: 'en',
        q: 'Please close the window.',
        a: 'Por favor, cierra la ventana.',
        w: ['Por favor, cierras la ventana.',
          'Por favor, cerrar la ventana.'],
        why: '"Please" va dirigido a una persona, así que en español responde el imperativo de tú: "cierra". "Cierras" es el indicativo, que narraría una costumbre tuya. Y "cerrar" a secas no es imposible en español, pero solo funciona en un rótulo o en una lista, no en un pedido directo a alguien.'
    },
    {
        lv: 3, pts: 2, dir: 'es',
        q: 'Nunca había montado una bici de montaña.',
        a: 'I had never ridden a mountain bike before.',
        w: ['I had never ride a mountain bike before.',
          'I have never rode a mountain bike before.'],
        why: 'Después de "had" el verbo va en participio, no en infinitivo: "had never ridden". Y con "have/has" también se usa el participio, no el pasado: "have never rode" mezcla el presente perfecto con el pasado simple. En las dos opciones el participio que corresponde es "ridden".'
    },
    {
        lv: 3, pts: 2, dir: 'en',
        q: 'If we leave now, we will catch the last bus.',
        a: 'Si salimos ahora, alcanzaremos el último bus.',
        w: ['Si saldremos ahora, alcanzaremos el último bus.',
          'Si salíamos ahora, alcanzaremos el último bus.'],
        why: '"If" con presente en inglés describe una condición real y posible, así que va en presente de indicativo: "si salimos". El futuro "saldremos" detrás de "si" presenta la ida como algo ya decidido. Y el imperfecto "salíamos" junto con "ahora" describe una costumbre del pasado, no una posibilidad de aquí y ahora.'
    },
    {
        lv: 3, pts: 2, dir: 'es',
        q: 'El resultado depende del tiempo atmosférico.',
        a: 'The result depends on the weather.',
        w: ['The result depends in the weather.',
          'The result depends of the weather.'],
        why: '"Depender de" se traduce con "depend on", nunca "in" ni "of": en inglés no existen esas dos formas. Ojo además con el vocabulario: "el tiempo atmosférico" es "the weather", porque habla del tiempo de hoy, mientras que "el clima" sería "the climate", el patrón de años.'
    },
    {
        lv: 4, pts: 3, dir: 'en',
        q: 'If she had studied medicine, she would be working in a hospital now.',
        a: 'Si hubiera estudiado medicina, ahora estaría trabajando en un hospital.',
        w: ['Si había estudiado medicina, ahora estaría trabajando en un hospital.',
          'Si hubiera estudiado medicina, ahora habría trabajado en un hospital.'],
        why: 'Condicional mixto: la causa es pasada ("hubiera estudiado") y el efecto es presente ("estaría trabajando"). "Si había estudiado" es el pluscuamperfecto de indicativo, que en español no abre una hipótesis: ahí va el pluscuamperfecto de subjuntivo. Y "habría trabajado" cuenta el efecto en pasado, cuando el original lo sitúa ahora.'
    },
    {
        lv: 4, pts: 3, dir: 'es',
        q: 'No puede ser que el equipo haya llegado tarde.',
        a: 'The team can\'t have arrived late.',
        w: ['The team must have arrived late.',
          'The team can\'t arrive late.'],
        why: '"No puede ser que" descarta una suposición sobre algo que ya pasó, así que en inglés va "can\'t have" más participio: "can\'t have arrived". "Must have" afirma que sí llegaron tarde, o sea lo contrario de lo que dice el enunciado, y "can\'t arrive" habla del futuro o de una falta de permiso, no de una deducción sobre el pasado.'
    },
    {
        lv: 4, pts: 3, dir: 'es',
        q: 'Aunque llueva, saldremos a tiempo.',
        a: 'Even if it rains, we will still make it on time.',
        w: ['However much it rains, we will still make it on time.',
          'Even if it rains, we made it on time.'],
        why: '"Aunque" seguido de subjuntivo expresa una concesión real en inglés, y eso es "even if": "Even if it rains". "However much" se usa para cantidades ("however much it costs"), no para este tipo de concesión. Y "we made it on time" ya cuenta un hecho pasado, cuando el original habla de lo que va a pasar.'
    },
    {
        lv: 5, pts: 4, dir: 'en',
        q: 'Not until the audit ends will the board approve the budget.',
        a: 'La junta no aprobará el presupuesto hasta que termine la auditoría.',
        w: ['La junta no aprobará el presupuesto hasta que la auditoría terminó.',
          'Hasta que la auditoría termine, la junta aprobará el presupuesto.'],
        why: '"Not until" invierte el orden de las cláusulas: el sujeto va primero ("the board will approve") y la condición con "until", al final, en una construcción que en inglés es obligadamente negativa. La primera opción quita ese "no" y por eso pasa a decir que la junta SÍ aprobará el presupuesto hasta que la auditoría termine, que es justo lo contrario. Y "terminó" en pretérito afirma que la auditoría ya acabó, cuando el original la da por pendiente.'
    },
    {
        lv: 5, pts: 4, dir: 'es',
        q: 'No es que el plan sea perfecto; es que no hay alternativa.',
        a: 'It is not that the plan is perfect; it is that there is no alternative.',
        w: ['The plan is not perfect because there is no alternative.',
          'It is not only that the plan is perfect; it is also that there is no alternative.'],
        why: '"No es que... es que" no expresa una causa, sino una corrección de la idea anterior, y en inglés lleva "It is not that... it is that". La primera opción convierte todo en un "because", que sí es una relación causal. Y "not only... also" suma una afirmación adicional, cuando el original va a corregir, no a acumular.'
    },
    {
        lv: 5, pts: 4, dir: 'en',
        q: 'The data were so inconsistent that nobody trusted the analysis.',
        a: 'Los datos eran tan inconsistentes que nadie confiaba en el análisis.',
        w: ['Los datos eran inconsistentes que nadie confiaba en el análisis.',
          'Los datos eran tan inconsistentes porque nadie confiaba en el análisis.'],
        why: 'Un "so" seguido de un adjetivo de resultado exige "tan" antes del adjetivo y "que" después: "tan inconsistentes que". La primera opción se queda sin "tan" y "inconsistentes que" no forma una oración, porque el "so" se queda sin la consecuencia que debe introducir. Y "porque" invierte la relación lógica: presenta la desconfianza como causa, cuando el inglés dice que la causa es la inconsistencia y el efecto es que nadie confiara.'
    }

];
