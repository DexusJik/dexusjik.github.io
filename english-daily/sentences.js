/*
 * sentences.js v2 - 365 oraciones en ingles con traduccion al espanol.
 *
 * Load order: sentences.js, placement.js, game.js
 *
 * Cambios respecto de la v1:
 *   - Ingles natural, no literal. Nada de "sin querer", "sintactico", etc.
 *   - Espanol natural, como lo diria un hablante, no una traduccion palabra
 *     por palabra.
 *   - Sin oraciones vagas ni repetidas: cada una dice algo distinto.
 *   - `we` y `ws` son distractores ESCRITOS A MANO, dos por idioma. No se
 *     eligen al azar de las otras 365: una opcion que no tiene nada que ver
 *     con la pregunta hace el ejercicio trivial.
 *
 * Por oracion:
 *   e   - oracion en ingles
 *   s   - traduccion al espanol
 *   l   - nivel 1..5
 *   we  - dos frases en ingles que NO son la correcta
 *   ws  - dos frases en espanol que NO son la correcta
 *
 * Los distractores son casi-correctos: cambian el tiempo verbal, niegan algo,
 * o usan una palabra parecida. Esa es la trampa que hay que aprender a notar.
 *
 * Marcadores personalizados (los reemplaza game.js al cargar y al cambiar el
 * nombre):
 *   {name}   primer nombre del estudiante
 *   {other}  otro nombre fijo, siempre distinto del nombre del estudiante
 */
window.DAILY_LESSONS = [


  /* ================= NIVEL 1 - A1 ================= */

  {
    title: "Presentaciones",
    sentences: [
      { en: "Hello, my name is {name}.", es: "Hola, me llamo {name}.", lv: 1,
        we: ["Hi, my surname is {name}.", "Hello, his name is {name}.", "Hello, my name is {other}."],
        ws: ["Hola, te llamas {name}.", "Hola, se llama {name}.", "Hola, me llamo {other}."] },
      { en: "Nice to meet you.", es: "Mucho gusto.", lv: 1,
        we: ["Nice to see you.", "Good to know you.", "Pleased to meet you too."],
        ws: ["Qué bueno verte.", "Mucho éxito contigo.", "Encantado de conocerte también."] },
      { en: "I am from Chile.", es: "Soy de Chile.", lv: 1,
        we: ["I live in Chile.", "I am going to Chile.", "I am from Chile City."],
        ws: ["Vivo en Chile.", "Voy a Chile.", "Soy de la ciudad de Chile."] },
      { en: "How are you doing today?", es: "¿Cómo estás hoy?", lv: 1,
        we: ["What are you doing today?", "Where are you going today?", "Who are you with today?"],
        ws: ["¿Qué estás haciendo hoy?", "¿Adónde vas hoy?", "¿Con quién estás hoy?"] },
      { en: "See you tomorrow.", es: "Hasta mañana.", lv: 1,
        we: ["See you today.", "See you yesterday.", "Talk to you tomorrow."],
        ws: ["Hasta hoy.", "Hasta ayer.", "Hablamos mañana."] }
    ]
  },

  {
    title: "La familia",
    sentences: [
      { en: "My father is a teacher.", es: "Mi padre es profesor.", lv: 1,
        we: ["My father is a student.", "My mother is a teacher.", "My father teaches students."],
        ws: ["Mi padre es estudiante.", "Mi madre es profesora.", "Mi padre enseña en la escuela."] },
      { en: "My mother cooks very well.", es: "Mi madre cocina muy bien.", lv: 1,
        we: ["My mother cooks very fast.", "My mother cooks for a living.", "My mother never cooks."],
        ws: ["Mi madre cocina muy rápido.", "Mi madre cocina de trabajo.", "Mi madre nunca cocina."] },
      { en: "This is my brother.", es: "Este es mi hermano.", lv: 1,
        we: ["This is my sister.", "That is my brother.", "These are my brothers."],
        ws: ["Esta es mi hermana.", "Ese es mi hermano.", "Estos son mis hermanos."] },
      { en: "My sister is younger than me.", es: "Mi hermana es menor que yo.", lv: 1,
        we: ["My sister is older than me.", "My sister is the same age as me.", "My sister is taller than me."],
        ws: ["Mi hermana es mayor que yo.", "Mi hermana tiene mi misma edad.", "Mi hermana es más alta que yo."] },
      { en: "We are a happy family.", es: "Somos una familia feliz.", lv: 1,
        we: ["We are a big family.", "We are a quiet family.", "They are a happy family."],
        ws: ["Somos una familia grande.", "Somos una familia tranquila.", "Ellos son una familia feliz."] }
    ]
  },

  {
    title: "Números y edad",
    sentences: [
      { en: "I have one brother.", es: "Tengo un hermano.", lv: 1,
        we: ["I have one sister.", "I have two brothers.", "I don't have a brother."],
        ws: ["Tengo una hermana.", "Tengo dos hermanos.", "No tengo hermano."] },
      { en: "She is ten years old.", es: "Ella tiene diez años.", lv: 1,
        we: ["She is ten years tall.", "She has ten years.", "She is ten years younger."],
        ws: ["Ella tiene diez años de alto.", "Ella mide diez años.", "Ella es diez años menor."] },
      { en: "There are three books on the table.", es: "Hay tres libros sobre la mesa.", lv: 1,
        we: ["There is three books on the table.", "There are three books under the table.", "There are four books on the table."],
        ws: ["Hay un tres libros sobre la mesa.", "Hay tres libros bajo la mesa.", "Hay cuatro libros sobre la mesa."] },
      { en: "The class has twenty students.", es: "La clase tiene veinte estudiantes.", lv: 1,
        we: ["The class has twelve students.", "The class has twenty teachers.", "The class is twenty students."],
        ws: ["La clase tiene doce estudiantes.", "La clase tiene veinte profesores.", "La clase es veinte estudiantes."] },
      { en: "I am twenty-five years old.", es: "Tengo veinticinco años.", lv: 1,
        we: ["I am twenty-five years tall.", "I am fifty-two years old.", "I have twenty-five years."],
        ws: ["Mido veinticinco años.", "Tengo cincuenta y dos años.", "Tengo veinticinco años de alto."] }
    ]
  },

  {
    title: "Colores",
    sentences: [
      { en: "The sky is blue today.", es: "El cielo está azul hoy.", lv: 1,
        we: ["The sky is grey today.", "The sea is blue today.", "The sky was blue today."],
        ws: ["El cielo está gris hoy.", "El mar está azul hoy.", "El cielo estaba azul hoy."] },
      { en: "I have a red car.", es: "Tengo un auto rojo.", lv: 1,
        we: ["I have a red bike.", "I have a blue car.", "I want a red car."],
        ws: ["Tengo una bicicleta roja.", "Tengo un auto azul.", "Quiero un auto rojo."] },
      { en: "My house is white.", es: "Mi casa es blanca.", lv: 1,
        we: ["My house is black.", "My apartment is white.", "My house is very white."],
        ws: ["Mi casa es negra.", "Mi departamento es blanco.", "Mi casa es muy blanca."] },
      { en: "The grass is green.", es: "La hierba es verde.", lv: 1,
        we: ["The grass is brown.", "The leaves are green.", "The grass was green."],
        ws: ["La hierba es marrón.", "Las hojas son verdes.", "La hierba era verde."] },
      { en: "I like this colour.", es: "Me gusta este color.", lv: 1,
        we: ["I like these colours.", "I don't like this colour.", "I like this house."],
        ws: ["Me gustan estos colores.", "No me gusta este color.", "Me gusta esta casa."] }
    ]
  },

  {
    title: "Comida",
    sentences: [
      { en: "I eat bread every morning.", es: "Como pan todas las mañanas.", lv: 1,
        we: ["I eat bread every evening.", "I bought bread this morning.", "I make bread every morning."],
        ws: ["Como pan todas las tardes.", "Compré pan esta mañana.", "Hago pan todas las mañanas."] },
      { en: "She drinks a lot of water.", es: "Ella bebe mucha agua.", lv: 1,
        we: ["She drinks a lot of milk.", "She drinks a little water.", "She gives a lot of water."],
        ws: ["Ella toma mucha leche.", "Ella bebe poca agua.", "Ella da mucha agua."] },
      { en: "The coffee is too hot.", es: "El café está demasiado caliente.", lv: 1,
        we: ["The coffee is too cold.", "The coffee is very hot.", "The coffee is hot enough."],
        ws: ["El café está demasiado frío.", "El café está muy caliente.", "El café está lo bastante caliente."] },
      { en: "I like fish with rice.", es: "Me gusta el pescado con arroz.", lv: 1,
        we: ["I like fish with potatoes.", "I like meat with rice.", "I don't like fish."],
        ws: ["Me gusta el pescado con papas.", "Me gusta la carne con arroz.", "No me gusta el pescado."] },
      { en: "Do you like pizza?", es: "¿Te gusta la pizza?", lv: 1,
        we: ["Do you eat pizza?", "Are you eating pizza?", "Would you like some pizza?"],
        ws: ["¿Comes pizza?", "¿Estás comiendo pizza?", "¿Quieres un poco de pizza?"] }
    ]
  },

  {
    title: "En la casa",
    sentences: [
      { en: "The kitchen is small.", es: "La cocina es pequeña.", lv: 1,
        we: ["The kitchen is big.", "The bedroom is small.", "The kitchen is very clean."],
        ws: ["La cocina es grande.", "El dormitorio es pequeño.", "La cocina está muy limpia."] },
      { en: "My bedroom has two beds.", es: "Mi dormitorio tiene dos camas.", lv: 1,
        we: ["My bedroom has two desks.", "My bedroom has one bed.", "My bedroom needs two beds."],
        ws: ["Mi dormitorio tiene dos escritorios.", "Mi dormitorio tiene una cama.", "Mi dormitorio necesita dos camas."] },
      { en: "The door is closed.", es: "La puerta está cerrada.", lv: 1,
        we: ["The door is open.", "The door is locked.", "The window is closed."],
        ws: ["La puerta está abierta.", "La puerta está bloqueada.", "La ventana está cerrada."] },
      { en: "There is a table in the room.", es: "Hay una mesa en la habitación.", lv: 1,
        we: ["There is a chair in the room.", "There are a table in the room.", "There is a table under the room."],
        ws: ["Hay una silla en la habitación.", "Hay una mesas en la habitación.", "Hay una mesa debajo de la habitación."] },
      { en: "The window is open.", es: "La ventana está abierta.", lv: 1,
        we: ["The window is shut.", "The door is open.", "The window is broken."],
        ws: ["La ventana está cerrada.", "La puerta está abierta.", "La ventana está rota."] }
    ]
  },

  {
    title: "Lugares",
    sentences: [
      { en: "The bank is next to the park.", es: "El banco está junto al parque.", lv: 1,
        we: ["The bank is opposite the park.", "The bank is far from the park.", "The park is next to the bank."],
        ws: ["El banco está frente al parque.", "El banco está lejos del parque.", "El parque está junto al banco."] },
      { en: "I go to the market on Sundays.", es: "Voy al mercado los domingos.", lv: 1,
        we: ["I go to the market on Mondays.", "I go to the mall on Sundays.", "I go to the market every day."],
        ws: ["Voy al mercado los lunes.", "Voy al centro comercial los domingos.", "Voy al mercado todos los días."] },
      { en: "The hospital is far from here.", es: "El hospital está lejos de aquí.", lv: 1,
        we: ["The hospital is near here.", "The hospital is close to here.", "The pharmacy is far from here."],
        ws: ["El hospital está cerca de aquí.", "El hospital está cerca de acá.", "La farmacia está lejos de aquí."] },
      { en: "My house is near the beach.", es: "Mi casa está cerca de la playa.", lv: 1,
        we: ["My house is far from the beach.", "My apartment is near the beach.", "The beach is near my house."],
        ws: ["Mi casa está lejos de la playa.", "Mi departamento está cerca de la playa.", "La playa está cerca de mi casa."] },
      { en: "We met at the station.", es: "Nos conocimos en la estación.", lv: 1,
        we: ["We met at the airport.", "We met at the museum.", "We waited at the station."],
        ws: ["Nos conocimos en el aeropuerto.", "Nos conocimos en el museo.", "Esperamos en la estación."] }
    ]
  },

  {
    title: "La rutina",
    sentences: [
      { en: "I wake up at seven.", es: "Me despierto a las siete.", lv: 1,
        we: ["I wake up at eight.", "I go to bed at seven.", "I get up at seven o'clock."],
        ws: ["Me despierto a las ocho.", "Me acuesto a las siete.", "Me levanto a las siete."] },
      { en: "She works at a hospital.", es: "Ella trabaja en un hospital.", lv: 1,
        we: ["She works at a school.", "She studies at a hospital.", "She works in a hospital."],
        ws: ["Ella trabaja en una escuela.", "Ella estudia en un hospital.", "Ella trabaja en el hospital."] },
      { en: "We study English every day.", es: "Estudiamos inglés todos los días.", lv: 1,
        we: ["We study English every week.", "We speak English every day.", "They study English every day."],
        ws: ["Estudiamos inglés todas las semanas.", "Hablamos inglés todos los días.", "Ellos estudian inglés todos los días."] },
      { en: "I go to bed at eleven.", es: "Me acuesto a las once.", lv: 1,
        we: ["I get up at eleven.", "I go to work at eleven.", "I stay up until eleven."],
        ws: ["Me levanto a las once.", "Voy al trabajo a las once.", "Me quedo despierto hasta las once."] },
      { en: "My day is very long.", es: "Mi día es muy largo.", lv: 1,
        we: ["My week is very long.", "My day is very short.", "My days are very long."],
        ws: ["Mi semana es muy larga.", "Mi día es muy corto.", "Mis días son muy largos."] }
    ]
  },

  {
    title: "La hora",
    sentences: [
      { en: "The shop opens at ten.", es: "La tienda abre a las diez.", lv: 1,
        we: ["The shop closes at ten.", "The shop opens at nine.", "The shop opens at night."],
        ws: ["La tienda cierra a las diez.", "La tienda abre a las nueve.", "La tienda abre de noche."] },
      { en: "It is half past twelve.", es: "Son las doce y media.", lv: 1,
        we: ["It is half past one.", "It is twelve o'clock.", "It is half past twelve in the morning."],
        ws: ["Son la una y media.", "Son las doce en punto.", "Es la una y media de la tarde."] },
      { en: "My class starts at eight.", es: "Mi clase empieza a las ocho.", lv: 1,
        we: ["My class ends at eight.", "My class starts at nine.", "My class starts in the morning."],
        ws: ["Mi clase termina a las ocho.", "Mi clase empieza a las nueve.", "Mi clase empieza por la mañana."] },
      { en: "We waited for one hour.", es: "Esperamos una hora.", lv: 1,
        we: ["We waited for one minute.", "We wait for one hour.", "We waited an hour ago."],
        ws: ["Esperamos un minuto.", "Esperamos un rato.", "Esperamos hace una hora."] },
      { en: "The meeting is at three.", es: "La reunión es a las tres.", lv: 1,
        we: ["The meeting is at four.", "The meeting is at three in the morning.", "The meeting lasted three hours."],
        ws: ["La reunión es a las cuatro.", "La reunión es a las tres de la mañana.", "La reunión duró tres horas."] }
    ]
  },

  {
    title: "Poder y no poder",
    sentences: [
      { en: "I can swim very well.", es: "Sé nadar muy bien.", lv: 1,
        we: ["I can swim a little.", "I can't swim at all.", "I can swim very fast."],
        ws: ["Sé nadar un poco.", "No sé nadar nada.", "Sé nadar muy rápido."] },
      { en: "She can play the guitar.", es: "Ella toca la guitarra.", lv: 1,
        we: ["She can play the piano.", "She plays the guitar.", "She can't play the guitar."],
        ws: ["Ella toca el piano.", "Ella juega la guitarra.", "Ella no puede tocar la guitarra."] },
      { en: "Can you help me, please?", es: "¿Puedes ayudarme, por favor?", lv: 1,
        we: ["Can you see me, please?", "Can you wait for me?", "Do you help me, please?"],
        ws: ["¿Puedes verme, por favor?", "¿Puedes esperarme?", "¿Me ayudas, por favor?"] },
      { en: "He cannot come tonight.", es: "Él no puede venir esta noche.", lv: 1,
        we: ["He can come tonight.", "He cannot come tomorrow.", "He doesn't come tonight."],
        ws: ["Él puede venir esta noche.", "Él no puede venir mañana.", "Él no viene esta noche."] },
      { en: "We can start now.", es: "Podemos empezar ahora.", lv: 1,
        we: ["We can start later.", "We can't start now.", "We started now."],
        ws: ["Podemos empezar más tarde.", "No podemos empezar ahora.", "Empezamos ahora."] }
    ]
  },

  {
    title: "Ayer y la semana pasada",
    sentences: [
      { en: "I was happy yesterday.", es: "Estuve feliz ayer.", lv: 1,
        we: ["I was happy every day.", "I am happy yesterday.", "I will be happy yesterday."],
        ws: ["Estuve feliz todos los días.", "Estoy feliz ayer.", "Estaré feliz ayer."] },
      { en: "We played football.", es: "Jugamos fútbol.", lv: 1,
        we: ["We watch football.", "We are playing football.", "We will play football."],
        ws: ["Miramos fútbol.", "Estamos jugando fútbol.", "Jugaremos fútbol."] },
      { en: "She went home early.", es: "Ella se fue a casa temprano.", lv: 1,
        we: ["She goes home early.", "She is going home early.", "She will go home early."],
        ws: ["Ella llega a casa temprano.", "Ella está yendo a casa temprano.", "Ella irá a casa temprano."] },
      { en: "The film was very good.", es: "La película estuvo muy buena.", lv: 1,
        we: ["The film is very good.", "The film was very bad.", "The film will be very good."],
        ws: ["La película está muy buena.", "La película estuvo muy mala.", "La película estará muy buena."] },
      { en: "I bought a new phone.", es: "Compré un teléfono nuevo.", lv: 1,
        we: ["I buy a new phone.", "I broke my new phone.", "I will buy a new phone."],
        ws: ["Compro un teléfono nuevo.", "Rompí mi teléfono nuevo.", "Compraré un teléfono nuevo."] }
    ]
  },

  {
    title: "El clima",
    sentences: [
      { en: "The weather is cold today.", es: "El clima está frío hoy.", lv: 1,
        we: ["The weather is warm today.", "The weather was cold today.", "The weather is cold yesterday."],
        ws: ["El clima está caliente hoy.", "El clima estuvo frío hoy.", "El clima estuvo frío ayer."] },
      { en: "It is raining in the city.", es: "Está lloviendo en la ciudad.", lv: 1,
        we: ["It is snowing in the city.", "It was raining in the city.", "It is raining on the city."],
        ws: ["Está nevando en la ciudad.", "Llovía en la ciudad.", "Está lloviendo sobre la ciudad."] },
      { en: "The sun is very bright.", es: "El sol está muy brillante.", lv: 1,
        we: ["The sun is very weak.", "The moon is very bright.", "The sun is very cold."],
        ws: ["El sol está muy débil.", "La luna está muy brillante.", "El sol está muy frío."] },
      { en: "It is windy outside.", es: "Está ventoso afuera.", lv: 1,
        we: ["It is rainy outside.", "It is cloudy outside.", "It is windy inside."],
        ws: ["Está lluvioso afuera.", "Está nublado afuera.", "Está ventoso adentro."] },
      { en: "The sky is clear tonight.", es: "El cielo está despejado esta noche.", lv: 1,
        we: ["The sky is cloudy tonight.", "The sky was clear tonight.", "The sky is clear this morning."],
        ws: ["El cielo está nublado esta noche.", "El cielo estaba despejado esta noche.", "El cielo está despejado esta mañana."] }
    ]
  },

  {
    title: "Preposiciones de lugar",
    sentences: [
      { en: "The book is on the table.", es: "El libro está sobre la mesa.", lv: 1,
        we: ["The book is under the table.", "The book is in the table.", "The table is on the book."],
        ws: ["El libro está bajo la mesa.", "El libro está en la mesa.", "La mesa está sobre el libro."] },
      { en: "The cat is under the bed.", es: "El gato está debajo de la cama.", lv: 1,
        we: ["The cat is on the bed.", "The cat is near the bed.", "The bed is under the cat."],
        ws: ["El gato está sobre la cama.", "El gato está cerca de la cama.", "La cama está debajo del gato."] },
      { en: "I live in a small town.", es: "Vivo en un pueblo pequeño.", lv: 1,
        we: ["I live in a small city.", "I live near a small town.", "I live in a small house."],
        ws: ["Vivo en una ciudad pequeña.", "Vivo cerca de un pueblo pequeño.", "Vivo en una casa pequeña."] },
      { en: "She walks to school.", es: "Ella camina a la escuela.", lv: 1,
        we: ["She walks from school.", "She walks with school.", "She walks at school."],
        ws: ["Ella camina desde la escuela.", "Ella camina con la escuela.", "Ella camina en la escuela."] },
      { en: "Wait for me here.", es: "Espérame aquí.", lv: 1,
        we: ["Wait for me there.", "Wait me here.", "I wait for you here."],
        ws: ["Espérame allá.", "Espérame un momento.", "Yo te espero aquí."] }
    ]
  },

  {
    title: "Trabajo y estudio",
    sentences: [
      { en: "I work in an office.", es: "Trabajo en una oficina.", lv: 1,
        we: ["I work in a shop.", "I study in an office.", "I work at home."],
        ws: ["Trabajo en una tienda.", "Estudio en una oficina.", "Trabajo en casa."] },
      { en: "He is my manager.", es: "Él es mi gerente.", lv: 1,
        we: ["He is my client.", "He is my student.", "I am his manager."],
        ws: ["Él es mi cliente.", "Él es mi estudiante.", "Yo soy su gerente."] },
      { en: "The meeting starts in five minutes.", es: "La reunión empieza en cinco minutos.", lv: 1,
        we: ["The meeting started five minutes ago.", "The meeting lasts five minutes.", "The meeting ends in five minutes."],
        ws: ["La reunión empezó hace cinco minutos.", "La reunión dura cinco minutos.", "La reunión termina en cinco minutos."] },
      { en: "Please send me the file.", es: "Por favor, envíame el archivo.", lv: 1,
        we: ["Please send me the folder.", "Please show me the file.", "Please save me the file."],
        ws: ["Por favor, mándame la carpeta.", "Por favor, muéstrame el archivo.", "Por favor, guárdame el archivo."] },
      { en: "I have a lot of work today.", es: "Tengo mucho trabajo hoy.", lv: 1,
        we: ["I have a little work today.", "I have a lot of work tomorrow.", "I don't have work today."],
        ws: ["Tengo poco trabajo hoy.", "Tengo mucho trabajo mañana.", "No tengo trabajo hoy."] }
    ]
  },

  {
    title: "Repaso del nivel 1",
    sentences: [
      { en: "I drink coffee and read the news.", es: "Tomo café y leo las noticias.", lv: 1,
        we: ["I drink coffee or read the news.", "I drink tea and read the news.", "I drink coffee and write the news."],
        ws: ["Tomo café o leo las noticias.", "Tomo té y leo las noticias.", "Tomo café y escribo las noticias."] },
      { en: "My sister lives in another city.", es: "Mi hermana vive en otra ciudad.", lv: 1,
        we: ["My sister lives in this city.", "My sister works in another city.", "My sister visited another city."],
        ws: ["Mi hermana vive en esta ciudad.", "Mi hermana trabaja en otra ciudad.", "Mi hermana visitó otra ciudad."] },
      { en: "The kids play in the park.", es: "Los niños juegan en el parque.", lv: 1,
        we: ["The kids play in the house.", "The children study in the park.", "The kids play near the park."],
        ws: ["Los niños juegan en la casa.", "Los niños estudian en el parque.", "Los niños juegan cerca del parque."] },
      { en: "I need to buy some milk.", es: "Necesito comprar un poco de leche.", lv: 1,
        we: ["I need to sell some milk.", "I want to buy some milk.", "I need to buy some bread."],
        ws: ["Necesito vender un poco de leche.", "Quiero comprar un poco de leche.", "Necesito comprar un poco de pan."] },
      { en: "This is a very good day.", es: "Este es un día muy bueno.", lv: 1,
        we: ["This is a very bad day.", "This was a very good day.", "Today is a very good day."],
        ws: ["Este es un día muy malo.", "Este fue un día muy bueno.", "Hoy es un día muy bueno."] }
    ]
  },
  {
    title: "Presente Continuo",
    sentences: [
      { en: "I am reading a book right now.", es: "Estoy leyendo un libro ahora mismo.", lv: 2,
        we: ["I am reading a book every night.", "I read a book right now.", "I was reading a book right now."],
        ws: ["Estoy leyendo un libro todas las noches.", "Leo un libro ahora mismo.", "Estaba leyendo un libro ahora mismo."] },
      { en: "She is waiting for the bus.", es: "Ella está esperando el autobús.", lv: 2,
        we: ["She is waiting for the train.", "She was waiting for the bus.", "She is looking for the bus."],
        ws: ["Ella está esperando el tren.", "Ella esperaba el autobús.", "Ella está buscando el autobús."] },
      { en: "They are having lunch together.", es: "Ellos están almorzando juntos.", lv: 2,
        we: ["They are having dinner together.", "They had lunch together.", "They are having lunch alone."],
        ws: ["Ellos están cenando juntos.", "Ellos almorzaron juntos.", "Ellos están almorzando solos."] },
      { en: "We are not working today.", es: "Hoy no estamos trabajando.", lv: 2,
        we: ["We are not working tomorrow.", "We are working today.", "We were not working today."],
        ws: ["Hoy no vamos a trabajar.", "Mañana no estamos trabajando.", "Hoy estamos trabajando."] },
      { en: "What are you doing?", es: "¿Qué estás haciendo?", lv: 2,
        we: ["What did you do?", "Where are you going?", "What are you cooking?"],
        ws: ["¿Qué hiciste?", "¿Adónde vas?", "¿Qué estás cocinando?"] }
    ]
  },
  {
    title: "Ayer y Pasado",
    sentences: [
      { en: "I called you yesterday.", es: "Te llamé ayer.", lv: 2,
        we: ["I will call you yesterday.", "I called you tomorrow.", "I called you last week."],
        ws: ["Te llamaré ayer.", "Te llamé mañana.", "Te llamé la semana pasada."] },
      { en: "She finished her homework early.", es: "Ella terminó su tarea temprano.", lv: 2,
        we: ["She finishes her homework early.", "She finished her homework late.", "She is finishing her homework early."],
        ws: ["Ella termina su tarea temprano.", "Ella terminó su tarea tarde.", "Ella está terminando su tarea temprano."] },
      { en: "We visited my grandparents.", es: "Visitamos a mis abuelos.", lv: 2,
        we: ["We will visit my grandparents.", "My grandparents visited us.", "We visited my grandparents last year."],
        ws: ["Visitaremos a mis abuelos.", "Mis abuelos nos visitaron.", "Visitamos a mis abuelos el año pasado."] },
      { en: "They didn't come to the party.", es: "Ellos no vinieron a la fiesta.", lv: 2,
        we: ["They didn't come to the meeting.", "They came to the party.", "They don't come to the party."],
        ws: ["Ellos no vinieron a la reunión.", "Ellos vinieron a la fiesta.", "Ellos no vienen a la fiesta."] },
      { en: "Did you watch the game?", es: "¿Viste el partido?", lv: 2,
        we: ["Did you play the game?", "Are you watching the game?", "Will you watch the movie?"],
        ws: ["¿Jugaste el partido?", "¿Estás viendo el partido?", "¿Vas a ver la película?"] }
    ]
  },
  {
    title: "There Is / There Are",
    sentences: [
      { en: "There is a problem with the order.", es: "Hay un problema con el pedido.", lv: 2,
        we: ["There is a problem with the payment.", "There are problems with the order.", "There was a problem with the order."],
        ws: ["Hay un problema con el pago.", "Hay problemas con el pedido.", "Había un problema con el pedido."] },
      { en: "There are two chairs in the room.", es: "Hay dos sillas en la habitación.", lv: 2,
        we: ["There are two tables in the room.", "There is two chairs in the room.", "There are three chairs in the room."],
        ws: ["Hay dos mesas en la habitación.", "Hay dos sillas en el salón.", "Hay tres sillas en la habitación."] },
      { en: "There isn't any milk left.", es: "No queda leche.", lv: 2,
        we: ["There isn't any bread left.", "There isn't much milk left.", "There wasn't any milk left."],
        ws: ["No queda pan.", "Queda poca leche.", "No quedaba leche."] },
      { en: "There was a storm last night.", es: "Hubo una tormenta anoche.", lv: 2,
        we: ["There was a storm last week.", "There were a storm last night.", "There will be a storm last night."],
        ws: ["Hubo una tormenta la semana pasada.", "Había una tormenta anoche.", "Habrá una tormenta anoche."] },
      { en: "There weren't many people.", es: "No había mucha gente.", lv: 2,
        we: ["There weren't many people waiting.", "There were many people.", "There aren't many people outside."],
        ws: ["No había mucha gente esperando.", "Había mucha gente.", "No hay mucha gente afuera."] }
    ]
  },
  {
    title: "Adjetivos",
    sentences: [
      { en: "The film was boring.", es: "La película fue aburrida.", lv: 2,
        we: ["The film was exciting.", "The film is boring.", "The book was boring."],
        ws: ["La película fue emocionante.", "La película es aburrida.", "El libro fue aburrido."] },
      { en: "That restaurant looks expensive.", es: "Ese restaurante se ve caro.", lv: 2,
        we: ["That restaurant looks cheap.", "That restaurant tastes expensive.", "That restaurant is expensive."],
        ws: ["Ese restaurante se ve barato.", "Ese restaurante sabe caro.", "Ese restaurante es caro."] },
      { en: "She is a very careful driver.", es: "Ella es una conductora muy cuidadosa.", lv: 2,
        we: ["She is a very careless driver.", "She is a careful driver.", "He is a very careful driver."],
        ws: ["Ella es una conductora muy descuidada.", "Ella es una conductora cuidadosa.", "Él es un conductor muy cuidadoso."] },
      { en: "The weather is terrible today.", es: "El clima está terrible hoy.", lv: 2,
        we: ["The weather is lovely today.", "The weather was terrible yesterday.", "The weather is terrible tomorrow."],
        ws: ["El clima está agradable hoy.", "El clima estaba terrible ayer.", "El clima estará terrible mañana."] },
      { en: "It was an interesting experience.", es: "Fue una experiencia interesante.", lv: 2,
        we: ["It will be an interesting experience.", "It was a boring experience.", "They were an interesting experience."],
        ws: ["Será una experiencia interesante.", "Fue una experiencia aburrida.", "Fueron una experiencia interesante."] }
    ]
  },
  {
    title: "Adverbios de Frecuencia",
    sentences: [
      { en: "I always drink coffee in the morning.", es: "Siempre tomo café por la mañana.", lv: 2,
        we: ["I sometimes drink coffee in the morning.", "I always drink coffee at night.", "I never drink coffee in the morning."],
        ws: ["A veces tomo café por la mañana.", "Siempre tomo café de noche.", "Nunca tomo café por la mañana."] },
      { en: "She sometimes works late.", es: "Ella a veces trabaja tarde.", lv: 2,
        we: ["She always works late.", "She sometimes works early.", "She rarely works late."],
        ws: ["Ella siempre trabaja tarde.", "Ella a veces trabaja temprano.", "Ella rara vez trabaja tarde."] },
      { en: "We rarely eat fast food.", es: "Rara vez comemos comida rápida.", lv: 2,
        we: ["We often eat fast food.", "We rarely eat healthy food.", "We never eat fast food."],
        ws: ["A menudo comemos comida rápida.", "Rara vez comemos comida sana.", "Nunca comemos comida rápida."] },
      { en: "He never drinks soda.", es: "Él nunca bebe gaseosa.", lv: 2,
        we: ["He always drinks soda.", "He never drinks coffee.", "He sometimes drinks soda."],
        ws: ["Él siempre bebe gaseosa.", "Él nunca bebe café.", "Él a veces bebe gaseosa."] },
      { en: "They often travel by train.", es: "Ellos viajan a menudo en tren.", lv: 2,
        we: ["They often travel by bus.", "They rarely travel by train.", "They travel by train tomorrow."],
        ws: ["Ellos viajan a menudo en autobús.", "Ellos rara vez viajan en tren.", "Ellos viajan en tren mañana."] }
    ]
  },
  {
    title: "Verbos Modales Básicos",
    sentences: [
      { en: "I have to work tomorrow.", es: "Tengo que trabajar mañana.", lv: 2,
        we: ["I want to work tomorrow.", "I had to work tomorrow.", "I don't have to work tomorrow."],
        ws: ["Quiero trabajar mañana.", "Tenía que trabajar mañana.", "No tengo que trabajar mañana."] },
      { en: "You should rest more.", es: "Deberías descansar más.", lv: 2,
        we: ["You should rest less.", "You must rest more.", "You should work more."],
        ws: ["Deberías descansar menos.", "Debes descansar más.", "Deberías trabajar más."] },
      { en: "We must arrive on time.", es: "Debemos llegar a tiempo.", lv: 2,
        we: ["We must arrive late.", "We might arrive on time.", "We don't need to arrive on time."],
        ws: ["Debemos llegar tarde.", "Podríamos llegar a tiempo.", "No necesitamos llegar a tiempo."] },
      { en: "She can drive a truck.", es: "Ella puede manejar un camión.", lv: 2,
        we: ["She can drive a bicycle.", "She can't drive a truck.", "She must drive a truck."],
        ws: ["Ella puede manejar una bicicleta.", "Ella no puede manejar un camión.", "Ella debe manejar un camión."] },
      { en: "Might I ask a question?", es: "¿Podría hacer una pregunta?", lv: 2,
        we: ["Might I make a suggestion?", "Could I ask a question?", "Must I ask a question?"],
        ws: ["¿Podría hacer una sugerencia?", "¿Puedo hacer una pregunta?", "¿Tengo que hacer una pregunta?"] }
    ]
  },
  {
    title: "Viajes",
    sentences: [
      { en: "I need to book a flight to Lima.", es: "Necesito reservar un vuelo a Lima.", lv: 2,
        we: ["I need to cancel a flight to Lima.", "I want to book a flight to Lima.", "I need to book a flight to Quito."],
        ws: ["Necesito cancelar un vuelo a Lima.", "Quiero reservar un vuelo a Lima.", "Necesito reservar un vuelo a Quito."] },
      { en: "The train leaves at nine o'clock.", es: "El tren sale a las nueve en punto.", lv: 2,
        we: ["The train arrives at nine o'clock.", "The train leaves at ten o'clock.", "The bus leaves at nine o'clock."],
        ws: ["El tren llega a las nueve en punto.", "El tren sale a las diez en punto.", "El autobús sale a las nueve en punto."] },
      { en: "Where is the bus station?", es: "¿Dónde está la estación de buses?", lv: 2,
        we: ["When is the bus station?", "Where is the train station?", "How far is the bus station?"],
        ws: ["¿Cuándo es la estación de buses?", "¿Dónde está la estación de tren?", "¿A qué distancia está la estación de buses?"] },
      { en: "My luggage is very heavy.", es: "Mi equipaje está muy pesado.", lv: 2,
        we: ["My luggage is very light.", "My suitcase is very heavy.", "My luggage was very heavy."],
        ws: ["Mi equipaje está muy liviano.", "Mi maleta está muy pesada.", "Mi equipaje estaba muy pesado."] },
      { en: "The hotel room wasn't clean.", es: "La habitación del hotel no estaba limpia.", lv: 2,
        we: ["The hotel room was clean.", "The hotel room isn't clean.", "The bedroom wasn't clean."],
        ws: ["La habitación del hotel estaba limpia.", "La habitación del hotel no está limpia.", "El dormitorio no estaba limpio."] }
    ]
  },
  {
    title: "En el Trabajo",
    sentences: [
      { en: "I have a meeting at three.", es: "Tengo una reunión a las tres.", lv: 2,
        we: ["I have a meeting at four.", "I had a meeting at three.", "I need a meeting at three."],
        ws: ["Tengo una reunión a las cuatro.", "Tuve una reunión a las tres.", "Necesito una reunión a las tres."] },
      { en: "Please fill out this form.", es: "Por favor completa este formulario.", lv: 2,
        we: ["Please sign out this form.", "Please fill in this form.", "Please throw out this form."],
        ws: ["Por favor firma este formulario.", "Por favor rellena este formulario.", "Por favor bota este formulario."] },
      { en: "My colleague is on vacation.", es: "Mi colega está de vacaciones.", lv: 2,
        we: ["My manager is on vacation.", "My colleague is on sick leave.", "My colleagues are on vacation."],
        ws: ["Mi gerente está de vacaciones.", "Mi colega está de licencia médica.", "Mis colegas están de vacaciones."] },
      { en: "The deadline is next Friday.", es: "La fecha límite es el próximo viernes.", lv: 2,
        we: ["The deadline is this Friday.", "The meeting is next Friday.", "The deadline was next Friday."],
        ws: ["La fecha límite es este viernes.", "La reunión es el próximo viernes.", "La fecha límite era el próximo viernes."] },
      { en: "I need to talk to my manager.", es: "Necesito hablar con mi gerente.", lv: 2,
        we: ["I need to talk to my client.", "I want to talk to my manager.", "I needed to talk to my manager."],
        ws: ["Necesito hablar con mi cliente.", "Quiero hablar con mi gerente.", "Necesitaba hablar con mi gerente."] }
    ]
  },
  {
    title: "Salud",
    sentences: [
      { en: "I have a headache today.", es: "Me duele la cabeza hoy.", lv: 2,
        we: ["I have a stomachache today.", "I had a headache today.", "I will have a headache today."],
        ws: ["Me duele el estómago hoy.", "Me dolía la cabeza hoy.", "Me va a doler la cabeza hoy."] },
      { en: "You should see a doctor.", es: "Deberías ver a un médico.", lv: 2,
        we: ["You must see a doctor.", "You should see a dentist.", "You don't need to see a doctor."],
        ws: ["Debes ver a un médico.", "Deberías ver a un dentista.", "No necesitas ver a un médico."] },
      { en: "She feels much better now.", es: "Ella se siente mucho mejor ahora.", lv: 2,
        we: ["She felt much better then.", "She feels much worse now.", "She feels a little better now."],
        ws: ["Ella se sintió mucho mejor entonces.", "Ella se siente mucho peor ahora.", "Ella se siente un poco mejor ahora."] },
      { en: "I need to rest for a week.", es: "Necesito descansar una semana.", lv: 2,
        we: ["I need to rest for a day.", "I want to rest for a week.", "I need to work for a week."],
        ws: ["Necesito descansar un día.", "Quiero descansar una semana.", "Necesito trabajar una semana."] },
      { en: "Take the medicine twice a day.", es: "Toma el medicamento dos veces al día.", lv: 2,
        we: ["Take the medicine three times a day.", "Take the medicine once a day.", "Take the medicine twice a week."],
        ws: ["Toma el medicamento tres veces al día.", "Toma el medicamento una vez al día.", "Toma el medicamento dos veces por semana."] }
    ]
  },
  {
    title: "Telefonear",
    sentences: [
      { en: "Could I speak to Mr. Díaz?", es: "¿Podría hablar con el señor Díaz?", lv: 2,
        we: ["Could I speak to Mrs. Díaz?", "Could I speak to Mr. Díaz yesterday?", "Might I speak to Mr. Díaz?"],
        ws: ["¿Podría hablar con la señora Díaz?", "¿Podría hablar con el señor Díaz ayer?", "¿Podría hablar con el señor Rivas?"] },
      { en: "Hold on, please.", es: "Espere, por favor.", lv: 2,
        we: ["Hold off, please.", "Call back, please.", "Hang on, please."],
        ws: ["Llame de vuelta, por favor.", "Espere un momento, por favor.", "Cuelgue, por favor."] },
      { en: "The line is busy.", es: "La línea está ocupada.", lv: 2,
        we: ["The line is free.", "The line was busy.", "The signal is weak."],
        ws: ["La línea está libre.", "La línea estaba ocupada.", "La señal es débil."] },
      { en: "I'll call you back later.", es: "Te llamo de vuelta más tarde.", lv: 2,
        we: ["I'll call you back earlier.", "I called you back later.", "I'll see you later."],
        ws: ["Te llamo de vuelta más temprano.", "Te llamé de vuelta más tarde.", "Nos vemos más tarde."] },
      { en: "Can I help you with that?", es: "¿Te ayudo con eso?", lv: 2,
        we: ["Can I help you with this?", "Could I help you with that?", "Do you need help with that?"],
        ws: ["¿Te ayudo con esto?", "¿Podría ayudarme con eso?", "¿Necesitas ayuda con eso?"] }
    ]
  },
  {
    title: "Cantidades",
    sentences: [
      { en: "How much does this cost?", es: "¿Cuánto cuesta esto?", lv: 2,
        we: ["How many does this cost?", "How much did this cost?", "How long does this cost?"],
        ws: ["¿Cuántos cuesta esto?", "¿Cuánto costó esto?", "¿Cuánto tiempo cuesta esto?"] },
      { en: "I need two tickets, please.", es: "Necesito dos entradas, por favor.", lv: 2,
        we: ["I need three tickets, please.", "I need two tickets for Friday.", "I want two tickets, please."],
        ws: ["Necesito tres entradas, por favor.", "Necesito dos entradas para el viernes.", "Quiero dos entradas, por favor."] },
      { en: "We have enough time.", es: "Tenemos suficiente tiempo.", lv: 2,
        we: ["We don't have enough time.", "We have too much time.", "We had enough time."],
        ws: ["No tenemos suficiente tiempo.", "Tenemos demasiado tiempo.", "Teníamos suficiente tiempo."] },
      { en: "There isn't much traffic today.", es: "No hay mucho tráfico hoy.", lv: 2,
        we: ["There is a lot of traffic today.", "There isn't any traffic today.", "There wasn't much traffic yesterday."],
        ws: ["Hay mucho tráfico hoy.", "No hay ningún tráfico hoy.", "No había mucho tráfico ayer."] },
      { en: "How many people can fit?", es: "¿Cuánta gente cabe?", lv: 2,
        we: ["How much people can fit?", "How many people could fit?", "How long can people fit?"],
        ws: ["¿Cuánto gente cabe?", "¿Cuánta gente podría caber?", "¿Cuánto tiempo caben las personas?"] }
    ]
  },
  {
    title: "Planes",
    sentences: [
      { en: "Do you want to grab lunch?", es: "¿Quieres almorzar juntos?", lv: 2,
        we: ["Do you want to grab dinner?", "Did you want to grab lunch?", "Do you have to grab lunch?"],
        ws: ["¿Quieres cenar juntos?", "¿Querías almorzar juntos?", "¿Tienes que almorzar?"] },
      { en: "Let's meet at the coffee shop.", es: "Reunámonos en la cafetería.", lv: 2,
        we: ["Let's meet at the coffee shop tomorrow.", "Let's meet near the coffee shop.", "We met at the coffee shop."],
        ws: ["Reunámonos mañana en la cafetería.", "Reunámonos cerca de la cafetería.", "Nos conocimos en la cafetería."] },
      { en: "Are you free this weekend?", es: "¿Estás libre este fin de semana?", lv: 2,
        we: ["Are you free next weekend?", "Are you busy this weekend?", "Will you be free this weekend?"],
        ws: ["¿Estás libre el próximo fin de semana?", "¿Estás ocupado este fin de semana?", "¿Estarás libre este fin de semana?"] },
      { en: "I'd rather stay home tonight.", es: "Prefiero quedarme en casa esta noche.", lv: 2,
        we: ["I'd rather stay home tonight too.", "I would rather go out tonight.", "I'd rather stay home tomorrow."],
        ws: ["Prefiero quedarme en casa esta noche también.", "Preferiría salir esta noche.", "Prefiero quedarme en casa mañana."] },
      { en: "We might go to the movies.", es: "Podríamos ir al cine.", lv: 2,
        we: ["We must go to the movies.", "We might go to the theater.", "We might have gone to the movies."],
        ws: ["Tenemos que ir al cine.", "Podríamos ir al teatro.", "Podríamos haber ido al cine."] }
    ]
  },
  {
    title: "Habilidades",
    sentences: [
      { en: "She speaks three languages.", es: "Ella habla tres idiomas.", lv: 2,
        we: ["She speaks two languages.", "She speaks three languages fluently.", "He speaks three languages."],
        ws: ["Ella habla dos idiomas.", "Ella habla tres idiomas con fluidez.", "Él habla tres idiomas."] },
      { en: "I can play the guitar.", es: "Puedo tocar la guitarra.", lv: 2,
        we: ["I can't play the guitar.", "I can play the piano.", "I must play the guitar."],
        ws: ["No puedo tocar la guitarra.", "Puedo tocar el piano.", "Debo tocar la guitarra."] },
      { en: "He can't lift heavy things.", es: "Él no puede levantar cosas pesadas.", lv: 2,
        we: ["He can lift heavy things.", "He can't lift light things.", "She can't lift heavy things."],
        ws: ["Él puede levantar cosas pesadas.", "Él no puede levantar cosas livianas.", "Ella no puede levantar cosas pesadas."] },
      { en: "Do you know how to use this app?", es: "¿Sabes cómo usar esta aplicación?", lv: 2,
        we: ["Do you know how to fix this app?", "Did you know how to use this app?", "Do you know why this app is slow?"],
        ws: ["¿Sabes cómo reparar esta aplicación?", "¿Sabías cómo usar esta aplicación?", "¿Sabes por qué esta aplicación es lenta?"] },
      { en: "Reading is my favorite hobby.", es: "Leer es mi pasatiempo favorito.", lv: 2,
        we: ["Cooking is my favorite hobby.", "Reading is my least favorite hobby.", "Reading was my favorite hobby."],
        ws: ["Cocinar es mi pasatiempo favorito.", "Leer es mi pasatiempo menos favorito.", "Leer era mi pasatiempo favorito."] }
    ]
  },
  {
    title: "Opiniones",
    sentences: [
      { en: "I think this is a good idea.", es: "Creo que esta es una buena idea.", lv: 2,
        we: ["I think this is a bad idea.", "I don't think this is a good idea.", "This is a good idea."],
        ws: ["Creo que esta es una mala idea.", "No creo que esta sea una buena idea.", "Esta es una buena idea."] },
      { en: "In my opinion, it's too expensive.", es: "En mi opinión, es demasiado caro.", lv: 2,
        we: ["In my opinion, it's too cheap.", "In my opinion, it isn't expensive.", "It's too expensive."],
        ws: ["En mi opinión, es demasiado barato.", "En mi opinión, no es caro.", "Es demasiado caro."] },
      { en: "I don't really agree with that.", es: "No estoy muy de acuerdo con eso.", lv: 2,
        we: ["I do really agree with that.", "I don't really understand that.", "I really agree with that."],
        ws: ["Estoy muy de acuerdo con eso.", "No entiendo muy bien eso.", "De acuerdo con eso."] },
      { en: "That sounds reasonable to me.", es: "Eso me suena razonable.", lv: 2,
        we: ["That sounds expensive to me.", "That doesn't sound reasonable.", "That sounds reasonable."],
        ws: ["Eso me suena caro.", "Eso no suena razonable.", "Eso suena razonable."] },
      { en: "I'm not sure, but maybe.", es: "No estoy seguro, pero quizás.", lv: 2,
        we: ["I'm sure, but maybe not.", "I'm not sure, but probably.", "I'm sure, and maybe."],
        ws: ["Estoy seguro, pero quizás no.", "No estoy seguro, pero probablemente.", "Estoy seguro, y quizás."] }
    ]
  },
  {
    title: "Repaso Nivel 2",
    sentences: [
      { en: "I was working when you called me.", es: "Estaba trabajando cuando me llamaste.", lv: 2,
        we: ["I was sleeping when you called me.", "I am working when you call me.", "I have worked when you called me."],
        ws: ["Estaba durmiendo cuando me llamaste.", "Estoy trabajando cuando me llamas.", "He trabajado cuando me llamaste."] },
      { en: "The restaurant was closed on Sunday.", es: "El restaurante estaba cerrado el domingo.", lv: 2,
        we: ["The restaurant was open on Sunday.", "The restaurant is closed on Sunday.", "The restaurant was closed on Saturday."],
        ws: ["El restaurante estaba abierto el domingo.", "El restaurante está cerrado el domingo.", "El restaurante estaba cerrado el sábado."] },
      { en: "She has been learning English for a year.", es: "Ella lleva un año aprendiendo inglés.", lv: 2,
        we: ["She learned English for a year.", "She has been learning English since a year.", "She will learn English for a year."],
        ws: ["Ella aprendió inglés durante un año.", "Ella lleva un año estudiando inglés.", "Ella aprenderá inglés durante un año."] },
      { en: "We should leave before it rains.", es: "Deberíamos salir antes de que llueva.", lv: 2,
        we: ["We should leave after it rains.", "We must leave before it rains.", "We should stay before it rains."],
        ws: ["Deberíamos salir después de que llueva.", "Debemos salir antes de que llueva.", "Deberíamos quedarnos antes de que llueva."] },
      { en: "I'll send you the details later.", es: "Te enviaré los detalles más tarde.", lv: 2,
        we: ["I sent you the details later.", "I'll send you the details tomorrow.", "I'll call you the details later."],
        ws: ["Te envié los detalles más tarde.", "Te enviaré los detalles mañana.", "Te llamaré con los detalles más tarde."] }
    ]
  },
  {
    title: "Presente Perfecto",
    sentences: [
      { en: "I have lived here for five years.", es: "Vivo aquí hace cinco años.", lv: 3,
        we: ["I have lived here for two years.", "I lived here for five years.", "I will have lived here for five years."],
        ws: ["Vivo aquí hace dos años.", "Viví aquí durante cinco años.", "Estaré viviendo aquí por cinco años."] },
      { en: "She has just finished her report.", es: "Ella acaba de terminar su informe.", lv: 3,
        we: ["She has already finished her report.", "She finished her report yesterday.", "She will just finish her report."],
        ws: ["Ella ya terminó su informe.", "Ella terminó su informe ayer.", "Ella acabará de terminar su informe."] },
      { en: "We haven't seen him since January.", es: "No lo hemos visto desde enero.", lv: 3,
        we: ["We saw him in January.", "We haven't seen him for a year.", "We won't see him until January."],
        ws: ["Lo vimos en enero.", "No lo vemos hace un año.", "No lo veremos hasta enero."] },
      { en: "Have you ever eaten sushi?", es: "¿Alguna vez has comido sushi?", lv: 3,
        we: ["Have you ever eaten pasta?", "Did you ever eat sushi yesterday?", "Have you ever tried sushi?"],
        ws: ["¿Alguna vez has comido pasta?", "¿Comiste sushi ayer?", "¿Alguna vez has probado sushi?"] },
      { en: "They have already paid the bill.", es: "Ellos ya han pagado la cuenta.", lv: 3,
        we: ["They haven't paid the bill yet.", "They paid the bill yesterday.", "They will already have paid the bill."],
        ws: ["Ellos todavía no han pagado la cuenta.", "Ellos pagaron la cuenta ayer.", "Ellos ya habrán pagado la cuenta."] }
    ]
  },
  {
    title: "Pasado vs Perfecto",
    sentences: [
      { en: "I lost my keys yesterday.", es: "Perdí mis llaves ayer.", lv: 3,
        we: ["I lost my keys in January.", "I have lost my keys yesterday.", "I lose my keys every week."],
        ws: ["Perdí mis llaves en enero.", "He perdido mis llaves ayer.", "Pierdo mis llaves todas las semanas."] },
      { en: "I have lost my keys twice this year.", es: "He perdido mis llaves dos veces este año.", lv: 3,
        we: ["I lost my keys twice this year.", "I have lost my keys once this year.", "I had lost my keys twice this year."],
        ws: ["Perdí mis llaves dos veces este año.", "He perdido mis llaves una vez este año.", "Había perdido mis llaves dos veces este año."] },
      { en: "We met in 2019.", es: "Nos conocimos en 2019.", lv: 3,
        we: ["We have met in 2019.", "We meet in 2019.", "We will meet in 2019."],
        ws: ["Nos hemos conocido en 2019.", "Nos conocemos en 2019.", "Nos conoceremos en 2019."] },
      { en: "I haven't seen the new movie.", es: "No he visto la nueva película.", lv: 3,
        we: ["I saw the new movie.", "I haven't seen the new movie yet.", "I won't see the new movie."],
        ws: ["Vi la nueva película.", "Todavía no he visto la nueva película.", "No veré la nueva película."] },
      { en: "She went to the doctor this morning.", es: "Ella fue al médico esta mañana.", lv: 3,
        we: ["She has gone to the doctor this morning.", "She will go to the doctor this morning.", "She goes to the doctor every morning."],
        ws: ["Ella ha ido al médico esta mañana.", "Ella irá al médico esta mañana.", "Ella va al médico cada mañana."] }
    ]
  },
  {
    title: "Primera Condicional",
    sentences: [
      { en: "If it rains, we will stay home.", es: "Si llueve, nos quedaremos en casa.", lv: 3,
        we: ["If it rains, we will go out.", "If it rained, we would stay home.", "Unless it rains, we will stay home."],
        ws: ["Si llueve, saldremos.", "Si llovía, nos quedaríamos en casa.", "A menos que llueva, nos quedaremos en casa."] },
      { en: "If you study, you will improve.", es: "Si estudias, mejorarás.", lv: 3,
        we: ["If you studied, you would improve.", "If you study, you won't improve.", "Unless you study, you will improve."],
        ws: ["Si estudiaste, mejorarías.", "Si estudias, no mejorarás.", "A menos que estudies, mejorarás."] },
      { en: "I'll call you if I have news.", es: "Te llamaré si tengo noticias.", lv: 3,
        we: ["I'll call you if I have time.", "I called you if I had news.", "I'll call you unless I have news."],
        ws: ["Te llamaré si tengo tiempo.", "Te llamé si tenía noticias.", "Te llamaré a menos que tenga noticias."] },
      { en: "We won't go out if it's cold.", es: "No saldremos si hace frío.", lv: 3,
        we: ["We won't go out if it's hot.", "We will go out if it's cold.", "We didn't go out if it was cold."],
        ws: ["No saldremos si hace calor.", "Saldremos si hace frío.", "No saldimos si hacía frío."] },
      { en: "She'll be happy if you come.", es: "Ella estará feliz si vienes.", lv: 3,
        we: ["She'd be happy if you came.", "She'll be sad if you come.", "She'll be happy if you stay."],
        ws: ["Ella estaría feliz si vinieras.", "Ella estaría triste si vienes.", "Ella estaría feliz si te quedas."] }
    ]
  },
  {
    title: "Pasiva",
    sentences: [
      { en: "The report was written by Ana.", es: "El informe fue escrito por Ana.", lv: 3,
        we: ["The report was written for Ana.", "Ana wrote the report.", "The report is written by Ana."],
        ws: ["El informe fue escrito para Ana.", "Ana escribió el informe.", "El informe está escrito por Ana."] },
      { en: "English is spoken everywhere.", es: "El inglés se habla en todas partes.", lv: 3,
        we: ["English is taught everywhere.", "English was spoken everywhere.", "Spanish is spoken everywhere."],
        ws: ["El inglés se enseña en todas partes.", "El inglés se hablaba en todas partes.", "El español se habla en todas partes."] },
      { en: "The project will be finished on time.", es: "El proyecto terminará a tiempo.", lv: 3,
        we: ["The project will be delayed.", "The project will be finished late.", "They will finish the project on time."],
        ws: ["El proyecto se retrasará.", "El proyecto terminará tarde.", "Terminarán el proyecto a tiempo."] },
      { en: "My car is being repaired.", es: "Mi auto está siendo reparado.", lv: 3,
        we: ["My car was repaired last week.", "They are repairing my car.", "My car has been repaired."],
        ws: ["Mi auto fue reparado la semana pasada.", "Están reparando mi auto.", "Mi auto ha sido reparado."] },
      { en: "The results were announced yesterday.", es: "Los resultados fueron anunciados ayer.", lv: 3,
        we: ["The results are announced today.", "The team announced the results yesterday.", "The results weren't announced."],
        ws: ["Los resultados se anuncian hoy.", "El equipo anunció los resultados ayer.", "Los resultados no fueron anunciados."] }
    ]
  },
  {
    title: "Gerundio e Infinitivo",
    sentences: [
      { en: "I enjoy reading before bed.", es: "Disfruto leer antes de dormir.", lv: 3,
        we: ["I enjoy to read before bed.", "I enjoy reading after breakfast.", "I enjoy reading before work."],
        ws: ["Disfruto leer antes del desayuno.", "Disfruto leer después del desayuno.", "Disfruto leer antes de trabajar."] },
      { en: "She decided to move abroad.", es: "Ella decidió mudarse al extranjero.", lv: 3,
        we: ["She decided moving abroad.", "She decided to move here.", "She decided to move abroad next year."],
        ws: ["Ella decidió mudarse aquí.", "Ella decidió mudarse al extranjero el próximo año.", "Ella decidió quedarse en el extranjero."] },
      { en: "Walking there takes twenty minutes.", es: "Caminar hasta allá toma veinte minutos.", lv: 3,
        we: ["Walking there takes ten minutes.", "It takes twenty minutes to get there.", "Walking there took twenty minutes."],
        ws: ["Caminar hasta allá toma diez minutos.", "Se necesitan veinte minutos para llegar allá.", "Caminar hasta allá tomaba veinte minutos."] },
      { en: "He avoided answering the question.", es: "Él evitó responder la pregunta.", lv: 3,
        we: ["He avoided to answer the question.", "He answered the question.", "He avoided asking the question."],
        ws: ["Él evitó hacer la pregunta.", "Él respondió la pregunta.", "Él siguió respondiendo la pregunta."] },
      { en: "I plan to study abroad next year.", es: "Planeo estudiar en el extranjero el próximo año.", lv: 3,
        we: ["I plan studying abroad next year.", "I plan to study here next year.", "I studied abroad last year."],
        ws: ["Planeo estudiar aquí el próximo año.", "Estudié en el extranjero el año pasado.", "Planeo viajar al extranjero el próximo año."] }
    ]
  },
  {
    title: "Phrasal Verbs 1",
    sentences: [
      { en: "Please turn off the lights.", es: "Por favor apaga las luces.", lv: 3,
        we: ["Please turn on the lights.", "Please turn off the TV.", "Please turn up the lights."],
        ws: ["Por favor enciende las luces.", "Por favor apaga el televisor.", "Por favor sube las luces."] },
      { en: "I need to look for my phone.", es: "Necesito buscar mi teléfono.", lv: 3,
        we: ["I need to look after my phone.", "I need to look at my phone.", "I need to turn on my phone."],
        ws: ["Necesito cuidar mi teléfono.", "Necesito revisar mi teléfono.", "Necesito encender mi teléfono."] },
      { en: "Let's talk about it later.", es: "Hablemos de eso después.", lv: 3,
        we: ["Let's talk about it now.", "Let's talk over it later.", "Let's look at it later."],
        ws: ["Hablemos de eso ahora.", "Hablemos de eso más tarde.", "Revisemos eso después."] },
      { en: "She showed up two hours late.", es: "Ella llegó dos horas tarde.", lv: 3,
        we: ["She showed up two hours early.", "She showed off two hours late.", "She won't show up late."],
        ws: ["Ella llegó dos horas temprano.", "Ella se vanaglorió dos horas tarde.", "Ella no llegará tarde."] },
      { en: "Please fill in your name here.", es: "Por favor completa tu nombre aquí.", lv: 3,
        we: ["Please fill out your name here.", "Please write your name here.", "Please read your name here."],
        ws: ["Por favor rellena tu nombre aquí.", "Por favor escribe tu nombre aquí.", "Por favor lee tu nombre aquí."] }
    ]
  },
  {
    title: "Phrasal Verbs 2",
    sentences: [
      { en: "We need to work out the details.", es: "Tenemos que resolver los detalles.", lv: 3,
        we: ["We need to work on the details.", "We need to find out the details.", "We need to time out the details."],
        ws: ["Tenemos que trabajar en los detalles.", "Tenemos que averiguar los detalles.", "Ya se nos acabó el tiempo para los detalles."] },
      { en: "He ran out of coffee.", es: "Se quedó sin café.", lv: 3,
        we: ["He ran out of milk.", "He ran into coffee.", "He ran out of money."],
        ws: ["Se quedó sin leche.", "Se topó con el café.", "Se quedó sin dinero."] },
      { en: "Can you check on the client?", es: "¿Puedes revisar al cliente?", lv: 3,
        we: ["Can you check out the client?", "Can you check in the client?", "Can you look after the client?"],
        ws: ["¿Podrías revisar al cliente?", "¿Puedes contactar al cliente?", "¿Sabes cómo atender al cliente?"] },
      { en: "I found out about the delay.", es: "Me enteré del retraso.", lv: 3,
        we: ["I found out about the delay yesterday.", "I found the delay out.", "I found out about the price."],
        ws: ["Me enteré del retraso ayer.", "Descubrí el retraso.", "Me enteré del precio."] },
      { en: "Let's set up a meeting.", es: "Organicemos una reunión.", lv: 3,
        we: ["Let's set off a meeting.", "Let's set up a party.", "Let's sit down for a meeting."],
        ws: ["Organicemos una fiesta.", "Sentémonos a tener una reunión.", "Cancelemos la reunión."] }
    ]
  },
  {
    title: "Comparativos",
    sentences: [
      { en: "This one is cheaper than that one.", es: "Este es más barato que ese.", lv: 3,
        we: ["This one is more expensive than that one.", "This one is cheaper as that one.", "That one is cheaper than this one."],
        ws: ["Este es más caro que ese.", "Este es tan barato como ese.", "Ese es más barato que este."] },
      { en: "She's more experienced than me.", es: "Ella tiene más experiencia que yo.", lv: 3,
        we: ["She's less experienced than me.", "She's as experienced as me.", "He's more experienced than me."],
        ws: ["Ella tiene menos experiencia que yo.", "Ella tiene tanta experiencia como yo.", "Él tiene más experiencia que yo."] },
      { en: "It's the best restaurant in town.", es: "Es el mejor restaurante de la ciudad.", lv: 3,
        we: ["It's the best restaurant in the country.", "It's the worst restaurant in town.", "It's the cheapest restaurant in town."],
        ws: ["Es el mejor restaurante del país.", "Es el peor restaurante de la ciudad.", "Es el restaurante más barato de la ciudad."] },
      { en: "The exam was less difficult than expected.", es: "El examen fue menos difícil de lo esperado.", lv: 3,
        we: ["The exam was more difficult than expected.", "The exam was as difficult as expected.", "The exam wasn't difficult at all."],
        ws: ["El examen fue más difícil de lo esperado.", "El examen fue tan difícil como se esperaba.", "El examen no fue difícil."] },
      { en: "He drives as fast as his brother.", es: "Él maneja tan rápido como su hermano.", lv: 3,
        we: ["He drives faster than his brother.", "He drives as slow as his brother.", "His brother drives as fast as him."],
        ws: ["Él maneja más rápido que su hermano.", "Él maneja tan lento como su hermano.", "Su hermano maneja tan rápido como él."] }
    ]
  },
  {
    title: "Superlativos",
    sentences: [
      { en: "It's the most useful app I've used.", es: "Es la aplicación más útil que he usado.", lv: 3,
        we: ["It's the least useful app I've used.", "It's the most useful app I've seen.", "It's the most expensive app I've used."],
        ws: ["Es la aplicación menos útil que he usado.", "Es la aplicación más útil que he visto.", "Es la aplicación más cara que he usado."] },
      { en: "That's the worst mistake of the year.", es: "Ese es el peor error del año.", lv: 3,
        we: ["That's the best mistake of the year.", "That's the worst mistake of last year.", "That was the worst mistake of the year."],
        ws: ["Ese es el mejor error del año.", "Ese es el peor error del año pasado.", "Ese fue el peor error del año."] },
      { en: "She is one of the best teachers here.", es: "Ella es una de las mejores maestras aquí.", lv: 3,
        we: ["She is one of the worst teachers here.", "She is the best teacher here.", "She is one of the best students here."],
        ws: ["Ella es una de las peores maestras aquí.", "Ella es la mejor maestra aquí.", "Ella es una de las mejores estudiantes aquí."] },
      { en: "The second floor is quieter.", es: "El segundo piso es más silencioso.", lv: 3,
        we: ["The second floor is louder.", "The second floor is as quiet as the third.", "The third floor is quieter."],
        ws: ["El segundo piso es más ruidoso.", "El segundo piso es tan silencioso como el tercero.", "El tercer piso es más silencioso."] },
      { en: "This is by far the hardest level.", es: "Este es, con diferencia, el nivel más difícil.", lv: 3,
        we: ["This is by far the easiest level.", "This is the hardest level so far.", "This level is hardly the hardest."],
        ws: ["Este es, con diferencia, el nivel más fácil.", "Este es el nivel más difícil hasta ahora.", "Este nivel apenas es el más difícil."] }
    ]
  },
  {
    title: "Email de Trabajo",
    sentences: [
      { en: "I'm writing to confirm our appointment.", es: "Escribo para confirmar nuestra cita.", lv: 3,
        we: ["I'm writing to cancel our appointment.", "I'm writing to confirm our invoice.", "I wrote to confirm our appointment."],
        ws: ["Escribo para cancelar nuestra cita.", "Escribo para confirmar nuestra factura.", "Escribí para confirmar nuestra cita."] },
      { en: "Please find attached the invoice.", es: "Adjunto la factura.", lv: 3,
        we: ["Please find enclosed the invoice.", "Please find attached the receipt.", "Please send me the invoice."],
        ws: ["Adjunto el recibo.", "Le adjunto la factura.", "Envíame la factura por favor."] },
      { en: "I look forward to hearing from you.", es: "Espero tener noticias tuyas.", lv: 3,
        we: ["I look forward to see you soon.", "I look forward to hearing about you.", "I don't look forward to hearing from you."],
        ws: ["Espero verte pronto.", "Espero tener noticias sobre ti.", "No espero tener noticias tuyas."] },
      { en: "Could you send me the updated version?", es: "¿Podrías enviarme la versión actualizada?", lv: 3,
        we: ["Could you send me the previous version?", "Would you send me the updated version?", "Could you show me the updated version?"],
        ws: ["¿Podrías enviarme la versión anterior?", "¿Me enviarías la versión actualizada?", "¿Podrías mostrarme la versión actualizada?"] },
      { en: "Please let me know if you have any questions.", es: "Avísame si tienes alguna pregunta.", lv: 3,
        we: ["Please let me know if you have any problems.", "Let me know if you had any questions.", "Please let me know about any questions."],
        ws: ["Avísame si tienes algún problema.", "Avísame si tuviste alguna pregunta.", "Por favor avísame cualquier pregunta."] }
    ]
  },
  {
    title: "Presentar y Defender",
    sentences: [
      { en: "Let me explain the main idea.", es: "Déjame explicar la idea principal.", lv: 3,
        we: ["Let me explain the main idea again.", "Let me explain the last idea.", "I explained the main idea."],
        ws: ["Déjame explicar la idea principal otra vez.", "Déjame explicar la última idea.", "Expliqué la idea principal."] },
      { en: "Our goal is to reduce costs.", es: "Nuestra meta es reducir los costos.", lv: 3,
        we: ["Our goal is to reduce sales.", "Our goal was to reduce costs.", "Our goal is to increase costs."],
        ws: ["Nuestra meta es reducir las ventas.", "Nuestra meta era reducir los costos.", "Nuestra meta es aumentar los costos."] },
      { en: "This improves the user experience.", es: "Esto mejora la experiencia del usuario.", lv: 3,
        we: ["This improves the user interface.", "This reduces the user experience.", "This improves the employee experience."],
        ws: ["Esto mejora la interfaz de usuario.", "Esto reduce la experiencia del usuario.", "Esto mejora la experiencia del empleado."] },
      { en: "Let's move on to the next topic.", es: "Pasemos al siguiente tema.", lv: 3,
        we: ["Let's move on to the last topic.", "Let's move back to the next topic.", "Let's move on to the previous topic."],
        ws: ["Pasemos al último tema.", "Volvamos al siguiente tema.", "Pasemos al tema anterior."] },
      { en: "In summary, we need more data.", es: "En resumen, necesitamos más datos.", lv: 3,
        we: ["In summary, we need less data.", "To summarize, we need more data.", "In conclusion, we need more time."],
        ws: ["En resumen, necesitamos menos datos.", "Para resumir, necesitamos más datos.", "En conclusión, necesitamos más tiempo."] }
    ]
  },
  {
    title: "Rutinas y Deberes",
    sentences: [
      { en: "He speaks three languages fluently.", es: "Él habla tres idiomas con fluidez.", lv: 3,
        we: ["He speaks three languages slowly.", "He speaks two languages fluently.", "She speaks three languages fluently."],
        ws: ["Él habla tres idiomas lentamente.", "Él habla dos idiomas con fluidez.", "Ella habla tres idiomas con fluidez."] },
      { en: "I have to take a bus every morning.", es: "Tengo que tomar un autobús cada mañana.", lv: 3,
        we: ["I have to take a bus every night.", "I don't have to take a bus every morning.", "I have to take a train every morning."],
        ws: ["Tengo que tomar un autobús cada noche.", "No tengo que tomar un autobús cada mañana.", "Tengo que tomar un tren cada mañana."] },
      { en: "You should get some exercise.", es: "Deberías hacer algo de ejercicio.", lv: 3,
        we: ["You should get some rest.", "You must get some exercise.", "You should get more exercise."],
        ws: ["Deberías descansar un poco.", "Debes hacer algo de ejercicio.", "Deberías hacer más ejercicio."] },
      { en: "The train leaves in ten minutes.", es: "El tren sale en diez minutos.", lv: 3,
        we: ["The train leaves in ten hours.", "The train arrived ten minutes ago.", "The train leaves at ten o'clock."],
        ws: ["El tren sale en diez horas.", "El tren llegó hace diez minutos.", "El tren sale a las diez en punto."] },
      { en: "She's supposed to arrive by noon.", es: "Se supone que ella llega antes del mediodía.", lv: 3,
        we: ["She's supposed to arrive by midnight.", "She's not supposed to arrive by noon.", "She arrived by noon."],
        ws: ["Se supone que ella llega antes de medianoche.", "No se supone que ella llegue antes del mediodía.", "Ella llegó antes del mediodía."] }
    ]
  },
  {
    title: "Educación",
    sentences: [
      { en: "I failed the exam last year.", es: "Reprobé el examen el año pasado.", lv: 3,
        we: ["I passed the exam last year.", "I failed the exam last week.", "I will fail the exam last year."],
        ws: ["Aprobé el examen el año pasado.", "Reprobé el examen la semana pasada.", "Reprobaré el examen el año pasado."] },
      { en: "She passed all her courses.", es: "Ella aprobó todos sus cursos.", lv: 3,
        we: ["She failed all her courses.", "She passed two of her courses.", "She is passing all her courses."],
        ws: ["Ella reprobó todos sus cursos.", "Ella aprobó dos de sus cursos.", "Ella está aprobando todos sus cursos."] },
      { en: "The university offers free courses.", es: "La universidad ofrece cursos gratuitos.", lv: 3,
        we: ["The university offers paid courses.", "The university offered free courses.", "The school offers free courses."],
        ws: ["La universidad ofrece cursos de pago.", "La universidad ofreció cursos gratuitos.", "El colegio ofrece cursos gratuitos."] },
      { en: "I'm taking a class in economics.", es: "Estoy tomando una clase de economía.", lv: 3,
        we: ["I took a class in economics.", "I'm teaching a class in economics.", "I'm taking a class in history."],
        ws: ["Tomé una clase de economía.", "Estoy dando una clase de economía.", "Estoy tomando una clase de historia."] },
      { en: "He dropped out of school.", es: "Él dejó los estudios.", lv: 3,
        we: ["He dropped out of work.", "He graduated from school.", "He is dropping out of school."],
        ws: ["Él dejó el trabajo.", "Él se graduó del colegio.", "Él está dejando los estudios."] }
    ]
  },
  {
    title: "Problemas y Soluciones",
    sentences: [
      { en: "We need to fix this problem quickly.", es: "Tenemos que arreglar este problema rápido.", lv: 3,
        we: ["We need to find this problem quickly.", "We need to fix this problem carefully.", "We managed to fix this problem quickly."],
        ws: ["Tenemos que encontrar este problema rápido.", "Tenemos que arreglar este problema con cuidado.", "Logramos arreglar este problema rápido."] },
      { en: "The solution is simpler than it looks.", es: "La solución es más simple de lo que parece.", lv: 3,
        we: ["The solution is more complicated than it looks.", "The problem is simpler than it looks.", "The solution is as simple as it looks."],
        ws: ["La solución es más complicada de lo que parece.", "El problema es más simple de lo que parece.", "La solución es tan simple como parece."] },
      { en: "Something went wrong yesterday.", es: "Algo salió mal ayer.", lv: 3,
        we: ["Something went wrong tomorrow.", "Everything went wrong yesterday.", "Nothing went wrong yesterday."],
        ws: ["Algo saldrá mal mañana.", "Todo salió mal ayer.", "No salió mal nada ayer."] },
      { en: "I'm taking care of it.", es: "Yo me estoy encargando de eso.", lv: 3,
        we: ["I'm taking care of him.", "I'll take care of it.", "You're taking care of it."],
        ws: ["Yo me estoy encargando de él.", "Yo me encargaré de eso.", "Tú te estás encargando de eso."] },
      { en: "We ran into a small issue.", es: "Encontramos un pequeño problema.", lv: 3,
        we: ["We ran into a big issue.", "We ran out of small issues.", "We walked into a small issue."],
        ws: ["Encontramos un gran problema.", "Nos quedamos sin problemas pequeños.", "Caminamos hacia un pequeño problema."] }
    ]
  },
  {
    title: "Repaso Nivel 3",
    sentences: [
      { en: "If you had asked, I would have helped.", es: "Si me hubieras preguntado, te habría ayudado.", lv: 3,
        we: ["If you ask, I would have helped.", "If you had asked, I would help.", "If you had asked, I would have helped her."],
        ws: ["Si me preguntas, te habría ayudado.", "Si me hubieras preguntado, te ayudaría.", "Si me hubieras preguntado, la habría ayudado a ella."] },
      { en: "The rules have changed since last year.", es: "Las reglas han cambiado desde el año pasado.", lv: 3,
        we: ["The rules changed last year.", "The rules have changed last year.", "The rules will change next year."],
        ws: ["Las reglas cambiaron el año pasado.", "Las reglas ya cambiaron este año.", "Las reglas cambiarán el próximo año."] },
      { en: "I've been working here for two years.", es: "Llevo dos años trabajando aquí.", lv: 3,
        we: ["I worked here for two years.", "I'll be working here for two years.", "I've been working here since two years."],
        ws: ["Trabajé aquí durante dos años.", "Estaré trabajando aquí durante dos años.", "Hace dos años que trabajo aquí."] },
      { en: "She didn't realize how late it was.", es: "Ella no se dio cuenta de qué tarde era.", lv: 3,
        we: ["She realized how late it was.", "She didn't realize how early it was.", "She doesn't realize how late it is."],
        ws: ["Ella se dio cuenta de qué tarde era.", "Ella no se dio cuenta de qué temprano era.", "Ella no se da cuenta de qué tarde es."] },
      { en: "We should have left earlier.", es: "Deberíamos habernos ido antes.", lv: 3,
        we: ["We should have left later.", "We should leave earlier.", "We would have left earlier."],
        ws: ["Deberíamos habernos ido después.", "Deberíamos salir antes.", "Nos habríamos ido antes."] }
    ]
  },
  {
    title: "Perfecto vs Pasado Profundo",
    sentences: [
      { en: "I've known him since childhood.", es: "Lo conozco desde la infancia.", lv: 4,
        we: ["I knew him since childhood.", "I've known him for a year.", "I met him last year."],
        ws: ["Lo conocía desde la infancia.", "Lo conozco hace un año.", "Lo conocí el año pasado."] },
      { en: "I knew him when he lived abroad.", es: "Lo conocía cuando vivía en el extranjero.", lv: 4,
        we: ["I know him when he lives abroad.", "I knew him when he lived here.", "I know him since he lived abroad."],
        ws: ["Lo conozco cuando vive en el extranjero.", "Lo conocía cuando vivía aquí.", "Lo conozco desde que vivía en el extranjero."] },
      { en: "She's been working on the same project all month.", es: "Lleva todo el mes trabajando en el mismo proyecto.", lv: 4,
        we: ["She worked on the same project last month.", "She's been working on a new project all month.", "She will work on the same project all month."],
        ws: ["Trabajó en el mismo proyecto el mes pasado.", "Lleva todo el mes trabajando en un proyecto nuevo.", "Trabajará en el mismo proyecto todo el mes."] },
      { en: "We had already left when he arrived.", es: "Ya nos habíamos ido cuando él llegó.", lv: 4,
        we: ["We have already left when he arrives.", "We had left before he arrived.", "We had already left after he arrived."],
        ws: ["Ya nos hemos ido cuando él llega.", "Nos habíamos ido antes de que él llegara.", "Ya nos habíamos ido después de que él llegó."] },
      { en: "He has just realized his mistake.", es: "Él acaba de darse cuenta de su error.", lv: 4,
        we: ["He has just repeated his mistake.", "He realized his mistake yesterday.", "He will just realize his mistake."],
        ws: ["Él acaba de repetir su error.", "Él se dio cuenta de su error ayer.", "Él se dará cuenta de su error pronto."] }
    ]
  },
  {
    title: "Segunda y Tercera Condicional",
    sentences: [
      { en: "If I had more time, I would travel.", es: "Si tuviera más tiempo, viajaría.", lv: 4,
        we: ["If I have more time, I will travel.", "If I had more time, I would have traveled.", "If I had more money, I would travel."],
        ws: ["Si tengo más tiempo, viajaré.", "Si tuviera más tiempo, habría viajado.", "Si tuviera más dinero, viajaría."] },
      { en: "If I had studied, I would have passed.", es: "Si hubiera estudiado, habría aprobado.", lv: 4,
        we: ["If I study, I will pass.", "If I had studied, I would pass.", "If I had studied, I would have failed."],
        ws: ["Si estudio, aprobaré.", "Si hubiera estudiado, aprobaría.", "Si hubiera estudiado, habría reprobado."] },
      { en: "She would have helped if you had asked.", es: "Ella te habría ayudado si se lo hubieras pedido.", lv: 4,
        we: ["She would help if you asked.", "She will have helped if you ask.", "She would have helped if you didn't ask."],
        ws: ["Ella te ayudaría si le pides.", "Ella te habrá ayudado si le pides.", "Ella te habría ayudado si no le hubieras pedido."] },
      { en: "If I were you, I would resign.", es: "Si fuera tú, renunciaría.", lv: 4,
        we: ["If I were you, I would resign now.", "If I am you, I would resign.", "If I were her, I would resign."],
        ws: ["Si fuera tú, renunciaría ahora.", "Si soy tú, renunciaría.", "Si fuera ella, renunciaría."] },
      { en: "We wish the deadline hadn't moved.", es: "Ojalá la fecha límite no se hubiera movido.", lv: 4,
        we: ["We wish the deadline hadn't been moved.", "We hope the deadline hasn't moved.", "We wish the deadline had moved."],
        ws: ["Ojalá la fecha límite no se hubiera adelantado.", "Esperamos que la fecha límite no se haya movido.", "Ojalá la fecha límite se hubiera movido."] }
    ]
  },
  {
    title: "Pasiva Avanzada",
    sentences: [
      { en: "The contract is being reviewed by legal.", es: "El contrato está siendo revisado por el área legal.", lv: 4,
        we: ["The contract has been reviewed by legal.", "Legal is reviewing the contract.", "The contract was reviewed by legal."],
        ws: ["El contrato ha sido revisado por el área legal.", "El área legal está revisando el contrato.", "El contrato fue revisado por el área legal."] },
      { en: "Mistakes must be reported immediately.", es: "Los errores deben reportarse de inmediato.", lv: 4,
        we: ["Mistakes must be reported eventually.", "Mistakes must be hidden immediately.", "Mistakes should be reported immediately."],
        ws: ["Los errores deben reportarse más tarde.", "Los errores deben ocultarse de inmediato.", "Los errores deberían reportarse de inmediato."] },
      { en: "It is widely believed that the theory is flawed.", es: "Se cree ampliamente que la teoría tiene fallas.", lv: 4,
        we: ["It is widely reported that the theory is flawed.", "It is widely believed that the theory is sound.", "The theory is widely believed to be flawed."],
        ws: ["Se informa ampliamente que la teoría tiene fallas.", "Se cree ampliamente que la teoría es sólida.", "Se cree que la teoría tiene fallas."] },
      { en: "The building had been renovated before the sale.", es: "El edificio había sido renovado antes de la venta.", lv: 4,
        we: ["The building has been renovated before the sale.", "The building was renovated after the sale.", "The building had been renovated after the sale."],
        ws: ["El edificio ha sido renovado antes de la venta.", "El edificio fue renovado después de la venta.", "El edificio había sido renovado después de la venta."] },
      { en: "Nothing was said about the budget.", es: "No se dijo nada sobre el presupuesto.", lv: 4,
        we: ["Everything was said about the budget.", "Something was said about the budget.", "Nothing has been said about the budget."],
        ws: ["Se dijo todo sobre el presupuesto.", "Se dijo algo sobre el presupuesto.", "No se ha dicho nada sobre el presupuesto."] }
    ]
  },
  {
    title: "Discurso Indirecto",
    sentences: [
      { en: "She said she was busy that day.", es: "Ella dijo que estaba ocupada ese día.", lv: 4,
        we: ["She says she is busy that day.", "She said she was busy yesterday.", "She asked whether she was busy."],
        ws: ["Ella dice que está ocupada ese día.", "Ella dijo que estaba ocupada ayer.", "Ella preguntó si estaba ocupada."] },
      { en: "He told me he would call later.", es: "Él me dijo que llamaría después.", lv: 4,
        we: ["He told me he called later.", "He said he would call earlier.", "He told me he would see you later."],
        ws: ["Él me dijo que llamó después.", "Él me dijo que llamaría antes.", "Él me dijo que te vería después."] },
      { en: "They explained that the train had been delayed.", es: "Ellos explicaron que el tren había sido retrasado.", lv: 4,
        we: ["They explained that the train has been delayed.", "They explained that the train was delayed.", "They explained why the train had been delayed."],
        ws: ["Explicaron que el tren había sido retrasado.", "Dijeron que el tren se retrasaría.", "Contaron por qué el tren se retrasó."] },
      { en: "I asked whether the price included tax.", es: "Pregunté si el precio incluía impuestos.", lv: 4,
        we: ["I asked if the price included tax.", "I asked whether the price excluded tax.", "I asked whether the price included delivery."],
        ws: ["Quise saber si el precio incluía impuestos.", "Pregunté si el precio excluía impuestos.", "Pregunté si el precio incluía el envío."] },
      { en: "She admitted that she had forgotten.", es: "Ella admitió que se había olvidado.", lv: 4,
        we: ["She admitted that she had remembered.", "She denied that she had forgotten.", "She admitted that she would forget."],
        ws: ["Ella admitió que se había olvidado la cita.", "Ella negó haber olvidado nada.", "Dijeron que ella se había olvidado."] }
    ]
  },
  {
    title: "Linkers de Contraste",
    sentences: [
      { en: "Although it was raining, we went outside.", es: "Aunque llovía, salimos afuera.", lv: 4,
        we: ["Although it was raining, we stayed inside.", "Because it was raining, we went outside.", "Although it will be raining, we went outside."],
        ws: ["Aunque llovía, nos quedamos adentro.", "Como llovía, salimos afuera.", "Aunque va a llover, salimos afuera."] },
      { en: "However, the results were surprising.", es: "Sin embargo, los resultados fueron sorprendentes.", lv: 4,
        we: ["However, the results were expected.", "Therefore, the results were surprising.", "However, the results will be surprising."],
        ws: ["Sin embargo, los resultados fueron esperados.", "Por lo tanto, los resultados fueron sorprendentes.", "Sin embargo, los resultados serán sorprendentes."] },
      { en: "On the other hand, the cost is lower.", es: "Por otro lado, el costo es menor.", lv: 4,
        we: ["On the other hand, the cost is higher.", "On the contrary, the cost is lower.", "On the other hand, the cost is double."],
        ws: ["Por otro lado, el costo es mayor.", "Al contrario, el costo es menor.", "Por otro lado, el costo es el doble."] },
      { en: "Nevertheless, the plan is worth trying.", es: "No obstante, el plan vale la pena.", lv: 4,
        we: ["Nevertheless, the plan isn't worth trying.", "Therefore, the plan is worth trying.", "Nevertheless, the plan was worth trying."],
        ws: ["No obstante, el plan no vale la pena.", "Por lo tanto, el plan vale la pena.", "No obstante, el plan valía la pena."] },
      { en: "Even though he was tired, he finished.", es: "Aunque estaba cansado, terminó.", lv: 4,
        we: ["Even though he was tired, he quit.", "Because he was tired, he finished.", "Even though he was rested, he finished."],
        ws: ["Aunque estaba cansado, se rindió.", "Como estaba cansado, terminó.", "Aunque estaba descansado, terminó."] }
    ]
  },
  {
    title: "Linkers de Causa",
    sentences: [
      { en: "The flight was canceled because of the storm.", es: "El vuelo fue cancelado por la tormenta.", lv: 4,
        we: ["The flight was delayed because of the storm.", "The flight was canceled because of the fog.", "The flight will be canceled because of the storm."],
        ws: ["El vuelo se retrasó por la tormenta.", "El vuelo fue cancelado por la niebla.", "El vuelo será cancelado por la tormenta."] },
      { en: "Since we arrived early, we waited outside.", es: "Como llegamos temprano, esperamos afuera.", lv: 4,
        we: ["Since we arrived late, we waited outside.", "Although we arrived early, we waited outside.", "Since we arrived early, we went inside."],
        ws: ["Como llegamos tarde, esperamos afuera.", "Aunque llegamos temprano, esperamos afuera.", "Como llegamos temprano, entramos."] },
      { en: "Therefore, we changed the schedule.", es: "Por lo tanto, cambiamos el horario.", lv: 4,
        we: ["However, we changed the schedule.", "Therefore, we kept the schedule.", "Therefore, we will change the schedule."],
        ws: ["Sin embargo, cambiamos el horario.", "Por lo tanto, mantuvimos el horario.", "Por lo tanto, cambiaremos el horario."] },
      { en: "The project failed due to poor planning.", es: "El proyecto fracasó debido a una mala planificación.", lv: 4,
        we: ["The project failed due to poor funding.", "The project succeeded due to poor planning.", "The project failed due to poor management."],
        ws: ["El proyecto fracasó debido a la falta de fondos.", "El proyecto tuvo éxito debido a una mala planificación.", "El proyecto fracasó debido a una mala gestión."] },
      { en: "As a result, sales dropped sharply.", es: "Como resultado, las ventas cayeron bruscamente.", lv: 4,
        we: ["As a result, sales rose sharply.", "As a result, sales dropped slightly.", "As a reason, sales dropped sharply."],
        ws: ["Como resultado, las ventas subieron bruscamente.", "Como resultado, las ventas cayeron levemente.", "Como razón, las ventas cayeron bruscamente."] }
    ]
  },
  {
    title: "Phrasal Verbs Avanzados",
    sentences: [
      { en: "Let's rule out that option for now.", es: "Descartemos esa opción por ahora.", lv: 4,
        we: ["Let's rule out that option forever.", "Let's carry out that option for now.", "Let's look into that option for now."],
        ws: ["Descartemos esa opción para siempre.", "Realicemos esa opción por ahora.", "Investiguemos esa opción por ahora."] },
      { en: "I can't put up with this noise.", es: "No puedo tolerar este ruido.", lv: 4,
        we: ["I can't put up with this music.", "I can put up with this noise.", "I can't put up this noise."],
        ws: ["No puedo tolerar esta música.", "Puedo tolerar este ruido.", "No puedo soportar este ruido."] },
      { en: "She stood by her decision.", es: "Ella mantuvo su decisión.", lv: 4,
        we: ["She stood beside her decision.", "She stood by her decision last year.", "She stood up her decision."],
        ws: ["Ella se paró junto a su decisión.", "Ella mantuvo su decisión el año pasado.", "Ella renunció a su decisión."] },
      { en: "They came up with a better plan.", es: "Ellos propuso un plan mejor.", lv: 4,
        we: ["They came up with a worse plan.", "They came up against a better plan.", "They came up with a better plan yesterday."],
        ws: ["Ellos propuso un plan peor.", "Ellos se opusieron a un plan mejor.", "Ellos propuso un plan mejor ayer."] },
      { en: "He took over the project last month.", es: "Él tomó el control del proyecto el mes pasado.", lv: 4,
        we: ["He took off the project last month.", "He took over the project next month.", "He handed over the project last month."],
        ws: ["Él dejó el proyecto el mes pasado.", "Él tomó el control del proyecto el próximo mes.", "Él entregó el proyecto el mes pasado."] }
    ]
  },
  {
    title: "Registro Formal",
    sentences: [
      { en: "We regret to inform you of the delay.", es: "Lamentamos informarle del retraso.", lv: 4,
        we: ["We regret to inform you of the meeting.", "We are happy to inform you of the delay.", "We regret to inform her of the delay."],
        ws: ["Lamentamos informarle de la reunión.", "Nos alegra informarle del retraso.", "Lamentamos informarla del retraso."] },
      { en: "Kindly submit the documents before Friday.", es: "Le rogamos enviar los documentos antes del viernes.", lv: 4,
        we: ["Kindly submit the documents after Friday.", "Please submit the documents by Friday.", "Kindly submit the invoices before Friday."],
        ws: ["Le rogamos enviar los documentos después del viernes.", "Por favor envíe los documentos antes del viernes.", "Le rogamos enviar las facturas antes del viernes."] },
      { en: "Please do not hesitate to contact me.", es: "No dude en contactarme.", lv: 4,
        we: ["Please do not hesitate to contact us.", "Please feel free to contact me.", "Please do not contact me."],
        ws: ["No duden en contactarnos.", "No dude en contactarme cuando quiera.", "Por favor no me contacte."] },
      { en: "I remain at your disposal.", es: "Quedo a su disposición.", lv: 4,
        we: ["I remain at your service.", "I remain at her disposal.", "I will remain at your disposal."],
        ws: ["Quedo a su servicio.", "Quedo a su entera disposición.", "Quedaré a su disposición."] },
      { en: "Thank you for your prompt response.", es: "Gracias por su rápida respuesta.", lv: 4,
        we: ["Thank you for your delayed response.", "Thank you for your prompt reply.", "Thanks for your prompt response."],
        ws: ["Gracias por su respuesta tardía.", "Gracias por su pronta respuesta.", "Gracias por responderme a tiempo."] }
    ]
  },
  {
    title: "Registro Informal",
    sentences: [
      { en: "Sorry, I didn't catch that.", es: "Perdón, no entendí eso.", lv: 4,
        we: ["Sorry, I didn't catch you.", "Sorry, I did catch that.", "Sorry, I won't catch that."],
        ws: ["Perdón, no te entendí.", "Perdón, sí entendí eso.", "Perdón, no voy a entender eso."] },
      { en: "Let me get back to you on that.", es: "Te respondo a eso luego.", lv: 4,
        we: ["Let me get back to you tomorrow.", "Let me get back at you on that.", "Let me get together with you on that."],
        ws: ["Te respondo a eso mañana.", "Te respondo a eso más tarde.", "Hablemos de eso luego."] },
      { en: "That's totally fine, don't worry.", es: "Está bien, no te preocupes.", lv: 4,
        we: ["That's totally wrong, don't worry.", "That's totally fine, worry about it.", "That's fine, don't worry about that."],
        ws: ["Está totalmente mal, no te preocupes.", "Está bien, no te preocupes por eso.", "Está bien, preocúpate por eso."] },
      { en: "I totally get what you mean.", es: "Entiendo perfectamente lo que quieres decir.", lv: 4,
        we: ["I totally see what you mean.", "I don't get what you mean.", "I totally get where you mean."],
        ws: ["Entiendo perfectamente lo que dijiste.", "No entiendo lo que quieres decir.", "Entiendo perfectamente a dónde quieres llegar."] },
      { en: "My bad, I'll fix it.", es: "Mi error, lo arreglo.", lv: 4,
        we: ["My bad, I'll break it.", "My bad, it broke.", "Your bad, I'll fix it."],
        ws: ["Mi error, lo rompí.", "Mi error, se rompió.", "Tu error, lo arreglo."] }
    ]
  },
  {
    title: "Argumentación",
    sentences: [
      { en: "There's a strong case for investing more.", es: "Hay un argumento sólido para invertir más.", lv: 4,
        we: ["There's a strong case for investing less.", "There's a weak case for investing more.", "There's a strong case for investing less now."],
        ws: ["Hay un argumento sólido para invertir menos.", "Hay un argumento débil para invertir más.", "Hay un argumento sólido para invertir ahora."] },
      { en: "That claim lacks evidence.", es: "Esa afirmación carece de evidencia.", lv: 4,
        we: ["That claim lacks clarity.", "That claim has evidence.", "That claim lacks evidence entirely."],
        ws: ["Esa afirmación carece de claridad.", "Esa afirmación tiene evidencia.", "Esa afirmación carece totalmente de evidencia."] },
      { en: "I'd argue the opposite is true.", es: "Sostendría que lo contrario es cierto.", lv: 4,
        we: ["I'd argue the opposite is false.", "I'd argue the same is true.", "He argued the opposite is true."],
        ws: ["Sostendría que lo contrario es falso.", "Sostendría que lo mismo es cierto.", "Él sostuvo que lo contrario es cierto."] },
      { en: "The downside is the cost.", es: "La desventaja es el costo.", lv: 4,
        we: ["The downside is the risk.", "The upside is the cost.", "The downside isn't the cost."],
        ws: ["La desventaja es el riesgo.", "La ventaja es el costo.", "La desventaja no es el costo."] },
      { en: "On balance, I think it's worth it.", es: "En balance, creo que vale la pena.", lv: 4,
        we: ["On balance, I think it isn't worth it.", "On balance, it is worth it.", "On the whole, I think it's worth it."],
        ws: ["En balance, creo que no vale la pena.", "En balance, vale la pena.", "En general, creo que vale la pena."] }
    ]
  },
  {
    title: "Describir Procesos",
    sentences: [
      { en: "Once the payment clears, we ship the order.", es: "Una vez que el pago se confirma, enviamos el pedido.", lv: 4,
        we: ["Once the payment clears, we cancel the order.", "Until the payment clears, we ship the order.", "Once the payment clears, we will ship the order."],
        ws: ["Una vez que el pago se confirma, cancelamos el pedido.", "Hasta que el pago se confirme, enviamos el pedido.", "Una vez que el pago se confirme, enviaremos el pedido."] },
      { en: "Applicants must submit two references.", es: "Los postulantes deben enviar dos referencias.", lv: 4,
        we: ["Applicants must submit one reference.", "Applicants might submit two references.", "Applicants should submit three references."],
        ws: ["Los postulantes deben enviar una referencia.", "Los postulantes podrían enviar dos referencias.", "Los postulantes deberían enviar tres referencias."] },
      { en: "The device is designed to be repaired.", es: "El dispositivo está diseñado para ser reparado.", lv: 4,
        we: ["The device is designed to be replaced.", "The device was designed to be repaired.", "The device is designed to last forever."],
        ws: ["El dispositivo está diseñado para ser reemplazado.", "El dispositivo fue diseñado para ser reparado.", "El dispositivo está diseñado para durar para siempre."] },
      { en: "Data is stored on encrypted servers.", es: "Los datos se almacenan en servidores cifrados.", lv: 4,
        we: ["Data is stored on local servers.", "Data was stored on encrypted servers.", "Data is shared with encrypted servers."],
        ws: ["Los datos se almacenan en servidores locales.", "Los datos se almacenaron en servidores cifrados.", "Los datos se comparten con servidores cifrados."] },
      { en: "The process takes about two weeks.", es: "El proceso toma alrededor de dos semanas.", lv: 4,
        we: ["The process takes about two days.", "The process took about two weeks.", "The process will take about two months."],
        ws: ["El proceso toma alrededor de dos días.", "El proceso tomó alrededor de dos semanas.", "El proceso tomará alrededor de dos meses."] }
    ]
  },
  {
    title: "Negociación",
    sentences: [
      { en: "We're flexible on the price.", es: "Somos flexibles con el precio.", lv: 4,
        we: ["We're flexible on the deadline.", "We're firm on the price.", "They are flexible on the price."],
        ws: ["Somos flexibles con el plazo.", "Somos firmes con el precio.", "Ellos son flexibles con el precio."] },
      { en: "The offer expires at the end of the month.", es: "La oferta expira a fin de mes.", lv: 4,
        we: ["The offer expires at the beginning of the month.", "The offer expired last month.", "The offer expires in two weeks."],
        ws: ["La oferta expira a principios de mes.", "La oferta expiró el mes pasado.", "La oferta expira en dos semanas."] },
      { en: "We can meet you halfway.", es: "Podemos llegar a un punto medio contigo.", lv: 4,
        we: ["We can meet you halfway there.", "We can't meet you halfway.", "They can meet you halfway."],
        ws: ["Podemos llegar a un punto medio contigo ahí.", "No podemos llegar a un punto medio contigo.", "Ellos pueden llegar a un punto medio contigo."] },
      { en: "That's below what we can accept.", es: "Eso está por debajo de lo que podemos aceptar.", lv: 4,
        we: ["That's above what we can accept.", "That's exactly what we can accept.", "That's below what they can accept."],
        ws: ["Eso está por encima de lo que podemos aceptar.", "Eso es exactamente lo que podemos aceptar.", "Eso está por debajo de lo que ellos pueden aceptar."] },
      { en: "Let's discuss the details tomorrow.", es: "Discutamos los detalles mañana.", lv: 4,
        we: ["Let's discuss the details today.", "Let's discuss the details next week.", "Let's discuss the terms tomorrow."],
        ws: ["Discutamos los detalles hoy.", "Discutamos los detalles la próxima semana.", "Discutamos las condiciones mañana."] }
    ]
  },
  {
    title: "Medir y Cuantificar",
    sentences: [
      { en: "Sales grew by fifteen percent.", es: "Las ventas crecieron un quince por ciento.", lv: 4,
        we: ["Sales grew by fifty percent.", "Sales grew to fifteen percent.", "Sales fell by fifteen percent."],
        ws: ["Las ventas crecieron un cincuenta por ciento.", "Las ventas crecieron hasta un quince por ciento.", "Las ventas cayeron un quince por ciento."] },
      { en: "The average wait time is thirty minutes.", es: "El tiempo de espera promedio es de treinta minutos.", lv: 4,
        we: ["The average wait time was thirty minutes.", "The average wait time is ten minutes.", "The longest wait time is thirty minutes."],
        ws: ["El tiempo de espera promedio era de treinta minutos.", "El tiempo de espera promedio es de diez minutos.", "El tiempo de espera más largo es de treinta minutos."] },
      { en: "We reduced costs by a third.", es: "Reducimos los costos en un tercio.", lv: 4,
        we: ["We reduced costs by half.", "We increased costs by a third.", "We reduced costs by two thirds."],
        ws: ["Reducimos los costos a la mitad.", "Aumentamos los costos en un tercio.", "Reducimos los costos en dos tercios."] },
      { en: "Roughly half of them agreed.", es: "Aproximadamente la mitad estuvo de acuerdo.", lv: 4,
        we: ["Roughly a quarter of them agreed.", "All of them agreed.", "Roughly half of them disagreed."],
        ws: ["Aproximadamente una cuarta parte estuvo de acuerdo.", "Todos estuvieron de acuerdo.", "Aproximadamente la mitad estuvo en desacuerdo."] },
      { en: "The figure doubled in two years.", es: "La cifra se duplicó en dos años.", lv: 4,
        we: ["The figure halved in two years.", "The figure doubled in two months.", "The figure tripled in two years."],
        ws: ["La cifra se redujo a la mitad en dos años.", "La cifra se duplicó en dos meses.", "La cifra se triplicó en dos años."] }
    ]
  },
  {
    title: "Riesgo y Precaución",
    sentences: [
      { en: "There's a risk of delays if we start late.", es: "Hay riesgo de retrasos si empezamos tarde.", lv: 4,
        we: ["There's a risk of delays if we start early.", "There's a chance of delays if we start late.", "There's no risk of delays if we start late."],
        ws: ["Hay riesgo de retrasos si empezamos temprano.", "Hay posibilidad de retrasos si empezamos tarde.", "No hay riesgo de retrasos si empezamos tarde."] },
      { en: "We should have a backup plan.", es: "Deberíamos tener un plan de contingencia.", lv: 4,
        we: ["We should have a backup plane.", "We must have a backup plan.", "We don't need a backup plan."],
        ws: ["Deberíamos tener un avión de respaldo.", "Debemos tener un plan de contingencia.", "No necesitamos un plan de contingencia."] },
      { en: "Make sure you back up the file.", es: "Asegúrate de hacer una copia de seguridad del archivo.", lv: 4,
        we: ["Make sure you back down the file.", "Make sure you back in the file.", "Make sure you look after the file."],
        ws: ["Asegúrate de bajar el archivo.", "Asegúrate de devolver el archivo.", "Asegúrate de cuidar el archivo."] },
      { en: "In the worst case, we postpone.", es: "En el peor caso, posponemos.", lv: 4,
        we: ["In the worst case, we cancel.", "In the best case, we postpone.", "In the worst case, we postponed."],
        ws: ["En el peor caso, cancelamos.", "En el mejor caso, posponemos.", "En el peor caso, pospusimos."] },
      { en: "It might not work as expected.", es: "Podría no funcionar como se espera.", lv: 4,
        we: ["It might not work as it did.", "It will not work as expected.", "It might work as expected."],
        ws: ["Podría no funcionar como antes.", "No funcionará como se espera.", "Podría funcionar como se espera."] }
    ]
  },
  {
    title: "Repaso Nivel 4",
    sentences: [
      { en: "Looking back, we handled it well.", es: "Mirando atrás, lo manejamos bien.", lv: 4,
        we: ["Looking back, we handled it badly.", "Looking forward, we handled it well.", "Looking back, they handled it well."],
        ws: ["Mirando atrás, lo manejamos mal.", "Mirando hacia adelante, lo manejamos bien.", "Mirando atrás, ellos lo manejaron bien."] },
      { en: "Had I known, I'd have told you.", es: "Si lo hubiera sabido, te lo habría dicho.", lv: 4,
        we: ["Had I known, I would tell you.", "Had I known, I'd have told him.", "If I had known, I told you."],
        ws: ["Si lo hubiera sabido, te lo diría.", "Si lo hubiera sabido, se lo habría dicho.", "Si lo sabía, te lo dije."] },
      { en: "The proposal was rejected without explanation.", es: "La propuesta fue rechazada sin explicación.", lv: 4,
        we: ["The proposal was rejected with explanation.", "The proposal was accepted without explanation.", "The proposal wasn't rejected."],
        ws: ["La propuesta fue rechazada con explicación.", "La propuesta fue aceptada sin explicación.", "La propuesta no fue rechazada."] },
      { en: "We're still weighing our options.", es: "Seguimos evaluando nuestras opciones.", lv: 4,
        we: ["We've already chosen our options.", "We're still weighing the options.", "They are still weighing their options."],
        ws: ["Ya elegimos nuestras opciones.", "Seguimos evaluando las opciones.", "Ellos siguen evaluando sus opciones."] },
      { en: "It goes without saying that deadlines matter.", es: "Ni hace falta decir que los plazos importan.", lv: 4,
        we: ["It goes without saying that deadlines don't matter.", "It seems that deadlines matter.", "It goes without saying that deadlines are flexible."],
        ws: ["Ni hace falta decir que los plazos no importan.", "Parece que los plazos importan.", "Ni hace falta decir que los plazos son flexibles."] }
    ]
  },
  {
    title: "Condicionales Mezclados",
    sentences: [
      { en: "If I had accepted the offer, I'd be living abroad now.", es: "Si hubiera aceptado la oferta, estaría viviendo en el extranjero ahora.", lv: 5,
        we: ["If I had accepted the offer, I'd be working abroad now.", "If I accept the offer, I'll be living abroad now.", "If I had rejected the offer, I'd be living abroad now."],
        ws: ["Si hubiera aceptado la oferta, estaría trabajando en el extranjero ahora.", "Si acepto la oferta, viviré en el extranjero ahora.", "Si hubiera rechazado la oferta, estaría viviendo en el extranjero ahora."] },
      { en: "She wouldn't have missed the train if she'd left earlier.", es: "No habría perdido el tren si se hubiera ido antes.", lv: 5,
        we: ["She would have missed the train if she'd left earlier.", "She wouldn't have missed the bus if she'd left earlier.", "She wouldn't have caught the train if she'd left earlier."],
        ws: ["Habría perdido el tren si se hubiera ido antes.", "No habría perdido el autobús si se hubiera ido antes.", "No habría alcanzado el tren si se hubiera ido antes."] },
      { en: "Were we to delay the launch, we'd lose the market.", es: "Si retrasáramos el lanzamiento, perderíamos el mercado.", lv: 5,
        we: ["Were we to delay the launch, we'd keep the market.", "If we delay the launch, we'll lose the market.", "Were we to launch early, we'd lose the market."],
        ws: ["Si retrasáramos el lanzamiento, mantendríamos el mercado.", "Si retrasamos el lanzamiento, perderemos el mercado.", "Si lanzáramos antes, perderíamos el mercado."] },
      { en: "Should it rain, the event will move indoors.", es: "Si lloviera, el evento se mudará al interior.", lv: 5,
        we: ["Should it rain, the event will move outdoors.", "If it rains, the event moved indoors.", "Should it snow, the event will move indoors."],
        ws: ["Si lloviera, el evento se mudará al exterior.", "Si llueve, el evento se mudó al interior.", "Si nevara, el evento se mudará al interior."] },
      { en: "If anything changes, let me know.", es: "Si algo cambia, avísame.", lv: 5,
        we: ["If anything goes wrong, let me know.", "If nothing changes, let me know.", "Let me know if anything changed."],
        ws: ["Si algo sale mal, avísame.", "Si nada cambia, avísame.", "Avísame si algo cambió."] }
    ]
  },
  {
    title: "Inversión y Énfasis",
    sentences: [
      { en: "Not only did she finish early, but she also exceeded expectations.", es: "No solo terminó temprano, sino que además superó las expectativas.", lv: 5,
        we: ["Not only did she finish early, but she also missed expectations.", "Not only did she finish late, but she also exceeded expectations.", "Not only did she finish early, but she also met expectations."],
        ws: ["No solo terminó temprano, sino que además quedó corta.", "No solo terminó tarde, sino que además superó las expectativas.", "No solo terminó temprano, sino que además cumplió las expectativas."] },
      { en: "Rarely have I seen such commitment.", es: "Rara vez he visto tanto compromiso.", lv: 5,
        we: ["Rarely have I seen such indifference.", "Often have I seen such commitment.", "I have rarely seen such commitment."],
        ws: ["Rara vez he visto tanta indiferencia.", "A menudo he visto tanto compromiso.", "He visto raramente tanto compromiso."] },
      { en: "Only after the audit was the discrepancy found.", es: "Solo después de la auditoría se encontró la discrepancia.", lv: 5,
        we: ["Only before the audit was the discrepancy missed.", "The discrepancy was found only after the audit.", "Not until the audit was the discrepancy found."],
        ws: ["Solo antes de la auditoría se encontró la discrepancia.", "La discrepancia se encontró solo después de la auditoría.", "Hasta que no hubo auditoría no se encontró la discrepancia."] },
      { en: "On no account should you share this.", es: "Bajo ninguna circunstancia debes compartir esto.", lv: 5,
        we: ["On no account should you keep this.", "On some occasions you should share this.", "On no account will you share this."],
        ws: ["Bajo ninguna circunstancia debes guardar esto.", "En algunas ocasiones deberías compartir esto.", "Bajo ninguna circunstancia compartirás esto."] },
      { en: "Seldom does an opportunity like this arise.", es: "Rara vez surge una oportunidad así.", lv: 5,
        we: ["Often does an opportunity like this arise.", "Seldom does an opportunity like that arise.", "An opportunity like this seldom arose."],
        ws: ["A menudo surge una oportunidad así.", "Rara vez surge una oportunidad como esa.", "Rara vez surgió una oportunidad así."] }
    ]
  },
  {
    title: "Pasiva Formal",
    sentences: [
      { en: "It has been decided that the office will close.", es: "Se ha decidido que la oficina cerrará.", lv: 5,
        we: ["It has been decided that the office will stay open.", "It was decided that the office would close.", "It has been reported that the office will close."],
        ws: ["Se ha decidido que la oficina seguirá abierta.", "Se decidió que la oficina cerraría.", "Se ha informado que la oficina cerrará."] },
      { en: "The findings were subsequently challenged.", es: "Los hallazgos fueron posteriormente cuestionados.", lv: 5,
        we: ["The findings were subsequently confirmed.", "The findings had been subsequently challenged.", "The findings were subsequently ignored."],
        ws: ["Los hallazgos fueron posteriormente confirmados.", "Los hallazgos habían sido posteriormente cuestionados.", "Los hallazgos fueron posteriormente ignorados."] },
      { en: "Such behavior is not tolerated.", es: "Esa conducta no se tolera.", lv: 5,
        we: ["Such behavior is always tolerated.", "Such behavior will be tolerated.", "Such behaviors are not tolerated."],
        ws: ["Esa conducta siempre se tolera.", "Esa conducta será tolerada.", "Esas conductas no se toleran."] },
      { en: "He is said to be the leading candidate.", es: "Se dice que es el candidato principal.", lv: 5,
        we: ["He is said to be the only candidate.", "He is said to have been the leading candidate.", "He is said to be a leading candidate."],
        ws: ["Se dice que es el único candidato.", "Él dijo ser el candidato principal.", "Se dice que es un candidato destacado."] },
      { en: "The proposal remains under consideration.", es: "La propuesta sigue en estudio.", lv: 5,
        we: ["The proposal remains under discussion.", "The proposal is still being considered.", "The proposal was under consideration."],
        ws: ["La propuesta sigue en discusión.", "La propuesta está siendo estudiada.", "La propuesta estaba en estudio."] }
    ]
  },
  {
    title: "Modales con Pasado",
    sentences: [
      { en: "You should have told me earlier.", es: "Deberías haberme informado antes.", lv: 5,
        we: ["You should tell me earlier.", "You must have told me earlier.", "You should have told me later."],
        ws: ["Deberías informarme antes.", "Debiste haberme informado antes.", "Deberías haberme informado después."] },
      { en: "She must have forgotten about it.", es: "Ella se debe haber olvidado de eso.", lv: 5,
        we: ["She must have remembered about it.", "She should have forgotten about it.", "She might have forgotten about it."],
        ws: ["Ella se debe haber acordado de eso.", "Ella debería haberse olvidado de eso.", "Ella podría haberse olvidado de eso."] },
      { en: "They can't have finished already.", es: "No pueden haber terminado ya.", lv: 5,
        we: ["They can't have started already.", "They must have finished already.", "They can't finish already."],
        ws: ["No pueden haber empezado ya.", "Deben haber terminado ya.", "No pueden terminar ya."] },
      { en: "I might have mentioned it in passing.", es: "Podría haberlo mencionado de pasada.", lv: 5,
        we: ["I might have mentioned it in detail.", "I might mention it in passing.", "I should have mentioned it in passing."],
        ws: ["Podría haberlo mencionado en detalle.", "Podría mencionarlo de pasada.", "Debería haberlo mencionado de pasada."] },
      { en: "It ought to be straightforward.", es: "Debería ser sencillo.", lv: 5,
        we: ["It ought to be complicated.", "It used to be straightforward.", "It ought to have been straightforward."],
        ws: ["Debería ser complicado.", "Solía ser sencillo.", "Debería haber sido sencillo."] }
    ]
  },
  {
    title: "Precisión Léxica",
    sentences: [
      { en: "The results were inconclusive.", es: "Los resultados no fueron concluyentes.", lv: 5,
        we: ["The results were conclusive.", "The results were inconclusive because of the sample size.", "The results will be inconclusive."],
        ws: ["Los resultados fueron concluyentes.", "Los resultados no fueron concluyentes por el tamaño de la muestra.", "Los resultados serán concluyentes."] },
      { en: "She has a tendency to overthink.", es: "Ella tiene la tendencia a sobrepensar.", lv: 5,
        we: ["She has a tendency to underestimate.", "She has a tendency to overthink everything.", "She tends to underthink."],
        ws: ["Ella tiene la tendencia a subestimar.", "Ella tiene la tendencia a sobrepensar todo.", "Ella tiende a pensar poco."] },
      { en: "The two accounts differ significantly.", es: "Las dos versiones difieren significativamente.", lv: 5,
        we: ["The two accounts are identical.", "The two accounts differ insignificantly.", "The two accounts differ only slightly."],
        ws: ["Las dos versiones son idénticas.", "Las dos versiones difieren insignemente.", "Las dos versiones difieren solo ligeramente."] },
      { en: "His argument is plausible but flawed.", es: "Su argumento es plausible pero defectuoso.", lv: 5,
        we: ["His argument is implausible but sound.", "His argument is plausible and flawless.", "His argument is flawed but implausible."],
        ws: ["Su argumento es implausible pero sólido.", "Su argumento es plausible y perfecto.", "Su argumento es defectuoso pero implausible."] },
      { en: "The evidence remains circumstantial.", es: "La evidencia sigue siendo circunstancial.", lv: 5,
        we: ["The evidence remains conclusive.", "The evidence remains purely circumstantial.", "The evidence will remain circumstantial."],
        ws: ["La evidencia sigue siendo concluyente.", "La evidencia sigue siendo meramente circunstancial.", "La evidencia seguirá siendo circunstancial."] }
    ]
  },
  {
    title: "Hedging",
    sentences: [
      { en: "I'd say it's roughly on track.", es: "Diría que más o menos va en camino.", lv: 5,
        we: ["I'd say it's exactly on track.", "I'd say it's nowhere near on track.", "It's roughly on track."],
        ws: ["Diría que va exactamente en camino.", "Diría que no va nada en camino.", "Va más o menos en camino."] },
      { en: "That seems plausible enough.", es: "Eso parece suficientemente creíble.", lv: 5,
        we: ["That seems implausible enough.", "That seems plausible but unproven.", "That seems entirely implausible."],
        ws: ["Eso parece suficientemente inverosímil.", "Eso parece creíble pero no demostrado.", "Eso parece completamente inverosímil."] },
      { en: "There's a reasonable chance of delay.", es: "Hay una posibilidad razonable de retraso.", lv: 5,
        we: ["There's no chance of delay.", "There's a remote chance of delay.", "There's a reasonable chance of arrival."],
        ws: ["No hay posibilidad de retraso.", "Hay una remota posibilidad de retraso.", "Hay una posibilidad razonable de llegada."] },
      { en: "It might, to some extent, be true.", es: "Podría, en cierta medida, ser cierto.", lv: 5,
        we: ["It might, to no extent, be true.", "It is, to some extent, true.", "It might, to some extent, be false."],
        ws: ["Podría, en ninguna medida, ser cierto.", "Es, en cierta medida, cierto.", "Podría, en cierta medida, ser falso."] },
      { en: "I wouldn't rule it out entirely.", es: "No lo descartaría del todo.", lv: 5,
        we: ["I would rule it out entirely.", "I wouldn't rule it in entirely.", "I won't rule it out at all."],
        ws: ["Lo descartaría del todo.", "No lo tendría en cuenta del todo.", "No lo descartaré en absoluto."] }
    ]
  },
  {
    title: "Concesión",
    sentences: [
      { en: "Granted, the plan has merit.", es: "Ciertamente, el plan tiene mérito.", lv: 5,
        we: ["Granted, the plan lacks merit.", "The plan has merit, admittedly.", "Granted, the plan has flaws."],
        ws: ["Ciertamente, el plan carece de mérito.", "El plan tiene mérito, es cierto.", "Ciertamente, el plan tiene defectos."] },
      { en: "Admittedly, we underestimated demand.", es: "Ciertamente, subestimamos la demanda.", lv: 5,
        we: ["Admittedly, we overestimated demand.", "We underestimated demand, admittedly.", "Admittedly, we underestimated costs."],
        ws: ["Ciertamente, sobreestimamos la demanda.", "Subestimamos la demanda, es cierto.", "Ciertamente, subestimamos los costos."] },
      { en: "That said, the risks are real.", es: "Dicho eso, los riesgos son reales.", lv: 5,
        we: ["That said, the risks are minimal.", "The risks are real, that said.", "That said, the gains are real."],
        ws: ["Dicho eso, los riesgos son mínimos.", "Los riesgos son reales, dicho eso.", "Dicho eso, las ganancias son reales."] },
      { en: "Be that as it may, we must decide.", es: "Sea como sea, debemos decidir.", lv: 5,
        we: ["Be that as it may, we must delay.", "We must decide, be that as it may.", "Be that as it may, we can decide later."],
        ws: ["Sea como sea, debemos retrasarnos.", "Debemos decidir, sea como sea.", "Sea como sea, podemos decidir más tarde."] },
      { en: "While I see the appeal, I disagree.", es: "Aunque veo el atractivo, estoy en desacuerdo.", lv: 5,
        we: ["While I see the appeal, I agree.", "While I see no appeal, I disagree.", "While I see the appeal, I remain undecided."],
        ws: ["Aunque veo el atractivo, estoy de acuerdo.", "Aunque no veo ningún atractivo, estoy en desacuerdo.", "Aunque veo el encanto, no me convenzo."] }
    ]
  },
  {
    title: "Business Abstracto",
    sentences: [
      { en: "Revenue streams need diversifying.", es: "Las fuentes de ingreso necesitan diversificarse.", lv: 5,
        we: ["Revenue streams need consolidating.", "Revenue streams need growing.", "Revenue stream needs diversifying."],
        ws: ["Las fuentes de ingreso necesitan consolidarse.", "Las fuentes de ingreso necesitan crecer.", "La fuente de ingreso necesita diversificarse."] },
      { en: "The margin leaves little room for error.", es: "El margen deja poco espacio para el error.", lv: 5,
        we: ["The margin leaves plenty of room for error.", "The margin leaves little room for growth.", "The margin leaves no room at all for error."],
        ws: ["El margen deja mucho espacio para el error.", "El margen deja poco espacio para crecer.", "El margen no deja espacio alguno para el error."] },
      { en: "We should capitalize on the momentum.", es: "Deberíamos capitalizar el impulso.", lv: 5,
        we: ["We should capitalize on the downturn.", "We should slow down the momentum.", "We might capitalize on the momentum."],
        ws: ["Deberíamos capitalizar la caída.", "Deberíamos frenar el impulso.", "Podríamos capitalizar el impulso."] },
      { en: "Costs must be reconciled before signing.", es: "Los costos deben conciliarse antes de firmar.", lv: 5,
        we: ["Costs must be reconciled after signing.", "Costs must be reconciled before shipping.", "Costs should be reconciled before signing."],
        ws: ["Los costos deben conciliarse después de firmar.", "Los costos deben conciliarse antes de enviar.", "Los costos deberían conciliarse antes de firmar."] },
      { en: "Stakeholders expect quarterly updates.", es: "Las partes interesadas esperan actualizaciones trimestrales.", lv: 5,
        we: ["Stakeholders expect annual updates.", "Stakeholders expect quarterly reports.", "Shareholders expect quarterly updates."],
        ws: ["Las partes interesadas esperan actualizaciones anuales.", "Las partes interesadas esperan informes trimestrales.", "Los accionistas esperan actualizaciones trimestrales."] }
    ]
  },
  {
    title: "Cultura y Sociedad",
    sentences: [
      { en: "Traditions evolve rather than disappear.", es: "Las tradiciones evolucionan en vez de desaparecer.", lv: 5,
        we: ["Traditions survive rather than evolve.", "Traditions disappear rather than evolve.", "Tradition evolves rather than traditions disappear."],
        ws: ["Las tradiciones sobreviven en vez de evolucionar.", "Las tradiciones desaparecen en vez de evolucionar.", "La tradición evoluciona en vez de las tradiciones desaparecer."] },
      { en: "The debate centers on access, not quality.", es: "El debate se centra en el acceso, no en la calidad.", lv: 5,
        we: ["The debate centers on quality, not access.", "The debate centers on access and quality.", "The debate does not center on access."],
        ws: ["El debate se centra en la calidad, no en el acceso.", "El debate se centra en el acceso y la calidad.", "El debate no se centra en el acceso."] },
      { en: "Generational attitudes have shifted markedly.", es: "Las actitudes generacionales han cambiado notablemente.", lv: 5,
        we: ["Generational attitudes have shifted slightly.", "Generational attitudes remain the same.", "Generational attitudes will shift markedly."],
        ws: ["Las actitudes generacionales han cambiado levemente.", "Las actitudes generacionales siguen igual.", "Las actitudes generacionales cambiarán notablemente."] },
      { en: "Inequality remains the defining issue.", es: "La desigualdad sigue siendo el problema definitorio.", lv: 5,
        we: ["Inequality is no longer the defining issue.", "Inequality remains the least pressing issue.", "Inequality will remain the defining issue."],
        ws: ["La desigualdad ya no es el problema definitorio.", "La desigualdad sigue siendo el problema menos urgente.", "La desigualdad seguirá siendo el problema definitorio."] },
      { en: "Urbanization continues to reshape cities.", es: "La urbanización sigue transformando las ciudades.", lv: 5,
        we: ["Urbanization continues to shrink cities.", "Urbanization stopped reshaping cities.", "Urbanization continues to reshape countries."],
        ws: ["La urbanización sigue encogiendo las ciudades.", "La urbanización dejó de transformar las ciudades.", "La urbanización sigue transformando los países."] }
    ]
  },
  {
    title: "Tecnología",
    sentences: [
      { en: "Automation has reshaped entry-level jobs.", es: "La automatización ha redefinido los trabajos de nivel inicial.", lv: 5,
        we: ["Automation has eliminated entry-level jobs.", "Automation will reshape entry-level jobs.", "Automation has reshaped senior-level jobs."],
        ws: ["La automatización ha eliminado los trabajos de nivel inicial.", "La automatización redefinirá los trabajos de nivel inicial.", "La automatización ha redefinido los trabajos de nivel superior."] },
      { en: "The algorithm determines what gets recommended.", es: "El algoritmo determina qué se recomienda.", lv: 5,
        we: ["The user determines what gets recommended.", "The algorithm determines what gets advertised.", "The algorithm decides what people think."],
        ws: ["El usuario determina qué se recomienda.", "El algoritmo determina qué se anuncia.", "El algoritmo decide qué piensa la gente."] },
      { en: "Privacy concerns continue to grow.", es: "Las preocupaciones por la privacidad siguen creciendo.", lv: 5,
        we: ["Privacy concerns continue to shrink.", "Privacy concerns continue to grow abroad.", "Privacy concerns stopped growing."],
        ws: ["Las preocupaciones por la privacidad siguen disminuyendo.", "Las preocupaciones por la privacidad siguen creciendo en el extranjero.", "Las preocupaciones por la privacidad dejaron de crecer."] },
      { en: "Adoption is gradual but irreversible.", es: "La adopción es gradual pero irreversible.", lv: 5,
        we: ["Adoption is gradual but reversible.", "Adoption is sudden but reversible.", "Adoption is gradual and slow."],
        ws: ["La adopción es gradual pero reversible.", "La adopción es repentina pero reversible.", "La adopción es gradual y lenta."] },
      { en: "Redundancy is a feature, not a flaw.", es: "La redundancia es una característica, no un defecto.", lv: 5,
        we: ["Redundancy is a flaw, not a feature.", "Redundancy is a feature and a flaw.", "Redundancy is a feature, not a cost."],
        ws: ["La redundancia es un defecto, no una característica.", "La redundancia es una característica y un defecto.", "La redundancia es una característica, no un costo."] }
    ]
  },
  {
    title: "Ironía y Tono",
    sentences: [
      { en: "Great. Another delay we weren't told about.", es: "Genial. Otro retraso del que no nos enteramos.", lv: 5,
        we: ["Great. Another delay we were told about.", "Great. Another update we weren't told about.", "Fine. Another delay we weren't told about."],
        ws: ["Genial. Otro retraso del que nos enteramos.", "Genial. Otra actualización de la que no nos enteramos.", "Bien. Otro retraso del que no nos enteramos."] },
      { en: "That's one way of putting it.", es: "Esa es una forma de decirlo.", lv: 5,
        we: ["That's one way of putting on it.", "That's the only way of putting it.", "That's one way of putting it down."],
        ws: ["Esa es una forma de ponérselo.", "Esa es la única forma de decirlo.", "Esa es una forma de expresarlo."] },
      { en: "Well, that went better than expected.", es: "Bueno, eso salió mejor de lo esperado.", lv: 5,
        we: ["Well, that went worse than expected.", "Well, that went exactly as expected.", "Well, that went better than usual."],
        ws: ["Bueno, eso salió peor de lo esperado.", "Bueno, eso salió exactamente como se esperaba.", "Bueno, eso salió mejor de lo habitual."] },
      { en: "So, we're behind schedule. Shocking.", es: "Así que vamos atrasados. Sorprendente.", lv: 5,
        we: ["So, we're ahead of schedule. Shocking.", "So, we're behind schedule. Reassuring.", "So, we were behind schedule. Expected."],
        ws: ["Así que vamos adelantados. Sorprendente.", "Así que vamos atrasados. Tranquilizador.", "Así que estábamos atrasados. Previsible."] },
      { en: "I appreciate the honesty, oddly enough.", es: "Aprecio la honestidad, curiosamente.", lv: 5,
        we: ["I appreciate the dishonesty, oddly enough.", "I appreciate the honesty, as usual.", "I expected the honesty, oddly enough."],
        ws: ["Aprecio la deshonestidad, curiosamente.", "Aprecio la honestidad, como siempre.", "Esperaba honestidad, curiosamente."] }
    ]
  },
  {
    title: "Idioms",
    sentences: [
      { en: "Let's call it a day.", es: "Demoslo por hoy.", lv: 5,
        we: ["Let's call it a day off.", "Let's call it a day early.", "Let's call off the day."],
        ws: ["Demoslo por hoy libre.", "Demoslo por hoy temprano.", "Cancelemos el día de hoy."] },
      { en: "That's easier said than done.", es: "Eso es más fácil de decir que de hacer.", lv: 5,
        we: ["That's harder said than done.", "That's easier said than said.", "That's easier done than said."],
        ws: ["Eso es más difícil de decir que de hacer.", "Eso es más fácil de decir que dicho.", "Eso es más fácil de hacer que de decir."] },
      { en: "I'm on the fence about it.", es: "Estoy dudando sobre eso.", lv: 5,
        we: ["I'm dead set against it.", "I'm fully in favor of it.", "I'm on the fence about her."],
        ws: ["Estoy completamente en contra.", "Estoy totalmente a favor.", "Estoy dudando sobre ella."] },
      { en: "He threw me a curveball.", es: "Me lanzó una curva inesperada.", lv: 5,
        we: ["He threw me a fastball.", "He threw me a curve last week.", "He caught me off guard politely."],
        ws: ["Me lanzó una recta rápida.", "Me lanzó una curva la semana pasada.", "Me agarró desprevenido."] },
      { en: "We need to read the fine print.", es: "Necesitamos leer la letra chica.", lv: 5,
        we: ["We need to read the fine print twice.", "We need to skip the fine print.", "We need to read the headline."],
        ws: ["Necesitamos leer la letra chica dos veces.", "Necesitamos saltarnos la letra chica.", "Necesitamos leer el titular."] }
    ]
  },
  {
    title: "Repaso Nivel 5",
    sentences: [
      { en: "Had the deadline been extended, the team would have delivered.", es: "Si se hubiera extendido el plazo, el equipo habría entregado.", lv: 5,
        we: ["Had the deadline been extended, the team would have missed it.", "Should the deadline be extended, the team will deliver.", "Had the deadline been cut, the team would have delivered."],
        ws: ["Si se hubiera extendido el plazo, el equipo lo habría incumplido.", "Si se extiende el plazo, el equipo entregará.", "Si se hubiera recortado el plazo, el equipo habría entregado."] },
      { en: "The findings, though preliminary, point to a clear pattern.", es: "Los hallazgos, aunque preliminares, apuntan a un patrón claro.", lv: 5,
        we: ["The findings, though preliminary, point to no clear pattern.", "The findings, being final, point to a clear pattern.", "The findings, though preliminary, point to a clear problem."],
        ws: ["Los hallazgos, aunque preliminares, no apuntan a ningún patrón claro.", "Los hallazgos, siendo definitivos, apuntan a un patrón claro.", "Los hallazgos, aunque preliminares, apuntan a un problema claro."] },
      { en: "Not by a long shot.", es: "Ni mucho menos.", lv: 5,
        we: ["Not by a short shot.", "Not in a long shot.", "Not in the least."],
        ws: ["Ni por poco.", "Ni por un disparo largo.", "De ninguna manera."] },
      { en: "What the report fails to address is the long-term cost.", es: "Lo que el informe no aborda es el costo a largo plazo.", lv: 5,
        we: ["What the report fails to address is the short-term cost.", "What the report addresses is the long-term cost.", "What the report fails to address is the long-term gain."],
        ws: ["Lo que el informe no aborda es el costo a corto plazo.", "Lo que el informe aborda es el costo a largo plazo.", "Lo que el informe no aborda es la ganancia a largo plazo."] },
      { en: "Progress is undeniable, though uneven.", es: "El progreso es innegable, aunque desigual.", lv: 5,
        we: ["Progress is undeniable, though steady.", "Progress is debatable, though uneven.", "Progress is undeniable and even."],
        ws: ["El progreso es innegable, aunque constante.", "El progreso es debatible, aunque desigual.", "El progreso es innegable y uniforme."] }
    ]
  }
];
