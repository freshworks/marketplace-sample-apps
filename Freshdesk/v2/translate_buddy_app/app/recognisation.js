let langs =
[['Afrikaans', ['af-ZA']],
['አማርኛ', ['am-ET']],
['Azərbaycanca', ['az-AZ']],
['বাংলা', ['bn-BD', 'বাংলাদেশ'],
  ['bn-IN', 'ভারত']],
['Bahasa Indonesia', ['id-ID']],
['Bahasa Melayu', ['ms-MY']],
['Català', ['ca-ES']],
['Čeština', ['cs-CZ']],
['Dansk', ['da-DK']],
['Deutsch', ['de-DE']],
['English', ['en-AU', 'Australia'],
  ['en-CA', 'Canada'],
  ['en-IN', 'India'],
  ['en-KE', 'Kenya'],
  ['en-TZ', 'Tanzania'],
  ['en-GH', 'Ghana'],
  ['en-NZ', 'New Zealand'],
  ['en-NG', 'Nigeria'],
  ['en-ZA', 'South Africa'],
  ['en-PH', 'Philippines'],
  ['en-GB', 'United Kingdom'],
  ['en-US', 'United States']],
['Español', ['es-AR', 'Argentina'],
  ['es-BO', 'Bolivia'],
  ['es-CL', 'Chile'],
  ['es-CO', 'Colombia'],
  ['es-CR', 'Costa Rica'],
  ['es-EC', 'Ecuador'],
  ['es-SV', 'El Salvador'],
  ['es-ES', 'España'],
  ['es-US', 'Estados Unidos'],
  ['es-GT', 'Guatemala'],
  ['es-HN', 'Honduras'],
  ['es-MX', 'México'],
  ['es-NI', 'Nicaragua'],
  ['es-PA', 'Panamá'],
  ['es-PY', 'Paraguay'],
  ['es-PE', 'Perú'],
  ['es-PR', 'Puerto Rico'],
  ['es-DO', 'República Dominicana'],
  ['es-UY', 'Uruguay'],
  ['es-VE', 'Venezuela']],
['Euskara', ['eu-ES']],
['Filipino', ['fil-PH']],
['Français', ['fr-FR']],
['Basa Jawa', ['jv-ID']],
['Galego', ['gl-ES']],
['ગુજરાતી', ['gu-IN']],
['Hrvatski', ['hr-HR']],
['IsiZulu', ['zu-ZA']],
['Íslenska', ['is-IS']],
['Italiano', ['it-IT', 'Italia'],
  ['it-CH', 'Svizzera']],
['ಕನ್ನಡ', ['kn-IN']],
['ភាសាខ្មែរ', ['km-KH']],
['Latviešu', ['lv-LV']],
['Lietuvių', ['lt-LT']],
['മലയാളം', ['ml-IN']],
['मराठी', ['mr-IN']],
['Magyar', ['hu-HU']],
['ລາວ', ['lo-LA']],
['Nederlands', ['nl-NL']],
['नेपाली भाषा', ['ne-NP']],
['Norsk bokmål', ['nb-NO']],
['Polski', ['pl-PL']],
['Português', ['pt-BR', 'Brasil'],
  ['pt-PT', 'Portugal']],
['Română', ['ro-RO']],
['සිංහල', ['si-LK']],
['Slovenščina', ['sl-SI']],
['Basa Sunda', ['su-ID']],
['Slovenčina', ['sk-SK']],
['Suomi', ['fi-FI']],
['Svenska', ['sv-SE']],
['Kiswahili', ['sw-TZ', 'Tanzania'],
  ['sw-KE', 'Kenya']],
['ქართული', ['ka-GE']],
['Հայերեն', ['hy-AM']],
['தமிழ்', ['ta-IN', 'இந்தியா'],
  ['ta-SG', 'சிங்கப்பூர்'],
  ['ta-LK', 'இலங்கை'],
  ['ta-MY', 'மலேசியா']],
['తెలుగు', ['te-IN']],
['Tiếng Việt', ['vi-VN']],
['Türkçe', ['tr-TR']],
['اُردُو', ['ur-PK', 'پاکستان'],
  ['ur-IN', 'بھارت']],
['Ελληνικά', ['el-GR']],
['български', ['bg-BG']],
['Pусский', ['ru-RU']],
['Српски', ['sr-RS']],
['Українська', ['uk-UA']],
['한국어', ['ko-KR']],
['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
  ['cmn-Hans-HK', '普通话 (香港)'],
  ['cmn-Hant-TW', '中文 (台灣)'],
  ['yue-Hant-HK', '粵語 (香港)']],
['日本語', ['ja-JP']],
['हिन्दी', ['hi-IN']],
['ภาษาไทย', ['th-TH']]];

$('document').ready(function () {
let select_language = document.getElementById('select_language');

for (var i = 0; i < langs.length; i++) {
  let opt = new Option(langs[i][0], i);
  select_language.appendChild(opt);
}
updateCountry(0);
});

function updateCountry(event) {
for (var i = select_dialect.options.length - 1; i >= 0; i--) {
  select_dialect.remove(i);
}
var list = langs[select_language.selectedIndex];
for (var i = 1; i < list.length; i++) {
  select_dialect.options.add(new Option(list[i][1], list[i][0]));
}
//  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';

if(list[1].length == 1 ) {
  $('.select_dialect_group').hide();
}
else {
  $('.select_dialect_group').show();
}


updateLanguageByLanguageIndex(event);
}

var final_transcript = '';
var recognizing = false;

if ('webkitSpeechRecognition' in window) {

var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function () {
  recognizing = true;
};

recognition.onerror = function (event) {
  console.log(event.error);
};

recognition.onend = function () {
  recognizing = false;
};

recognition.onresult = function (event) {
  var interim_transcript = '';
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
  final_transcript = capitalize(final_transcript);
  final_span.innerHTML = linebreak(final_transcript);
  interim_span.innerHTML = linebreak(interim_transcript);
};
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
return s.replace(s.substr(0, 1), function (m) { return m.toUpperCase(); });
}
voiceLang = 'af-ZA';
function startDictation(event) {
if (recognizing) {
  $( "#record-icon" ).removeClass( "blink" );
  recognition.stop();

  return;
}
$( "#record-icon" ).addClass( "blink" );
final_transcript = '';
recognition.lang = voiceLang;
recognition.start();
final_span.innerHTML = '';
interim_span.innerHTML = '';
}

function updateLanguageByLanguageIndex(languageIndex) {
   voiceLang = langs[languageIndex][1][0];
 
}

function updateDialect(dailectCode) {
voiceLang = dailectCode; 
}

function clearTranslatedText(event) {
final_span.innerHTML = '';
interim_span.innerHTML = '';
}

let textToSpeech = new SpeechSynthesisUtterance();
// textToSpeech.voiceURI = 'native';
function speak(speechText) {
    textToSpeech.text = speechText;
    textToSpeech.lang = currentVoiceLang;
    speechSynthesis.speak(textToSpeech);
}

function startSpeaking(event) {
   let spokenText =  document.getElementById("final_span").innerText;
   speak(spokenText);
}

let  voices ;
speechSynthesis.onvoiceschanged = function () { 
    voices = this.getVoices();
};

let currentVoiceLang = 'en-IN';
function checkIfLanguageIsSUpportedBySpeak() {

    // allowing google translate time to upadte languagecode
    setTimeout(() => {
        let languageCode = google.translate.TranslateElement().B.c + '-';
            for(let i = 0; i< voices.length; i++) {
                if(voices[i].lang.startsWith(languageCode)) {
                    currentVoiceLang = voices[i].lang;
                    $("#speak-icon").attr("disabled", false);
                    return;
                }
            }
            $("#speak-icon").attr("disabled", true);
    }, 0);
   
}

function disableTranslate() {
    $( "#final_span" ).removeClass( "translate" );
}

function enableTranslate() {
    $( "#final_span" ).addClass( "translate" );
    let selectField = document.querySelector(".goog-te-combo");
    selectField.dispatchEvent(new Event('change'));
}