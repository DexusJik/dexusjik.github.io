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
            example: { en: 'My name is Rodrigo and I am from Valparaíso.', es: 'Me llamo Rodrigo y soy de Valparaíso.' },
            contrast: '✗ I am of Chile → ✓ I am from Chile'
        },
        1: {
            title: 'Tu familia: "my" + "is"',
            body: '"My" sirve igual para todos: my father, my mother, my sister. Con una profesión el inglés agrega "a": "My father is a teacher" (mi padre es profesor).',
            example: { en: 'My uncle is an electrician.', es: 'Mi tío es electricista.' },
            contrast: '✗ My father is teacher → ✓ My father is a teacher'
        },
        2: {
            title: 'La edad va con "to be"',
            body: 'En inglés la edad no se "tiene", se "es": "I am 25 years old". Para cosas y personas sí usas "have": "I have one brother".',
            example: { en: 'My grandmother turned seventy last month.', es: 'Mi abuela cumple setenta años este mes.' },
            contrast: '✗ I have 25 years → ✓ I am 25 years old'
        },
        3: {
            title: 'El color va antes del sustantivo',
            body: 'El adjetivo va antes del sustantivo y nunca cambia: "a red car", "red cars". Después de "is" va solo: "My house is white".',
            example: { en: 'She painted the wall yellow.', es: 'Ella pintó la pared de amarillo.' },
            contrast: '✗ a car red → ✓ a red car'
        },
        4: {
            title: 'Gustos: "I like" y "Do you like?"',
            body: '"Me gusta" se dice "I like": tú eres el sujeto. Para preguntar usa "Do you like…?". Con she o he el verbo lleva -s: "She drinks".',
            example: { en: 'Do you like spicy food?', es: '¿Te gusta la comida picante?' },
            contrast: '✗ She drink a lot of water → ✓ She drinks a lot of water'
        },
        5: {
            title: '"There is" para decir "hay"',
            body: '"Hay" se dice "There is" cuando es una cosa: "There is a table in the room". Para describir usa "is" + adjetivo: "The door is closed".',
            example: { en: 'There is a bakery on my street.', es: 'Hay una panadería en mi calle.' },
            contrast: '✗ Is a table in the room → ✓ There is a table in the room'
        },
        6: {
            title: 'Ubicar lugares: near, next to',
            body: '"Next to" es "al lado de", "near" es "cerca de" (sin "of") y "far from" es "lejos de". Para ir a un lugar usa "go to": "I go to the market".',
            example: { en: 'The pharmacy is next to the school.', es: 'La farmacia está al lado del colegio.' },
            contrast: '✗ near of the beach → ✓ near the beach'
        },
        7: {
            title: 'Rutinas en presente simple',
            body: 'Para hábitos usa el presente simple: "I wake up at seven". Con he, she o it agrega -s al verbo: "She works at a hospital".',
            example: { en: 'My brother works at a bakery.', es: 'Mi hermano trabaja en una panadería.' },
            contrast: '✗ She work at a hospital → ✓ She works at a hospital'
        },
        8: {
            title: 'La hora: "at" + número',
            body: 'Para decir a qué hora pasa algo usa "at": "at ten", "at three". Para decir la hora empieza con "It is": "It is half past twelve" (son las doce y media).',
            example: { en: 'It is quarter past six.', es: 'Son las seis y cuarto.' }
        },
        9: {
            title: '"Can": poder y saber hacer algo',
            body: '"Can" va con el verbo sin "to" y no cambia con she o he: "She can play". También significa "saber": "I can swim" es "sé nadar". Negativo: "cannot".',
            example: { en: 'My cousin can play the drums.', es: 'Mi prima sabe tocar el tambor.' },
            contrast: '✗ I can to swim → ✓ I can swim'
        },
        10: {
            title: 'Pasado simple: -ed e irregulares',
            body: 'Los verbos regulares agregan -ed: "played". Muchos verbos comunes son irregulares: go → went, buy → bought. "Was" es el pasado de "am" e "is".',
            example: { en: 'They rented a used sofa last month.', es: 'Arrendaron un sofá usado el mes pasado.' }
        },
        11: {
            title: 'El clima empieza con "It"',
            body: 'En inglés toda oración necesita sujeto, por eso el clima empieza con "it": "It is windy", "It is raining" (está lloviendo).',
            example: { en: 'It is snowing in the mountains.', es: 'Está nevando en las montañas.' },
            contrast: '✗ Is raining → ✓ It is raining'
        },
        12: {
            title: 'On, in, under: dónde está algo',
            body: '"On" es encima de una superficie, "in" es dentro (de un pueblo, una caja) y "under" es debajo. "Wait for me" lleva "for": esperar a alguien.',
            example: { en: 'Your keys are in my jacket pocket.', es: 'Tus llaves están en el bolsillo de mi chaqueta.' },
            contrast: '✗ Wait me here → ✓ Wait for me here'
        },
        13: {
            title: '"An office" y "a lot of work"',
            body: 'Usa "an" antes de sonido vocal: "an office". "Work" no se cuenta: "a lot of work", nunca "works". "In five minutes" es "dentro de cinco minutos".',
            example: { en: 'We have an exam in five minutes.', es: 'Tenemos un examen en cinco minutos.' },
            contrast: '✗ I have a lot of works → ✓ I have a lot of work'
        },
        14: {
            title: 'Repaso: presente simple y "need to"',
            body: 'Este repaso junta lo básico: presente simple ("She lives", "The kids play") y "need to" + verbo para lo que tienes que hacer: "I need to buy some milk".',
            example: { en: 'I need to call the plumber tonight.', es: 'Necesito llamar al plomero esta noche.' }
        },
        15: {
            title: 'Ahora mismo: am/is/are + -ing',
            body: 'Para algo que está pasando ahora usa am, is o are + verbo con -ing: "I am reading". Sin "am" la oración queda incompleta.',
            example: { en: 'They are painting the fence.', es: 'Ellos están pintando el cerco.' },
            contrast: '✗ I reading a book → ✓ I am reading a book'
        },
        16: {
            title: 'Pasado: "did" en preguntas',
            body: 'En afirmativo el verbo va en pasado: "I called". En preguntas y negativas el pasado lo lleva "did" y el verbo vuelve a su forma base: "They didn\'t come".',
            example: { en: 'Did you pay the rent?', es: '¿Pagaste el arriendo?' },
            contrast: '✗ They didn\'t came → ✓ They didn\'t come'
        },
        17: {
            title: 'There is, there are, there was',
            body: '"There is" va con singular y "there are" con plural. En pasado: "there was" y "there were". "There isn\'t any milk left" significa "no queda leche".',
            example: { en: 'There are two elevators in this building.', es: 'Hay dos ascensores en este edificio.' },
            contrast: '✗ There is two chairs → ✓ There are two chairs'
        },
        18: {
            title: 'Adjetivos: "boring" no es "bored"',
            body: 'Los adjetivos con -ing describen lo que causa la sensación: "The film was boring". Después de "look" va un adjetivo: "looks expensive" (se ve caro).',
            example: { en: 'The workshop was boring.', es: 'El taller fue aburrido.' },
            contrast: '✗ The film was bored → ✓ The film was boring'
        },
        19: {
            title: 'Always, never: antes del verbo',
            body: 'Los adverbios de frecuencia van antes del verbo principal: "I always drink", "He never drinks". "Never" ya es negativo: no agregues "not".',
            example: { en: 'He always pays for the tickets.', es: 'Él siempre paga los boletas.' },
            contrast: '✗ He doesn\'t never drink soda → ✓ He never drinks soda'
        },
        20: {
            title: 'Have to, must, should',
            body: '"Have to" y "must" expresan obligación; "should" da un consejo (deberías). Después de "must", "should" o "can" el verbo va sin "to".',
            example: { en: 'You must wear a helmet when you ride.', es: 'Debes usar casco cuando andas en bici.' },
            contrast: '✗ You should to rest → ✓ You should rest'
        },
        21: {
            title: 'Viajes: "book" y "luggage"',
            body: '"Book" como verbo es reservar: "book a flight". "Luggage" no tiene plural: "my luggage is", nunca "luggages". "Leave" es salir de un lugar.',
            example: { en: 'She booked a room in Buenos Aires.', es: 'Ella reservó una habitación en Buenos Aires.' },
            contrast: '✗ My luggages are heavy → ✓ My luggage is heavy'
        },
        22: {
            title: 'Frases fijas de oficina',
            body: 'Algunas expresiones llevan una preposición fija: "fill out a form", "on vacation" (de vacaciones), "talk to" alguien. "Next Friday" va sin "the".',
            example: { en: 'Please talk to the front desk.', es: 'Por favor habla con la recepción.' },
            contrast: '✗ in vacation → ✓ on vacation'
        },
        23: {
            title: 'Síntomas: "I have a headache"',
            body: 'El dolor se "tiene": "I have a headache". Para cómo te sientes usa "feel": "She feels much better now". "Twice a day" es dos veces al día.',
            example: { en: 'I have a sore throat.', es: 'Me duele la garganta.' },
            contrast: '✗ It hurts me the head → ✓ I have a headache'
        },
        24: {
            title: 'Al teléfono: frases hechas',
            body: 'Para pedir hablar con alguien di "Could I speak to…?". "Hold on" es "espere". "Call back" es devolver la llamada: "I\'ll call you back later".',
            example: { en: 'Could I speak to the manager, please?', es: '¿Podría hablar con el gerente, por favor?' }
        },
        25: {
            title: '"Much" o "many"',
            body: '"Many" va con lo que se puede contar (people, tickets) y "much" con lo que no (traffic, time). "How much does this cost?" pregunta un precio.',
            example: { en: 'How many applicants were there?', es: '¿Cuántos postulantes hubo?' },
            contrast: '✗ How much people → ✓ How many people'
        },
        26: {
            title: 'Planes: "Let\'s" y "I\'d rather"',
            body: '"Let\'s" + verbo propone hacer algo juntos: "Let\'s meet". "I\'d rather" + verbo dice qué prefieres. "Might" marca un plan posible, no seguro.',
            example: { en: 'Let\'s take a short break.', es: 'Hagamos una pausa corta.' },
            contrast: '✗ I\'d rather to stay → ✓ I\'d rather stay'
        },
        27: {
            title: 'Lo que sabes hacer',
            body: 'Usa "can" o "know how to" + verbo: "Do you know how to use this app?". Cuando un verbo es el sujeto lleva -ing: "Reading is my favorite hobby".',
            example: { en: 'Cooking for friends is my hobby.', es: 'Cocinar para amigos es mi pasatiempo.' },
            contrast: '✗ Read is my favorite hobby → ✓ Reading is my favorite hobby'
        },
        28: {
            title: 'Dar tu opinión',
            body: '"I think" introduce lo que crees. "Agree" ya es un verbo: "I agree", "I don\'t agree", sin "am". "That sounds…" sirve para reaccionar a una idea.',
            example: { en: 'I agree, but I would add one thing.', es: 'Estoy de acuerdo, pero agregaría una cosa.' },
            contrast: '✗ I am not agree → ✓ I don\'t agree'
        },
        29: {
            title: 'Repaso: acciones interrumpidas',
            body: 'Usa was o were + -ing para la acción larga y el pasado simple para la que la interrumpe. Para algo que empezó antes y sigue: "has been learning … for".',
            example: { en: 'She was cooking when the bell rang.', es: 'Ella estaba cocinando cuando sonó el timbre.' },
            contrast: '✗ She is learning English since a year → ✓ She has been learning English for a year'
        },
        30: {
            title: 'Presente perfecto: have + participio',
            body: 'Une pasado y presente: have o has + participio. Va con "just", "already", "ever", y con "for" o "since" para algo que sigue: "I have lived here for five years".',
            example: { en: 'I have just finished my presentation.', es: 'Acabo de terminar mi presentación.' },
            contrast: '✗ I live here since five years → ✓ I have lived here for five years'
        },
        31: {
            title: '¿Pasado simple o perfecto?',
            body: 'Con un momento terminado (yesterday, in 2019) usa pasado simple. Con un período que sigue abierto (this year) o sin fecha, usa presente perfecto.',
            example: { en: 'I have not written in Spanish for months.', es: 'No he escrito en español hace meses.' },
            contrast: '✗ I have lost my keys yesterday → ✓ I lost my keys yesterday'
        },
        32: {
            title: 'Primera condicional: if + presente',
            body: 'Para algo posible en el futuro: "if" + presente y "will" en la otra parte. Después de "if" no va "will": "If it rains, we will stay home".',
            example: { en: 'If you finish early, we can grab a coffee.', es: 'Si terminas temprano, podemos tomar un café.' },
            contrast: '✗ If it will rain → ✓ If it rains'
        },
        33: {
            title: 'Voz pasiva: be + participio',
            body: 'La pasiva usa "be" en el tiempo que necesites + participio: "was written", "is being repaired". Quien hace la acción va con "by". Así se traduce "se habla".',
            example: { en: 'The bridge was built in 1902.', es: 'El puente fue construido en 1902.' },
            contrast: '✗ English speaks everywhere → ✓ English is spoken everywhere'
        },
        34: {
            title: 'Verbo + -ing o verbo + to',
            body: 'Algunos verbos piden -ing (enjoy, avoid) y otros "to" + verbo (decide, plan). Apréndelos con su pareja: "enjoy reading", "decide to move".',
            example: { en: 'I avoid eating late.', es: 'Evito comer tarde.' },
            contrast: '✗ I enjoy to read → ✓ I enjoy reading'
        },
        35: {
            title: 'Phrasal verbs: verbo + partícula',
            body: 'La partícula cambia el sentido del verbo: "turn off" es apagar, "look for" es buscar, "show up" es llegar o aparecer. Apréndelos como una sola unidad.',
            example: { en: 'Could you show up ten minutes earlier?', es: '¿Podrías llegar diez minutos antes?' }
        },
        36: {
            title: 'Phrasal verbs de trabajo',
            body: '"Work out" es resolver, "find out" es enterarse y "set up" es organizar. Algunos llevan dos partículas: "run out of" es quedarse sin algo.',
            example: { en: 'We ran out of batteries.', es: 'Nos quedamos sin baterías.' }
        },
        37: {
            title: 'Comparar: -er, more, as … as',
            body: 'Los adjetivos cortos agregan -er (cheaper) y los largos usan "more" (more experienced), siempre con "than". Para igualdad: "as fast as".',
            example: { en: 'This tent is cheaper than that one, and it works just as well.', es: 'Esta carpa es más barata que esa y funciona igual de bien.' },
            contrast: '✗ more cheap than → ✓ cheaper than'
        },
        38: {
            title: 'Superlativos: the most, the best',
            body: 'El superlativo lleva "the": "the hardest", "the most useful". Irregulares: good → the best, bad → the worst. "One of the best" va con plural.',
            example: { en: 'That\'s the worst winter in decades.', es: 'Ese es el peor invierno en décadas.' },
            contrast: '✗ one of the best teacher → ✓ one of the best teachers'
        },
        39: {
            title: 'Fórmulas de email profesional',
            body: 'El email formal usa frases fijas: "I\'m writing to…" para abrir y "I look forward to hearing from you" para cerrar. "Look forward to" va con -ing.',
            example: { en: 'I am writing to attach the signed contract.', es: 'Le escribo para adjuntar el contrato firmado.' },
            contrast: '✗ I look forward to hear from you → ✓ I look forward to hearing from you'
        },
        40: {
            title: 'Guiar una presentación',
            body: 'Usa frases que marcan el camino: "Let me explain…" para empezar, "Let\'s move on to…" para cambiar de tema e "In summary…" para cerrar.',
            example: { en: 'Overall, the evidence points elsewhere.', es: 'En conjunto, la evidencia apunta a otro lado.' }
        },
        41: {
            title: '"Supposed to" y horarios fijos',
            body: '"Be supposed to" indica lo que se espera o está acordado. Para horarios fijos se usa presente simple, aunque sea futuro: "The train leaves in ten minutes".',
            example: { en: 'I\'m supposed to lock the gate every evening.', es: 'Supongo que tengo que cerrar la reja todas las noches.' }
        },
        42: {
            title: 'Pass, fail, take: vida académica',
            body: '"Pass" es aprobar y "fail" es reprobar. "Take a class" es tomar un curso. "Approve" no se usa para exámenes: significa autorizar.',
            example: { en: 'He dropped the course and retook it in winter.', es: 'Dejó el curso y lo volvió a tomar en invierno.' },
            contrast: '✗ I approved the exam → ✓ I passed the exam'
        },
        43: {
            title: 'Hablar de problemas',
            body: '"Fix" es arreglar, "go wrong" es salir mal y "run into" un problema es encontrárselo sin esperarlo. "Take care of it" es encargarse.',
            example: { en: 'We ran into a snag with the printer.', es: 'Nos encontramos con un problema con la impresora.' }
        },
        44: {
            title: 'Repaso: mirar al pasado',
            body: '"Should have" + participio expresa arrepentimiento: "We should have left earlier". "If you had asked, I would have helped" habla de algo que no pasó.',
            example: { en: 'We should have set an alarm before that hike.', es: 'Deberíamos haber puesto una alarma antes de esa caminata.' }
        },
        45: {
            title: 'Pasado perfecto: had + participio',
            body: '"Had" + participio marca lo que pasó antes de otro hecho pasado: "We had already left when he arrived". Con "since" y algo que sigue, usa presente perfecto.',
            example: { en: 'The baker had already packed the shelves.', es: 'El panadero ya había guardado los repuestos.' },
            contrast: '✗ I know him since childhood → ✓ I\'ve known him since childhood'
        },
        46: {
            title: 'Condicionales irreales',
            body: 'Presente irreal: if + pasado, would + verbo. Pasado irreal: if + had + participio, would have + participio. "If I were you" usa "were" con todas las personas.',
            example: { en: 'If we repaired the roof, we wouldn\'t pay for water damage.', es: 'Si reparáramos el techo, no pagaríamos por daños de agua.' },
            contrast: '✗ If I would have more time → ✓ If I had more time'
        },
        47: {
            title: 'Pasiva con modales e impersonal',
            body: 'Con modales: modal + be + participio ("must be reported"). "It is widely believed that…" es la forma impersonal y formal de "se cree que…".',
            example: { en: 'Applications must be reviewed by the committee.', es: 'Las postulaciones deben ser revisadas por el comité.' }
        },
        48: {
            title: 'Estilo indirecto: un tiempo atrás',
            body: 'Al contar lo que alguien dijo, el verbo retrocede un tiempo: "will" pasa a "would", "is" a "was". "Tell" lleva a quién: "told me"; "say" no.',
            example: { en: 'She told me the interview was going well.', es: 'Ella me dijo que la entrevista iba bien.' },
            contrast: '✗ He said me → ✓ He told me'
        },
        49: {
            title: '"Although" o "however"',
            body: '"Although" y "even though" unen dos ideas dentro de una oración. "However" y "nevertheless" abren una oración nueva y van seguidos de coma.',
            example: { en: 'Even though the trail flooded, we reached the ridge.', es: 'Aunque el sendero se inundó, alcanzamos la cresta.' }
        },
        50: {
            title: '"Because" o "because of"',
            body: '"Because of" y "due to" van con sustantivo; "because" y "since" van con oración completa. "Therefore" y "as a result" introducen la consecuencia.',
            example: { en: 'Since the road flooded, we took the ferry.', es: 'Como se inundó el camino, tomamos el ferry.' },
            contrast: '✗ because the storm → ✓ because of the storm'
        },
        51: {
            title: 'Phrasal verbs con matiz',
            body: 'Equivalen a verbos más formales: "rule out" es descartar, "put up with" es tolerar y "take over" es asumir el control. "Come up with" es idear algo.',
            example: { en: 'We came up with a temporary patch by lunchtime.', es: 'Se nos ocurrió un parche temporal a la hora de almuerzo.' }
        },
        52: {
            title: 'Registro formal escrito',
            body: 'El inglés formal usa fórmulas fijas en vez de frases directas: "We regret to inform you" para malas noticias, "do not hesitate to contact me" para ofrecer ayuda.',
            example: { en: 'We regret to inform you that the position has been filled.', es: 'Lamentamos informarle que el cargo ya fue ocupado.' }
        },
        53: {
            title: 'Registro informal hablado',
            body: 'Entre colegas se habla corto y relajado: "I didn\'t catch that" (no te entendí), "My bad" (mi error) y "get" con el sentido de entender.',
            example: { en: 'Sorry, that completely slipped my mind.', es: 'Perdón, se me pasó por completo.' }
        },
        54: {
            title: 'Argumentar con firmeza y matiz',
            body: '"There\'s a strong case for…" presenta un argumento a favor. "I\'d argue…" suaviza tu postura sin debilitarla. "On balance" concluye sopesando pros y contras.',
            example: { en: 'On balance, I\'d argue the timing was poor.', es: 'En conjunto, sostendría que el momento fue malo.' },
            contrast: '✗ That claim lacks of evidence → ✓ That claim lacks evidence'
        },
        55: {
            title: 'Describir los pasos de un proceso',
            body: '"Once" + presente marca el paso previo: "Once the payment clears, we ship". La pasiva en presente dice qué se hace sin decir quién: "Data is stored".',
            example: { en: 'Once the oven reaches 220 degrees, the bread is ready.', es: 'Una vez que el horno llega a 220 grados, el pan está listo.' },
            contrast: '✗ Once the payment will clear → ✓ Once the payment clears'
        },
        56: {
            title: 'Negociar sin cerrar puertas',
            body: '"Meet halfway" es que ambos cedan hasta un punto medio. "Flexible on" indica dónde puedes ceder y "below what we can accept" marca tu límite con cortesía.',
            example: { en: 'We\'re flexible on the dates but firm on the price.', es: 'Somos flexibles con las fechas, pero firmes con el precio.' },
            contrast: '✗ discuss about the details → ✓ discuss the details'
        },
        57: {
            title: 'Cifras: "by" marca la diferencia',
            body: '"By" indica cuánto cambió algo: "grew by fifteen percent", "reduced costs by a third". "Roughly" es aproximadamente y "double" como verbo es duplicarse.',
            example: { en: 'Enrollment tripled in three years.', es: 'La matrícula se triplicó en tres años.' },
            contrast: '✗ grew in fifteen percent → ✓ grew by fifteen percent'
        },
        58: {
            title: '"Backup" y "back up"',
            body: '"Backup" junto es sustantivo (a backup plan); "back up" separado es el verbo (back up the file). "A risk of" va con sustantivo o con -ing.',
            example: { en: 'Back up your photos now; there is no backup.', es: 'Haz una copia de seguridad de tus fotos ahora; no hay respaldo.' }
        },
        59: {
            title: 'Repaso: "Had I known"',
            body: '"Had I known" es la forma formal de "If I had known": se omite "if" y "had" pasa adelante. "Looking back" abre la oración dando contexto.',
            example: { en: 'Had I checked the tide tables, we would have waited.', es: 'Si hubiera revisado las tablas de mareas, habríamos esperado.' }
        },
        60: {
            title: 'Condicionales mezclados',
            body: 'Mezclan tiempos: una condición pasada con un resultado presente ("If I had accepted…, I\'d be living abroad now"). "Were we to…" y "Should it…" son variantes formales.',
            example: { en: 'If we had postponed the wedding, we\'d be packing today.', es: 'Si hubiéramos aplazado la boda, estaríamos empacando hoy.' }
        },
        61: {
            title: 'Inversión tras palabras negativas',
            body: 'Si abres con "rarely", "seldom", "not only" u "on no account", el auxiliar va antes del sujeto, como en una pregunta. Suena enfático y formal.',
            example: { en: 'Not only did she finish the mural, she also got paid for it.', es: 'No solo terminó el mural, sino que además la pagaron.' },
            contrast: '✗ Rarely I have seen → ✓ Rarely have I seen'
        },
        62: {
            title: 'Pasiva formal e impersonal',
            body: '"It has been decided that…" y "He is said to be…" sacan al autor de la frase. Son típicas de informes y comunicados donde importa el hecho, no quién lo dice.',
            example: { en: 'The museum is said to be expanding next spring.', es: 'Se dice que el museo se ampliará la primavera próxima.' }
        },
        63: {
            title: 'Deducir el pasado: must have',
            body: '"Must have" + participio es una deducción casi segura; "can\'t have" la descarta; "might have" es una posibilidad. "Should have" expresa un reproche.',
            example: { en: 'They can\'t have repainted the whole kitchen overnight.', es: 'No pueden haber pintado toda la cocina de un día para otro.' }
        },
        64: {
            title: 'Elegir la palabra exacta',
            body: 'En nivel avanzado cuenta la palabra precisa: "inconclusive" en vez de "not clear", "differ" en vez de "are different". "Plausible but flawed" reconoce y critica a la vez.',
            example: { en: 'His timing was impeccable.', es: 'Su sentido del tiempo fue impecable.' }
        },
        65: {
            title: 'Hedging: suavizar afirmaciones',
            body: 'Para no sonar tajante agrega atenuadores: "I\'d say", "roughly", "to some extent", "seems". "I wouldn\'t rule it out" afirma sin comprometerte del todo.',
            example: { en: 'I\'d say the delay is mostly weather-related.', es: 'Diría que el retraso se debe casi todo al clima.' }
        },
        66: {
            title: 'Conceder antes de contradecir',
            body: '"Granted" y "admittedly" reconocen un punto del otro lado. "That said" o "be that as it may" introducen tu objeción sin ignorar lo anterior.',
            example: { en: 'Granted, the neighbourhood is convenient.', es: 'Es cierto que el barrio es conveniente.' }
        },
        67: {
            title: '"Need" + -ing con sentido pasivo',
            body: '"Revenue streams need diversifying" equivale a "need to be diversified". Fíjate también en verbos con preposición fija: "capitalize on" una oportunidad.',
            example: { en: 'These cliffs need monitoring every spring.', es: 'Estos acantilados necesitan ser vigilados cada primavera.' }
        },
        68: {
            title: 'Sustantivos abstractos sin "the"',
            body: 'Para hablar en general, los sustantivos abstractos y los plurales van sin artículo: "Inequality remains…", "Traditions evolve…". En español sí usamos "la" o "las".',
            example: { en: 'Wildlife corridors matter more than new highways.', es: 'Los corredores de fauna importan más que las nuevas autopistas.' },
            contrast: '✗ The inequality remains the defining issue → ✓ Inequality remains the defining issue'
        },
        69: {
            title: 'Tendencias: "has reshaped"',
            body: 'El presente perfecto muestra un cambio con efecto actual: "Automation has reshaped…". "Continue to" + verbo describe una tendencia que sigue en curso.',
            example: { en: 'Remote work has reshaped how teams hire.', es: 'El trabajo remoto ha cambiado cómo contratan los equipos.' }
        },
        70: {
            title: 'Ironía: decir lo contrario',
            body: 'En inglés la ironía es frecuente y seca: "Great." o "Shocking." pueden significar lo opuesto. El tono y el contexto deciden el sentido, no las palabras.',
            example: { en: 'Oh good, another parking ticket. Just what I needed.', es: 'Oh perfecto, otra multa de estacionamiento. Justo lo que necesitaba.' }
        },
        71: {
            title: 'Idioms: el sentido va completo',
            body: 'Un idiom se entiende entero, no palabra por palabra: "call it a day" es dar por terminado el trabajo del día y "on the fence" es estar indeciso.',
            example: { en: 'Let\'s not beat around the bush.', es: 'No demos más vueltas.' }
        },
        72: {
            title: 'Repaso: estructuras de nivel C1',
            body: 'Este repaso junta inversión ("Had the deadline been extended…"), oraciones con "what" para dar énfasis ("What the report fails to address is…") y concesiones breves.',
            example: { en: 'Had the funding lasted, we\'d still be operating. What nobody asked was why.', es: 'Si el financiamiento hubiera durado, seguiríamos operando. Nadie preguntó por qué.' }
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
        /* both halves of a contrast are English sentences */
        var body = el('span', 'tips-contrast-text', text);
        body.lang = 'en';
        row.appendChild(body);
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
