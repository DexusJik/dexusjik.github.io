/*
 * sentences.js — 365 graded English sentences with Spanish translations.
 * Load order: sentences.js BEFORE game.js
 *
 * Structure per lesson: 5 sentences, ordered by difficulty inside the lesson.
 * Per sentence:
 *   en  - English sentence
 *   es  - Spanish translation
 *   lv  - CEFR-ish level: 1 (A1) .. 5 (B2)
 */
window.DAILY_LESSONS = [
  /* ---------------- LEVEL 1 — A1: basics ---------------- */
  {
    title: "Primeros Pasos",
    sentences: [
      { en: "Hello. My name is Javier.", es: "Hola. Me llamo Javier.", lv: 1 },
      { en: "Nice to meet you.", es: "Mucho gusto.", lv: 1 },
      { en: "I am from Chile.", es: "Soy de Chile.", lv: 1 },
      { en: "How are you today?", es: "¿Cómo estás hoy?", lv: 1 },
      { en: "See you tomorrow.", es: "Hasta mañana.", lv: 1 }
    ]
  },
  {
    title: "La Familia",
    sentences: [
      { en: "My father is a teacher.", es: "Mi padre es profesor.", lv: 1 },
      { en: "My mother cooks very well.", es: "Mi madre cocina muy bien.", lv: 1 },
      { en: "This is my brother.", es: "Este es mi hermano.", lv: 1 },
      { en: "My sister is young.", es: "Mi hermana es joven.", lv: 1 },
      { en: "We are a happy family.", es: "Somos una familia feliz.", lv: 1 }
    ]
  },
  {
    title: "Números y Edad",
    sentences: [
      { en: "I have one brother.", es: "Tengo un hermano.", lv: 1 },
      { en: "She is ten years old.", es: "Ella tiene diez años.", lv: 1 },
      { en: "There are three books here.", es: "Hay tres libros aquí.", lv: 1 },
      { en: "The class has twenty students.", es: "La clase tiene veinte estudiantes.", lv: 1 },
      { en: "I am twenty-five years old.", es: "Tengo veinticinco años.", lv: 1 }
    ]
  },
  {
    title: "Colores y Cosas",
    sentences: [
      { en: "The sky is blue.", es: "El cielo es azul.", lv: 1 },
      { en: "I have a red car.", es: "Tengo un auto rojo.", lv: 1 },
      { en: "My house is white.", es: "Mi casa es blanca.", lv: 1 },
      { en: "The grass is green.", es: "La hierba es verde.", lv: 1 },
      { en: "I like this color.", es: "Me gusta este color.", lv: 1 }
    ]
  },
  {
    title: "Comida y Bebida",
    sentences: [
      { en: "I eat bread every morning.", es: "Como pan cada mañana.", lv: 1 },
      { en: "She drinks water.", es: "Ella bebe agua.", lv: 1 },
      { en: "The coffee is hot.", es: "El café está caliente.", lv: 1 },
      { en: "I like fish and rice.", es: "Me gusta el pescado con arroz.", lv: 1 },
      { en: "Do you like pizza?", es: "¿Te gusta la pizza?", lv: 1 }
    ]
  },
  {
    title: "La Casa",
    sentences: [
      { en: "The kitchen is small.", es: "La cocina es pequeña.", lv: 1 },
      { en: "My bedroom has two beds.", es: "Mi dormitorio tiene dos camas.", lv: 1 },
      { en: "The door is closed.", es: "La puerta está cerrada.", lv: 1 },
      { en: "There is a table in the room.", es: "Hay una mesa en la habitación.", lv: 1 },
      { en: "The window is open.", es: "La ventana está abierta.", lv: 1 }
    ]
  },
  {
    title: "Lugares",
    sentences: [
      { en: "The bank is next to the park.", es: "El banco está junto al parque.", lv: 1 },
      { en: "I go to the market on Sunday.", es: "Voy al mercado el domingo.", lv: 1 },
      { en: "The hospital is far.", es: "El hospital está lejos.", lv: 1 },
      { en: "My house is near the beach.", es: "Mi casa está cerca de la playa.", lv: 1 },
      { en: "We met at the station.", es: "Nos conocimos en la estación.", lv: 1 }
    ]
  },
  {
    title: "Rutina Diaria",
    sentences: [
      { en: "I wake up at seven.", es: "Me despierto a las siete.", lv: 1 },
      { en: "She works at a hospital.", es: "Ella trabaja en un hospital.", lv: 1 },
      { en: "We study English every day.", es: "Estudiamos inglés todos los días.", lv: 1 },
      { en: "I go to bed at eleven.", es: "Me acuesto a las once.", lv: 1 },
      { en: "The day is very long.", es: "El día es muy largo.", lv: 1 }
    ]
  },
  {
    title: "Tiempo y Días",
    sentences: [
      { en: "Today is Monday.", es: "Hoy es lunes.", lv: 1 },
      { en: "Tomorrow is Tuesday.", es: "Mañana es martes.", lv: 1 },
      { en: "The shop opens at ten.", es: "La tienda abre a las diez.", lv: 1 },
      { en: "It is twelve thirty now.", es: "Son las doce y media.", lv: 1 },
      { en: "We have four classes today.", es: "Tenemos cuatro clases hoy.", lv: 1 }
    ]
  },
  {
    title: "Verbo Can",
    sentences: [
      { en: "I can swim.", es: "Sé nadar.", lv: 1 },
      { en: "She can sing very well.", es: "Ella canta muy bien.", lv: 1 },
      { en: "Can you help me?", es: "¿Puedes ayudarme?", lv: 1 },
      { en: "He cannot come today.", es: "Él no puede venir hoy.", lv: 1 },
      { en: "We can start now.", es: "Podemos empezar ahora.", lv: 1 }
    ]
  },
  {
    title: "Tiempo Pasado 1",
    sentences: [
      { en: "I was happy yesterday.", es: "Estuve feliz ayer.", lv: 1 },
      { en: "We played football.", es: "Jugamos fútbol.", lv: 1 },
      { en: "She went home.", es: "Ella se fue a casa.", lv: 1 },
      { en: "The movie was very good.", es: "La película estuvo muy buena.", lv: 1 },
      { en: "I bought a new phone.", es: "Compré un teléfono nuevo.", lv: 1 }
    ]
  },
  {
    title: "Clima",
    sentences: [
      { en: "The weather is cold today.", es: "El clima está frío hoy.", lv: 1 },
      { en: "It is raining in the city.", es: "Está lloviendo en la ciudad.", lv: 1 },
      { en: "The sun is very bright.", es: "El sol está muy brillante.", lv: 1 },
      { en: "It is windy outside.", es: "Está ventoso afuera.", lv: 1 },
      { en: "The sky is clear tonight.", es: "El cielo está despejado esta noche.", lv: 1 }
    ]
  },
  {
    title: "Preposiciones",
    sentences: [
      { en: "The book is on the table.", es: "El libro está sobre la mesa.", lv: 1 },
      { en: "The cat is under the bed.", es: "El gato está bajo la cama.", lv: 1 },
      { en: "I live in a small town.", es: "Vivo en un pueblo pequeño.", lv: 1 },
      { en: "She walks to school.", es: "Ella camina a la escuela.", lv: 1 },
      { en: "Wait for me here.", es: "Espérame aquí.", lv: 1 }
    ]
  },
  {
    title: "Employment Básico",
    sentences: [
      { en: "I work in an office.", es: "Trabajo en una oficina.", lv: 1 },
      { en: "He is my boss.", es: "Él es mi jefe.", lv: 1 },
      { en: "The meeting starts now.", es: "La reunión empieza ahora.", lv: 1 },
      { en: "Please send me the file.", es: "Por favor envíame el archivo.", lv: 1 },
      { en: "I have a lot of work.", es: "Tengo mucho trabajo.", lv: 1 }
    ]
  },
  {
    title: "Primeros Repasos",
    sentences: [
      { en: "I drink coffee and read the news.", es: "Tomo café y leo las noticias.", lv: 1 },
      { en: "My sister lives in Santiago.", es: "Mi hermana vive en Santiago.", lv: 1 },
      { en: "The kids play in the park.", es: "Los niños juegan en el parque.", lv: 1 },
      { en: "I need to buy milk.", es: "Necesito comprar leche.", lv: 1 },
      { en: "This is a very good day.", es: "Este es un día muy bueno.", lv: 1 }
    ]
  },

  /* ---------------- LEVEL 2 — A2: everyday detail ---------------- */
  {
    title: "Presente Continuo",
    sentences: [
      { en: "I am reading a book right now.", es: "Estoy leyendo un libro ahora mismo.", lv: 2 },
      { en: "She is waiting for the bus.", es: "Ella está esperando el autobús.", lv: 2 },
      { en: "They are having lunch together.", es: "Ellos están almorzando juntos.", lv: 2 },
      { en: "We are not working today.", es: "Hoy no estamos trabajando.", lv: 2 },
      { en: "What are you doing?", es: "¿Qué estás haciendo?", lv: 2 }
    ]
  },
  {
    title: "Ayer y Pasado",
    sentences: [
      { en: "I called you yesterday.", es: "Te llamé ayer.", lv: 2 },
      { en: "She finished her homework early.", es: "Ella terminó su tarea temprano.", lv: 2 },
      { en: "We visited my grandparents.", es: "Visitamos a mis abuelos.", lv: 2 },
      { en: "They didn't come to the party.", es: "Ellos no vinieron a la fiesta.", lv: 2 },
      { en: "Did you watch the game?", es: "¿Viste el partido?", lv: 2 }
    ]
  },
  {
    title: "There Is / There Are",
    sentences: [
      { en: "There is a problem with the order.", es: "Hay un problema con el pedido.", lv: 2 },
      { en: "There are two chairs in the room.", es: "Hay dos sillas en la habitación.", lv: 2 },
      { en: "There isn't any milk left.", es: "No queda leche.", lv: 2 },
      { en: "There was a storm last night.", es: "Hubo una tormenta anoche.", lv: 2 },
      { en: "There weren't many people.", es: "No había mucha gente.", lv: 2 }
    ]
  },
  {
    title: "Adjetivos",
    sentences: [
      { en: "The film was boring.", es: "La película fue aburrida.", lv: 2 },
      { en: "That restaurant looks expensive.", es: "Ese restaurante se ve caro.", lv: 2 },
      { en: "She is a very careful driver.", es: "Ella es una conductora muy cuidadosa.", lv: 2 },
      { en: "The weather is terrible today.", es: "El clima está terrible hoy.", lv: 2 },
      { en: "It was an interesting experience.", es: "Fue una experiencia interesante.", lv: 2 }
    ]
  },
  {
    title: " adverbios de Frecuencia",
    sentences: [
      { en: "I always drink coffee in the morning.", es: "Siempre tomo café por la mañana.", lv: 2 },
      { en: "She sometimes works late.", es: "Ella a veces trabaja tarde.", lv: 2 },
      { en: "We rarely eat fast food.", es: "Rara vez comemos comida rápida.", lv: 2 },
      { en: "He never drinks soda.", es: "Él nunca bebe gaseosa.", lv: 2 },
      { en: "They often travel by train.", es: "Ellos viajan a menudo en tren.", lv: 2 }
    ]
  },
  {
    title: "Verbo Modales Básico",
    sentences: [
      { en: "I have to work tomorrow.", es: "Tengo que trabajar mañana.", lv: 2 },
      { en: "You should rest more.", es: "Deberías descansar más.", lv: 2 },
      { en: "We must arrive on time.", es: "Debemos llegar a tiempo.", lv: 2 },
      { en: "She can drive a truck.", es: "Ella puede manejar un camión.", lv: 2 },
      { en: "Might I ask a question?", es: "¿Podría hacer una pregunta?", lv: 2 }
    ]
  },
  {
    title: "Viajes",
    sentences: [
      { en: "I need to book a flight to Lima.", es: "Necesito reservar un vuelo a Lima.", lv: 2 },
      { en: "The train leaves at nine o'clock.", es: "El tren sale a las nueve en punto.", lv: 2 },
      { en: "Where is the bus station?", es: "¿Dónde está la estación de buses?", lv: 2 },
      { en: "My luggage is very heavy.", es: "Mi equipaje está muy pesado.", lv: 2 },
      { en: "The hotel room wasn't clean.", es: "La habitación del hotel no estaba limpia.", lv: 2 }
    ]
  },
  {
    title: "En el Trabajo",
    sentences: [
      { en: "I have a meeting at three.", es: "Tengo una reunión a las tres.", lv: 2 },
      { en: "Please fill out this form.", es: "Por favor completa este formulario.", lv: 2 },
      { en: "My colleague is on vacation.", es: "Mi colega está de vacaciones.", lv: 2 },
      { en: "The deadline is next Friday.", es: "La fecha límite es el próximo viernes.", lv: 2 },
      { en: "I need to talk to my manager.", es: "Necesito hablar con mi gerente.", lv: 2 }
    ]
  },
  {
    title: "Salud",
    sentences: [
      { en: "I have a headache today.", es: "Me duele la cabeza hoy.", lv: 2 },
      { en: "You should see a doctor.", es: "Deberías ver a un médico.", lv: 2 },
      { en: "She feels much better now.", es: "Ella se siente mucho mejor ahora.", lv: 2 },
      { en: "I need to rest for a week.", es: "Necesito descansar una semana.", lv: 2 },
      { en: "Take the medicine twice a day.", es: "Toma el medicamento dos veces al día.", lv: 2 }
    ]
  },
  {
    title: "Telefonear",
    sentences: [
      { en: "Could I speak to Mr. Díaz?", es: "¿Podría hablar con el señor Díaz?", lv: 2 },
      { en: "Hold on, please.", es: "Espere, por favor.", lv: 2 },
      { en: "The line is busy.", es: "La línea está ocupada.", lv: 2 },
      { en: "I'll call you back later.", es: "Te llamo de vuelta más tarde.", lv: 2 },
      { en: "Can I help you with that?", es: "¿Te ayudo con eso?", lv: 2 }
    ]
  },
  {
    title: "Cantidades",
    sentences: [
      { en: "How much does this cost?", es: "¿Cuánto cuesta esto?", lv: 2 },
      { en: "I need two tickets, please.", es: "Necesito dos entradas, por favor.", lv: 2 },
      { en: "We have enough time.", es: "Tenemos suficiente tiempo.", lv: 2 },
      { en: "There isn't much traffic today.", es: "No hay mucho tráfico hoy.", lv: 2 },
      { en: "How many people can fit?", es: "¿Cuánta gente cabe?", lv: 2 }
    ]
  },
  {
    title: "Planes",
    sentences: [
      { en: "Do you want to grab lunch?", es: "¿Quieres almorzar juntos?", lv: 2 },
      { en: "Let's meet at the coffee shop.", es: "Reunámonos en la cafetería.", lv: 2 },
      { en: "Are you free this weekend?", es: "¿Estás libre este fin de semana?", lv: 2 },
      { en: "I'd rather stay home tonight.", es: "Prefiero quedarme en casa esta noche.", lv: 2 },
      { en: "We might go to the movies.", es: "Podríamos ir al cine.", lv: 2 }
    ]
  },
  {
    title: "Habilidades",
    sentences: [
      { en: "She speaks three languages.", es: "Ella habla tres idiomas.", lv: 2 },
      { en: "I can play the guitar.", es: "Puedo tocar la guitarra.", lv: 2 },
      { en: "He can't lift heavy things.", es: "Él no puede levantar cosas pesadas.", lv: 2 },
      { en: "Do you know how to use this app?", es: "¿Sabes cómo usar esta aplicación?", lv: 2 },
      { en: "Reading is my favorite hobby.", es: "Leer es mi pasatiempo favorito.", lv: 2 }
    ]
  },
  {
    title: "Opiniones",
    sentences: [
      { en: "I think this is a good idea.", es: "Creo que esta es una buena idea.", lv: 2 },
      { en: "In my opinion, it's too expensive.", es: "En mi opinión, es demasiado caro.", lv: 2 },
      { en: "I don't really agree with that.", es: "No estoy muy de acuerdo con eso.", lv: 2 },
      { en: "That sounds reasonable to me.", es: "Eso me suena razonable.", lv: 2 },
      { en: "I'm not sure, but maybe.", es: "No estoy seguro, pero quizás.", lv: 2 }
    ]
  },
  {
    title: "Repaso Nivel 2",
    sentences: [
      { en: "I was working when you called me.", es: "Estaba trabajando cuando me llamaste.", lv: 2 },
      { en: "The restaurant was closed on Sunday.", es: "El restaurante estaba cerrado el domingo.", lv: 2 },
      { en: "She has been learning English for a year.", es: "Ella lleva un año aprendiendo inglés.", lv: 2 },
      { en: "We should leave before it rains.", es: "Deberíamos salir antes de que llueva.", lv: 2 },
      { en: "I'll send you the details later.", es: "Te enviaré los detalles más tarde.", lv: 2 }
    ]
  },

  /* ---------------- LEVEL 3 — B1: real-world detail ---------------- */
  {
    title: "Presente Perfecto",
    sentences: [
      { en: "I have lived here for five years.", es: "Vivo aquí hace cinco años.", lv: 3 },
      { en: "She has just finished her report.", es: "Ella acaba de terminar su informe.", lv: 3 },
      { en: "We haven't seen him since January.", es: "No lo hemos visto desde enero.", lv: 3 },
      { en: "Have you ever eaten sushi?", es: "¿Alguna vez has comido sushi?", lv: 3 },
      { en: "They have already paid the bill.", es: "Ellos ya han pagado la cuenta.", lv: 3 }
    ]
  },
  {
    title: "Pasado vs Perfecto",
    sentences: [
      { en: "I lost my keys yesterday.", es: "Perdí mis llaves ayer.", lv: 3 },
      { en: "I have lost my keys twice this year.", es: "He perdido mis llaves dos veces este año.", lv: 3 },
      { en: "We met in 2019.", es: "Nos conocimos en 2019.", lv: 3 },
      { en: "I haven't seen the new movie.", es: "No he visto la nueva película.", lv: 3 },
      { en: "She went to the doctor this morning.", es: "Ella fue al médico esta mañana.", lv: 3 }
    ]
  },
  {
    title: "Primera Condicional",
    sentences: [
      { en: "If it rains, we will stay home.", es: "Si llueve, nos quedaremos en casa.", lv: 3 },
      { en: "If you study, you will improve.", es: "Si estudias, mejorarás.", lv: 3 },
      { en: "I'll call you if I have news.", es: "Te llamaré si tengo noticias.", lv: 3 },
      { en: "We won't go out if it's cold.", es: "No saldremos si hace frío.", lv: 3 },
      { en: "She'll be happy if you come.", es: "Ella estará feliz si vienes.", lv: 3 }
    ]
  },
  {
    title: "Pasiva",
    sentences: [
      { en: "The report was written by Ana.", es: "El informe fue escrito por Ana.", lv: 3 },
      { en: "English is spoken everywhere.", es: "El inglés se habla en todas partes.", lv: 3 },
      { en: "The project will be finished on time.", es: "El proyecto terminará a tiempo.", lv: 3 },
      { en: "My car is being repaired.", es: "Mi auto está siendo reparado.", lv: 3 },
      { en: "The results were announced yesterday.", es: "Los resultados fueron anunciados ayer.", lv: 3 }
    ]
  },
  {
    title: "Gerundio e Infinitivo",
    sentences: [
      { en: "I enjoy reading before bed.", es: "Disfruto leer antes de dormir.", lv: 3 },
      { en: "She decided to move abroad.", es: "Ella decidió mudarse al extranjero.", lv: 3 },
      { en: "Walking there takes twenty minutes.", es: "Caminar hasta allá toma veinte minutos.", lv: 3 },
      { en: "He avoided answering the question.", es: "Él evitó responder la pregunta.", lv: 3 },
      { en: "I plan to study abroad next year.", es: "Planeo estudiar en el extranjero el próximo año.", lv: 3 }
    ]
  },
  {
    title: "Phrasal Verbs 1",
    sentences: [
      { en: "Please turn off the lights.", es: "Por favor apaga las luces.", lv: 3 },
      { en: "I need to look for my phone.", es: "Necesito buscar mi teléfono.", lv: 3 },
      { en: "Let's talk about it later.", es: "Hablemos de eso después.", lv: 3 },
      { en: "She showed up two hours late.", es: "Ella llegó dos horas tarde.", lv: 3 },
      { en: "Please fill in your name here.", es: "Por favor completa tu nombre aquí.", lv: 3 }
    ]
  },
  {
    title: "Phrasal Verbs 2",
    sentences: [
      { en: "We need to work out the details.", es: "Tenemos que resolver los detalles.", lv: 3 },
      { en: "He ran out of coffee.", es: "Se quedó sin café.", lv: 3 },
      { en: "Can you check on the client?", es: "¿Puedes revisar al cliente?", lv: 3 },
      { en: "I found out about the delay.", es: "Me enteré del retraso.", lv: 3 },
      { en: "Let's set up a meeting.", es: "Organicemos una reunión.", lv: 3 }
    ]
  },
  {
    title: "Comparativos",
    sentences: [
      { en: "This one is cheaper than that one.", es: "Este es más barato que ese.", lv: 3 },
      { en: "She's more experienced than me.", es: "Ella tiene más experiencia que yo.", lv: 3 },
      { en: "It's the best restaurant in town.", es: "Es el mejor restaurante de la ciudad.", lv: 3 },
      { en: "The exam was less difficult than expected.", es: "El examen fue menos difícil de lo esperado.", lv: 3 },
      { en: "He drives as fast as his brother.", es: "Él maneja tan rápido como su hermano.", lv: 3 }
    ]
  },
  {
    title: "Superlativos",
    sentences: [
      { en: "It's the most useful app I've used.", es: "Es la aplicación más útil que he usado.", lv: 3 },
      { en: "That's the worst mistake of the year.", es: "Ese es el peor error del año.", lv: 3 },
      { en: "She is one of the best teachers here.", es: "Ella es una de las mejores maestras aquí.", lv: 3 },
      { en: "The second floor is quieter.", es: "El segundo piso es más silencioso.", lv: 3 },
      { en: "This is by far the hardest level.", es: "Este es, con diferencia, el nivel más difícil.", lv: 3 }
    ]
  },
  {
    title: "Email de Trabajo",
    sentences: [
      { en: "I'm writing to confirm our appointment.", es: "Escribo para confirmar nuestra cita.", lv: 3 },
      { en: "Please find attached the invoice.", es: "Adjunto la factura.", lv: 3 },
      { en: "I look forward to hearing from you.", es: "Espero tener noticias tuyas.", lv: 3 },
      { en: "Could you send me the updated version?", es: "¿Podrías enviarme la versión actualizada?", lv: 3 },
      { en: "Please let me know if you have any questions.", es: "Avísame si tienes alguna pregunta.", lv: 3 }
    ]
  },
  {
    title: "Presentar defended",
    sentences: [
      { en: "Let me explain the main idea.", es: "Déjame explicar la idea principal.", lv: 3 },
      { en: "Our goal is to reduce costs.", es: "Nuestra meta es reducir los costos.", lv: 3 },
      { en: "This improves the user experience.", es: "Esto mejora la experiencia del usuario.", lv: 3 },
      { en: "Let's move on to the next topic.", es: "Pasemos al siguiente tema.", lv: 3 },
      { en: "In summary, we need more data.", es: "En resumen, necesitamos más datos.", lv: 3 }
    ]
  },
  {
    title: "Medias y Duties",
    sentences: [
      { en: "He speaks three languages fluently.", es: "Él habla tres idiomas con fluidez.", lv: 3 },
      { en: "I have to take a bus every morning.", es: "Tengo que tomar un autobús cada mañana.", lv: 3 },
      { en: "You should get some exercise.", es: "Deberías hacer algo de ejercicio.", lv: 3 },
      { en: "The train leaves in ten minutes.", es: "El tren sale en diez minutos.", lv: 3 },
      { en: "She's supposed to arrive by noon.", es: "Se supone que ella llega antes del mediodía.", lv: 3 }
    ]
  },
  {
    title: "Educación",
    sentences: [
      { en: "I failed the exam last year.", es: "Reprobé el examen el año pasado.", lv: 3 },
      { en: "She passed all her courses.", es: "Ella aprobó todos sus cursos.", lv: 3 },
      { en: "The university offers free courses.", es: "La universidad ofrece cursos gratuitos.", lv: 3 },
      { en: "I'm taking a class in economics.", es: "Estoy tomando una clase de economía.", lv: 3 },
      { en: "He dropped out of school.", es: "Él dejó los estudios.", lv: 3 }
    ]
  },
  {
    title: "Problemas y Soluciones",
    sentences: [
      { en: "We need to fix this problem quickly.", es: "Tenemos que arreglar este problema rápido.", lv: 3 },
      { en: "The solution is simpler than it looks.", es: "La solución es más simple de lo que parece.", lv: 3 },
      { en: "Something went wrong yesterday.", es: "Algo salió mal ayer.", lv: 3 },
      { en: "I'm taking care of it.", es: "Yo me estoy encargando de eso.", lv: 3 },
      { en: "We ran into a small issue.", es: "Encontramos un pequeño problema.", lv: 3 }
    ]
  },
  {
    title: "Repaso Nivel 3",
    sentences: [
      { en: "If you had asked, I would have helped.", es: "Si me hubieras preguntado, te habría ayudado.", lv: 3 },
      { en: "The rules have changed since last year.", es: "Las reglas han cambiado desde el año pasado.", lv: 3 },
      { en: "I've been working here for two years.", es: "Llevo dos años trabajando aquí.", lv: 3 },
      { en: "She didn't realize how late it was.", es: "Ella no se dio cuenta de qué tarde era.", lv: 3 },
      { en: "We should have left earlier.", es: "Deberíamos habernos ido antes.", lv: 3 }
    ]
  },

  /* ---------------- LEVEL 4 — B2: nuance ---------------- */
  {
    title: "Perfecto vs Pasado Profundo",
    sentences: [
      { en: "I've known him since childhood.", es: "Lo conozco desde la infancia.", lv: 4 },
      { en: "I knew him when he lived abroad.", es: "Lo conocía cuando vivía en el extranjero.", lv: 4 },
      { en: "She's been working on the same project all month.", es: "Lleva todo el mes trabajando en el mismo proyecto.", lv: 4 },
      { en: "We had already left when he arrived.", es: "Ya nos habíamos ido cuando él llegó.", lv: 4 },
      { en: "He has just realized his mistake.", es: "Él acaba de darse cuenta de su error.", lv: 4 }
    ]
  },
  {
    title: "Segunda y Tercera Condicional",
    sentences: [
      { en: "If I had more time, I would travel.", es: "Si tuviera más tiempo, viajaría.", lv: 4 },
      { en: "If I had studied, I would have passed.", es: "Si hubiera estudiado, habría aprobado.", lv: 4 },
      { en: "She would have helped if you had asked.", es: "Ella te habría ayudado si se lo hubieras pedido.", lv: 4 },
      { en: "If I were you, I would resign.", es: "Si fuera tú, renunciaría.", lv: 4 },
      { en: "We wish the deadline hadn't moved.", es: "Ojalá la fecha límite no se hubiera movido.", lv: 4 }
    ]
  },
  {
    title: "Pasiva Avanzada",
    sentences: [
      { en: "The contract is being reviewed by legal.", es: "El contrato está siendo revisado por el área legal.", lv: 4 },
      { en: "Mistakes must be reported immediately.", es: "Los errores deben reportarse de inmediato.", lv: 4 },
      { en: "It is widely believed that the theory is flawed.", es: "Se cree ampliamente que la teoría tiene fallas.", lv: 4 },
      { en: "The building had been renovated before the sale.", es: "El edificio había sido renovado antes de la venta.", lv: 4 },
      { en: "Nothing was said about the budget.", es: "No se dijo nada sobre el presupuesto.", lv: 4 }
    ]
  },
  {
    title: "Discurso Indirecto",
    sentences: [
      { en: "She said she was busy that day.", es: "Ella dijo que estaba ocupada ese día.", lv: 4 },
      { en: "He told me he would call later.", es: "Él me dijo que llamaría después.", lv: 4 },
      { en: "They explained that the train had been delayed.", es: "Ellos explicaron que el tren había sido retrasado.", lv: 4 },
      { en: "I asked whether the price included tax.", es: "Pregunté si el precio incluía impuestos.", lv: 4 },
      { en: "She admitted that she had forgotten.", es: "Ella admitió que se había olvidado.", lv: 4 }
    ]
  },
  {
    title: "Linkers de Contraste",
    sentences: [
      { en: "Although it was raining, we went outside.", es: "Aunque llovía, salimos afuera.", lv: 4 },
      { en: "However, the results were surprising.", es: "Sin embargo, los resultados fueron sorprendentes.", lv: 4 },
      { en: "On the other hand, the cost is lower.", es: "Por otro lado, el costo es menor.", lv: 4 },
      { en: "Nevertheless, the plan is worth trying.", es: "No obstante, el plan vale la pena.", lv: 4 },
      { en: "Even though he was tired, he finished.", es: "Aunque estaba cansado, terminó.", lv: 4 }
    ]
  },
  {
    title: "Linkers de Causa",
    sentences: [
      { en: "The flight was canceled because of the storm.", es: "El vuelo fue cancelado por la tormenta.", lv: 4 },
      { en: "Since we arrived early, we waited outside.", es: "Como llegamos temprano, esperamos afuera.", lv: 4 },
      { en: "Therefore, we changed the schedule.", es: "Por lo tanto, cambiamos el horario.", lv: 4 },
      { en: "The project failed due to poor planning.", es: "El proyecto fracasó debido a una mala planificación.", lv: 4 },
      { en: "As a result, sales dropped sharply.", es: "Como resultado, las ventas cayeron bruscamente.", lv: 4 }
    ]
  },
  {
    title: "Phrasal Verbs Avanzados",
    sentences: [
      { en: "Let's rule out that option for now.", es: "Descartemos esa opción por ahora.", lv: 4 },
      { en: "I can't put up with this noise.", es: "No puedo tolerar este ruido.", lv: 4 },
      { en: "She stood by her decision.", es: "Ella mantuvo su decisión.", lv: 4 },
      { en: "They came up with a better plan.", es: "Ellos propuso un plan mejor.", lv: 4 },
      { en: "He took over the project last month.", es: "Él tomó el control del proyecto el mes pasado.", lv: 4 }
    ]
  },
  {
    title: "Registro Formal",
    sentences: [
      { en: "We regret to inform you of the delay.", es: "Lamentamos informarle del retraso.", lv: 4 },
      { en: "Kindly submit the documents before Friday.", es: "Le rogamos enviar los documentos antes del viernes.", lv: 4 },
      { en: "Please do not hesitate to contact me.", es: "No dude en contactarme.", lv: 4 },
      { en: "I remain at your disposal.", es: "Quedo a su disposición.", lv: 4 },
      { en: "Thank you for your prompt response.", es: "Gracias por su rápida respuesta.", lv: 4 }
    ]
  },
  {
    title: "Registro Informal",
    sentences: [
      { en: "Sorry, I didn't catch that.", es: "Perdón, no entendí eso.", lv: 4 },
      { en: "Let me get back to you on that.", es: "Te respondo a eso luego.", lv: 4 },
      { en: "That's totally fine, don't worry.", es: "Está bien, no te preocupes.", lv: 4 },
      { en: "I totally get what you mean.", es: "Entiendo perfectamente lo que quieres decir.", lv: 4 },
      { en: "My bad, I'll fix it.", es: "Mi error, lo arreglo.", lv: 4 }
    ]
  },
  {
    title: "Argumentación",
    sentences: [
      { en: "There's a strong case for investing more.", es: "Hay un argumento sólido para invertir más.", lv: 4 },
      { en: "That claim lacks evidence.", es: "Esa afirmación carece de evidencia.", lv: 4 },
      { en: "I'd argue the opposite is true.", es: "Sostendría que lo contrario es cierto.", lv: 4 },
      { en: "The downside is the cost.", es: "La desventaja es el costo.", lv: 4 },
      { en: "On balance, I think it's worth it.", es: "En balance, creo que vale la pena.", lv: 4 }
    ]
  },
  {
    title: "Describir Procesos",
    sentences: [
      { en: "Once the payment clears, we ship the order.", es: "Una vez que el pago se confirma, enviamos el pedido.", lv: 4 },
      { en: "Applicants must submit two references.", es: "Los postulantes deben enviar dos referencias.", lv: 4 },
      { en: "The device is designed to be repaired.", es: "El dispositivo está diseñado para ser reparado.", lv: 4 },
      { en: "Data is stored on encrypted servers.", es: "Los datos se almacenan en servidores cifrados.", lv: 4 },
      { en: "The process takes about two weeks.", es: "El proceso toma alrededor de dos semanas.", lv: 4 }
    ]
  },
  {
    title: "Negociación",
    sentences: [
      { en: "We're flexible on the price.", es: "Somos flexibles con el precio.", lv: 4 },
      { en: "The offer expires at the end of the month.", es: "La oferta expira a fin de mes.", lv: 4 },
      { en: "We can meet you halfway.", es: "Podemos llegar a un punto medio contigo.", lv: 4 },
      { en: "That's below what we can accept.", es: "Eso está por debajo de lo que podemos aceptar.", lv: 4 },
      { en: "Let's discuss the details tomorrow.", es: "Discutamos los detalles mañana.", lv: 4 }
    ]
  },
  {
    title: "Medir y Cuantificar",
    sentences: [
      { en: "Sales grew by fifteen percent.", es: "Las ventas crecieron un quince por ciento.", lv: 4 },
      { en: "The average wait time is thirty minutes.", es: "El tiempo de espera promedio es de treinta minutos.", lv: 4 },
      { en: "We reduced costs by a third.", es: "Reducimos los costos en un tercio.", lv: 4 },
      { en: "Roughly half of them agreed.", es: "Aproximadamente la mitad estuvo de acuerdo.", lv: 4 },
      { en: "The figure doubled in two years.", es: "La cifra se duplicó en dos años.", lv: 4 }
    ]
  },
  {
    title: "Riesgo y Precaución",
    sentences: [
      { en: "There's a risk of delays if we start late.", es: "Hay riesgo de retrasos si empezamos tarde.", lv: 4 },
      { en: "We should have a backup plan.", es: "Deberíamos tener un plan de contingencia.", lv: 4 },
      { en: "Make sure you back up the file.", es: "Asegúrate de hacer una copia de seguridad del archivo.", lv: 4 },
      { en: "In the worst case, we postpone.", es: "En el peor caso, posponemos.", lv: 4 },
      { en: "It might not work as expected.", es: "Podría no funcionar como se espera.", lv: 4 }
    ]
  },
  {
    title: "Repaso Nivel 4",
    sentences: [
      { en: "Looking back, we handled it well.", es: "Mirando atrás, lo manejamos bien.", lv: 4 },
      { en: "Had I known, I'd have told you.", es: "Si lo hubiera sabido, te lo habría dicho.", lv: 4 },
      { en: "The proposal was rejected without explanation.", es: "La propuesta fue rechazada sin explicación.", lv: 4 },
      { en: "We're still weighing our options.", es: "Seguimos evaluando nuestras opciones.", lv: 4 },
      { en: "It goes without saying that deadlines matter.", es: "Ni hace falta decir que los plazos importan.", lv: 4 }
    ]
  },

  /* ---------------- LEVEL 5 — B2+/C1: advanced nuance ---------------- */
  {
    title: "Condicionales Mezclados",
    sentences: [
      { en: "If I had accepted the offer, I'd be living abroad now.", es: "Si hubiera aceptado la oferta, estaría viviendo en el extranjero ahora.", lv: 5 },
      { en: "She wouldn't have missed the train if she'd left earlier.", es: "No habría perdido el tren si se hubiera ido antes.", lv: 5 },
      { en: "Were we to delay the launch, we'd lose the market.", es: "Si retrasáramos el lanzamiento, perderíamos el mercado.", lv: 5 },
      { en: "Should it rain, the event will move indoors.", es: "Si lloviera, el evento se mudará al interior.", lv: 5 },
      { en: "If anything changes, let me know.", es: "Si algo cambia, avísame.", lv: 5 }
    ]
  },
  {
    title: "Inversión y Énfasis",
    sentences: [
      { en: "Not only did she finish early, but she also exceeded expectations.", es: "No solo terminó temprano, sino que además superó las expectativas.", lv: 5 },
      { en: "Rarely have I seen such commitment.", es: "Rara vez he visto tanto compromiso.", lv: 5 },
      { en: "Only after the audit was the discrepancy found.", es: "Solo después de la auditoría se encontró la discrepancia.", lv: 5 },
      { en: "On no account should you share this.", es: "Bajo ninguna circunstancia debes compartir esto.", lv: 5 },
      { en: "Seldom does an opportunity like this arise.", es: "Rara vez surge una oportunidad así.", lv: 5 }
    ]
  },
  {
    title: "Pasiva Formal",
    sentences: [
      { en: "It has been decided that the office will close.", es: "Se ha decidido que la oficina cerrará.", lv: 5 },
      { en: "The findings were subsequently challenged.", es: "Los hallazgos fueron posteriormente cuestionados.", lv: 5 },
      { en: "Such behavior is not tolerated.", es: "Esa conducta no se tolera.", lv: 5 },
      { en: "He is said to be the leading candidate.", es: "Se dice que es el candidato principal.", lv: 5 },
      { en: "The proposal remains under consideration.", es: "La propuesta sigue en estudio.", lv: 5 }
    ]
  },
  {
    title: "Modales con Pasado",
    sentences: [
      { en: "You should have told me earlier.", es: "Deberías haberme informed antes.", lv: 5 },
      { en: "She must have forgotten about it.", es: "Ella se debe haber olvidado de eso.", lv: 5 },
      { en: "They can't have finished already.", es: "No pueden haber terminado ya.", lv: 5 },
      { en: "I might have mentioned it in passing.", es: "Podría haberlo mencionado de pasada.", lv: 5 },
      { en: "It ought to be straightforward.", es: "Debería ser sencillo.", lv: 5 }
    ]
  },
  {
    title: "Precision Léxica",
    sentences: [
      { en: "The results were inconclusive.", es: "Los resultados no fueron concluyentes.", lv: 5 },
      { en: "She has a tendency to overthink.", es: "Ella tiene la tendencia a sobrepensar.", lv: 5 },
      { en: "The two accounts differ significantly.", es: "Las dos versiones difieren significativamente.", lv: 5 },
      { en: "His argument is plausible but flawed.", es: "Su argumento es plausible pero defectuoso.", lv: 5 },
      { en: "The evidence remains circumstantial.", es: "La evidencia sigue siendo circunstancial.", lv: 5 }
    ]
  },
  {
    title: "Hedging",
    sentences: [
      { en: "I'd say it's roughly on track.", es: "Diría que más o menos va en camino.", lv: 5 },
      { en: "That seems plausible enough.", es: "Eso parece suficientemente creíble.", lv: 5 },
      { en: "There's a reasonable chance of delay.", es: "Hay una posibilidad razonable de retraso.", lv: 5 },
      { en: "It might, to some extent, be true.", es: "Podría, en cierta medida, ser cierto.", lv: 5 },
      { en: "I wouldn't rule it out entirely.", es: "No lo descartaría del todo.", lv: 5 }
    ]
  },
  {
    title: "Concesión",
    sentences: [
      { en: "Granted, the plan has merit.", es: "Ciertamente, el plan tiene mérito.", lv: 5 },
      { en: "Admittedly, we underestimated demand.", es: "Ciertamente, subestimamos la demanda.", lv: 5 },
      { en: "That said, the risks are real.", es: "Dicho eso, los riesgos son reales.", lv: 5 },
      { en: "Be that as it may, we must decide.", es: "Sea como sea, debemos decidir.", lv: 5 },
      { en: "While I see the appeal, I disagree.", es: "Aunque veo el atractivo, estoy en desacuerdo.", lv: 5 }
    ]
  },
  {
    title: "Business Abstracto",
    sentences: [
      { en: "Revenue streams need diversifying.", es: "Las fuentes de ingreso necesitan diversificarse.", lv: 5 },
      { en: "The margin leaves little room for error.", es: "El margen deja poco espacio para el error.", lv: 5 },
      { en: "We should capitalize on the momentum.", es: "Deberíamos capitalizar el impulso.", lv: 5 },
      { en: "Costs must be reconciled before signing.", es: "Los costos deben conciliarse antes de firmar.", lv: 5 },
      { en: "Stakeholders expect quarterly updates.", es: "Las partes interesadas esperan actualizaciones trimestrales.", lv: 5 }
    ]
  },
  {
    title: "Cultura y Sociedad",
    sentences: [
      { en: "Traditions evolve rather than disappear.", es: "Las tradiciones evolucionan en vez de desaparecer.", lv: 5 },
      { en: "The debate centers on access, not quality.", es: "El debate se centra en el acceso, no en la calidad.", lv: 5 },
      { en: "Generational attitudes have shifted markedly.", es: "Las actitudes generacionales han cambiado notablemente.", lv: 5 },
      { en: "Inequality remains the defining issue.", es: "La desigualdad sigue siendo el problema definitorio.", lv: 5 },
      { en: "Urbanization continues to reshape cities.", es: "La urbanización sigue transformando las ciudades.", lv: 5 }
    ]
  },
  {
    title: "Tecnología",
    sentences: [
      { en: "Automation has reshaped entry-level jobs.", es: "La automatización ha redefinido los trabajos de nivel inicial.", lv: 5 },
      { en: "The algorithm determines what gets recommended.", es: "El algoritmo determina qué se recomienda.", lv: 5 },
      { en: "Privacy concerns continue to grow.", es: "Las preocupaciones por la privacidad siguen creciendo.", lv: 5 },
      { en: "Adoption is gradual but irreversible.", es: "La adopción es gradual pero irreversible.", lv: 5 },
      { en: "Redundancy is a feature, not a flaw.", es: "La redundancia es una característica, no un defecto.", lv: 5 }
    ]
  },
  {
    title: "Ironía y Tono",
    sentences: [
      { en: "Great. Another delay we weren't told about.", es: "Genial. Otro retraso del que no nos enteramos.", lv: 5 },
      { en: "That's one way of putting it.", es: "Esa es una forma de decirlo.", lv: 5 },
      { en: "Well, that went better than expected.", es: "Bueno, eso salió mejor de lo esperado.", lv: 5 },
      { en: "So, we're behind schedule. Shocking.", es: "Así que vamos atrasados. Sorprendente.", lv: 5 },
      { en: "I appreciate the honesty, oddly enough.", es: "Aprecio la honestidad, curiosamente.", lv: 5 }
    ]
  },
  {
    title: "Idioms",
    sentences: [
      { en: "Let's call it a day.", es: "Demoslo por hoy.", lv: 5 },
      { en: "That's easier said than done.", es: "Eso es más fácil de decir que de hacer.", lv: 5 },
      { en: "I'm on the fence about it.", es: "Estoy dudando sobre eso.", lv: 5 },
      { en: "He threw me a curveball.", es: "Me lanczo una curva inesperada.", lv: 5 },
      { en: "We need to read the fine print.", es: "Necesitamos leer la letra chica.", lv: 5 }
    ]
  },
  {
    title: "Repaso Nivel 5",
    sentences: [
      { en: "Had the deadline been extended, the team would have delivered.", es: "Si se hubiera extendido el plazo, el equipo habría entregado.", lv: 5 },
      { en: "The findings, though preliminary, point to a clear pattern.", es: "Los hallazgos, aunque preliminares, apuntan a un patrón claro.", lv: 5 },
      { en: "Not by a long shot.", es: "Ni mucho menos.", lv: 5 },
      { en: "What the report fails to address is the long-term cost.", es: "Lo que el informe no aborda es el costo a largo plazo.", lv: 5 },
      { en: "Progress is undeniable, though uneven.", es: "El progreso es innegable, aunque desigual.", lv: 5 }
    ]
  }
];
