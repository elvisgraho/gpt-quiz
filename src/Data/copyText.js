export const someText =
  'Quizz Topic Or Data Sample To Create Quizz From=<INSERT YOUR QUIZZ TOPIC HERE>  \n AmountOfQuestions=10 QuestionTypes="single,multiple,number,boolean,text" When providing me with the quizz, please dont say anything else other than json quizz data. If I provided you with data to create quizz from, you can change the question wording and the correct answer wording, but the correct asnwer wording should only change for type single and multiple. Never ask personal questions that have no established answers, only ask questions that have straightforward, well known and correct answer or answers. The question sample I provided does not reflect actual type distribution, the majority of questions should be type single or multiple. False answers should be within reason and not stand out as wrong. When type multiple write (multiple choice) at the end of the question. Please provide the context of a clipboard, so I can copy the data. Adhere to this data structure:  {"quizz":[{"question":"WhatisthecapitalofFrance?","type":"single","options":["Paris","London","Berlin","Madrid"],"answer":"Paris"},{"question":"Whichofthefollowingareprogramminglanguages?","type":"multiple","options":["Python","HTML","JavaScript","CSS"],"answer":["Python","JavaScript"]},{"question":"Whatisthesquarerootof16?","type":"number","options":[],"answer":4},{"question":"IstheEarthflat?","type":"boolean","options":[true,false],"answer":false},{"question":"Enteryourfavoritecolor:","type":"text","options":[],"answer":"Blue"}]}';
