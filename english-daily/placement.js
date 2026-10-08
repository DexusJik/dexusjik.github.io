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
    /* Banda 2: 1 | Banda 3: 2 | Banda 4: 2 | Banda 5: 5 */

    /* ---------------- BANDA 2 ---------------- */
    {
        lv: 2, pts: 1, dir: 'en',
        q: 'Please close the window.',
        a: 'Por favor, cierra la ventana.',
        w: ['Por favor, cierras la ventana.',
          'Por favor, cerrar la ventana.'],
        why: 'Cuando "por favor" pide algo, el español usa el imperativo de tú: "cierra". "Cierras" es la forma del indicativo, la que sirve para hablar de lo que haces tú, y "cerrar" es un infinitivo que por sí solo no forma una orden.'
    },
    {
        lv: 3, pts: 2, dir: 'en',
        q: 'If we leave now, we will catch the last bus.',
        a: 'Si salimos ahora, alcanzaremos el último bus.',
        w: ['Si saldremos ahora, alcanzaremos el último bus.',
          'Si salíamos ahora, alcanzaremos el último bus.'],
        why: 'La condición en presente con "si" pide subjuntivo y el resultado va en futuro: "alcanzaremos". Detrás de "si" nunca aparece el futuro "saldremos", porque eso da por hecho que nos vamos, y el imperfecto "salíamos" describe una costumbre pasada, no una hipótesis.'
    },
    {
        lv: 3, pts: 2, dir: 'es',
        q: 'El resultado depende del clima.',
        a: 'The result depends on the weather.',
        w: ['The result depends in the weather.',
          'The result depends for the weather.'],
        why: '"Depender" va siempre con "on" en inglés: "depends on". "Depends in" y "depends for" son calcos del español "depender de" y ninguna de las dos formas existe en inglés.'
    },
    {
        lv: 3, pts: 2, dir: 'en',
        q: 'He used to smoke, but he stopped last year.',
        a: 'Solía fumar, pero dejó el año pasado.',
        w: ['Usaba fumar, pero dejó el año pasado.',
          'Está acostumbrado a fumar, pero dejó el año pasado.'],
        why: '"Used to" marca una costumbre del pasado que ya no existe: "solía". El imperfecto "usaba" en inglés se construye con el verbo "use" más el infinitivo, no con "usaba fumar". Y "be used to" es "estar acostumbrado a", o sea un hábito que sigue vigente, justo lo contrario de "solía".'
    },
    {
        lv: 4, pts: 3, dir: 'en',
        q: 'If she had studied medicine, she would be a doctor now.',
        a: 'Si hubiera estudiado medicina, ahora sería médica.',
        w: ['Si había estudiado medicina, ahora sería médica.',
          'Si hubiera estudiado medicina, ahora habría sido médica.'],
        why: 'Condicional mixto: la causa es pasada ("hubiera estudiado") y el efecto es presente ("sería"). "Si había estudiado" es el pluscuamperfecto de indicativo, que en español no abre una hipótesis: ahí va el pluscuamperfecto de subjuntivo. Y "habría sido" cuenta el efecto en pasado, cuando el original lo sitúa ahora.'
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
        q: 'Ojalá hubiera estudiado medicina.',
        a: 'I wish I had studied medicine.',
        w: ['I wish I studied medicine.',
          'I would have studied medicine.'],
        why: '"Wish" sobre un arrepentimiento pasado pide pluscuamperfecto de subjuntivo en inglés: "I had studied". Con el presente "studied" queda un deseo sobre el presente, no un arrepentimiento. Y sin "I wish", "I would have studied" por sí solo es una frase incompleta, sin ningún deseo que expresar.'
    },
    {
        lv: 5, pts: 4, dir: 'en',
        q: 'If the team had trained harder, they would be playing in the final now.',
        a: 'Si el equipo hubiera entrenado más, ahora estaría jugando en la final.',
        w: ['Si el equipo había entrenado más, ahora estaría jugando en la final.',
          'Si el equipo hubiera entrenado más, ahora habría jugado en la final.'],
        why: 'En una hipótesis sobre el pasado la condición va en pretérito pluscuamperfecto de subjuntivo: "hubiera entrenado". El "había entrenado" afirma que en realidad sí entrenó, así que ya no hay hipótesis. Y la consecuencia describe el presente: "estaría jugando". El "habría jugado" cuenta un resultado ya pasado.'
    },
    {
        lv: 5, pts: 4, dir: 'es',
        q: 'Es fundamental que todos los directores voten por el plan mañana.',
        a: 'It is essential that all the directors vote for the plan tomorrow.',
        w: ['It is essential that all the directors voted for the plan tomorrow.',
          'It is essential that all the directors will vote for the plan tomorrow.'],
        why: 'Después de "es fundamental que" el verbo va en subjuntivo y en presente: "vote". El "voted" cuenta una votación ya pasada y el "will vote" ya no es subjuntivo. En los dos casos desaparece la exigencia: lo que era obligatorio pasa a ser un hecho.'
    },
    {
        lv: 5, pts: 4, dir: 'en',
        q: 'The regulations were so convoluted that nobody could follow them.',
        a: 'Las normas eran tan enrevesadas que nadie podía seguirlas.',
        w: ['Las normas eran tan enrevesadas que nadie las seguía.',
          'Las normas eran tan enrevesadas porque nadie podía seguirlas.'],
        why: 'El "so...that" de resultado se traduce con "tan...que" y termina en una consecuencia: "podía seguirlas". Sin el "podía" queda "nadie las seguía", que afirma que nadie las siguió. Y con "porque" la relación se da vuelta: la complicación pasa a ser la causa en vez del efecto.'
    }

];
