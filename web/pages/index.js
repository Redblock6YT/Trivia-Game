import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import anime from 'animejs'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      const vid1 = document.getElementById('vid1')
      vid1.play();
    }, 500)
  }, [router.isReady])

  function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [currentCash, setCurrentCash] = useState(0);
  var question = 10;
  var currentAudio;
  var currentClone;
  var playerCash = 0;
  var questionOver = false;
  var correctAnswerElem
  var timerStarted = false;
  var playerElem;
  var questionText;
  var answerGrid;

  var elems = []
  function checkAnswer(button, amt, correct) {
    if (!timerStarted || questionOver) {
      return;
    }
    timerStarted = false;
    //fade out currentAudio
    anime({
      targets: currentAudio,
      volume: 0,
      easing: "easeInOutQuad",
    })
    questionOver = true;

    if (correct) {
      anime({
        targets: button,
        backgroundColor: 'rgb(22 141 22)',
        scale: 1.1,
      })
    } else {
      anime({
        targets: button,
        backgroundColor: 'rgb(155 2 12 / 63%)',
        scale: 1.1,
      })
    }

    //make money jump and then go to the bottom
    console.log(button)
    anime({
      targets: button,
      translateY: "-100px",
      translateX: "50px",
      duration: 1000,
    })
    //split correct and i from the id of button
    //const s = button.id.split("correct")
    const id = button.id
    console.log("id: " + id)
    setTimeout(() => {
      var translateX = "0px"
      var translateY = "0px"
      console.log(correctAnswer)
      if (id == 0) {
        translateX = "471px"
        console.log("0")
        translateY = "561px"
      } else if (id == 1) {
        translateX = "15px"
        translateY = "551px"
        console.log("1")
      } else if (id == 2) {
        translateX = "473px"
        translateY = "350px"
        console.log("2")
      } else if (id == 3) {
        translateX = "21px"
        translateY = "335px"
        console.log("3")
      }
      anime({
        targets: button,
        translateX: translateX,
        translateY: translateY,
        width: "50px",
        height: "40px",
        fontSize: "10px",
      })
      setTimeout(() => {
        button.style.opacity = "0"
        const playercash = document.getElementById("playercash");
        playercash.innerHTML = "$" + (playerCash + amt)
        var color = "rgb(22 141 22)"
        if (correct === false) {
          color = "rgb(155 2 12 / 63%)"
          const rand = Math.floor(Math.random() * 4) + 1
          const audio = new Audio("wrong" + rand + ".wav")
          audio.play()
        } else {
          const audio = new Audio("correct.wav")
          audio.play()
        }
        const rand = Math.floor(Math.random() * 6) + 1
        var audio;
        if (rand == 1) {
          audio = new Audio("blues.wav")
          audio.play()
        } else if (rand == 2) {
          audio = new Audio("funk.wav")
          audio.play()
        } else if (rand == 3) {
          audio = new Audio("nawlins.wav")
          audio.play()
        } else if (rand == 4) {
          audio = new Audio("polka.wav")
          audio.play()
        } else if (rand == 5) {
          audio = new Audio("clav.wav")
          audio.play()
        } else if (rand == 6) {
          audio = new Audio("seris.wav")
          audio.play()
        }
        audio.loop = true;
        currentAudio = audio;
        //shake and change 
        anime({
          targets: playercash,
          scale: 1.1,
          color: color,
          complete: function (anim) {
            setCurrentCash(currentCash + amt)
            playerCash = playerCash + amt;
            anime({
              targets: playercash,
              scale: 1,
              color: "rgb(255 255 255)",
              complete: function (anim) {
                console.log(elems)
                showCorrectAnswer()
                setTimeout(() => {
                  anime({
                    targets: currentClone,
                    width: "80%",
                    height: "80%",
                    translateX: "-61%",
                    translateY: "-59%",
                    easing: "easeInOutQuad",
                  })
                  playercash.remove()
                  playerElem.style.marginBottom = "0px"
                  nextQuestion()
                }, 2000)
              }
            })
          }
        })
      }, 300);
    }, 500)
  }

  var currentTimer;
  var timerc;
  var timer2c;
  var currentBackground;
  const [correctAnswerFinal, setCorrectAnswerFinal] = useState(27);
  var currentInput;
  const [currentInputState, setCurrentInputState] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const debouncedValue = useDebounce(currentValue, 500);
  const [currentQuestionText, setCurrentQuestionText] = useState("");

  function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
  }

  function chooseFinalAnswer(final) {
    anime({
      targets: answerGrid,
      scale: 0,
      easing: "easeInOutQuad",
      complete: function (anim) {
        for (var i = 0; i < answerGrid.children.length; i++) {
          answerGrid.children[i].remove()
        }
      }
    })
    const cutoff = new Audio("cutoff.wav")
    currentAudio.pause()
    cutoff.play()
    if (final == "Letter") {
      const rand = Math.floor(Math.random() * 5) + 1
      var letter;
      maintextcontainer.children[0].innerHTML = "Letter"
      if (rand == 1) {
        letter = "I enjoy spending time with my friends and family. We often go out to eat at our favorite restaurants or stay in and cook together. We also enjoy playing games and watching movies together. It's always a good time when we're all together."
      } else if (rand == 2) {
        letter = "I love the sound of rain on the roof. It's a soothing and peaceful sound that always makes me feel calm and relaxed. Sometimes I like to sit by the window and watch the rain falling, listening to the soft patter of the drops hitting the glass. It's a simple pleasure, but one that brings me a lot of joy."
      } else if (rand == 3) {
        letter = "The leaves on the trees have turned a beautiful shade of orange and red. It's a reminder that fall is here and winter is just around the corner. I love the crisp, cool air and the way the leaves crunch under my feet as I walk. It's a time of year that always makes me feel nostalgic and grateful."
      } else if (rand == 4) {
        letter = "I love the smell of freshly baked cookies. It's a sweet and comforting smell that always makes me feel happy and warm inside. I like to bake cookies on the weekends and share them with my friends and family. It's a simple way to show them how much I care about them."
      } else if (rand == 5) {
        letter = "I love the sound of the ocean. It's a soothing and peaceful sound that always makes me feel calm and relaxed. Sometimes I like to sit by the window and watch the waves crashing against the shore, listening to the soft patter of the water hitting the sand. It's a simple pleasure, but one that brings me a lot of joy."
      }
      const audio = new Audio("question3a.mp3")
      audio.loop = true;
      audio.load()
      anime({
        targets: questionText,
        scale: 0,
        easing: "easeInOutQuad",
        complete: function (anim) {
          audio.play()
          anime({
            targets: questionText,
            scale: 1,
            easing: "easeInOutQuad",
          })
          questionText.style.marginTop = "0px"
          const textArea = document.createElement("textarea");
          textArea.className = styles.textarea
          textArea.placeholder = "Start typing here..."
          const typingaudio = new Audio("letter.mp3")
          typingaudio.load()
          const textAreaContainer = document.createElement("div")
          textAreaContainer.style.margin = "auto";
          textAreaContainer.style.gridTemplateColumns = "auto";
          textAreaContainer.style.position = "absolute";
          textAreaContainer.style.zIndex = "100";
          textAreaContainer.style.gridGap = "15px";
          textAreaContainer.style.width = "50%"
          textAreaContainer.style.top = "50%";
          textAreaContainer.style.left = "50%";
          textAreaContainer.style.transform = "translate(-50%, -40%) scale(0)";
          textAreaContainer.appendChild(textArea)
          currentClone.appendChild(textAreaContainer)
          questionText.innerHTML = "I'm going to read a letter to you. Listen carefully and try to type the letter as it is read. I'll give you cash based on how accurate your typing is."
          setTimeout(() => {
            anime({
              targets: audio,
              volume: 0,
              easing: "easeInOutQuad"
            })
            anime({
              targets: questionText,
              scale: 0
            })
            anime({
              targets: textAreaContainer,
              scale: 1,
            })
            console.log(letter)
            const sentences = letter.split(".");
            console.log(sentences)
            //read the sentences aloud using text to speech
            var msg = new SpeechSynthesisUtterance();
            questionText.style.marginTop = "-350px"
            questionText.style.transform = "scale(0.7)"
            var otheri = 0;
            typingaudio.volume = 0.2
            typingaudio.play()
            setTimeout(() => {
              for (var i = 0; i < sentences.length; i++) {
                setTimeout(() => {
                  const sentence = sentences[otheri];
                  console.log(sentence)
                  console.log(i)
                  questionText.innerHTML = sentence;
                  anime({
                    targets: questionText,
                    scale: 1.1,
                    easing: "easeInOutQuad",
                    duration: 500,
                    complete: function (anim) {
                      anime({
                        targets: questionText,
                        scale: 1,
                        easing: "easeInOutQuad",
                        duration: 500,
                      })
                    }
                  })
                  msg.text = sentence;
                  window.speechSynthesis.speak(msg);
                  otheri++;
                  if (otheri == 5) {
                    anime({
                      targets: textAreaContainer,
                      scale: 0,
                      easing: "easeInOutQuad",
                      delay: 1000,
                      complete: function (anim) {
                        var total = 10000;
                        var prepercent = similarity(letter, textArea.value)
                        var percent = Math.floor(prepercent * 100)
                        //player gets percent of total based on accuracy
                        total = Math.floor(total / percent)
                        questionText.innerHTML = percent + "%"
                        questionText.style.marginTop = "0px"
                        setTimeout(() => {
                          questionText.innerHTML = "$" + total
                        }, 1000)
                        anime({
                          targets: questionText,
                          rotate: 360,
                          delay: 1000,
                          complete: function (anim) {
                            const playercash = document.getElementById("playercash");
                            const correct = new Audio("correct.wav")
                            correct.load()
                            setTimeout(() => {
                              anime({
                                targets: questionText,
                                translateY: 370,
                                fontSize: "0px",
                                complete: function (anim) {
                                  correct.play()
                                  playerCash = playerCash + total;
                                  playercash.innerHTML = "$" + playerCash;
                                  anime({
                                    targets: playercash,
                                    scale: 1.1,
                                    color: "rgb(22 141 22)",
                                    complete: function (anim) {
                                      anime({
                                        targets: playercash,
                                        scale: 1,
                                        color: "rgb(255 255 255)",
                                        complete: function (anim) {
                                          backToTitle()
                                        }
                                      })
                                    }
                                  })
                                }
                              })
                            }, 1000)
                          }
                        })
                      }
                    })
                  }
                }, 7000 * i)
              }
            }, 2000)

          }, 5000)
        }
      })
      //const audio = new Audio("letter.mp3")
    } else if (final == "Math") {
      var rand = Math.floor(Math.random() * 2) + 5;
      const audio = new Audio("question" + rand + "a.mp3")
      audio.loop = true;
      audio.load()
      const audio2 = new Audio("question" + rand + "c.mp3")
      audio2.loop = true;
      audio2.load()
      anime({
        targets: questionText,
        scale: 0,
        duration: 500,
        easing: "easeInOutQuad",
        complete: function (anim) {
          currentAudio = audio;
          questionText.style.marginTop = "0px"
          audio.play()
          currentBackground.children[0].src = "math.mp4"
          const textAreaContainer = document.createElement("div")
          textAreaContainer.style.display = "grid";
          textAreaContainer.style.gridTemplateColumns = "auto";
          textAreaContainer.style.margin = "auto";
          textAreaContainer.style.gridTemplateColumns = "auto";
          textAreaContainer.style.position = "absolute";
          textAreaContainer.style.zIndex = "100";
          textAreaContainer.style.gridGap = "15px";
          textAreaContainer.style.width = "50%"
          textAreaContainer.style.top = "50%";
          textAreaContainer.style.left = "50%";
          textAreaContainer.style.transform = "translate(-50%, -40%) scale(0)";
          textAreaContainer.id = "textAreaContainer"
          const input = document.createElement("input")
          input.className = styles.ename;
          input.placeholder = "Answer"
          input.style.opacity = "0";
          setCorrectAnswerFinal(27)
          currentInput = input;
          setCurrentInputState(input)
          input.oninput = () => inputFinal()
          textAreaContainer.appendChild(input)
          currentClone.appendChild(textAreaContainer)
          timerc.innerHTML = "3"
          questionText.innerHTML = "Answer math questions to earn cash. Answer the most questions before the time runs out."
          anime({
            targets: currentTimer,
            scale: 1,
            opacity: 1,
            duration: 500,
            easing: "easeInOutQuad",
          })
          anime({
            targets: [questionText, textAreaContainer],
            scale: 1,
            opacity: 1,
            duration: 500,
            easing: "easeInOutQuad",
            complete: function (anim) {
              setTimeout(() => {
                input.style.opacity = "1";
                questionText.innerHTML = "9 x 3"
                currentBackground.playbackRate = 4;
                currentBackground.style.filter = "brightness(0.5) blur(7px)"
                anime({
                  targets: questionText,
                  marginTop: "-45vh",
                  fontSize: "4vw",
                  scale: "0.6",
                  rotate3d: "0, 1, 0, 360deg",
                  duration: 500,
                  easing: "easeInOutQuad",
                  complete: function (anim) {
                    audio.pause();
                    audio2.play()
                    currentAudio = audio2;
                    let timet = 3;
                    let timet2 = 0;
                    var i = 0;
                    let timerint = setInterval(() => {
                      //every 10 seconds, subtract 1 from timet
                      if (i % 10 === 0) {
                        timet--;
                        if (timet === 0) {
                          timer2c.style.marginRight = "2px"
                        }
                        const anim = timerc.animate({ opacity: 0, marginTop: "-50px" }, { duration: 300, easing: "ease-in-out" })
                        anim.onfinish = function () {
                          timerc.innerHTML = timet;
                          timerc.style.marginTop = "50px"
                          timerc.style.opacity = "0"
                          const anim2 = timerc.animate({ opacity: 1, marginTop: "0px" }, { duration: 300, easing: "ease-in-out" })
                          anim2.onfinish = function () {
                            timerc.style.opacity = "1"
                            timerc.style.marginTop = "0px"
                          }
                        }
                        /*
                        anime({
                          targets: timer,
                          opacity: 0,
                          marginTop: "-50px",
                        }).complete = () => {
                          timer.innerHTML = timet;
                          timer.style.marginTop = "50px";
                          anime({
                            targets: timer,
                            opacity: 1,
                            marginTop: "0px",
                          })
                        }
                        */
                      }
                      //every second, subtract 1 from time 2
                      if (timet2 === 0) {
                        timet2 = 10;
                      }
                      timet2--;
                      /*
                      anime({
                        targets: timer2,
                        opacity: 0,
                        marginTop: "-50px",
                      }).complete = () => {
                        timer2.innerHTML = timet2;
                        timer2.style.marginTop = "50px";
                        anime({
                          targets: timer2,
                          opacity: 1,
                          marginTop: "0px",
                        })
                      }
                      */
                      const anim = timer2c.animate({ opacity: 0, marginTop: "-50px" }, { duration: 300, easing: "ease-in-out" })
                      anim.onfinish = function () {
                        timer2c.innerHTML = timet2;
                        timer2c.style.marginTop = "50px"
                        timer2c.style.opacity = "0"
                        const anim2 = timer2c.animate({ opacity: 1, marginTop: "0px" }, { duration: 300, easing: "ease-in-out" })
                        anim2.onfinish = function () {
                          timer2c.style.opacity = "1"
                          timer2c.style.marginTop = "0px"
                        }
                      }
                      i++;
                      if (i == 30) {
                        clearInterval(timerint);
                        anime({
                          targets: audio2,
                          volume: 0,
                          easing: "easeInOutQuad",
                        })
                        backToTitle()
                      }
                    }, 1000)
                  }
                })
              }, 3000)
            }
          })
        }
      })
    }
  }

  function inputFinal(input) {
    console.log("input final")
    setCurrentValue(currentInput.value)
  }

  function newQuestion() {
    //generate a new math question and set the correct answer
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 * num2;
    setCorrectAnswerFinal(correctAnswer)
    currentQuestionText.innerHTML = num1 + " x " + num2;
  }

  useEffect(() => {
    if (debouncedValue) {
      console.log("debounced value")
      var color = "rgb(22 141 22)"
      console.log(correctAnswerFinal)
      console.log(currentValue)
      if (parseInt(currentValue) == correctAnswerFinal) {
        console.log("right")
        console.log(currentInputState)
        const amt = 100;
        const playercash = document.getElementById("playercash")
        playercash.innerHTML = "$" + (currentCash + amt);
        setCurrentCash(currentCash + amt)
        playerCash = playerCash + amt;
        console.log(playerCash)
        console.log(currentCash)
        newQuestion()
        currentInputState.value = ""
        currentInputState.oninput = () => inputFinal()
        currentInput = currentInputState
        anime({
          targets: currentInputState,
          backgroundColor: "rgb(22 141 22)",
        })
        const audio = new Audio("correct.wav")
        audio.play()
        anime({
          targets: playercash,
          scale: 1.1,
          color: color,
          complete: function (anim) {
            setCurrentCash(currentCash + amt)
            playerCash = playerCash + amt;
            anime({
              targets: playercash,
              scale: 1,
              color: "rgb(255 255 255)",
              complete: function (anim) {
              }
            })
          }
        })
      } else {
        console.log("wrong")
        color = "rgb(155 2 12 / 63%)"
        const rand = Math.floor(Math.random() * 4) + 1
        const audio = new Audio("wrong" + rand + ".wav")
        const amt = -100;
        const playercash = document.getElementById("playercash")
        playercash.innerHTML = "$" + (currentCash + amt);
        setCurrentCash(currentCash + amt)
        playerCash = playerCash + amt;
        console.log(playerCash)
        console.log(currentCash)
        audio.play()
        console.log(currentInputState)
        newQuestion()
        currentInputState.value = ""
        currentInputState.oninput = () => inputFinal()
        currentInput = currentInputState
        anime({
          targets: currentInputState,
          backgroundColor: "rgb(155 2 12 / 63%)",
        })
        anime({
          targets: playercash,
          scale: 1.1,
          color: color,
          complete: function (anim) {
            anime({
              targets: playercash,
              scale: 1,
              color: "rgb(255 255 255)",
              complete: function (anim) {
              }
            })
          }
        })
      }
    }
  }, [debouncedValue])

  function backToTitle() {
    const title = document.getElementById("title");
    title.style.transform = "translate(170%, 58%)"
    title.style.height = "30%";
    title.style.width = "30%";
    anime({
      targets: currentClone,
      width: "70%",
      height: "70%",
      translateX: "-70%",
      translateY: "-68%",
    })
    const anim2 = title.animate({ transform: "translateX(63%) translateY(58%)" }, { duration: 1000, easing: "ease-in-out" })
    anim2.onfinish = function () {
      title.style.transform = "translateX(63%) translateY(58%)"
      setTimeout(() => {
        anime({
          targets: currentClone,
          translateX: "-172%",
          translateY: "-172%",
          easing: "easeInOutQuad",
        })
        anime({
          targets: title,
          width: "98%",
          height: "95%",
          translateX: "-50%",
          translateY: "-50%",
          easing: "easeInOutQuad",
          complete: function (anim) {
            const text = document.getElementById("text");
            const subtext = document.getElementById("subtext")
            const target = [text, subtext]

            const loader = document.getElementById("loader")
            anime({
              targets: loader,
              opacity: 0,
              duration: 500,
              complete: () => {
                loader.style.display = "none";
                loader.style.opacity = "0";
                anime({
                  targets: target,
                  opacity: 1,
                })
              }
            })
          }
        })
      }, 500)
    }
  }

  function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  var questions = []
  var currentcashelem

  function nextQuestion() {
    var preElems = []
    console.log(questions)
    /*
    anime({
      targets: title,
      translateX: "-170%",
      translateY: "-170%",
      duration: 1500,
      easing: "linear",
    })
    */
    question++;
    questionOver = false;
    const title = document.getElementById("title");
    const container = document.getElementById("container");
    const clone = title.cloneNode();
    clone.style.transform = "translateX(170%) translateY(170%)";
    const video = document.createElement("video");
    const source = document.createElement("source");
    source.type = "video/mp4";
    const q1 = questions[question - 1];
    console.log(q1.difficulty)
    var bluramt = 5;
    if (q1.difficulty === "easy") {
      source.src = "1.mp4"
      bluramt = 5;
    } else if (q1.difficulty === "medium") {
      source.src = "2.mp4"
      bluramt = 10;
    } else if (q1.difficulty === "hard") {
      source.src = "hard.mp4"
      bluramt = 5;
    } else if (q1.difficulty === "final") {
      source.src = "final.mp4";
      bluramt = 7;
    }
    video.appendChild(source);
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.className = styles.video;
    video.style.filter = "blur(10px)";
    currentBackground = video;
    clone.appendChild(video);
    const textContainer = document.createElement("div");
    textContainer.className = styles.textContainer;
    textContainer.style.width = "70%";
    const catagory = document.createElement("h1");
    catagory.className = styles.text;
    catagory.style.fontSize = "200px"
    catagory.innerHTML = question;
    preElems.push(catagory);
    container.appendChild(clone);
    clone.appendChild(textContainer)
    const qtext = document.createElement("h1");
    const questionContainer = document.createElement("div");
    questionContainer.className = styles.textContainer2;
    qtext.className = styles.text;
    qtext.innerHTML = q1.question;

    textContainer.appendChild(catagory);
    preElems.push(questionContainer);
    maintextcontainer = textContainer;
    qtext.style.display = "none";
    qtext.style.opacity = "0";
    qtext.style.transform = "scale(0)"
    qtext.style.fontSize = "70px"
    setCurrentQuestionText(qtext);
    questionText = qtext;
    const answergrid = document.createElement("div");
    answergrid.style.display = "grid";
    answergrid.style.margin = "auto";
    answergrid.style.gridTemplateColumns = "50% 50%";
    answerGrid = answergrid;
    preElems.push(answergrid);
    clone.appendChild(answergrid);
    var answers;
    var shuffledAnswers;
    if (q1.difficulty === "final") {
      answers = ["Letter Writer", "Math", "Simon Says"]
      shuffledAnswers = answers;
    } else {
      answers = [q1.correct_answer, ...q1.incorrect_answers];
      shuffledAnswers = shuffleArray(answers);
      console.log(shuffledAnswers)
    }
    console.log(answers)

    const text = qtext.innerHTML;
    let time = 0;
    const textarr = text.split(" ");
    for (let i = 0; i < textarr.length; i++) {
      time += 1;
    }
    questionContainer.appendChild(qtext);
    clone.appendChild(questionContainer);
    var answerbuttons = [];
    const playerdiv = document.createElement("div");
    const playercash = document.createElement("p");
    const player = document.createElement("h1");
    //make cash overlap with player
    //playercash.style.position = "absolute";
    playercash.style.bottom = "0";
    playercash.style.left = "0";
    playercash.style.marginLeft = "0";
    playercash.style.padding = "0";
    playercash.style.fontSize = "50px";
    playercash.style.color = "white";
    playercash.style.textShadow = "0px 0px 10px black";
    playercash.id = "playercash";
    player.innerHTML = "1";
    player.className = styles.text;
    player.style.fontSize = "80px";
    playerElem = player;
    player.style.marginBottom = "-30px"
    if (q1.difficulty === "easy") {
      player.style.color = "rgb(78 141 255 / 35%)";
    } else if (q1.difficulty === "medium") {
      player.style.color = "rgb(81 54 163 / 55%)";
    } else {
      player.style.color = "rgb(143 29 29 / 46%)";
    }
    playercash.innerHTML = "$" + playerCash;
    playercash.className = styles.subtext;
    playerdiv.appendChild(player);
    playerdiv.appendChild(playercash);
    playerdiv.style.width = "100%";
    playerdiv.style.display = "grid";
    playerdiv.style.gridTemplateColumns = "auto";
    playerdiv.style.bottom = "0";
    playerdiv.style.position = "absolute";
    playerdiv.style.margin = "auto";
    clone.appendChild(playerdiv);
    const timerdiv = document.createElement("div");
    timerdiv.style.zIndex = "100";
    timerdiv.style.marginTop = "5px"
    timerdiv.style.marginLeft = "25px"
    timerdiv.style.width = "110px"
    timerdiv.style.transform = "scale(0)"
    timerdiv.style.opacity = "0"
    timerdiv.style.display = "grid";
    //timerdiv.style.gridGap = "4px";
    timerdiv.style.gridTemplateColumns = "50% 50%";
    timerdiv.style.position = "absolute";
    const timer = document.createElement("h1");
    timer.className = styles.text;
    timer.innerHTML = "2"
    timer.style.fontSize = "80px"
    timerc = timer;
    preElems.push(timerdiv);
    //timer.style.width = "100%"
    timer.style.textAlign = "left";
    const timer2 = document.createElement("h1");
    timer2.className = styles.text;
    timer2.innerHTML = "0"
    timer2.style.fontSize = "80px"
    //timer2.style.width = "100%"
    timer2.style.textAlign = "left";
    timer2c = timer2;
    clone.appendChild(timerdiv)
    timerdiv.appendChild(timer);
    timerdiv.appendChild(timer2);
    currentTimer = timerdiv;
    //make answergrid ontop of all over elements
    answergrid.style.zIndex = "100";
    answergrid.style.position = "absolute";
    answergrid.style.gridGap = "15px";
    answergrid.style.width = "50%"
    answergrid.style.top = "50%";
    answergrid.style.left = "50%";
    answergrid.style.transform = "translate(-50%, -40%)";
    clone.style.width = "30%"
    console.log(preElems)
    elems = preElems
    for (let i = 0; i < shuffledAnswers.length; i++) {
      const answer = document.createElement("button");
      answer.className = styles.button;
      answer.style.height = "200px";
      answer.innerHTML = shuffledAnswers[i];
      answer.style.opacity = "0";
      answer.style.marginTop = "50px";
      answer.style.width = "100%";
      answer.style.backgroundColor = "#3e3e3ea1"
      if (q1.difficulty === "final") {
        answer.id = i;
        answer.onclick = () => {
          if (i === 0) {
            chooseFinalAnswer("Letter");
          } else if (i === 1) {
            chooseFinalAnswer("Math");
          } else if (i === 2) {
            chooseFinalAnswer("Simon Says");
          }
        }
      } else {
        if (shuffledAnswers[i] === q1.correct_answer) {
          answer.id = i;
          setCorrectAnswer(i);
          correctAnswerElem = answer;
          answer.onclick = () => {
            if (q1.difficulty === "easy") {
              checkAnswer(answer, 500, true);
              answer.innerHTML = "$500";
              answer.style.fontSize = "100px";
            } else if (q1.difficulty === "medium") {
              checkAnswer(answer, 1000, true);
              answer.innerHTML = "$1000";
              answer.style.fontSize = "100px";
            } else {
              checkAnswer(answer, 2000, true);
              answer.innerHTML = "$2000";
              answer.style.fontSize = "100px";
            }
          }
        } else {
          answer.id = i;
          answer.onclick = () => {
            if (q1.difficulty === "easy") {
              checkAnswer(answer, -500, false);
              answer.innerHTML = "$500";
              answer.style.fontSize = "100px";
            } else if (q1.difficulty === "medium") {
              checkAnswer(answer, -1000, false);
              answer.innerHTML = "$1000";
              answer.style.fontSize = "100px";
            } else {
              checkAnswer(answer, -2000, false);
              answer.innerHTML = "$2000";
              answer.style.fontSize = "100px";
            }
          }
        }
      }

      answerbuttons.push(answer);
      answergrid.appendChild(answer);
    }
    clone.style.height = "30%"
    clone.style.transform = "translate(170%, 58%)";

    var rand = Math.floor(Math.random() * 6) + 1;
    const audio = new Audio("question" + rand + "a.mp3");
    const audio2 = new Audio("question" + rand + "b.mp3");
    //preload audio
    audio.load();
    audio.loop = true;
    audio2.loop = true;
    audio2.load();
    //move to the top left corner off screen

    const anim2 = clone.animate({ transform: "translateX(63%) translateY(58%)" }, { duration: 1000, easing: "ease-in-out" })
    anim2.onfinish = function () {
      clone.style.transform = "translateX(63%) translateY(58%)"
      setTimeout(() => {
        anime({
          targets: currentClone,
          translateX: "-172%",
          translateY: "-172%",
          easing: "easeInOutQuad",
        })
        currentClone = clone;
        triggerWhatsNext();
        anime({
          targets: clone,
          width: "80%",
          height: "80%",
          translateX: "-50%",
          translateY: "-50%",
          easing: "easeInOutQuad",
          complete: () => {
            setTimeout(() => {
              const carosel = document.getElementById("carosel");
              carosel.children[0].style.boxShadow = "10px 10px 33px #08080854, -9px -9px 33px #00000046";
              carosel.children[0].style.transform = "translateY(-2px)"
            }, 1000)
            setTimeout(() => {
              anime({
                targets: currentAudio,
                volume: 0,
                easing: "easeInOutQuad",
              })
              anime({
                targets: clone,
                width: "98%",
                height: "95%",
                easing: "easeInOutQuad",
                complete: () => {
                  setTimeout(() => {
                    const hudon = new Audio("hud_on.wav")
                    hudon.play();
                    anime({
                      targets: catagory,
                      rotate: 360,
                      fontSize: "90px",
                      complete: () => {
                        audio.play();
                        currentAudio = audio;
                        audio2.volume = 0;
                        audio2.play();
                        anime({
                          targets: catagory,
                          scale: 0,
                          duration: 500,
                          easing: "easeInOutQuad",
                          complete: () => {
                            qtext.style.display = "block";
                            //generate random number 1 - 3
                            anime({
                              targets: qtext,
                              opacity: 1,
                              scale: 0.7,
                              duration: 500,
                              easing: "easeInOutQuad",
                              complete: () => {
                                setTimeout(() => {
                                  if (q1.difficulty !== "final") {
                                    anime({
                                      targets: timerdiv,
                                      opacity: 1,
                                      scale: 1,
                                      easing: "easeInOutQuad",
                                    })
                                  }
                                  anime({
                                    targets: qtext,
                                    scale: "0.6",
                                    fontSize: "4vw",
                                    marginTop: "-45vh",
                                    easing: "easeInOutQuad",
                                    complete: () => {
                                      textContainer.style.width = "85%"
                                      audio.pause();

                                      //calculate the time to read the answers
                                      let timea = 0;
                                      for (let i = 0; i < answers.length; i++) {
                                        timea += 1;
                                      }
                                      for (let i = 0; i < answerbuttons.length; i++) {
                                        anime({
                                          targets: answerbuttons[i],
                                          opacity: 1,
                                          marginTop: "0px",
                                          delay: 100 * i,
                                        })
                                      }
                                      if (!questionOver && q1.difficulty !== "final") {
                                        audio2.pause();
                                        const audio3 = new Audio("question" + rand + "c.mp3");
                                        audio3.loop = true;
                                        audio3.load();
                                        audio3.play();
                                        timerStarted = true;
                                        currentAudio = audio3;
                                        let timet = 2;
                                        let timet2 = 0;
                                        var i = 0;
                                        let timerint = setInterval(() => {
                                          //every 10 seconds, subtract 1 from timet
                                          if (i % 10 === 0) {
                                            timet--;
                                            if (timet === 0) {
                                              timer2.style.marginRight = "2px"
                                            }
                                            const anim = timer.animate({ opacity: 0, marginTop: "-50px" }, { duration: 300, easing: "ease-in-out" })
                                            anim.onfinish = function () {
                                              timer.innerHTML = timet;
                                              timer.style.marginTop = "50px"
                                              timer.style.opacity = "0"
                                              const anim2 = timer.animate({ opacity: 1, marginTop: "0px" }, { duration: 300, easing: "ease-in-out" })
                                              anim2.onfinish = function () {
                                                timer.style.opacity = "1"
                                                timer.style.marginTop = "0px"
                                              }
                                            }
                                            /*
                                            anime({
                                              targets: timer,
                                              opacity: 0,
                                              marginTop: "-50px",
                                            }).complete = () => {
                                              timer.innerHTML = timet;
                                              timer.style.marginTop = "50px";
                                              anime({
                                                targets: timer,
                                                opacity: 1,
                                                marginTop: "0px",
                                              })
                                            }
                                            */
                                          }
                                          //every second, subtract 1 from time 2
                                          if (timet2 === 0) {
                                            timet2 = 10;
                                          }
                                          timet2--;
                                          /*
                                          anime({
                                            targets: timer2,
                                            opacity: 0,
                                            marginTop: "-50px",
                                          }).complete = () => {
                                            timer2.innerHTML = timet2;
                                            timer2.style.marginTop = "50px";
                                            anime({
                                              targets: timer2,
                                              opacity: 1,
                                              marginTop: "0px",
                                            })
                                          }
                                          */
                                          const anim = timer2.animate({ opacity: 0, marginTop: "-50px" }, { duration: 300, easing: "ease-in-out" })
                                          anim.onfinish = function () {
                                            timer2.innerHTML = timet2;
                                            timer2.style.marginTop = "50px"
                                            timer2.style.opacity = "0"
                                            const anim2 = timer2.animate({ opacity: 1, marginTop: "0px" }, { duration: 300, easing: "ease-in-out" })
                                            anim2.onfinish = function () {
                                              timer2.style.opacity = "1"
                                              timer2.style.marginTop = "0px"
                                            }
                                          }
                                          i++;
                                          if (i == 20) {
                                            clearInterval(timerint);
                                            anime({
                                              targets: audio3,
                                              volume: 0,
                                              easing: "easeInOutQuad",
                                            })
                                          }
                                        }, 1000)
                                      } else {
                                        return;
                                      }

                                    }
                                  })
                                }, time * 300)
                              }
                            })
                          }
                        })
                        anime({
                          targets: video,
                          filter: "blur(" + bluramt + "px)",
                          complete: () => {
                            //move catagory text to the top

                          }
                        })
                      }
                    })
                    setTimeout(() => {
                      catagory.innerHTML = q1.category;
                    }, 250)
                  }, 500)
                }
              })
            }, 2500)
          }
        })
      }, 500)
    };
  }

  function showCorrectAnswer() {
    anime({
      targets: correctAnswerElem,
      scale: 1.1,
      backgroundColor: 'rgb(22 141 22)',
    })
  }

  var maintextcontainer;

  function startGame() {
    const title = document.getElementById("title");
    const text = document.getElementById("text");
    const subtext = document.getElementById("subtext")
    const loader = document.getElementById("loader")
    const target = [text, subtext]
    console.log("startGame() called")
    currentClone = title
    question = 0;
    anime({
      targets: target,
      opacity: 0,
      duration: 500,
      complete: () => {
        loader.style.display = "block";
        loader.style.opacity = "0";
        anime({
          targets: loader,
          opacity: 1,
        })
      }
    })

    //move to the top left corner

    anime({
      targets: title,
      width: "80%",
      height: "80%",
      translateX: "-61%",
      translateY: "-59%",
    })

    axios({
      method: "get",
      url: "https://rygb.tech:8443/getTriviaQuestions"
    }).then((response) => {
      questions = response.data.results;
      questions.push({ category: "Final Round", type: "multiple", difficulty: "final", question: "Pick a game", correct_answer: "" })
      console.log(questions)
      const carosel = document.getElementById("carosel");
      for (var i = 0; i < 10; i++) {
        const qdiv = document.createElement("button");
        qdiv.className = styles.minithumbnail;
        qdiv.style.transform = "translateY(110px)"
        qdiv.innerHTML = i + 1;
        carosel.appendChild(qdiv);
      }
      nextQuestion();
    })

  }

  function triggerWhatsNext() {
    const carosel = document.getElementById("carosel");
    anime({
      targets: carosel.children,
      translateY: "0px",
      delay: anime.stagger(50),
      complete: () => {
        anime({
          targets: carosel.children[question - 1],
          scale: 1.1,
          backgroundColor: "rgb(22 141 22)",
        })
        /*
        setTimeout(() => {
          anime({
            targets: carosel.children[question - 1],
            scale: 1,
            backgroundColor: "rgb(22 141 22)",
          })
        }, 1200)
        */
        setTimeout(() => {
          anime({
            targets: carosel.children,
            translateY: "110px",
            scale: 1,
            delay: anime.stagger(50),
            easing: "easeInOutQuad",
          })
        }, 1500)
      }
    })
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="container">
        <div id="title" className={styles.slide} style={{ backgroundColor: "black" }}>
          <video loop muted autoPlay id="vid1" className={styles.video} >
            <source type='video/mp4' src="hard.mp4"></source>
          </video>
          <div className={styles.textContainer}>
            <h1 id="text" className={styles.text} style={{ fontSize: "50px", position: "relative" }}>Trivia Game</h1>
            <p id="subtext" className={styles.subtext} style={{ position: "relative" }}>by RYGB</p>
            <div id="loader" className={styles.circle2}></div>
            <div className={styles.doublegrid}>
              <button className={styles.button} onClick={() => startGame()}>Play</button>
            </div>
          </div>
        </div>
        <div id="carosel" className={styles.carosel}>

        </div>
      </div>
    </div>
  )
}
