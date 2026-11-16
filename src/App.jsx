
import { useEffect, useState } from "react";
import "./App.css";

// متغيرات الصوت خارج المكون لتجنب مشكلة React refs
let narrationAudio = null;
let sharedAudioContext = null;

const pages = [
  "البداية",
  "أهداف الرحلة",
  "مصادر المياه",
  "المياه العذبة",
  "المياه المالحة",
  "خريطة مصر",
  "الفيديو التعليمي",
  "تحدي المحقق",
  "الاختبار النهائي",
  "معلومات المشروع",
];

const narrationFiles = [
  "home.mp3",
  "objectives.mp3",
  "sources.mp3",
  "fresh.mp3",
  "salty.mp3",
  "map.mp3",
  "video.mp3",
  "challenge.mp3",
  "quiz.mp3",
  "about.mp3",
];

const objectives = [
  {
    title: "التعرف على الموارد المائية",
    text: "أن يتعرف التلميذ على أهم الموارد المائية الموجودة في مصر.",
    icon: "💧",
  },
  {
    title: "التمييز بين أنواع المياه",
    text: "أن يميز التلميذ بين المياه العذبة والمياه المالحة.",
    icon: "🌊",
  },
  {
    title: "تحديد مصادر المياه",
    text: "أن يحدد التلميذ أهم مصادر المياه على خريطة مصر.",
    icon: "🗺️",
  },
  {
    title: "المحافظة على المياه",
    text: "أن يقدر أهمية المياه ويقترح طرقًا لترشيد استهلاكها.",
    icon: "🌱",
  },
];

const sources = [
  {
    title: "نهر النيل",
    type: "مياه عذبة",
    icon: "🏞️",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/The_Nile_River_at_Cairo.jpg/960px-The_Nile_River_at_Cairo.jpg",
    lat: 30.0444,
    lon: 31.2357,
    mapLabel: "نهر النيل في القاهرة",
    text: "يعد نهر النيل المصدر الرئيسي للمياه العذبة في مصر، ويستخدم في الشرب والزراعة والصناعة.",
    fact: "يمر نهر النيل في مصر من الجنوب إلى الشمال.",
  },
  {
    title: "بحيرة ناصر",
    type: "مياه عذبة",
    icon: "🌊",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900",
    lat: 23.7,
    lon: 32.8,
    mapLabel: "بحيرة ناصر جنوب مصر",
    text: "تقع بحيرة ناصر خلف السد العالي، وتعد من أكبر البحيرات الصناعية في العالم.",
    fact: "تساعد البحيرة في تخزين مياه نهر النيل.",
  },
  {
    title: "المياه الجوفية",
    type: "مياه عذبة",
    icon: "💧",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900",
    lat: 29.203,
    lon: 25.519,
    mapLabel: "منطقة سيوة بالصحراء الغربية",
    text: "توجد المياه الجوفية تحت سطح الأرض، ويمكن الحصول عليها عن طريق حفر الآبار.",
    fact: "تستخدم المياه الجوفية في بعض المناطق الصحراوية.",
  },
  {
    title: "البحيرات الشمالية",
    type: "مياه مالحة أو شروب",
    icon: "🦆",
    image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=900",
    lat: 31.25,
    lon: 32.15,
    mapLabel: "بحيرة المنزلة شمال شرق الدلتا",
    text: "من أمثلتها بحيرات المنزلة والبرلس والبردويل، وتعد بيئة مهمة للأسماك والطيور.",
    fact: "توجد البحيرات الشمالية بالقرب من ساحل البحر المتوسط.",
  },
  {
    title: "البحر المتوسط",
    type: "مياه مالحة",
    icon: "🌅",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900",
    lat: 31.2,
    lon: 29.9,
    mapLabel: "الساحل الشمالي عند الإسكندرية",
    text: "يقع البحر المتوسط شمال مصر، ويعد من أهم المسطحات المائية التي تطل عليها البلاد.",
    fact: "تطل مصر على البحر المتوسط من جهة الشمال.",
  },
  {
    title: "البحر الأحمر",
    type: "مياه مالحة",
    icon: "🐠",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900",
    lat: 27.2579,
    lon: 33.8116,
    mapLabel: "البحر الأحمر عند الغردقة",
    text: "يقع البحر الأحمر شرق مصر، ويتميز بالشعاب المرجانية والكائنات البحرية المتنوعة.",
    fact: "توجد به مناطق سياحية مهمة مثل الغردقة وشرم الشيخ.",
  },
];

const questions = [
  {
    q: "ما المصدر الرئيسي للمياه العذبة في مصر؟",
    options: ["البحر الأحمر", "نهر النيل", "البحر المتوسط", "المحيط"],
    answer: 1,
    explain: "أحسنت! نهر النيل هو المصدر الرئيسي للمياه العذبة في مصر. 👏",
    wrongFeedback: [
      "البحر الأحمر يحتوي على مياه مالحة، فكر في مصدر مياه عذبة.",
      "",
      "البحر المتوسط من المياه المالحة، ابحث عن نهر يمر داخل مصر.",
      "المحيط ليس مصدر المياه الرئيسي في مصر. فكر في النهر الذي نعرفه جميعًا.",
    ],
  },
  {
    q: "أين تقع بحيرة ناصر؟",
    options: ["خلف السد العالي", "شمال الدلتا", "على ساحل المتوسط", "غرب مصر"],
    answer: 0,
    explain: "إجابة صحيحة! تقع بحيرة ناصر خلف السد العالي في جنوب مصر.",
    wrongFeedback: [
      "",
      "ليست في شمال الدلتا. تذكر موقع السد العالي في جنوب مصر.",
      "ليست على ساحل البحر المتوسط؛ فكر في موقع السد العالي.",
      "فكر في جنوب مصر ومكان السد العالي.",
    ],
  },
  {
    q: "أي مما يلي يعد من المياه المالحة؟",
    options: ["مياه الآبار", "نهر النيل", "البحر الأحمر", "مياه الأمطار"],
    answer: 2,
    explain: "رائع! البحر الأحمر من مصادر المياه المالحة. 🌊",
    wrongFeedback: [
      "مياه الآبار من المياه الجوفية، وغالبًا ما تكون عذبة.",
      "نهر النيل مصدر للمياه العذبة، حاول مرة أخرى.",
      "",
      "مياه الأمطار ليست مياه بحر مالحة. فكر في البحار.",
    ],
  },
  {
    q: "كيف نحصل على المياه الجوفية؟",
    options: ["من السحب", "بحفر الآبار", "من البحار", "من الثلوج"],
    answer: 1,
    explain: "ممتاز! نحصل على المياه الجوفية عن طريق حفر الآبار. 💧",
    wrongFeedback: [
      "المياه الجوفية توجد تحت سطح الأرض، وليست في السحب.",
      "",
      "مياه البحار مياه سطحية مالحة، فكر فيما نستخدمه للوصول للمياه تحت الأرض.",
      "الثلوج ليست مصدر الحصول على المياه الجوفية.",
    ],
  },
  {
    q: "ما السلوك الصحيح للمحافظة على المياه؟",
    options: ["ترك الصنبور مفتوحًا", "الإسراف في المياه", "إصلاح التسربات", "تلويث النهر"],
    answer: 2,
    explain: "أحسنت! إصلاح التسربات يساعد على توفير المياه. 🌱",
    wrongFeedback: [
      "ترك الصنبور مفتوحًا يهدر المياه. حاول اختيار سلوك يوفرها.",
      "الإسراف يهدر المياه، فكر في سلوك يحافظ عليها.",
      "",
      "تلويث النهر يضر بالمياه والكائنات الحية.",
    ],
  },
];

function stopNarrationFile() {
  if (narrationAudio) {
    narrationAudio.pause();
    narrationAudio.currentTime = 0;
    narrationAudio = null;
  }
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="section-title">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

function App() {
  const [page, setPage] = useState(0);
  const [openedObjective, setOpenedObjective] = useState(-1);
  const [openedSource, setOpenedSource] = useState(-1);
  const [selectedMapPlace, setSelectedMapPlace] = useState(0);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [challengeFeedback, setChallengeFeedback] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioError, setAudioError] = useState("");

  // إيقاف الصوت عند إغلاق البرمجية
  useEffect(() => {
    return () => {
      stopNarrationFile();

      if (sharedAudioContext) {
        sharedAudioContext.close();
        sharedAudioContext = null;
      }
    };
  }, []);

  function stopNarration() {
    stopNarrationFile();
    setIsSpeaking(false);
  }

  // تشغيل الشرح من مجلد public مباشرة
  function speakCurrentPage() {
    stopNarrationFile();
    setIsSpeaking(false);
    setAudioError("");

    const audio = new Audio(`/${narrationFiles[page]}`);
    narrationAudio = audio;
    audio.volume = 1;

    audio.onended = () => {
      if (narrationAudio === audio) {
        narrationAudio = null;
        setIsSpeaking(false);
      }
    };

    audio.onerror = () => {
      if (narrationAudio === audio) {
        narrationAudio = null;
        setIsSpeaking(false);
        setAudioError(`تعذر العثور على الملف: ${narrationFiles[page]}`);
      }
    };

    audio.play()
      .then(() => {
        if (narrationAudio === audio) {
          setIsSpeaking(true);
        }
      })
      .catch(() => {
        if (narrationAudio === audio) {
          narrationAudio = null;
          setIsSpeaking(false);
          setAudioError(
            "تعذر تشغيل الصوت. تأكدي من وجود ملف الصوت داخل مجلد public."
          );
        }
      });
  }

  async function playEffect(correct) {
    if (!soundOn) return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!sharedAudioContext) {
        // eslint-disable-next-line react-hooks/globals
        sharedAudioContext = new AudioContextClass();
      }

      const audio = sharedAudioContext;

      if (audio.state === "suspended") {
        await audio.resume();
      }

      if (correct) {
        const duration = 0.16;

        const buffer = audio.createBuffer(
          1,
          Math.floor(audio.sampleRate * duration),
          audio.sampleRate
        );

        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
          data[i] =
            // eslint-disable-next-line react-hooks/purity
            (Math.random() * 2 - 1) * (1 - i / data.length);
        }

        for (let i = 0; i < 5; i++) {
          const startAt = audio.currentTime + i * 0.17;

          const source = audio.createBufferSource();
          const filter = audio.createBiquadFilter();
          const gain = audio.createGain();

          source.buffer = buffer;
          filter.type = "highpass";
          filter.frequency.value = 900;

          source.connect(filter);
          filter.connect(gain);
          gain.connect(audio.destination);

          gain.gain.setValueAtTime(0.001, startAt);
          gain.gain.linearRampToValueAtTime(
            0.32,
            startAt + 0.015
          );
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            startAt + duration
          );

          source.start(startAt);
          source.stop(startAt + duration);
        }

        [660, 880].forEach((frequency, index) => {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const startAt = audio.currentTime + 0.85 + index * 0.12;

          oscillator.type = "sine";
          oscillator.frequency.value = frequency;

          oscillator.connect(gain);
          gain.connect(audio.destination);

          gain.gain.setValueAtTime(0.001, startAt);
          gain.gain.linearRampToValueAtTime(
            0.12,
            startAt + 0.02
          );
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            startAt + 0.2
          );

          oscillator.start(startAt);
          oscillator.stop(startAt + 0.2);
        });
      } else {
        [260, 190].forEach((frequency, index) => {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const startAt = audio.currentTime + index * 0.22;

          oscillator.type = "triangle";
          oscillator.frequency.value = frequency;

          oscillator.connect(gain);
          gain.connect(audio.destination);

          gain.gain.setValueAtTime(0.001, startAt);
          gain.gain.linearRampToValueAtTime(
            0.18,
            startAt + 0.02
          );
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            startAt + 0.2
          );

          oscillator.start(startAt);
          oscillator.stop(startAt + 0.2);
        });
      }
    } catch (error) {
      console.error("تعذر تشغيل المؤثر الصوتي:", error);
    }
  }

  function changePage(index) {
    stopNarrationFile();
    setIsSpeaking(false);
    setAudioError("");
    setPage(index);
    setOpenedObjective(-1);
    setOpenedSource(-1);
    setChallengeFeedback("");
    setChallengeAnswer("");
  }

  function showSourceOnMap(index) {
    setSelectedMapPlace(index);
    changePage(5);
  }

  function answerChallenge(answer) {
    setChallengeAnswer(answer);

    const feedbackMessages = {
      "البحر الأحمر":
        "فكر جيدًا! البحر الأحمر يحتوي على مياه مالحة، ونحن نبحث عن مصدر للمياه العذبة. حاول مرة أخرى.",
      "البحر المتوسط":
        "اقتربت من التفكير الصحيح، لكن البحر المتوسط مياهه مالحة. ابحث عن نهر يمر في مصر.",
      "نهر النيل":
        "أحسنت! لقد اكتشفت المصدر الرئيسي للمياه العذبة في مصر. أنت محقق بارع! 👏",
    };

    setChallengeFeedback(feedbackMessages[answer]);
    playEffect(answer === "نهر النيل");
  }

  function chooseAnswer(index) {
    if (answered) return;

    setSelected(index);
    setAnswered(true);

    const correct = index === questions[questionIndex].answer;

    if (correct) {
      setScore((oldScore) => oldScore + 1);
    }

    playEffect(correct);
  }

  function nextQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((old) => old + 1);
      setSelected(-1);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }

  function restartQuiz() {
    setQuestionIndex(0);
    setSelected(-1);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }

  function renderHome() {
    return (
      <div className="home-screen">
        <div className="home-content">
          <span className="eyebrow">
            مغامرة تعليمية تفاعلية
          </span>

          <h1>رحلة المياه</h1>
          <h2>الموارد المائية في مصر</h2>
          <p>الصف الخامس الابتدائي</p>

          <button
            className="main-button"
            onClick={() => changePage(1)}
          >
            ابدأ الرحلة <span>←</span>
          </button>
        </div>

        <div className="home-visual">
          <div className="water-orbit orbit-one"></div>
          <div className="water-orbit orbit-two"></div>
          <div className="water-drop">💧</div>
          <div className="floating-bubble bubble-one"></div>
          <div className="floating-bubble bubble-two"></div>
        </div>
      </div>
    );
  }

  function renderObjectives() {
    return (
      <section>
        <SectionTitle
          eyebrow="خطتنا التعليمية"
          title="أهداف الرحلة"
          subtitle="اضغط على كل بطاقة لاكتشاف الهدف التعليمي."
        />

        <div className="objectives-grid">
          {objectives.map((item, index) => (
            <button
              className={`objective-card ${
                openedObjective === index ? "active" : ""
              }`}
              key={item.title}
              onClick={() =>
                setOpenedObjective(
                  openedObjective === index ? -1 : index
                )
              }
            >
              <span className="card-icon">{item.icon}</span>
              <h3>{item.title}</h3>

              <span className="card-hint">
                {openedObjective === index
                  ? "إخفاء الهدف"
                  : "اكتشف الهدف"}
              </span>

              {openedObjective === index && (
                <p className="revealed-text">{item.text}</p>
              )}
            </button>
          ))}
        </div>
      </section>
    );
  }

  function renderSources() {
    return (
      <section>
        <SectionTitle
          eyebrow="اكتشف كنوز مصر المائية"
          title="مصادر المياه في مصر"
          subtitle="اضغط على أي بطاقة لتتعرف على المصدر ومعلومة مهمة عنه."
        />

        <div className="sources-grid">
          {sources.map((source, index) => (
            <article
              className={`source-card ${
                openedSource === index ? "expanded" : ""
              }`}
              key={source.title}
            >
              <div className="source-image">
                <img
                  src={source.image}
                  alt={source.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: 190,
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    const fallback =
                      event.currentTarget.nextElementSibling;

                    if (fallback) {
                      fallback.style.display = "grid";
                    }
                  }}
                />

                <div
                  style={{
                    display: "none",
                    width: "100%",
                    height: 190,
                    placeItems: "center",
                    background:
                      "linear-gradient(135deg,#123b68,#087eaa)",
                    color: "white",
                    fontSize: 48,
                  }}
                >
                  {source.icon}
                </div>

                <span className="source-icon">
                  {source.icon}
                </span>

                <span className="source-type">
                  {source.type}
                </span>
              </div>

              <div className="source-content">
                <h3>{source.title}</h3>

                <button
                  className="small-button"
                  onClick={() =>
                    setOpenedSource(
                      openedSource === index ? -1 : index
                    )
                  }
                >
                  {openedSource === index
                    ? "إخفاء التفاصيل"
                    : "اكتشف المزيد"}
                </button>

                <button
                  className="small-button"
                  onClick={() => showSourceOnMap(index)}
                >
                  📍 اعرض الموقع على الخريطة
                </button>

                {openedSource === index && (
                  <div className="source-details">
                    <p>{source.text}</p>

                    <div className="important-fact">
                      <strong>💡 معلومة مهمة</strong>
                      <p>{source.fact}</p>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function renderWaterType(salty) {
    const items = salty
      ? sources.filter((source) =>
          source.type.includes("مالحة")
        )
      : sources.filter(
          (source) => source.type === "مياه عذبة"
        );

    return (
      <section>
        <SectionTitle
          eyebrow="تعرف على أنواع المياه"
          title={salty ? "المياه المالحة" : "المياه العذبة"}
          subtitle={
            salty
              ? "توجد المياه المالحة في البحار والبحيرات المالحة."
              : "المياه العذبة ضرورية للشرب والزراعة وحياة الكائنات الحية."
          }
        />

        <div className="type-intro">
          <span>{salty ? "🌊" : "💧"}</span>

          <div>
            <h3>
              {salty ? "مياه البحار" : "مياه الحياة"}
            </h3>

            <p>
              {salty
                ? "تتميز بارتفاع نسبة الأملاح الذائبة فيها، ولا تستخدم للشرب مباشرة."
                : "تتميز بانخفاض نسبة الأملاح الذائبة فيها، وتعد أساسية لحياة الإنسان."}
            </p>
          </div>
        </div>

        <div className="sources-grid">
          {items.map((source) => {
            const sourceIndex = sources.indexOf(source);

            return (
              <article
                className="source-card"
                key={source.title}
              >
                <div className="source-image">
                  <img
                    src={source.image}
                    alt={source.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: 190,
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback =
                        event.currentTarget.nextElementSibling;

                      if (fallback) {
                        fallback.style.display = "grid";
                      }
                    }}
                  />

                  <div
                    style={{
                      display: "none",
                      width: "100%",
                      height: 190,
                      placeItems: "center",
                      background:
                        "linear-gradient(135deg,#123b68,#087eaa)",
                      color: "white",
                      fontSize: 48,
                    }}
                  >
                    {source.icon}
                  </div>

                  <span className="source-icon">
                    {source.icon}
                  </span>
                </div>

                <div className="source-content">
                  <h3>{source.title}</h3>
                  <p>{source.text}</p>

                  <button
                    className="small-button"
                    onClick={() =>
                      showSourceOnMap(sourceIndex)
                    }
                  >
                    📍 اعرض الموقع على الخريطة
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  function renderMap() {
    const place = sources[selectedMapPlace] || sources[0];

    const lat = place.lat;
    const lon = place.lon;

    const west = (lon - 0.45).toFixed(4);
    const south = (lat - 0.3).toFixed(4);
    const east = (lon + 0.45).toFixed(4);
    const north = (lat + 0.3).toFixed(4);

    const mapUrl =
      `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${lat}%2C${lon}`;

    return (
      <section>
        <SectionTitle
          eyebrow="اكتشف مواقع المياه"
          title="خريطة مصر"
          subtitle="اختاري مصدر المياه من الأزرار، وستظهر علامته على الخريطة."
        />

        <div className="map-panel">
          <div className="map-heading">
            <span>🗺️</span>

            <div>
              <h3>خريطة مصر التفاعلية</h3>
              <p>
                اضغطي على اسم المكان لتحديد موقعه على الخريطة.
              </p>
            </div>
          </div>

          <div className="map-legend">
            {sources.map((source, index) => (
              <button
                key={source.title}
                className="small-button"
                onClick={() => setSelectedMapPlace(index)}
                style={{
                  outline:
                    selectedMapPlace === index
                      ? "2px solid #55d6ff"
                      : "none",
                  opacity:
                    selectedMapPlace === index ? 1 : 0.82,
                }}
              >
                {source.icon} {source.title}
              </button>
            ))}
          </div>

          <div
            className="important-fact"
            style={{ margin: "16px 0" }}
          >
            <strong>📍 الموقع المحدد: {place.title}</strong>
            <p>{place.mapLabel}</p>
            <p>
              الإحداثيات التقريبية: {place.lat} ، {place.lon}
            </p>
          </div>

          <iframe
            key={selectedMapPlace}
            title={`موقع ${place.title} على الخريطة`}
            src={mapUrl}
            loading="lazy"
            allowFullScreen
            style={{
              width: "100%",
              minHeight: "420px",
              border: 0,
              borderRadius: "16px",
            }}
          />

          <p style={{ marginTop: 12, textAlign: "center" }}>
            العلامة على الخريطة تشير إلى الموقع التقريبي للمكان المختار.
          </p>
        </div>
      </section>
    );
  }

  function renderVideo() {
    return (
      <section>
        <SectionTitle
          eyebrow="شاهد وتعلم"
          title="الفيديو التعليمي"
          subtitle="شاهد الفيديو بتركيز، ثم استعد لتحدي المحقق."
        />

        <div className="map-panel">
          <div className="map-heading">
            <span>🎬</span>

            <div>
              <h3>فيديو الموارد المائية في مصر</h3>
              <p>
                يمكنك تشغيل الفيديو وإيقافه والتحكم في مستوى الصوت.
              </p>
            </div>
          </div>

          <video
            controls
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              maxHeight: "520px",
              borderRadius: "18px",
              background: "#000",
              display: "block",
              marginTop: "18px",
            }}
          >
            <source src="/water.mp4" type="video/mp4" />
            المتصفح لا يدعم تشغيل الفيديو.
          </video>
        </div>
      </section>
    );
  }

  function renderChallenge() {
    return (
      <section>
        <SectionTitle
          eyebrow="مهمة المحقق الصغير"
          title="تحدي المحقق"
          subtitle="اقرأ السؤال واختر الإجابة الصحيحة، وإذا أخطأت اقرأ التلميح وحاول مرة أخرى."
        />

        <div className="challenge-panel">
          <div className="detective-icon">🕵️</div>

          <span className="challenge-label">
            ملف القضية رقم 01
          </span>

          <h2>
            من هو المصدر الرئيسي للمياه العذبة في مصر؟
          </h2>

          <div className="challenge-options">
            {[
              "البحر الأحمر",
              "نهر النيل",
              "البحر المتوسط",
            ].map((answer) => (
              <button
                key={answer}
                className={`answer-option ${
                  challengeAnswer === answer ? "chosen" : ""
                }`}
                onClick={() => answerChallenge(answer)}
              >
                {answer}
              </button>
            ))}
          </div>

          {challengeFeedback && (
            <div
              className={`feedback ${
                challengeAnswer === "نهر النيل"
                  ? "correct"
                  : "wrong"
              }`}
              role="status"
            >
              <strong>
                {challengeAnswer === "نهر النيل"
                  ? "🌟 أحسنت!"
                  : "🔎 تلميح للمحقق:"}
              </strong>

              <p>{challengeFeedback}</p>

              {challengeAnswer !== "نهر النيل" && (
                <p>
                  حاول مرة أخرى، يمكنك اكتشاف الإجابة بنفسك.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderQuiz() {
    if (finished) {
      return (
        <section className="quiz-finish">
          <span className="finish-icon">🏆</span>

          <h2>انتهى الاختبار!</h2>
          <p>لقد أكملت رحلة الاختبار النهائي بنجاح.</p>

          <div className="score-circle">
            {score}
            <small>من {questions.length}</small>
          </div>

          <h3>
            {score === questions.length
              ? "ممتاز! أنت بطل الموارد المائية."
              : score >= 3
                ? "أحسنت! استمر في التعلم."
                : "حاول مرة أخرى وستتحسن."}
          </h3>

          <button
            className="main-button"
            onClick={restartQuiz}
          >
            إعادة الاختبار
          </button>
        </section>
      );
    }

    const question = questions[questionIndex];
    const isCorrect = selected === question.answer;

    return (
      <section>
        <SectionTitle
          eyebrow="اختبر معلوماتك"
          title="الاختبار النهائي"
          subtitle="اختر إجابة واحدة لكل سؤال، واقرأ التغذية الراجعة بعد الإجابة."
        />

        <div className="quiz-panel">
          <div className="quiz-progress">
            <span>
              السؤال {questionIndex + 1} من {questions.length}
            </span>

            <span>النتيجة: {score}</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((questionIndex + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>

          <h2>{question.q}</h2>

          <div className="quiz-options">
            {question.options.map((option, index) => {
              let className = "quiz-option";

              if (answered && index === question.answer) {
                className += " correct";
              } else if (answered && index === selected) {
                className += " wrong";
              }

              return (
                <button
                  className={className}
                  key={option}
                  onClick={() => chooseAnswer(index)}
                  disabled={answered}
                >
                  <span>{["أ", "ب", "ج", "د"][index]}</span>
                  {option}
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={`feedback ${
                isCorrect ? "correct" : "wrong"
              }`}
              role="status"
              style={{
                padding: 18,
                marginTop: 18,
                borderRadius: 14,
              }}
            >
              <strong>
                {isCorrect
                  ? "🌟 تغذية راجعة: أحسنت!"
                  : "🔎 تغذية راجعة: فكر مرة أخرى"}
              </strong>

              <p style={{ marginTop: 8 }}>
                {isCorrect
                  ? question.explain
                  : question.wrongFeedback[selected]}
              </p>

              {!isCorrect && (
                <p style={{ marginTop: 8 }}>
                  اقرأ التلميح جيدًا، ثم انتقل للسؤال التالي وحاول الاستفادة من المعلومة.
                </p>
              )}
            </div>
          )}

          {answered && (
            <button
              className="main-button next-button"
              onClick={nextQuestion}
            >
              {questionIndex === questions.length - 1
                ? "عرض النتيجة"
                : "السؤال التالي"}{" "}
              ←
            </button>
          )}
        </div>
      </section>
    );
  }

  function renderAbout() {
    return (
      <section>
        <SectionTitle
          eyebrow="نهاية الرحلة"
          title="معلومات المشروع"
          subtitle="شكرًا لمشاركتك في رحلة التعرف على الموارد المائية في مصر."
        />

        <div className="about-panel">
          <div className="about-symbol">💧</div>

          <h2>رحلة المياه</h2>

          <p>
            مغامرة تعليمية تفاعلية عن الموارد المائية في مصر.
          </p>

          <div className="about-info">
            <div>
              <span>الصف الدراسي</span>
              <strong>الصف الخامس الابتدائي</strong>
            </div>

            <div>
              <span>موضوع الدرس</span>
              <strong>الموارد المائية في مصر</strong>
            </div>

            <div>
              <span>إعداد</span>
              <strong>فاطمة الزهراء بخيت</strong>
            </div>

            <div>
              <span>تحت إشراف</span>
              <strong>د. نرمين نصر</strong>
            </div>

            <div>
              <span>تحت إشراف</span>
              <strong>د. حسام حمدي</strong>
            </div>
          </div>

          <p className="thank-you">
            حافظ على المياه... فهي سر الحياة 💙
          </p>
        </div>
      </section>
    );
  }

  const content = [
    renderHome(),
    renderObjectives(),
    renderSources(),
    renderWaterType(false),
    renderWaterType(true),
    renderMap(),
    renderVideo(),
    renderChallenge(),
    renderQuiz(),
    renderAbout(),
  ];

  return (
    <div className="app-shell" dir="rtl">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">💧</span>

          <div>
            <strong>رحلة المياه</strong>
            <small>الموارد المائية في مصر</small>
          </div>
        </div>

        <div className="top-actions">
          <button
            className={`sound-toggle ${
              soundOn ? "enabled" : ""
            }`}
            onClick={() => setSoundOn(!soundOn)}
          >
            {soundOn
              ? "🔊 المؤثرات مفعلة"
              : "🔇 المؤثرات مغلقة"}
          </button>

          <button
            className="sound-toggle enabled"
            onClick={speakCurrentPage}
            disabled={isSpeaking}
          >
            {isSpeaking
              ? "🔊 الشرح يعمل..."
              : "🎙️ استمع للشرح"}
          </button>

          <button
            className="sound-toggle"
            onClick={stopNarration}
            disabled={!isSpeaking}
          >
            ⏹️ إيقاف الشرح
          </button>
        </div>
      </header>

      {audioError && (
        <div
          role="alert"
          style={{
            padding: "10px 16px",
            background: "#7b2632",
            color: "#fff",
            textAlign: "center",
          }}
        >
          {audioError}
        </div>
      )}

      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-title">
            مراحل الرحلة
          </div>

          <nav>
            {pages.map((item, index) => (
              <button
                key={item}
                className={`nav-item ${
                  page === index ? "active" : ""
                }`}
                onClick={() => changePage(index)}
              >
                <span className="nav-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {item}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <span>🌊</span>
            <p>رحلتك نحو المعرفة تبدأ بقطرة ماء</p>
          </div>
        </aside>

        <main className="main-content">
          <div className="page-heading">
            <span>
              المرحلة {String(page + 1).padStart(2, "0")}
            </span>

            <span>{pages[page]}</span>
          </div>

          <div className="page-content" key={page}>
            {content[page]}
          </div>

          <footer className="page-footer">
            <button
              className="footer-button"
              disabled={page === 0}
              onClick={() => changePage(page - 1)}
            >
              → السابق
            </button>

            <span>
              {page + 1} / {pages.length}
            </span>

            <button
              className="footer-button"
              disabled={page === pages.length - 1}
              onClick={() => changePage(page + 1)}
            >
              التالي ←
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
