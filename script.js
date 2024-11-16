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
    document.getElementById('welcome-container').style.display = 'none';
    document.getElementById('rules-container').style.display = 'block';
  }
  


  // Afficher une question et ses options
  function displayQuestion() {
    let question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question;
    let optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = ''; // Effacer les options précédentes
  
    // Créer les options et les afficher
    question.options.forEach((option, index) => {
      let optionLabel = document.createElement('label');
      optionLabel.textContent = option;
      optionLabel.addEventListener('click', () => selectAnswer(index)); // Sélectionner une réponse
      optionsContainer.appendChild(optionLabel);
    });
  
    // Réinitialiser le temps et démarrer le chronomètre
    startTimer();
  
    // Désactiver le bouton "Suivant" tant qu'une réponse n'est pas donnée
    document.getElementById('next-button').disabled = true;
    canProceed = false; // On ne peut pas passer à la question suivante tant qu'il n'y a pas de réponse
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
            questionScore += pointsPerAnswer * question.selectedAnswers.length;

            // Bonus pour rapidité
            if (timeTaken <= 5) {
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
        }
    }
}


  














  // Fonction pour afficher les résultats
  // Afficher les résultats avec un message personnalisé
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

    // Afficher le message, le score et le temps total
    const totalTimeTaken = questions.length * 15 - timeLeft; // Exemple si chaque question dure 15 secondes
    document.getElementById('congratulations-message').textContent = message;
    document.getElementById('score').textContent = `Score : ${score}`;
    document.getElementById('total-time').textContent = `Temps total : ${totalTimeTaken} secondes`;

    // Assurez-vous que la page des réponses ne soit pas déjà affichée par défaut
    document.getElementById('answers-view-container').style.display = 'none';
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






  // Fonction pour quitter le quiz
document.getElementById('quit-button').addEventListener('click', function() {
    window.close(); // Ferme la fenêtre (fonctionne dans des contextes de fenêtre popup)
    // Si la fermeture n'est pas possible, on redirige vers la page d'accueil ou une autre page
    // window.location.href = "index.html"; // Décommentez si vous voulez rediriger
  });




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

// Fonction pour générer le PDF
function downloadAnswersAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPosition = 10; // Position de départ

    // Ajouter un titre au PDF
    doc.text('Mes Réponses au Quiz', 10, yPosition);
    yPosition += 10;

    // Ajouter les réponses au quiz
    questions.forEach((question, index) => {
        doc.text(`Question ${index + 1}: ${question.question}`, 10, yPosition);
        yPosition += 10;

        question.options.forEach((option, optionIndex) => {
            let optionText = option;
            // Vérification de la bonne ou mauvaise réponse
            if (question.correctIndex.includes(optionIndex)) {
                optionText = `${option} (Bonne réponse)`;
            } else if (question.selectedAnswers.includes(optionIndex) && !question.correctIndex.includes(optionIndex)) {
                optionText = `${option} (Mauvaise réponse)`;
            }
            doc.text(optionText, 10, yPosition);
            yPosition += 10;
        });

        // Ajouter l'explication si elle existe
        if (question.explanation) {
            doc.text(`Explication: ${question.explanation}`, 10, yPosition);
            yPosition += 10;
        }
    });

    // Téléchargement du PDF
    doc.save('mes_reponses_quiz.pdf');
}












   // télécharger les réponses en PDF

  async function downloadAnswersAsPDF() {
    const { jsPDF } = window.jspdf; // Charger jsPDF
    const doc = new jsPDF();
    let yPosition = 20; // Position de départ dans le PDF
  
    // Ajouter un titre
    doc.setFontSize(18);
    doc.text("Résumé de vos réponses au quiz", 10, yPosition);
    yPosition += 10;
  
    // Boucler sur les questions pour ajouter les détails dans le PDF
    questions.forEach((question, index) => {
      // Question
      doc.setFontSize(14);
      doc.text(`Question ${index + 1}: ${question.question}`, 10, yPosition);
      yPosition += 10;
  
      // Options et réponses
      question.options.forEach((option, optionIndex) => {
        let prefix = '';
  
        // Marquer les bonnes et mauvaises réponses
        if (question.correctIndex.includes(optionIndex)) {
          prefix = '[Bonne réponse] ';
        }
        if (question.selectedAnswers && question.selectedAnswers.includes(optionIndex)) {
          prefix += '[Votre réponse] ';
        }
  
        doc.setFontSize(12);
        doc.text(`${prefix}${option}`, 15, yPosition);
        yPosition += 8;
  
        // Vérifier si on dépasse la page et créer une nouvelle page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
  
      // Ajouter l'explication si disponible
      if (question.explanation) {
        doc.setFont("italic");
        doc.text(`Explication : ${question.explanation}`, 15, yPosition);
        doc.setFont("normal");
        yPosition += 10;
      }
  
      // Ajouter un espace entre les questions
      yPosition += 10;
    });
  
    // Télécharger le fichier PDF
    doc.save("reponses_quiz.pdf");
  }
  
  
  
 // envoyer un mail à EHS pour donner son avis 
  document.getElementById('quit-button').addEventListener('click', function() {
    // Construire l'URL mailto avec les détails
    const mailtoLink = `mailto:ehs215@primark.fr?subject=Votre avis sur le quiz&body=Bonjour,%0D%0A%0D%0AJe souhaite partager mon avis sur le quiz que je viens de faire.%0D%0A%0D%0A[Écrivez ici vos commentaires.]%0D%0A%0D%0AMerci !`;
    
    // Rediriger l'utilisateur vers l'email
    window.location.href = mailtoLink;
  });
  

