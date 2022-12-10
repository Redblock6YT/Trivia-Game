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
  var question = 0;
  var currentAudio;
  var currentClone;
  var playerCash = 0;
  var questionOver = false;
  var correctAnswerElem
  var timerStarted = false;
  var playerElem;

  var elems = []
  function checkAnswer(button, amt, correct) {
    if (!timerStarted) {
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
                    width: "70%",
                    height: "70%",
                    translateX: "-70%",
                    translateY: "-68%",
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
    } else {
      source.src = "hard.mp4"
      bluramt = 5;
    }
    video.appendChild(source);
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.className = styles.video;
    video.style.filter = "blur(10px)";
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
    const answergrid = document.createElement("div");
    answergrid.style.display = "grid";
    answergrid.style.margin = "auto";
    answergrid.style.gridTemplateColumns = "50% 50%";
    preElems.push(answergrid);
    clone.appendChild(answergrid);
    var answers = [q1.correct_answer, ...q1.incorrect_answers];
    console.log(answers)
    const shuffledAnswers = shuffleArray(answers);
    console.log(shuffledAnswers)
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
    preElems.push(timerdiv);
    //timer.style.width = "100%"
    timer.style.textAlign = "left";
    const timer2 = document.createElement("h1");
    timer2.className = styles.text;
    timer2.innerHTML = "0"
    timer2.style.fontSize = "80px"
    //timer2.style.width = "100%"
    timer2.style.textAlign = "left";
    clone.appendChild(timerdiv)
    timerdiv.appendChild(timer);
    timerdiv.appendChild(timer2);
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
      answerbuttons.push(answer);
      answergrid.appendChild(answer);
    }
    clone.style.height = "30%"
    clone.style.transform = "translate(170%, 58%)";

    var rand = Math.floor(Math.random() * 4) + 1;
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
                          fontSize: "50px"
                        })
                        anime({
                          targets: textContainer,
                          translateY: "-730%",
                          translateX: "-50%",
                          complete: () => {
                            qtext.style.display = "block";
                            //generate random number 1 - 3
                            anime({
                              targets: qtext,
                              opacity: 1,
                              scale: 1,
                              easing: "easeInOutQuad",
                              complete: () => {
                                setTimeout(() => {
                                  anime({
                                    targets: timerdiv,
                                    opacity: 1,
                                    scale: 1,
                                    easing: "easeInOutQuad",
                                  })
                                  anime({
                                    targets: qtext,
                                    scale: "0.7",
                                    marginTop: "-350px",
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
                                      if (!questionOver) {
                                        audio2.pause();
                                        const audio3 = new Audio("question" + rand + "c.mp3");
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
      width: "70%",
      height: "70%",
      translateX: "-70%",
      translateY: "-68%",
    })

    axios({
      method: "get",
      url: "https://rygb.tech:8443/getTriviaQuestions"
    }).then((response) => {
      questions = response.data.results;
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
