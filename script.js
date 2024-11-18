// Tableau des questions, options et réponses correctes
const questions = [
    { 
      question: "Quel équipement de protection est nécessaire pour un gerbeur électrique ?", 
      options: ["Casque", "Chaussures de sécurité", "Gants", "Lunettes de sécurité"], 
      correctIndex: [1], 
      explanation: "Les chaussures de sécurité sont nécessaires." 
    },
    { 
      question: "Que ne faut-il pas mettre dans le compacteur ?", 
      options: ["Plastique et carton", "cintres", "Plastique", "Papier"], 
      correctIndex: [1,3], 
      explanation: "Il faut mettre soit les cartons, soit les plastiques mais pas les deux à la fois !" 
    },
    { 
      question: "Quelle est la durée maximale d'utilisation d'un gerbeur électrique sans formation ?", 
      options: ["1 heure", "2 heures", "Aucune", "15 minutes"], 
      correctIndex: [2], 
      explanation: "Aucune durée sans formation." 
    },
    { 
      question: "Qui est responsable du traitement des déchets DIB ?", 
      options: ["L'équipe EHS", "Veolia", "Le centre commercial", "La gestion des déchets internes"], 
      correctIndex: [2], 
      explanation: "Le centre commercial est responsable." 
    },
    { 
      question: "Que faire en cas d'incident avec un compacteur ?", 
      options: ["Appeler le responsable sécurité", "Ignorer l'incident", "Reprendre l'utilisation", "Alerter immédiatement le superviseur"], 
      correctIndex: [0], 
      explanation: "Appeler le responsable de la sécurité immédiatement." 
    }
    
    // Ajouter d'autres questions ici...
  ];
  
  let currentQuestionIndex = 0;
  let score = 0;
  let totalTimeTaken = 0; // Temps total pris
  let timeLeft = 15; // Temps de départ pour le chrono
  let timer; // Variable pour stocker l'intervalle du chronomètre
  let canProceed = false; // Pour vérifier si l'utilisateur peut passer à la question suivante
  const totalQuestions = questions.length; // Mettre à jour avec le nombre total de questions (par exemple, 5)
// Déclarez un chrono global qui commence au début du quiz
let totalStartTime = Date.now(); // Temps de début du quiz  
  
  // Démarrer le quiz lorsque l'utilisateur clique sur "Démarrer"
  document.getElementById('start-button').addEventListener('click', startQuiz);
  
  // Afficher les règles lorsque l'utilisateur clique sur "Continuer"
  document.getElementById('continue-button').addEventListener('click', function() {
    document.getElementById('welcome-container').style.display = 'none';
    document.getElementById('rules-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    displayQuestion();
  });
  
  // Redémarrer le quiz lorsque l'utilisateur clique sur "Redémarrer"
  document.getElementById('restart-button').addEventListener('click', restartQuiz);
  
  // Clic sur le bouton "Suivant" pour passer à la question suivante
  document.getElementById('next-button').addEventListener('click', function() {
    clearInterval(timer); // Arrêter le chronomètre manuellement
    checkAnswerAndProceed(); // Vérifier la réponse et passer à la question suivante
  });
  
// Fonction pour démarrer le quiz
function startQuiz() {
  // Cacher le conteneur d'accueil et les règles
  document.getElementById('welcome-container').style.display = 'none';
  document.getElementById('rules-container').style.display = 'block';
  
  // Attacher l'événement de clic pour quitter et envoyer l'email avant de commencer le quiz
  const startQuitButton = document.getElementById('quit-button'); // Assurez-vous que l'id du bouton est correct
  if (startQuitButton) {
      startQuitButton.removeEventListener('click', quitEmailHandler); // Supprimer l'événement précédent s'il existe
      startQuitButton.addEventListener('click', quitEmailHandler); // Ajouter l'événement de clic
  } else {
      console.error("Bouton Quitter au début du quiz introuvable !");
  }
}



  // Afficher une question et ses options
  function displayQuestion() {
    let question = questions[currentQuestionIndex];

    // Récupérer les éléments HTML
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    // Effacer les options précédentes
    optionsContainer.innerHTML = '';

    // Ajouter l'animation fade-in à la question
    questionText.classList.remove('fade-in'); // Supprimer la classe d'animation si elle existe déjà
    void questionText.offsetWidth; // Forcer un recalcul du DOM
    questionText.classList.add('fade-in'); // Ré-appliquer la classe fade-in pour la nouvelle question

    // Afficher le texte de la question
    questionText.textContent = question.question;

    // Créer les options et les afficher
    question.options.forEach((option, index) => {
      let optionLabel = document.createElement('label');
      optionLabel.textContent = option;

      // Appliquer l'animation à chaque option
      optionLabel.classList.add('option-slide-in'); // Appliquer l'animation

      optionLabel.addEventListener('click', () => selectAnswer(index)); // Sélectionner une réponse
      optionsContainer.appendChild(optionLabel);
    });

    // Réinitialiser le temps et démarrer le chronomètre
    startTimer();

    // Désactiver le bouton "Suivant" tant qu'une réponse n'est pas donnée
    document.getElementById('next-button').disabled = true;
    canProceed = false; // On ne peut pas passer à la question suivante tant qu'il n'y a pas de réponse

    // Calculer la progression en pourcentage (dynamique) en fonction de la question actuelle
    let progressPercentage = (currentQuestionIndex / questions.length) * 100;
    
    // Mettre à jour la barre de progression
    updateProgressBar(progressPercentage);
}


  



  // Fonction pour démarrer le chronomètre
  function startTimer() {
    timeLeft = 15; // Réinitialiser le temps à 15 secondes
    document.getElementById('time-left').textContent = timeLeft;
  
    // Supprimer tout timer existant pour éviter des doublons
    clearInterval(timer);
  
    // Démarrer un intervalle pour compter le temps
    timer = setInterval(function() {
      timeLeft--;
      document.getElementById('time-left').textContent = timeLeft; // Mettre à jour l'affichage du chronomètre
  
      // Lorsque le temps est écoulé, arrêter le chronomètre et passer à la question suivante
      if (timeLeft <= 0) {
        clearInterval(timer); // Arrêter le chronomètre
        checkAnswerAndProceed(); // Vérifier la réponse et passer à la question suivante
      }
    }, 1000);
  }
  


  // Fonction pour sélectionner une réponse
  function selectAnswer(index) {
    let question = questions[currentQuestionIndex];
    if (!question.selectedAnswers) {
      question.selectedAnswers = [];
    }

    // Ajouter ou supprimer une option choisie
    if (question.selectedAnswers.includes(index)) {
      question.selectedAnswers = question.selectedAnswers.filter(i => i !== index);
      document.querySelectorAll('.options label')[index].classList.remove('selected');
    } else {
      question.selectedAnswers.push(index);
      document.querySelectorAll('.options label')[index].classList.add('selected');
    }

    // Désactiver le bouton "Suivant" si aucune réponse n'est sélectionnée
    if (question.selectedAnswers.length === 0) {
      document.getElementById('next-button').disabled = true;
    } else {
      document.getElementById('next-button').disabled = false;
    }

    // Réinitialiser la possibilité de passer à la question suivante
    canProceed = question.selectedAnswers.length > 0;
}

  

// Fonction pour vérifier la réponse et passer à la question suivante
function checkAnswerAndProceed() {
 
    let question = questions[currentQuestionIndex];
    let timeTaken = 15 - timeLeft; // Temps pris pour répondre

        // Ajouter le temps pris pour cette question au temps total
       totalTimeTaken += timeTaken;  // Accumuler le temps total

       
    if (question.selectedAnswers && question.selectedAnswers.length > 0) {
        // Vérifier le nombre de réponses possibles
        const totalPossibleAnswers = question.correctIndex.length;
        let pointsPerAnswer = 1 / totalPossibleAnswers; // Calcul des points par bonne réponse

        // Vérifier si la réponse est correcte
        const isCorrect = question.correctIndex.every((index) =>
            question.selectedAnswers.includes(index)
        );

        // Initialiser le score de la question
        let questionScore = 0;

        

        // Calcul du score en fonction du nombre de bonnes réponses
        if (isCorrect) {
            // Calculer le score proportionnel en fonction du nombre de bonnes réponses
            questionScore = pointsPerAnswer * question.selectedAnswers.length;

            // Bonus pour rapidité
            if (timeTaken <= 2) {
                questionScore += 0.5; // Bonus rapide
            }
        }

        // Ajouter le score de la question au score total
        score += questionScore;

        // Passer à la question suivante ou afficher les résultats
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
            document.getElementById('next-button').disabled = true; // Désactiver "Suivant"
        } else {
            showResults(); // Afficher les résultats finaux
            endQuiz()
            
        }

    }else {
      // Si aucune réponse n'est donnée, ne pas ajouter de point
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
          displayQuestion();
      } else {
          showResults(); // Afficher les résultats finaux
          endQuiz()
      }
  }
}


  

  // Fonction pour Afficher les résultats avec un message personnalisé
  function showResults() {
    // Cacher le quiz
    document.getElementById('quiz-container').style.display = 'none';

    // Afficher le conteneur des résultats
    document.getElementById('result-container').style.display = 'block';

    // Calcul du message personnalisé en fonction du score
    let message;
    if (score === questions.length) {
        message = "🎉 Bravo, tu es un expert ! Tu as obtenu le score parfait ! 🎉";
    } else if (score >= questions.length / 2) {
        message = "🚀 Super travail ! Tu as bien joué, continue comme ça ! 🚀";
    } else {
        message = "💪 Courage ! La prochaine fois sera la bonne. Tu peux t'améliorer ! 💪";
    }

     // Formater le score avec 2 décimales
     let formattedScore = score.toFixed(2);  // Formater avec 2 décimales

    // Calculer le temps total écoulé en secondes
    let totalElapsedTime = Math.floor((Date.now() - totalStartTime) / 1000); // Temps écoulé depuis le début du quiz
    document.getElementById('congratulations-message').textContent = message;
    document.getElementById('score').textContent = `🎯 Score : ${formattedScore} 🎯`; // Afficher le score formaté
    document.getElementById('total-time').textContent = `⏳ Temps total : ${totalElapsedTime} secondes ⏳`;

    // Assurez-vous que la page des réponses ne soit pas déjà affichée par défaut
    document.getElementById('answers-view-container').style.display = 'none';

    // Appeler endQuiz pour afficher le bouton "Quitter"
    endQuiz();
    
}


  
  // Fonction pour redémarrer le quiz
  function restartQuiz() {
    score = 0; // Réinitialiser le score
    totalTimeTaken = 0; // Réinitialiser le temps total
    currentQuestionIndex = 0; // Revenir à la première question

    // Réinitialiser l'affichage des sections
    document.getElementById('result-container').style.display = 'none'; // Cacher les résultats
    document.getElementById('quiz-container').style.display = 'none'; // Cacher le quiz
    document.getElementById('welcome-container').style.display = 'block'; // Afficher l'écran de bienvenue
    document.getElementById('rules-container').style.display = 'none'; // Cacher les règles

    // Réinitialiser l'état des questions
    questions.forEach((question) => {
        question.selectedAnswers = []; // Réinitialiser les réponses sélectionnées
    });

    // Réinitialiser l'état du bouton "Suivant"
    document.getElementById('next-button').disabled = true;

    // Remettre l'écran de bienvenue et les autres étapes à zéro
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('welcome-container').style.display = 'block'; // Revenir à l'étape de bienvenue
}




  



  // Fonction pour partager le score sur les réseaux sociaux
document.getElementById('share-score-button').addEventListener('click', function() {
    let scoreMessage = `J'ai terminé le quiz ! Mon score est de ${score} sur ${questions.length} ! 🎉`;
    let shareText = encodeURIComponent(scoreMessage); // Encode le message pour l'URL
    
    // Partager sur Twitter
    let twitterURL = `https://twitter.com/intent/tweet?text=${shareText}`;
    window.open(twitterURL, '_blank'); // Ouvrir dans un nouvel onglet
  
    // Partager sur Facebook
    let facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${shareText}`;
    window.open(facebookURL, '_blank'); // Ouvrir dans un nouvel onglet
  });




 
// Affichage des réponses après le quiz
document.getElementById('view-answers-button').addEventListener('click', function () {
    const answersViewContainer = document.getElementById('answers-view-container');
    answersViewContainer.innerHTML = ''; // Réinitialiser le contenu
    answersViewContainer.style.display = 'block'; // Afficher le conteneur des réponses

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-result');

        // Ajouter la question
        const questionText = document.createElement('h3');
        questionText.textContent = `Question ${index + 1} : ${question.question}`;
        questionDiv.appendChild(questionText);

        // Ajouter les options avec marquage des réponses
        question.options.forEach((option, optionIndex) => {
            const optionDiv = document.createElement('p');
            optionDiv.textContent = option;

            // Identifier les bonnes et mauvaises réponses
            if (question.correctIndex.includes(optionIndex)) {
                optionDiv.style.color = 'green'; // Bonne réponse en vert
            }
            if (question.selectedAnswers && question.selectedAnswers.includes(optionIndex) && !question.correctIndex.includes(optionIndex)) {
                optionDiv.style.color = 'red'; // Mauvaise réponse en rouge
            }
            questionDiv.appendChild(optionDiv);
        });

        // Ajouter l'explication
        if (question.explanation) {
            const explanationDiv = document.createElement('p');
            explanationDiv.textContent = `Explication : ${question.explanation}`;
            explanationDiv.style.fontStyle = 'italic';
            questionDiv.appendChild(explanationDiv);
        }

        answersViewContainer.appendChild(questionDiv);
    });

    // Assurez-vous qu'il n'y a qu'un seul bouton PDF
    const existingButton = answersViewContainer.querySelector('.download-pdf-button');
    if (existingButton) {
        existingButton.remove(); // Supprimer le bouton existant
    }

    // Ajouter un bouton pour télécharger en PDF
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Télécharger en PDF';
    downloadButton.classList.add('download-pdf-button'); // Ajouter une classe pour le styliser
    downloadButton.addEventListener('click', downloadAnswersAsPDF);
    answersViewContainer.appendChild(downloadButton);
});


   // télécharger les réponses en PDF
   async function downloadAnswersAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPosition = 20;

    // Titre du document
    doc.setFontSize(18);
    doc.text("Résumé de vos réponses au quiz", 10, yPosition);
    yPosition += 20;

    // Fonction de vérification de la page
    function checkPageOverflow(doc, yPosition, lineHeight = 10) {
        const pageHeight = doc.internal.pageSize.height;
        if (yPosition + lineHeight > pageHeight - 20) {
            doc.addPage();
            return 20;
        }
        return yPosition;
    }

    // Boucle sur les questions
    questions.forEach((question, index) => {
        yPosition = checkPageOverflow(doc, yPosition);
        doc.setFontSize(14);
        const wrappedQuestion = doc.splitTextToSize(`Question ${index + 1}: ${question.question}`, 180);
        wrappedQuestion.forEach((line) => {
            doc.text(line, 10, yPosition);
            yPosition += 10;
        });

        // Boucle sur les réponses
        question.options.forEach((option, optionIndex) => {
            yPosition = checkPageOverflow(doc, yPosition);

            // Détermine le préfixe, couleur et style
            let prefix = "Réponse : ";
            let color = [0, 0, 0]; // Noir par défaut
            let fontStyle = "normal"; // Normal par défaut

            if (question.correctIndex.includes(optionIndex)) {
                prefix = "Bonne réponse : ";
                color = [0, 128, 0]; // Vert
                fontStyle = "bold"; // Gras pour les bonnes réponses
            } else if (
                question.selectedAnswers &&
                question.selectedAnswers.includes(optionIndex) &&
                !question.correctIndex.includes(optionIndex)
            ) {
                prefix = "Mauvaise réponse : ";
                color = [255, 0, 0]; // Rouge
                fontStyle = "bold"; // Gras pour les mauvaises réponses
            }

            // Applique les styles et affiche la réponse
            doc.setFont("helvetica", fontStyle); // Définit le style (normal ou bold)
            doc.setTextColor(...color); // Définit la couleur
            const wrappedOption = doc.splitTextToSize(`${prefix}${option}`, 180);
            wrappedOption.forEach((line) => {
                doc.text(line, 15, yPosition);
                yPosition += 10;
            });
        });

        // Explication
        if (question.explanation) {
            yPosition = checkPageOverflow(doc, yPosition, 20);
            const wrappedExplanation = doc.splitTextToSize(`Explication : ${question.explanation}`, 180);

            // Applique le style bleu et italique
            doc.setFont("helvetica", "italic");
            doc.setTextColor(0, 123, 255); // Bleu pour les explications
            wrappedExplanation.forEach((line) => {
                doc.text(line, 15, yPosition);
                yPosition += 10;
            });

            // Réinitialise le style après l'explication
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0); // Retour au noir
        }

        yPosition += 10; // Espacer les questions
    });

    // Résumé final


    yPosition = checkPageOverflow(doc, yPosition, 20);
    doc.setFontSize(16);
    doc.text(`Score final : ${score}/${questions.length}`, 10, yPosition);
    doc.text(`Score final : ${score}/${questions.length}`, 10, yPosition);

    yPosition += 10; // Espacer les questions
    

    // Ajouter la date et l'heure actuelles en bas du PDF
const currentDateTime = new Date().toLocaleString(); // Format de la date et de l'heure
doc.setFontSize(10); // Taille de police plus petite
doc.text(`Date et heure du téléchargement : ${currentDateTime}`, 10, yPosition);
yPosition += 10; // Espacement après la date et l'heure
    
    // Télécharger le fichier
    doc.save("reponses_quiz.pdf");
}







  


// Fonction pour terminer le quiz
function endQuiz() {
  // Cacher le conteneur du quiz
  document.getElementById('quiz-container').style.display = 'none';

  // Afficher le conteneur des résultats
  const resultContainer = document.getElementById('result-container');
  resultContainer.style.display = 'block';

  // Déplacer le bouton Quitter vers le conteneur des résultats
  const quitButton = document.getElementById('quit-button');
  if (quitButton) {
      // Supprimer le bouton de son ancien parent s'il y est encore
      quitButton.style.display = 'inline-block'; // Le rendre visible
      resultContainer.appendChild(quitButton); // Le placer dans le conteneur des résultats

      // Réattacher l'événement de clic après l'avoir déplacé
      quitButton.removeEventListener('click', quitEmailHandler); // Supprimer l'événement précédent
      quitButton.addEventListener('click', quitEmailHandler); // Ajouter l'événement de clic pour envoyer l'email
  } else {
      console.error("Bouton Quitter introuvable !");
  }
}

// Fonction pour gérer l'envoi de l'email
function quitEmailHandler() {
  const mailtoLink = `mailto:ehs215@primark.fr?subject=Votre avis sur le quiz&body=Bonjour,%0D%0A%0D%0AJe souhaite partager mon avis sur le quiz que je viens de faire.%0D%0A%0D%0A[Écrivez ici vos commentaires.]%0D%0A%0D%0AMerci !`;
  window.location.href = mailtoLink; // Ouvre le client de messagerie pour envoyer l'email
}





  document.addEventListener('DOMContentLoaded', function () {
    var rulesContainer = document.getElementById('rules-container');
    
    // Ajoutez la classe fade-in pour appliquer l'animation de fondu
    rulesContainer.classList.add('fade-in');
  
    // Utilisez un setTimeout pour afficher l'élément après que l'animation ait commencé
    setTimeout(function () {
      rulesContainer.classList.add('visible');  // Ajouter la classe "visible" pour rendre l'élément visible
    }, 500); // 500 ms : le temps d'animation de fadeIn
  });
  

// Désactiver toutes les options après la sélection d'une réponse
function disableOptions() {
  const options = document.querySelectorAll('.options label');
  options.forEach(option => {
    option.removeEventListener('click', selectAnswer);
    option.classList.add('disabled'); // Ajoute un style pour montrer qu'elles sont désactivées
  });
}



function updateProgressBar(targetValue) {
  // Validation de la valeur entre 0 et 100
  if (targetValue < 0) targetValue = 0;
  if (targetValue > 100) targetValue = 100;

  const progressBar = document.getElementById("progress");
  const progressBarContainer = document.querySelector(".progress-bar");

  // La valeur actuelle de la progression (initialisée à 0 ou à la largeur actuelle de la barre)
  let currentValue = parseInt(progressBar.style.width) || 0;

  // Utilisation d'un intervalle pour animer la barre de progression
  const interval = setInterval(() => {
    // Si la valeur actuelle est inférieure à la valeur cible, incrémenter
    if (currentValue < targetValue) {
      currentValue++; // Incrémenter la valeur
    } 
    // Si la valeur actuelle est supérieure à la valeur cible, décrémenter
    else if (currentValue > targetValue) {
      currentValue--; // Décrémenter la valeur
    }

    // Mise à jour de la largeur de la barre de progression
    progressBar.style.width = currentValue + "%";

    // Mise à jour de l'attribut aria-valuenow pour l'accessibilité
    progressBarContainer.setAttribute("aria-valuenow", currentValue);

    // Si la valeur cible est atteinte, arrêter l'intervalle
    if (currentValue === targetValue) {
      clearInterval(interval);
    }
  }, 10); // Actualiser toutes les 10ms pour une animation fluide
}





