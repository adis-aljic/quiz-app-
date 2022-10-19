const rules = () => {
    document.getElementById("rules").addEventListener("click", () =>
        alert(`
    For game to start first choose username, difficulty, categories and number of question.
    You can  choose one difficulty, one more then one catogory and up to 50 questions per one game.
    Your score is range as percentage for correct answers. 
    Top players, with score of 90% and more, are listed on "TOP 90% players" button.
    Good Luck`)
    )
}

const list_games = () => {
    document.getElementById("list_games").addEventListener("click", () => {
        let list = ""
        for (let i = 0; i < localStorage.length; i++) {

            let key = localStorage.key(i);

            let value = localStorage.getItem(key);
            let user = JSON.parse(value)
            if (Number(user.percentege.slice(0, -1)) > 90)
                list += `Username: ${user.username} <br> Percentege:  ${user.percentege} <br> Time ${user.time} <br><hr> 
                `

        }
        document.getElementById("top").innerHTML = list
    })
}
function play_correct() {
    var audio = new Audio('correct.mp3');
    audio.play();
}
function play_wrong() {
    var audio = new Audio('wrong.mp3');
    audio.play();
}

const input = () => {
    let string = "https://the-trivia-api.com/api/questions?categories="
    let categories = [];
    let categoriesCheckedValue = document.querySelectorAll('.categories:checked');
    if (categoriesCheckedValue.length === 0) {
        string += "arts_and_literature,film_and_tv,food_and_drink,general_knowledge,geography,history,music,science,society_and_culture,sport_and_leisure"
    }
    else if (categoriesCheckedValue == "random,arts_and_literature,film_and_tv,food_and_drink,general_knowledge,geography,history,music,science,society_and_culture,sport_and_leisure") {
        const cat = document.getElementById("random_cat").value
        const cat_string = cat.split(",")
        let i = Math.trunc(Math.random() * 11 + 1)
        string += cat_string[i];
    }
    else {
        categoriesCheckedValue.forEach((element) => {
            categories.push(element.value)
        })
        string += categories.join(",")

    }
    console.log(string);
    let dif = ["easy", "medium", "hard"]
    let rnd = Math.trunc(Math.random() * 3)
    let dificulity = "";
    let dificulityCheckedValue = document.getElementsByName('dificulity');
    dificulityCheckedValue.forEach((element) => {
        if (element.checked && element.value == "random_diff") {

            dificulity = dif[rnd]
        }
        else if (element.checked) {
            dificulity = element.value
        }
    })

    const limit = document.getElementById("limit").value
    if (limit <= 50 && limit > 0) {
        let link = `${string}&limit=${limit}&dificulty=${dificulity}`
        return link
    }
    else {
        // window.location.reload()
        window.alert("Unesite broj pitanja od 1 do 50")
    }
}

const switch_to_first_question = () => {
    document.getElementById("start_container").classList.add("hidden")
    document.getElementById("start_button").classList.add("hidden")
    document.getElementById("start_button").classList.remove("btn")
    document.getElementById("card").classList.remove("hidden")
    document.getElementById("next").classList.remove("hidden")
    document.getElementById("next").classList.add("btn")

}


const select_buttons_for_answers = () => {
    const input_a = document.getElementById("a")
    const input_b = document.getElementById("b")
    const input_c = document.getElementById("c")
    const input_d = document.getElementById("d")
    const input_none = document.getElementById("none")
    const inputs = []
    inputs.push(input_a, input_b, input_c, input_d)
    return inputs.sort(() => Math.random() - 0.5)
}

const create_object_with_data_from_api = (data) => {
    const questions = []
    data.forEach(element => {
        const question = {
            question: element.question,
            a: element.correctAnswer,
            b: element.incorrectAnswers[0],
            c: element.incorrectAnswers[1],
            d: element.incorrectAnswers[2],
            answers: [element.correctAnswer, element.incorrectAnswers[0], element.incorrectAnswers[1], element.incorrectAnswers[2]],
            category: element.category,
            difficulty: element.difficulty
        }
        question.correctAnswer = question.a
        questions.push(question)
    });
    return questions
}
const add_question = (questionNbr, questions, inputs,question_times) => {
                question_timer(question_times)

    inputs.forEach((element) => {
        {
            // element.classList.remove("selected")
            if (element.classList.contains("correct")) element.classList.remove("correct")
            if (element.classList.contains("wrong")) element.classList.remove("wrong")
        }
    })
    document.getElementById("question_text").innerText = questions[questionNbr].question
    document.getElementById("question_category").innerText = `Category : ${questions[questionNbr].category}`
    document.getElementById("dificulity_text").innerText = `Difficulty : ${questions[questionNbr].difficulty}`
    inputs.sort(() => Math.random() - 0.5)
    for (let u = 0; u < 4; u++) {
        const element = inputs[u];
        const input = inputs[u]
        element.innerText = questions[questionNbr].answers[u]
        input.setAttribute("value", questions[questionNbr].answers[u])

    }

}



const timer = () => {

    let time = 0
    let timer = setInterval(() => {

        time += 1000
        let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((time % (1000 * 60)) / 1000);
        if (document.getElementById("timer") != null) {


            if (seconds < 10) {

                document.getElementById("timer").innerHTML = ` ${minutes}min 0${seconds}s `
            }
            else {

                document.getElementById("timer").innerHTML = ` ${minutes}min ${seconds}s `
            }
            // document.getElementById("timer").innerText = ` ${minutes}min ${seconds}s `
        }
        else return

    }, 1000);
    if (!document.getElementById("timer").innerText) {
        return
    }


}

const question_timer = (question_times) => {
    

    let now = 10000;
    var question_timer_int = setInterval(() => {
        now -= 1000
        if (now == -1000) {
            alert("Time is up. Please click on next")
            question_times.push(`Timed out`)
            console.log("distance 0");
            if (document.getElementById("question_timer" != null)) {
                
                document.getElementById("question_timer").innerHTML = ""
            }
            document.getElementsByName("answer").forEach((element) => element.classList.add("wrong"))
            document.getElementById("none").click()
            clearInterval(question_timer_int)
            return
        }
        else {

            let minutes = Math.floor(now / 60000);
            let seconds = (now) / 1000 - Math.floor(minutes * 60);
            console.log("aaaaaaaaa");
            if (document.getElementById("timer") != null && seconds < 10) {

                document.getElementById("question_timer").innerHTML = ` ${minutes}min 0${seconds}s `
            }
            else if (document.getElementById("timer") != null && seconds >= 10) {
                document.getElementById("question_timer").innerHTML = ` ${minutes}min ${seconds}s `

            }

        }





    }, 1000);

    
        document.getElementById("next").addEventListener("click", ()=>{
            // if (document.getElementById("question_timer") != null) {
                        
            //     question_times.push(`0:${30 - Number(document.getElementById("question_timer").innerText.slice(-3, -1))}s `)
            // }
            clearInterval(question_timer_int)
        })

}


const listAns = (answers_from_user, questions, maxQuestions, question_times) => {
    const list = []
    for (let i = 0; i < maxQuestions; i++) {
        const answer_from_user = answers_from_user[i];
        const question = questions[i].question;
        const correctAnswer = questions[i].correctAnswer
        if (document.getElementById("timer").innerHTML) {


            if (answer_from_user == correctAnswer) {
                // counter++

                list.push(`<div class="correct_div"><strong>Category: ${questions[i].category} </strong> 
                <br>
                <strong>Difficulty: ${questions[i].difficulty} </strong>  <br> <strong> Question: </strong>${question} <br> <strong>Your answer:</strong> ${answer_from_user}  <br><strong> Correct answer: </strong>${correctAnswer} 
                <br> 
                <strong>Number of questions: </strong>${maxQuestions}
                <br>
                <strong>Time per question: </strong> ${question_times[i]} </div>
                <hr>
                
                `)
            }
            else {

                list.push(`<div class="wrong_div"> <strong> Question: </strong> ${question} <br><strong> Your answer:</strong> ${answer_from_user}  <br><strong> Correct answer: </strong>${correctAnswer} 
                <br> 
                <strong> Number of questions: </strong>${maxQuestions}
                <br>
                <strong>Time per question:</strong> ${question_times[i]}   </div>
                <hr>
                
                `)
            }
        }
        else return
    }

    return list.join("")
}













rules()
list_games()
document.getElementById("clear").addEventListener("click", () => localStorage.clear())



let username = document.getElementById("username").value
let start_button = document.getElementById("start_button");
if (username = "") {
    alert("Please enter username")
}
else {

    start_button.addEventListener("click", () => {
        start_game()
    }
    );
}


const start_game = () => {
    document.getElementById("card").classList.remove("score_listed")

    fetch(`${input()}`)
        .then(response => response.json())
        .then((data) => {
            let counter = 0;
            let questionNbr = 0;
            const maxQuestions = data.length;
            const answers_from_user = []
            const question_times = []
            let username = document.getElementById("username").value
            if (!username) {
                username = `Guest-${Math.trunc(Math.random() * 10000000)}`
            }
            switch_to_first_question()
            const questions = create_object_with_data_from_api(data)
            const inputs = select_buttons_for_answers()

            let score = document.getElementById("score");
            score.innerText = `Question ${questionNbr + 1} /${data.length}. Correct answers : ${counter}/${maxQuestions}`

            add_question(questionNbr, questions, inputs,question_times)
            timer()
            const first_answers = []
            inputs.forEach(element => {
                element.addEventListener("click", () => {

                    if (!answers_from_user.includes(element.value)) {
                        const first_answer = {};
                        first_answer.answer = element.value
                        first_answer.question = questions[questionNbr]
                        first_answers.push(first_answer)

                        if (element.value == questions[questionNbr].correctAnswer && !document.getElementById("none").classList.contains("wrong")) {
                            console.log(first_answers);
                            inputs.forEach((el) => {
                                if (!el.classList.contains("wrong") && el == element) {

                                    console.log("correct");
                                    play_correct()
                                    document.getElementById("c_w").innerHTML = `This is correct answer`
                                    element.classList.add("correct")
                                    answers_from_user.push(element.value)
                                    counter++
                                }
                            })
                        }
                        else {
                            play_wrong()
                            console.log("wrong");
                            answers_from_user.push(element.value)
                            element.classList.add("wrong")
                            document.getElementById("c_w").innerHTML = `This is wrong answer`
                        }
                    }
                })
            })

            document.getElementById("next").addEventListener("click", () => {
       
                if (document.getElementById("question_timer") != null) {

                    question_times.push(`0:${30 - Number(document.getElementById("question_timer").innerText.slice(-3, -1))}s `)
                    console.log(`0:${30 - Number(document.getElementById("question_timer").innerText.slice(-3, -1))}s `);
                }

                document.getElementById("none").classList.remove("wrong")
                document.getElementById("c_w").innerHTML = ""
                if (questionNbr + 1 == maxQuestions) {
                    const obj = {
                        username: username,
                        percentege: Math.floor(counter / maxQuestions) * 100 + "%",
                        time: document.getElementById("timer").innerText

                    };
                    localStorage.setItem(`${username}`, JSON.stringify(obj))
                }

                inputs.forEach(element => {
                    if (!element.classList.contains("wrong") && !element.classList.contains("correct")) {
                        return;
                    }
                    else {

                        if (questionNbr + 1 == data.length) {
                            // clearInterval(question_timer(question_times,1)) // ?????
                            document.getElementById("new_game").classList.remove("hidden")
                            document.getElementById("new_game").classList.add("btn")
                            document.getElementById("next").classList.remove("btn")
                            document.getElementById("next").classList.add("hidden")
                            if (document.getElementById("question_timer") != null) {

                                // question_times.push(`0:${30 - Number(document.getElementById("question_timer").innerText.slice(-3, -1))}s `)
                            }
                            document.getElementById("card").classList.add("score_listed")
                            document.getElementById("card").innerHTML = `<span>Hello  <strong><u>${username}</u></strong> your score is ${counter}/${data.length} (${Math.floor(counter * 100 / data.length)}%) </span>
                            
                        <br>
                        Time: ${document.getElementById("timer").innerText}
                        <br>
                        <p class="score_listed">  <br> ${listAns(answers_from_user, questions, data.length, question_times)} </p>
                        `
                        }
                        else {

                            document.getElementById("score").innerText = ` Question ${questionNbr + 2} /${data.length}. Correct answers : ${counter}/${maxQuestions}`
                            questionNbr++
                            add_question(questionNbr, questions, inputs,question_times)

                        }
                    }

                })

            })

        }).catch((err) => console.log(err))

}
