/*
 * features/tips.js — one ungraded "Antes de empezar" card at the start of a
 * path lesson, shown only the first time the learner opens that lesson.
 */
(function () {
    'use strict';

    var TIPS = {
        0: {
            title: 'Presentarte: "my name is"',
            body: 'Para decir tu nombre usa "My name is…". Para decir de dónde eres: "I am from…" (soy de…). "Nice to meet you" equivale a "mucho gusto".',
            example: { en: 'Hello, my name is {name}.', es: 'Hola, me llamo {name}.' },
            contrast: '✗ I am of Chile → ✓ I am from Chile'
        },
        1: {
            title: 'Tu familia: "my" + "is"',
            body: '"My" sirve igual para todos: my father, my mother, my sister. Con una profesión el inglés agrega "a": "My father is a teacher" (mi padre es profesor).',
            example: { en: 'My father is a teacher.', es: 'Mi padre es profesor.' },
            contrast: '✗ My father is teacher → ✓ My father is a teacher'
        },
        2: {
            title: 'La edad va con "to be"',
            body: 'En inglés la edad no se "tiene", se "es": "I am 25 years old". Para cosas y personas sí usas "have": "I have one brother".',
            example: { en: 'I am twenty-five years old.', es: 'Tengo veinticinco años.' },
            contrast: '✗ I have 25 years → ✓ I am 25 years old'
        },
        3: {
            title: 'El color va antes del sustantivo',
            body: 'El adjetivo va antes del sustantivo y nunca cambia: "a red car", "red cars". Después de "is" va solo: "My house is white".',
            example: { en: 'I have a red car.', es: 'Tengo un auto rojo.' },
            contrast: '✗ a car red → ✓ a red car'
        },
        4: {
            title: 'Gustos: "I like" y "Do you like?"',
            body: '"Me gusta" se dice "I like": tú eres el sujeto. Para preguntar usa "Do you like…?". Con she o he el verbo lleva -s: "She drinks".',
            example: { en: 'Do you like pizza?', es: '¿Te gusta la pizza?' },
            contrast: '✗ She drink a lot of water → ✓ She drinks a lot of water'
        },
        5: {
            title: '"There is" para decir "hay"',
            body: '"Hay" se dice "There is" cuando es una cosa: "There is a table in the room". Para describir usa "is" + adjetivo: "The door is closed".',
            example: { en: 'There is a table in the room.', es: 'Hay una mesa en la habitación.' },
            contrast: '✗ Is a table in the room → ✓ There is a table in the room'
        },
        6: {
            title: 'Ubicar lugares: near, next to',
            body: '"Next to" es "al lado de", "near" es "cerca de" (sin "of") y "far from" es "lejos de". Para ir a un lugar usa "go to": "I go to the market".',
            example: { en: 'My house is near the beach.', es: 'Mi casa está cerca de la playa.' },
            contrast: '✗ near of the beach → ✓ near the beach'
        },
        7: {
            title: 'Rutinas en presente simple',
            body: 'Para hábitos usa el presente simple: "I wake up at seven". Con he, she o it agrega -s al verbo: "She works at a hospital".',
            example: { en: 'She works at a hospital.', es: 'Ella trabaja en un hospital.' },
            contrast: '✗ She work at a hospital → ✓ She works at a hospital'
        },
        8: {
            title: 'La hora: "at" + número',
            body: 'Para decir a qué hora pasa algo usa "at": "at ten", "at three". Para decir la hora empieza con "It is": "It is half past twelve" (son las doce y media).',
            example: { en: 'It is half past twelve.', es: 'Son las doce y media.' }
        },
        9: {
            title: '"Can": poder y saber hacer algo',
            body: '"Can" va con el verbo sin "to" y no cambia con she o he: "She can play". También significa "saber": "I can swim" es "sé nadar". Negativo: "cannot".',
            example: { en: 'I can swim very well.', es: 'Sé nadar muy bien.' },
            contrast: '✗ I can to swim → ✓ I can swim'
        },
        10: {
            title: 'Pasado simple: -ed e irregulares',
            body: 'Los verbos regulares agregan -ed: "played". Muchos verbos comunes son irregulares: go → went, buy → bought. "Was" es el pasado de "am" e "is".',
            example: { en: 'She went home early.', es: 'Ella se fue a casa temprano.' }
        },
        11: {
            title: 'El clima empieza con "It"',
            body: 'En inglés toda oración necesita sujeto, por eso el clima empieza con "it": "It is windy", "It is raining" (está lloviendo).',
            example: { en: 'It is raining in the city.', es: 'Está lloviendo en la ciudad.' },
            contrast: '✗ Is raining → ✓ It is raining'
        },
        12: {
            title: 'On, in, under: dónde está algo',
            body: '"On" es encima de una superficie, "in" es dentro (de un pueblo, una caja) y "under" es debajo. "Wait for me" lleva "for": esperar a alguien.',
            example: { en: 'The book is on the table.', es: 'El libro está sobre la mesa.' },
            contrast: '✗ Wait me here → ✓ Wait for me here'
        },
        13: {
            title: '"An office" y "a lot of work"',
            body: 'Usa "an" antes de sonido vocal: "an office". "Work" no se cuenta: "a lot of work", nunca "works". "In five minutes" es "dentro de cinco minutos".',
            example: { en: 'I work in an office.', es: 'Trabajo en una oficina.' },
            contrast: '✗ I have a lot of works → ✓ I have a lot of work'
        },
        14: {
            title: 'Repaso: presente simple y "need to"',
            body: 'Este repaso junta lo básico: presente simple ("She lives", "The kids play") y "need to" + verbo para lo que tienes que hacer: "I need to buy some milk".',
            example: { en: 'I need to buy some milk.', es: 'Necesito comprar un poco de leche.' }
        },
        15: {
            title: 'Ahora mismo: am/is/are + -ing',
            body: 'Para algo que está pasando ahora usa am, is o are + verbo con -ing: "I am reading". Sin "am" la oración queda incompleta.',
            example: { en: 'She is waiting for the bus.', es: 'Ella está esperando el autobús.' },
            contrast: '✗ I reading a book → ✓ I am reading a book'
        },
        16: {
            title: 'Pasado: "did" en preguntas',
            body: 'En afirmativo el verbo va en pasado: "I called". En preguntas y negativas el pasado lo lleva "did" y el verbo vuelve a su forma base: "They didn\'t come".',
            example: { en: 'Did you watch the game?', es: '¿Viste el partido?' },
            contrast: '✗ They didn\'t came → ✓ They didn\'t come'
        },
        17: {
            title: 'There is, there are, there was',
            body: '"There is" va con singular y "there are" con plural. En pasado: "there was" y "there were". "There isn\'t any milk left" significa "no queda leche".',
            example: { en: 'There are two chairs in the room.', es: 'Hay dos sillas en la habitación.' },
            contrast: '✗ There is two chairs → ✓ There are two chairs'
        },
        18: {
            title: 'Adjetivos: "boring" no es "bored"',
            body: 'Los adjetivos con -ing describen lo que causa la sensación: "The film was boring". Después de "look" va un adjetivo: "looks expensive" (se ve caro).',
            example: { en: 'The film was boring.', es: 'La película fue aburrida.' },
            contrast: '✗ The film was bored → ✓ The film was boring'
        },
        19: {
            title: 'Always, never: antes del verbo',
            body: 'Los adverbios de frecuencia van antes del verbo principal: "I always drink", "He never drinks". "Never" ya es negativo: no agregues "not".',
            example: { en: 'He never drinks soda.', es: 'Él nunca bebe gaseosa.' },
            contrast: '✗ He doesn\'t never drink soda → ✓ He never drinks soda'
        },
        20: {
            title: 'Have to, must, should',
            body: '"Have to" y "must" expresan obligación; "should" da un consejo (deberías). Después de "must", "should" o "can" el verbo va sin "to".',
            example: { en: 'You should rest more.', es: 'Deberías descansar más.' },
            contrast: '✗ You should to rest → ✓ You should rest'
        },
        21: {
            title: 'Viajes: "book" y "luggage"',
            body: '"Book" como verbo es reservar: "book a flight". "Luggage" no tiene plural: "my luggage is", nunca "luggages". "Leave" es salir de un lugar.',
            example: { en: 'I need to book a flight to Lima.', es: 'Necesito reservar un vuelo a Lima.' },
            contrast: '✗ My luggages are heavy → ✓ My luggage is heavy'
        },
        22: {
            title: 'Frases fijas de oficina',
            body: 'Algunas expresiones llevan una preposición fija: "fill out a form", "on vacation" (de vacaciones), "talk to" alguien. "Next Friday" va sin "the".',
            example: { en: 'My colleague is on vacation.', es: 'Mi colega está de vacaciones.' },
            contrast: '✗ in vacation → ✓ on vacation'
        },
        23: {
            title: 'Síntomas: "I have a headache"',
            body: 'El dolor se "tiene": "I have a headache". Para cómo te sientes usa "feel": "She feels much better now". "Twice a day" es dos veces al día.',
            example: { en: 'I have a headache today.', es: 'Me duele la cabeza hoy.' },
            contrast: '✗ It hurts me the head → ✓ I have a headache'
        },
        24: {
            title: 'Al teléfono: frases hechas',
            body: 'Para pedir hablar con alguien di "Could I speak to…?". "Hold on" es "espere". "Call back" es devolver la llamada: "I\'ll call you back later".',
            example: { en: 'Could I speak to Mr. Díaz?', es: '¿Podría hablar con el señor Díaz?' }
        },
        25: {
            title: '"Much" o "many"',
            body: '"Many" va con lo que se puede contar (people, tickets) y "much" con lo que no (traffic, time). "How much does this cost?" pregunta un precio.',
            example: { en: 'How many people can fit?', es: '¿Cuánta gente cabe?' },
            contrast: '✗ How much people → ✓ How many people'
        },
        26: {
            title: 'Planes: "Let\'s" y "I\'d rather"',
            body: '"Let\'s" + verbo propone hacer algo juntos: "Let\'s meet". "I\'d rather" + verbo dice qué prefieres. "Might" marca un plan posible, no seguro.',
            example: { en: 'I\'d rather stay home tonight.', es: 'Prefiero quedarme en casa esta noche.' },
            contrast: '✗ I\'d rather to stay → ✓ I\'d rather stay'
        },
        27: {
            title: 'Lo que sabes hacer',
            body: 'Usa "can" o "know how to" + verbo: "Do you know how to use this app?". Cuando un verbo es el sujeto lleva -ing: "Reading is my favorite hobby".',
            example: { en: 'Do you know how to use this app?', es: '¿Sabes cómo usar esta aplicación?' },
            contrast: '✗ Read is my favorite hobby → ✓ Reading is my favorite hobby'
        },
        28: {
            title: 'Dar tu opinión',
            body: '"I think" introduce lo que crees. "Agree" ya es un verbo: "I agree", "I don\'t agree", sin "am". "That sounds…" sirve para reaccionar a una idea.',
            example: { en: 'I don\'t really agree with that.', es: 'No estoy muy de acuerdo con eso.' },
            contrast: '✗ I am not agree → ✓ I don\'t agree'
        },
        29: {
            title: 'Repaso: acciones interrumpidas',
            body: 'Usa was o were + -ing para la acción larga y el pasado simple para la que la interrumpe. Para algo que empezó antes y sigue: "has been learning … for".',
            example: { en: 'I was working when you called me.', es: 'Estaba trabajando cuando me llamaste.' },
            contrast: '✗ She is learning English since a year → ✓ She has been learning English for a year'
        },
        30: {
            title: 'Presente perfecto: have + participio',
            body: 'Une pasado y presente: have o has + participio. Va con "just", "already", "ever", y con "for" o "since" para algo que sigue: "I have lived here for five years".',
            example: { en: 'Have you ever eaten sushi?', es: '¿Alguna vez has comido sushi?' },
            contrast: '✗ I live here since five years → ✓ I have lived here for five years'
        },
        31: {
            title: '¿Pasado simple o perfecto?',
            body: 'Con un momento terminado (yesterday, in 2019) usa pasado simple. Con un período que sigue abierto (this year) o sin fecha, usa presente perfecto.',
            example: { en: 'I have lost my keys twice this year.', es: 'He perdido mis llaves dos veces este año.' },
            contrast: '✗ I have lost my keys yesterday → ✓ I lost my keys yesterday'
        },
        32: {
            title: 'Primera condicional: if + presente',
            body: 'Para algo posible en el futuro: "if" + presente y "will" en la otra parte. Después de "if" no va "will": "If it rains, we will stay home".',
            example: { en: 'If it rains, we will stay home.', es: 'Si llueve, nos quedaremos en casa.' },
            contrast: '✗ If it will rain → ✓ If it rains'
        },
        33: {
            title: 'Voz pasiva: be + participio',
            body: 'La pasiva usa "be" en el tiempo que necesites + participio: "was written", "is being repaired". Quien hace la acción va con "by". Así se traduce "se habla".',
            example: { en: 'The report was written by Ana.', es: 'El informe fue escrito por Ana.' },
            contrast: '✗ English speaks everywhere → ✓ English is spoken everywhere'
        },
        34: {
            title: 'Verbo + -ing o verbo + to',
            body: 'Algunos verbos piden -ing (enjoy, avoid) y otros "to" + verbo (decide, plan). Apréndelos con su pareja: "enjoy reading", "decide to move".',
            example: { en: 'I enjoy reading before bed.', es: 'Disfruto leer antes de dormir.' },
            contrast: '✗ I enjoy to read → ✓ I enjoy reading'
        },
        35: {
            title: 'Phrasal verbs: verbo + partícula',
            body: 'La partícula cambia el sentido del verbo: "turn off" es apagar, "look for" es buscar, "show up" es llegar o aparecer. Apréndelos como una sola unidad.',
            example: { en: 'I need to look for my phone.', es: 'Necesito buscar mi teléfono.' }
        },
        36: {
            title: 'Phrasal verbs de trabajo',
            body: '"Work out" es resolver, "find out" es enterarse y "set up" es organizar. Algunos llevan dos partículas: "run out of" es quedarse sin algo.',
            example: { en: 'He ran out of coffee.', es: 'Se quedó sin café.' }
        },
        37: {
            title: 'Comparar: -er, more, as … as',
            body: 'Los adjetivos cortos agregan -er (cheaper) y los largos usan "more" (more experienced), siempre con "than". Para igualdad: "as fast as".',
            example: { en: 'This one is cheaper than that one.', es: 'Este es más barato que ese.' },
            contrast: '✗ more cheap than → ✓ cheaper than'
        },
        38: {
            title: 'Superlativos: the most, the best',
            body: 'El superlativo lleva "the": "the hardest", "the most useful". Irregulares: good → the best, bad → the worst. "One of the best" va con plural.',
            example: { en: 'That\'s the worst mistake of the year.', es: 'Ese es el peor error del año.' },
            contrast: '✗ one of the best teacher → ✓ one of the best teachers'
        },
        39: {
            title: 'Fórmulas de email profesional',
            body: 'El email formal usa frases fijas: "I\'m writing to…" para abrir y "I look forward to hearing from you" para cerrar. "Look forward to" va con -ing.',
            example: { en: 'I look forward to hearing from you.', es: 'Espero tener noticias tuyas.' },
            contrast: '✗ I look forward to hear from you → ✓ I look forward to hearing from you'
        },
        40: {
            title: 'Guiar una presentación',
            body: 'Usa frases que marcan el camino: "Let me explain…" para empezar, "Let\'s move on to…" para cambiar de tema e "In summary…" para cerrar.',
            example: { en: 'Let\'s move on to the next topic.', es: 'Pasemos al siguiente tema.' }
        },
        41: {
            title: '"Supposed to" y horarios fijos',
            body: '"Be supposed to" indica lo que se espera o está acordado. Para horarios fijos se usa presente simple, aunque sea futuro: "The train leaves in ten minutes".',
            example: { en: 'She\'s supposed to arrive by noon.', es: 'Se supone que ella llega antes del mediodía.' }
        },
        42: {
            title: 'Pass, fail, take: vida académica',
            body: '"Pass" es aprobar y "fail" es reprobar. "Take a class" es tomar un curso. "Approve" no se usa para exámenes: significa autorizar.',
            example: { en: 'She passed all her courses.', es: 'Ella aprobó todos sus cursos.' },
            contrast: '✗ I approved the exam → ✓ I passed the exam'
        },
        43: {
            title: 'Hablar de problemas',
            body: '"Fix" es arreglar, "go wrong" es salir mal y "run into" un problema es encontrárselo sin esperarlo. "Take care of it" es encargarse.',
            example: { en: 'Something went wrong yesterday.', es: 'Algo salió mal ayer.' }
        },
        44: {
            title: 'Repaso: mirar al pasado',
            body: '"Should have" + participio expresa arrepentimiento: "We should have left earlier". "If you had asked, I would have helped" habla de algo que no pasó.',
            example: { en: 'We should have left earlier.', es: 'Deberíamos habernos ido antes.' }
        },
        45: {
            title: 'Pasado perfecto: had + participio',
            body: '"Had" + participio marca lo que pasó antes de otro hecho pasado: "We had already left when he arrived". Con "since" y algo que sigue, usa presente perfecto.',
            example: { en: 'We had already left when he arrived.', es: 'Ya nos habíamos ido cuando él llegó.' },
            contrast: '✗ I know him since childhood → ✓ I\'ve known him since childhood'
        },
        46: {
            title: 'Condicionales irreales',
            body: 'Presente irreal: if + pasado, would + verbo. Pasado irreal: if + had + participio, would have + participio. "If I were you" usa "were" con todas las personas.',
            example: { en: 'If I had studied, I would have passed.', es: 'Si hubiera estudiado, habría aprobado.' },
            contrast: '✗ If I would have more time → ✓ If I had more time'
        },
        47: {
            title: 'Pasiva con modales e impersonal',
            body: 'Con modales: modal + be + participio ("must be reported"). "It is widely believed that…" es la forma impersonal y formal de "se cree que…".',
            example: { en: 'Mistakes must be reported immediately.', es: 'Los errores deben reportarse de inmediato.' }
        },
        48: {
            title: 'Estilo indirecto: un tiempo atrás',
            body: 'Al contar lo que alguien dijo, el verbo retrocede un tiempo: "will" pasa a "would", "is" a "was". "Tell" lleva a quién: "told me"; "say" no.',
            example: { en: 'He told me he would call later.', es: 'Él me dijo que llamaría después.' },
            contrast: '✗ He said me → ✓ He told me'
        },
        49: {
            title: '"Although" o "however"',
            body: '"Although" y "even though" unen dos ideas dentro de una oración. "However" y "nevertheless" abren una oración nueva y van seguidos de coma.',
            example: { en: 'Although it was raining, we went outside.', es: 'Aunque llovía, salimos afuera.' }
        },
        50: {
            title: '"Because" o "because of"',
            body: '"Because of" y "due to" van con sustantivo; "because" y "since" van con oración completa. "Therefore" y "as a result" introducen la consecuencia.',
            example: { en: 'The flight was canceled because of the storm.', es: 'El vuelo fue cancelado por la tormenta.' },
            contrast: '✗ because the storm → ✓ because of the storm'
        },
        51: {
            title: 'Phrasal verbs con matiz',
            body: 'Equivalen a verbos más formales: "rule out" es descartar, "put up with" es tolerar y "take over" es asumir el control. "Come up with" es idear algo.',
            example: { en: 'Let\'s rule out that option for now.', es: 'Descartemos esa opción por ahora.' }
        },
        52: {
            title: 'Registro formal escrito',
            body: 'El inglés formal usa fórmulas fijas en vez de frases directas: "We regret to inform you" para malas noticias, "do not hesitate to contact me" para ofrecer ayuda.',
            example: { en: 'Please do not hesitate to contact me.', es: 'No dude en contactarme.' }
        },
        53: {
            title: 'Registro informal hablado',
            body: 'Entre colegas se habla corto y relajado: "I didn\'t catch that" (no te entendí), "My bad" (mi error) y "get" con el sentido de entender.',
            example: { en: 'Sorry, I didn\'t catch that.', es: 'Perdón, no entendí eso.' }
        },
        54: {
            title: 'Argumentar con firmeza y matiz',
            body: '"There\'s a strong case for…" presenta un argumento a favor. "I\'d argue…" suaviza tu postura sin debilitarla. "On balance" concluye sopesando pros y contras.',
            example: { en: 'I\'d argue the opposite is true.', es: 'Sostendría que lo contrario es cierto.' },
            contrast: '✗ That claim lacks of evidence → ✓ That claim lacks evidence'
        },
        55: {
            title: 'Describir los pasos de un proceso',
            body: '"Once" + presente marca el paso previo: "Once the payment clears, we ship". La pasiva en presente dice qué se hace sin decir quién: "Data is stored".',
            example: { en: 'Once the payment clears, we ship the order.', es: 'Una vez que el pago se confirma, enviamos el pedido.' },
            contrast: '✗ Once the payment will clear → ✓ Once the payment clears'
        },
        56: {
            title: 'Negociar sin cerrar puertas',
            body: '"Meet halfway" es que ambos cedan hasta un punto medio. "Flexible on" indica dónde puedes ceder y "below what we can accept" marca tu límite con cortesía.',
            example: { en: 'We can meet you halfway.', es: 'Podemos llegar a un punto medio contigo.' },
            contrast: '✗ discuss about the details → ✓ discuss the details'
        },
        57: {
            title: 'Cifras: "by" marca la diferencia',
            body: '"By" indica cuánto cambió algo: "grew by fifteen percent", "reduced costs by a third". "Roughly" es aproximadamente y "double" como verbo es duplicarse.',
            example: { en: 'Sales grew by fifteen percent.', es: 'Las ventas crecieron un quince por ciento.' },
            contrast: '✗ grew in fifteen percent → ✓ grew by fifteen percent'
        },
        58: {
            title: '"Backup" y "back up"',
            body: '"Backup" junto es sustantivo (a backup plan); "back up" separado es el verbo (back up the file). "A risk of" va con sustantivo o con -ing.',
            example: { en: 'Make sure you back up the file.', es: 'Asegúrate de hacer una copia de seguridad del archivo.' }
        },
        59: {
            title: 'Repaso: "Had I known"',
            body: '"Had I known" es la forma formal de "If I had known": se omite "if" y "had" pasa adelante. "Looking back" abre la oración dando contexto.',
            example: { en: 'Had I known, I\'d have told you.', es: 'Si lo hubiera sabido, te lo habría dicho.' }
        },
        60: {
            title: 'Condicionales mezclados',
            body: 'Mezclan tiempos: una condición pasada con un resultado presente ("If I had accepted…, I\'d be living abroad now"). "Were we to…" y "Should it…" son variantes formales.',
            example: { en: 'If I had accepted the offer, I\'d be living abroad now.', es: 'Si hubiera aceptado la oferta, estaría viviendo en el extranjero ahora.' }
        },
        61: {
            title: 'Inversión tras palabras negativas',
            body: 'Si abres con "rarely", "seldom", "not only" u "on no account", el auxiliar va antes del sujeto, como en una pregunta. Suena enfático y formal.',
            example: { en: 'Rarely have I seen such commitment.', es: 'Rara vez he visto tanto compromiso.' },
            contrast: '✗ Rarely I have seen → ✓ Rarely have I seen'
        },
        62: {
            title: 'Pasiva formal e impersonal',
            body: '"It has been decided that…" y "He is said to be…" sacan al autor de la frase. Son típicas de informes y comunicados donde importa el hecho, no quién lo dice.',
            example: { en: 'He is said to be the leading candidate.', es: 'Se dice que es el candidato principal.' }
        },
        63: {
            title: 'Deducir el pasado: must have',
            body: '"Must have" + participio es una deducción casi segura; "can\'t have" la descarta; "might have" es una posibilidad. "Should have" expresa un reproche.',
            example: { en: 'She must have forgotten about it.', es: 'Ella se debe haber olvidado de eso.' }
        },
        64: {
            title: 'Elegir la palabra exacta',
            body: 'En nivel avanzado cuenta la palabra precisa: "inconclusive" en vez de "not clear", "differ" en vez de "are different". "Plausible but flawed" reconoce y critica a la vez.',
            example: { en: 'The results were inconclusive.', es: 'Los resultados no fueron concluyentes.' }
        },
        65: {
            title: 'Hedging: suavizar afirmaciones',
            body: 'Para no sonar tajante agrega atenuadores: "I\'d say", "roughly", "to some extent", "seems". "I wouldn\'t rule it out" afirma sin comprometerte del todo.',
            example: { en: 'It might, to some extent, be true.', es: 'Podría, en cierta medida, ser cierto.' }
        },
        66: {
            title: 'Conceder antes de contradecir',
            body: '"Granted" y "admittedly" reconocen un punto del otro lado. "That said" o "be that as it may" introducen tu objeción sin ignorar lo anterior.',
            example: { en: 'That said, the risks are real.', es: 'Dicho eso, los riesgos son reales.' }
        },
        67: {
            title: '"Need" + -ing con sentido pasivo',
            body: '"Revenue streams need diversifying" equivale a "need to be diversified". Fíjate también en verbos con preposición fija: "capitalize on" una oportunidad.',
            example: { en: 'Revenue streams need diversifying.', es: 'Las fuentes de ingreso necesitan diversificarse.' }
        },
        68: {
            title: 'Sustantivos abstractos sin "the"',
            body: 'Para hablar en general, los sustantivos abstractos y los plurales van sin artículo: "Inequality remains…", "Traditions evolve…". En español sí usamos "la" o "las".',
            example: { en: 'Traditions evolve rather than disappear.', es: 'Las tradiciones evolucionan en vez de desaparecer.' },
            contrast: '✗ The inequality remains the defining issue → ✓ Inequality remains the defining issue'
        },
        69: {
            title: 'Tendencias: "has reshaped"',
            body: 'El presente perfecto muestra un cambio con efecto actual: "Automation has reshaped…". "Continue to" + verbo describe una tendencia que sigue en curso.',
            example: { en: 'Automation has reshaped entry-level jobs.', es: 'La automatización ha redefinido los trabajos de nivel inicial.' }
        },
        70: {
            title: 'Ironía: decir lo contrario',
            body: 'En inglés la ironía es frecuente y seca: "Great." o "Shocking." pueden significar lo opuesto. El tono y el contexto deciden el sentido, no las palabras.',
            example: { en: 'So, we\'re behind schedule. Shocking.', es: 'Así que vamos atrasados. Sorprendente.' }
        },
        71: {
            title: 'Idioms: el sentido va completo',
            body: 'Un idiom se entiende entero, no palabra por palabra: "call it a day" es dar por terminado el trabajo del día y "on the fence" es estar indeciso.',
            example: { en: 'That\'s easier said than done.', es: 'Eso es más fácil de decir que de hacer.' }
        },
        72: {
            title: 'Repaso: estructuras de nivel C1',
            body: 'Este repaso junta inversión ("Had the deadline been extended…"), oraciones con "what" para dar énfasis ("What the report fails to address is…") y concesiones breves.',
            example: { en: 'What the report fails to address is the long-term cost.', es: 'Lo que el informe no aborda es el costo a largo plazo.' }
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TIPS;
        return;
    }

    var G = window.DailyGame;
    if (!G) return;

    function seenMap() {
        var st = G.store('tips');
        if (!st.seen || typeof st.seen !== 'object') st.seen = {};
        return st.seen;
    }

    function markSeen(index) {
        try {
            seenMap()[index] = 1;
            G.save();
        } catch (e) { /* storage failure must not block the lesson */ }
    }

    G.registerQueueTransform(function (queue, lesson, lessonIndex) {
        if (typeof lessonIndex !== 'number' || !TIPS[lessonIndex]) return queue;
        if (!lesson || !lesson.sentences || !lesson.sentences.length) return queue;
        if (seenMap()[lessonIndex]) return queue;
        for (var i = 0; i < queue.length; i++) {
            if (queue[i] && (queue[i].type === 'tip' || queue[i].tag === 'tip')) return queue;
        }
        queue.unshift({
            sentence: lesson.sentences[0],
            type: 'tip',
            graded: false,
            tag: 'tip',
            data: { lessonIndex: lessonIndex }
        });
        return queue;
    });

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
    }

    function contrastRow(mark, label, text, cls) {
        var row = el('p', 'tips-contrast-row ' + cls);
        var m = el('span', 'tips-mark', mark);
        m.setAttribute('aria-hidden', 'true');
        row.appendChild(m);
        row.appendChild(el('span', 'tips-sr', label));
        row.appendChild(el('span', 'tips-contrast-text', text));
        return row;
    }

    function renderContrast(str) {
        var parts = String(str).split('→');
        if (parts.length !== 2) return null;
        var bad = parts[0].replace('✗', '').trim();
        var good = parts[1].replace('✓', '').trim();
        var box = el('div', 'tips-contrast');
        box.appendChild(el('p', 'tips-section', 'Error común'));
        box.appendChild(contrastRow('✗', 'Incorrecto: ', bad, 'tips-bad'));
        box.appendChild(contrastRow('✓', 'Correcto: ', good, 'tips-good'));
        return box;
    }

    G.registerExercise('tip', function (sentence, item) {
        var index = item && item.data && typeof item.data.lessonIndex === 'number'
            ? item.data.lessonIndex
            : (G.session ? G.session.index : -1);
        var tip = TIPS[index];
        if (!tip) throw new Error('no tip for lesson ' + index);

        var card = el('section', 'tips-card');
        card.setAttribute('aria-labelledby', 'tips-title');
        card.appendChild(el('p', 'tips-label', 'Antes de empezar'));
        var h = el('h2', 'tips-title', tip.title);
        h.id = 'tips-title';
        card.appendChild(h);
        card.appendChild(el('p', 'tips-body', tip.body));

        var fill = typeof G.personalize === 'function' ? G.personalize : function (t) { return t; };
        var exEn = fill(tip.example.en);
        var ex = el('div', 'tips-example');
        ex.appendChild(el('p', 'tips-section', 'Ejemplo'));
        var en = el('p', 'tips-en', exEn);
        en.setAttribute('lang', 'en');
        ex.appendChild(en);
        ex.appendChild(el('p', 'tips-es', fill(tip.example.es)));
        ex.appendChild(G.speakButton(exEn));
        card.appendChild(ex);

        if (tip.contrast) {
            var c = renderContrast(tip.contrast);
            if (c) card.appendChild(c);
        }

        G.exerciseArea.appendChild(card);
        markSeen(index);

        var btn = G.checkBtn;
        btn.disabled = false;
        btn.textContent = 'Empezar';
        btn.onclick = G.advance;
    });
})();
