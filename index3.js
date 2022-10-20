const rules = () => {
    document.getElementById("rules").addEventListener("click", () =>
        alert(`
    For game to start first choose username, difficulty, categories and number of question.
    You can  choose one difficulty, one more then one catogory and up to 50 questions per one game.
    Your score is range as percentage for correct answers. 
    Top players, with score of 90% and more, are listed bellow "TOP 90% players".
    Good Luck`)
    )
}



const list_games = () => {
    window.addEventListener("load", () => {
        let list = ""
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            let user = JSON.parse(value)
            if (Number(user.percentege.slice(0, -1)) > 90) {
                list += `Username: ${user.username} <br> Percentege:  ${user.percentege} <br> Time ${user.time} <br><hr>`
            }
        }
        document.getElementById("top").innerHTML = list
    })
}
const play_correct = () => {
    let audio = document.getElementById("correct");
    audio.play();
}
const play_wrong = () => {
    let audio = document.getElementById("wrong");
    audio.play();
}
const find_total_time = (question_times) => {
    let times = 0;
    for (let i = 0; i < question_times.length; i++) {
        const element = question_times[i].slice(2, 3);
        console.log(element);
        times += Number(element);
    }
    let seconds = Math.floor(times % 60)
    let minutes = (times - seconds) % 60
    if (seconds < 10) {
        return `${minutes}:${seconds}s`
    }
    else return `${minutes}:${seconds}s`
}

let muted_button_name = document.getElementById("muted");
let unmuted_button_name = document.getElementById("unmuted");
document.getElementById("wrong").volume = 0.1;
document.getElementById("correct").volume = 0.1;

muted_button_name.addEventListener("click", () => {
    document.getElementById("correct").muted = true;
    document.getElementById("wrong").muted = true;
    
    console.log("klik");
    unmuted_button_name.classList.remove("hidden")
    muted_button_name.classList.add("hidden")
})

unmuted_button_name.addEventListener("click", () => {
    document.getElementById("correct").muted = false;
    document.getElementById("wrong").muted = false;
    muted_button_name.value = "Mute"
    console.log("klik 2");
    muted_button_name.classList.remove("hidden")
    unmuted_button_name.classList.add("hidden")
})


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
    // let dificulity = "";
    let dificulityCheckedValue = document.getElementsByName('dificulity');
    dificulityCheckedValue.forEach((element) => {
        if (element.checked && element.value == "random_diff") {

            dificulity = dif[rnd]
        }
        else if (element.checked) {
            dificulity = element.value
        }
    })
console.log(dificulity);
    const limit = document.getElementById("limit").value
    if (limit <= 50 && limit > 0) {
        let link = `${string}&limit=${limit}&difficulty=${dificulity}`
        console.log(link);
        return link
    }
    else {
        window.alert("Unesite broj pitanja od 1 do 50")
    }
}

const switch_to_first_question = () => {
    document.getElementById("start_container").classList.add("hidden")
    document.getElementById("start_button").classList.add("hidden")
    document.getElementById("start_button").classList.remove("btn")
    document.getElementById("card").classList.remove("hidden")

}

const select_buttons_for_answers = () => {
    const input_a = document.getElementById("a")
    const input_b = document.getElementById("b")
    const input_c = document.getElementById("c")
    const input_d = document.getElementById("d")
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
const add_question = (questionNbr, questions, inputs, question_times) => {
    document.getElementById("c_w").innerHTML = ""
    document.activeElement.blur()
    document.getElementById("timer_stripes").classList.remove("correct")
    document.getElementById("timer_stripes").classList.remove("wrong")

    inputs.forEach((element) => {
        // element.classList.remove("ans:hover")
        {
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


const question_timer = (question_times, inputs, questionNbr, questions) => {

    let now = 21000;
    var question_timer_int = setInterval(() => {
        now -= 1000
        if (now == -1000) {
            alert("Time is up.")
            if (document.getElementById("question_timer" != null)) {
                document.getElementById("question_timer").innerHTML = ""
            }
            document.getElementsByName("answer").forEach((element) => element.classList.add("wrong"))
            document.getElementById("a").click()
            clearInterval(question_timer_int)
            question_times.push(`0:20s Timed out`)
        }   
        else {
            let minutes = Math.floor(now / 60000);
            let seconds = (now) / 1000 - Math.floor(minutes * 60);
            if (seconds < 10) {
                document.getElementById("question_timer").innerHTML = `${minutes}min 0${seconds}s`

            }
            else if (seconds >= 10) {
                document.getElementById("question_timer").innerHTML = `${minutes}min ${seconds}s `
                
            }
            let a = ""
            for (let i = 0; i < seconds; i++) {
             

                    a += ` <span style="font-weight:20000"><b>|</b></span>`
                
            }
            document.getElementById("timer_stripes").classList.add("correct")
            if(now == 5000) {
                document.getElementById("timer_stripes").classList.add("wrong")
            }
            document.getElementById("timer_stripes").innerHTML = `${a}`
        }
    }, 1000);

    inputs.forEach((input) => {
        input.addEventListener("click", () => {
            clearInterval(question_timer_int)
        })
    })
}


const timer = () => {

    let time = 0
    let timer = setInterval(() => {

        time += 1000
        let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((time % (1000 * 60)) / 1000);
        if (document.getElementById("timer") != null) {


            if (seconds < 10) {

                document.getElementById("timer").innerHTML = `  ${minutes}min 0${seconds}s `
            }
            else {

                document.getElementById("timer").innerHTML = `  ${minutes}min ${seconds}s `
            }
        }
        else return

    }, 1000);
    if (!document.getElementById("timer").innerText) {
        return
    }


}
const listAns = (answers_from_user, questions, maxQuestions, question_times) => {
    const list = []
    for (let i = 0; i < maxQuestions; i++) {
        const answer_from_user = answers_from_user[i];
        const question = questions[i].question;
        const correctAnswer = questions[i].correctAnswer
        if (answer_from_user == correctAnswer) {
            list.push(`<div class="correct_div"><strong>Category: ${questions[i].category} </strong> 
                <br>
                <strong>Difficulty: ${questions[i].difficulty} </strong>  <br> <strong> Question: </strong>${question} <br> <strong>Your answer:</strong> ${answer_from_user}  <br><strong> Correct answer: </strong>${correctAnswer} 
                <br> 
                <strong>Number of questions: </strong>${maxQuestions}
                <br>
                <strong>Time per question: </strong> ${question_times[i]} </div>
                <hr> `
            )
        }
        else {
            list.push(`<div class="wrong_div"> <strong> Question: </strong> ${question} <br><strong> Your answer:</strong> ${answer_from_user}  <br><strong> Correct answer: </strong>${correctAnswer} 
                <br> 
                <strong> Number of questions: </strong>${maxQuestions}
                <br>
                <strong>Time per question:</strong> ${question_times[i]}   </div>
                <hr> `
            )
        }
    }

    return list.join("")
}


rules()
list_games()
document.getElementById("clear").addEventListener("click", () => localStorage.clear())


document.getElementById("start_button").addEventListener("click", () => start_game());



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
            if (username == "undefiend" || username == "function" || username == "null") {
                username = "Don't be like that"
                alert("Be nice, don't break me !")
                window.location.reload()
            }
            if (username.length > 10) {
                alert(`Username must be under 10 characters .`)
                window.location.reload()

            }
            if (!username) {
                username = `Guest-${Math.trunc(Math.random() * 10000000)}`
            }

            switch_to_first_question()
            const questions = create_object_with_data_from_api(data)
            const inputs = select_buttons_for_answers()

            let score = document.getElementById("score");
            score.innerText = `Question ${questionNbr + 1} /${data.length}. Correct answers : ${counter}/${maxQuestions}`
            timer()
            add_question(questionNbr, questions, inputs, question_times)
            question_timer(question_times, inputs, questionNbr, questions)
// console.log(document.getElementById("question_timer").innerText);

            const first_answers = []
            inputs.forEach(element => {
                element.addEventListener("click", () => {

                    if (!answers_from_user.includes(element.value)) {
                        const first_answer = {};
                        first_answer.answer = element.value
                        first_answer.question = questions[questionNbr]
                        first_answers.push(first_answer)

                        if (element.value == questions[questionNbr].correctAnswer) {
                            inputs.forEach((el) => {
                                if (!el.classList.contains("wrong") && el == element) {
                                    
                                    question_times.push(`0:${20 - document.getElementById("question_timer").innerText.slice(5, 7)}s`)
                                    play_correct()
                                    // document.getElementById("c_w").innerHTML = `This is correct answer`
                                    element.classList.add("correct")
                                    answers_from_user.push(element.value)
                                    counter++
                                }
                            })
                        }
                        else {
                            console.log("wrong");
                            answers_from_user.push(element.value)
                            question_times.push(`0:${20 - document.getElementById("question_timer").innerText.slice(5, 7)}s`)
                            console.log(document.getElementById("question_timer").innerText.slice(5, 7));
                            play_wrong()
                            element.classList.add("wrong")
                            // document.getElementById("c_w").innerHTML = `This is wrong answer`
                        }
                    }

                    if (questionNbr + 1 == data.length) {
                        setTimeout(() => {
                            
                            document.getElementById("card").classList.add("score_listed")
                            // Time: ${document.getElementById("timer").innerHTML}
                            document.getElementById("card").innerHTML = `<span>Hello  <strong><u>${username}</u></strong> your score is ${counter}/${data.length} (${Math.floor(counter * 100 / data.length)}%) </span>
                            <br>
                            <p class="score_listed">  <br> ${listAns(answers_from_user, questions, data.length, question_times)} </p>`
                            document.getElementById("new_game").classList.remove("hidden")
                            document.getElementById("new_game").classList.add("btn")
                        }, 800);
                        const obj = {
                            username: username,
                            percentege: Math.floor(counter / maxQuestions) * 100 + "%",
                            time: document.getElementById("timer").innerHTML
                        }
                        localStorage.setItem(`${username}`, JSON.stringify(obj))
                    }
                    else {
                        setTimeout(() => {
                            question_timer(question_times, inputs, questionNbr, questions)
                            questionNbr++
                            add_question(questionNbr, questions, inputs, question_times)
                            document.getElementById("score").innerText = ` Question ${questionNbr + 1} /${data.length}. Correct answers : ${counter}/${maxQuestions}`
                        }, 800);
                    }
                })
            })

        }).catch((err) => console.log(err))

}
